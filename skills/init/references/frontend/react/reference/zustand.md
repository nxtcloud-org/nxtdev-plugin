# Zustand

경량 전역 상태 관리 라이브러리.

## 공식 문서

- https://zustand.docs.pmnd.rs/getting-started/introduction

## 사내 사용 패턴

### 스토어 생성

```ts
// src/stores/auth-store.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### 사용 (selector 필수)

```tsx
// 좋은 예: 필요한 값만 구독
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// 나쁜 예: 전체 스토어 구독 (아무 값 바뀌어도 리렌더링)
const store = useAuthStore();
```

### 컴포넌트 밖에서 접근

```ts
// API 인터셉터 등에서 사용 가능 (Context와 달리 Provider 불필요)
const token = useAuthStore.getState().token;
```

### persist 미들웨어 (localStorage 저장)

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'settings-storage' }
  )
);
```

## 규칙

- 파일 위치: `src/stores/[이름]-store.ts`
- selector 필수 — 전체 스토어 구독 금지
- 스토어 하나에 너무 많은 상태 넣지 않기 (관심사별 분리)
- 서버 데이터는 Zustand에 넣지 않기 → TanStack Query 사용
