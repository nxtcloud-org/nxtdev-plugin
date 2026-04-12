---
paths:
  - "src/**/*.tsx"
  - "app/**/*.tsx"
---

# Next.js 접근성 규칙 (React 공통 위에 추가)

## Next.js 특화

- html lang 속성: Root Layout에서 설정
- next/image: alt 속성 필수 (장식용이면 alt="")
- next/image fill: sizes 속성으로 반응형 크기 지정
- next/link: 명확한 텍스트 ("여기 클릭" 금지)
- loading.tsx: 스크린 리더 접근 가능한 로딩 표시
- Suspense fallback: 의미 있는 로딩 UI 제공
