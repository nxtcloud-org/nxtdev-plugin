---
paths:
  - "src/**/*.{ts,tsx}"
  - "app/**/*.{ts,tsx}"
---

# Next.js 네이밍 규칙 (React 공통 위에 추가)

## Next.js 전용 파일명

- Server Actions: `actions.ts`
- Server Action 함수: [동사][명사]Action (createUserAction, deletePostAction)
- Route Handler: `route.ts`
- 규약 파일: page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, global-error.tsx, template.tsx, default.tsx

## Import

- 경로 별칭: `@/` 사용 (상대 경로 `../../` 지양)
