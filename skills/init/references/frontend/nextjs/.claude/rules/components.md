---
paths:
  - "src/**/*.tsx"
  - "src/components/**/*"
  - "app/**/*.tsx"
---

# Next.js 컴포넌트 규칙 (React 공통 위에 추가)

## default export 예외

- Next.js 규약 파일(page.tsx, layout.tsx, error.tsx, loading.tsx, not-found.tsx, global-error.tsx, template.tsx, default.tsx)은 default export 필수
- 그 외 컴포넌트는 React 룰셋 규칙 따름 (Named export)

## Server Component 기본

- 모든 컴포넌트는 Server Component가 기본
- "use client"는 훅/이벤트/브라우저 API 사용 시만 선언
- 상세 → `server-components.md`

## Import 순서 (React 공통에 Next.js 추가)

1번에 Next.js import 포함: `next/link`, `next/image`, `next/navigation`, `next/font`, `next/script`

## Next.js 최적화 컴포넌트

- `<Link>`: next/link — 자동 prefetch, `<a>` 대신 사용
- `<Image>`: next/image — width/height 또는 fill 필수, alt 필수, LCP에 priority
- `<Script>`: next/script — strategy로 로딩 시점 제어 (afterInteractive 기본)

## Metadata

- 정적: `export const metadata: Metadata = { title, description }`
- 동적: `export async function generateMetadata({ params })`
- title 템플릿: layout에서 `{ template: '%s | 사이트명', default: '사이트명' }`

## 금지

- HTML `<a>` 직접 사용 → `next/link` 사용
- HTML `<img>` 직접 사용 → `next/image` 사용
- `<script>` 직접 사용 → `next/script` 사용
