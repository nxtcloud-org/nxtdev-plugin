---
paths:
  - "app/**/*.tsx"
---

# 비동기 상태 처리 규칙

Client Component의 상태 처리는 → `rules/react/async-states.md` 참조

## Server Component — 파일 기반 처리

Next.js App Router는 파일명으로 상태를 자동 처리한다.

```
app/dashboard/
├── page.tsx          ← 실제 UI
├── loading.tsx       ← 로딩 상태 (자동 Suspense 경계)
├── error.tsx         ← 에러 상태
└── not-found.tsx     ← 404
```

### loading.tsx
- 해당 세그먼트 전체의 로딩 UI
- Skeleton으로 작성 — 실제 page.tsx 레이아웃과 동일한 구조

```tsx
export default function Loading() {
  return <DashboardSkeleton />
}
```

### error.tsx
- `"use client"` 필수 (reset 함수 사용을 위해)
- 재시도 버튼 포함
- 사용자에게 기술적 에러 메시지 노출 금지

```tsx
'use client'

export default function Error({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <p>문제가 발생했습니다.</p>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}
```

### not-found.tsx
- `notFound()` 호출 시 렌더링
- 홈 또는 이전 페이지로 돌아가는 링크 포함

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <p>페이지를 찾을 수 없습니다.</p>
      <Link href="/">홈으로</Link>
    </div>
  )
}
```

## Suspense로 부분 로딩

page.tsx 전체를 loading.tsx로 기다리지 않고, 느린 컴포넌트만 Suspense로 감싸 스트리밍.

```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <StaticSection />
      <Suspense fallback={<SlowSectionSkeleton />}>
        <SlowSection />
      </Suspense>
    </>
  )
}
```

## 금지

- `loading.tsx` 없이 page.tsx에서 직접 로딩 상태 분기
- `error.tsx`에서 `"use client"` 누락
- `not-found.tsx` 없이 조건부 렌더링으로 404 처리
- Suspense fallback에 spinner만 사용 (Skeleton 사용)
