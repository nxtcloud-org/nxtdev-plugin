---
paths:
  - "app/**/*.tsx"
  - "src/**/*.tsx"
---

# Server Component / Client Component 규칙

## 기본 원칙

- 모든 컴포넌트는 Server Component가 기본
- "use client"는 반드시 필요한 경우에만 최상단에 선언

## "use client"가 필요한 경우

- useState, useEffect, useRef 등 React 훅 사용
- onClick, onChange 등 이벤트 핸들러
- 브라우저 API (window, document, localStorage)
- useContext 또는 createContext

## "use client" 경계 최소화

- 페이지 전체를 Client Component로 만들지 않기
- 인터랙티브 부분만 별도 Client Component로 분리
- Server Component에서 데이터를 fetch → Client Component에 props로 전달

```tsx
// app/posts/page.tsx (Server Component)
export default async function PostsPage() {
  const posts = await getPosts();
  return <PostList posts={posts} />;
}

// components/PostList/index.tsx (Client Component)
"use client";
export function PostList({ posts }: Props) {
  const [filter, setFilter] = useState("");
  // ...
}
```

## Server Component → Client Component props

- props는 React가 직렬화 가능한 값만 전달 가능
- 함수, Date, Map, Set, Class 인스턴스 전달 불가
- Server Component를 Client Component의 children으로 전달 가능 (Composition 패턴)

```tsx
// Server Component
import Modal from './ui/modal';
import Cart from './ui/cart';

export default function Page() {
  return (
    <Modal>
      <Cart /> {/* Server Component를 children으로 전달 */}
    </Modal>
  );
}
```

## "use client" 전파 규칙

- Client Component가 import하는 모든 모듈도 Client Component가 됨
- Third-party 라이브러리에 "use client"가 없으면 래퍼 필요

```tsx
'use client';
import { Carousel } from 'acme-carousel';
export default Carousel;
```

## Context Providers 패턴

- Provider는 Client Component ("use client" 필수)
- Root Layout(Server Component)에서 children을 감싸는 형태로 사용

```tsx
// app/providers.tsx
'use client';
import { ThemeProvider } from './theme-context';
import { QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryClientProvider>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}

// app/layout.tsx (Server Component)
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return <html><body><Providers>{children}</Providers></body></html>;
}
```

## Server Component에서 할 수 있는 것

- async/await로 직접 데이터 fetch
- 데이터베이스 직접 조회
- 파일 시스템 접근
- 서버 전용 모듈 import
- 민감한 환경 변수 접근

## 금지

- Server Component에서 훅 사용
- Server Component에서 이벤트 핸들러 정의
- Client Component에서 async 컴포넌트
- "use client" 파일에서 서버 전용 모듈 import (db, fs 등)
