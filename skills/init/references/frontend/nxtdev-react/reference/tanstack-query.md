# TanStack Query (React Query)

서버 상태 관리 라이브러리.

## 공식 문서

- https://tanstack.com/query/latest/docs/framework/react/overview

## 사내 사용 패턴

### 설정

```tsx
'use client'; // Next.js에서만
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 1000 * 60 * 5 }, // 5분
    },
  }));
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
```

### Query Key 관리

```ts
// src/features/auth/keys.ts
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
  user: (id: string) => [...authKeys.all, 'user', id] as const,
};
```

### useQuery (조회)

```ts
import { useQuery } from '@tanstack/react-query';
import { getMeApi } from './api';
import { authKeys } from './keys';

export function useMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getMeApi,
  });
}
```

### useMutation (변경)

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserApi } from './api';
import { authKeys } from './keys';

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
```

### 낙관적 업데이트

```ts
useMutation({
  mutationFn: updateUserApi,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: authKeys.me() });
    const previous = queryClient.getQueryData(authKeys.me());
    queryClient.setQueryData(authKeys.me(), newData);
    return { previous };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(authKeys.me(), context?.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: authKeys.me() });
  },
});
```

## 규칙

- QueryClient: useState로 생성 (컴포넌트 밖 금지)
- staleTime 필수 설정 (기본값 0은 위험)
- queryKey: keys.ts에서 상수 관리, 계층적 설계
- queryKey 하드코딩 금지
- enabled 옵션으로 불필요한 쿼리 실행 방지
