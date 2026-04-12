---
paths:
  - "src/**/*.{ts,tsx}"
  - "app/**/*.{ts,tsx}"
---

# Next.js 성능 규칙 (React 공통 위에 추가)

## React Compiler (사내 표준 활성화)

- useMemo, useCallback, React.memo 수동 사용 불필요 — 컴파일러가 자동 최적화
- 기존 수동 메모이제이션 코드가 있어도 컴파일러가 무시하므로 해롭지 않음

## Server Component 활용

- 데이터 fetch는 Server Component에서 (클라이언트 워터폴 방지)
- 병렬 데이터 fetch: Promise.all 사용
- 정적 생성 가능한 페이지: generateStaticParams 활용
- "use client" 경계 최소화 (서버 번들 최대화)

## Next.js 최적화 컴포넌트

- next/image: 이미지 최적화 필수 (width/height 또는 fill 지정, quality 기본 75)
- next/image priority: LCP 이미지에 priority 속성 추가
- next/font: 폰트 최적화 (layout.tsx에서 로드, FOUT/FOIT 방지)
- next/dynamic: 무거운 Client Component 지연 로딩 (ssr: false 옵션)
- next/link: 자동 prefetch (viewport 진입 시)

## 캐싱 전략

- Request Memoization: 같은 렌더 내 동일 fetch 자동 중복 제거
- Data Cache: `{ next: { revalidate: N } }` 으로 ISR
- Full Route Cache: 정적 라우트 빌드 시 자동 캐싱
- Router Cache: 클라이언트 메모리 캐시 (layout/loading 자동 캐싱)

## Streaming

- loading.tsx: Suspense 기반 스트리밍 SSR
- Suspense로 세밀한 스트리밍 제어 (섹션별 로딩)
