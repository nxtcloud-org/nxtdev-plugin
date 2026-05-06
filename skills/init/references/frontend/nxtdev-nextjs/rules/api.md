---
paths:
  - "src/**/api.*"
  - "src/**/hooks.*"
  - "src/lib/api/**/*"
  - "app/**/route.ts"
---

# Next.js API 규칙 (React 공통 위에 추가)

## 데이터 패칭 전략

- Server Component: async/await로 직접 fetch (TanStack Query 불필요)
- Client Component: TanStack Query (React 룰셋 규칙 따름)
- 데이터 변경: Server Actions 우선, Route Handler는 외부 연동용

## Server Component 데이터 패칭

```tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/posts');
  const posts = await data.json();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

- 동일 fetch 요청은 자동 memoization (같은 렌더 내)
- 병렬 fetch: Promise.all 사용
- 순차 fetch: Suspense로 스트리밍

## 캐싱

- fetch 기본: 캐시 안 됨
- 캐시 활성화: `{ cache: 'force-cache' }` 또는 `{ next: { revalidate: 3600 } }`
- 태그 기반: `{ next: { tags: ['posts'] } }` → `revalidateTag('posts')`
- 캐시 비활성화: `{ cache: 'no-store' }`

## Route Handler (app/api/)

- GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS 함수 export
- NextRequest, NextResponse 사용
- 입력 검증: Zod로 body/params 검증
- 에러 응답: `Response.json({ error: string }, { status: 4xx })`
- page.tsx와 같은 경로에 route.ts 동시 배치 불가

## Streaming (use API)

```tsx
// Server Component — Promise를 await 없이 전달
export default function Page() {
  const posts = getPosts(); // await 안 함
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  );
}

// Client Component — use()로 resolve
'use client';
import { use } from 'react';
export default function Posts({ posts }) {
  const allPosts = use(posts);
  return <ul>{allPosts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

## 금지

- Server Component에서 TanStack Query 사용
- 데이터 조회용 Server Actions (Server Component에서 fetch)
