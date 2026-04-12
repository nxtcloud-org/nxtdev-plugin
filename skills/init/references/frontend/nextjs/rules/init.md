---
paths:
  - "**/*"
---

# Next.js + TypeScript 프로젝트

이 프로젝트는 Next.js (App Router) + TypeScript 기반입니다.
사용자가 /init 호출 시, 이 파일과 아래 규칙 파일들을 기반으로 `.claude/CLAUDE.md`를 생성하세요.

> 이 룰셋은 React 룰셋과 함께 적용됩니다. React 공통 규칙은 React 룰셋을 따르고, 이 파일들은 Next.js 전용 규칙만 다룹니다.

## 규칙 매핑

- 컴포넌트 생성/수정 시 → `rules/nextjs/components.md`
- Server Component / Client Component 판단 시 → `rules/nextjs/server-components.md`
- Server Actions 구현 시 → `rules/nextjs/server-actions.md`
- 인터랙티브 UI 작업 시 → `rules/nextjs/accessibility.md`
- 폼 구현 시 → `rules/nextjs/form.md`
- API 호출/데이터 패칭 시 → `rules/nextjs/api.md`
- 보안 관련 코드 작성 시 → `rules/nextjs/security.md`
- 성능 최적화 필요 시 → `rules/nextjs/performance.md`
- 코드 리뷰/셀프 체크 시 → `rules/nextjs/code-quality.md`
- 테스트 작성 시 → `rules/nextjs/testing.md`
- 폴더 구조/파일 배치 시 → `rules/nextjs/structure.md`
- 에러 처리 구현 시 → `rules/nextjs/error-handling.md`
- 파일/변수 이름 지을 때 → `rules/nextjs/naming.md`
