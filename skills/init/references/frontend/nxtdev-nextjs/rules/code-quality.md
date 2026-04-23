---
paths:
  - "src/**/*.{ts,tsx}"
  - "app/**/*.{ts,tsx}"
---

# Next.js 코드 품질 체크리스트 (React 공통 위에 추가)

## Server/Client 경계

- "use client" 필요한데 빠졌는지 확인
- Server Component → Client Component props 직렬화 가능 여부 확인
- Third-party 라이브러리 "use client" 누락 시 래퍼 필요

## Server Actions

- redirect()를 try/catch 안에 넣지 않았는지 (Next.js가 throw하므로)
- Server Action에서 권한 확인 빠졌는지

## 동적 라우트

- params는 Promise — `await params` 필수 (Next.js 15+)
- searchParams도 Promise — `await searchParams` 필수 (Next.js 15+)

## 동적 vs 정적 렌더링

아래를 사용하면 라우트가 자동으로 동적 렌더링으로 전환됨:
- `cookies()`, `headers()` 호출
- `searchParams` 접근
- `fetch`에 `cache: 'no-store'` 사용

의도하지 않은 동적 전환 주의.

## Route Segment Config

```ts
// 라우트별 동작 제어 (page.tsx 또는 layout.tsx에서 export)
export const dynamic = 'force-dynamic';     // 항상 동적 렌더링
export const dynamic = 'force-static';      // 항상 정적 렌더링
export const revalidate = 3600;             // ISR (초 단위)
export const runtime = 'edge';              // Edge Runtime 사용
export const fetchCache = 'force-no-store'; // 모든 fetch 캐시 비활성화
```

## next.config.ts 자주 쓰는 설정

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: 'example.com' }], // 외부 이미지 허용
  },
  async redirects() {
    return [{ source: '/old', destination: '/new', permanent: true }];
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: 'https://api.example.com/:path*' }];
  },
};
```
