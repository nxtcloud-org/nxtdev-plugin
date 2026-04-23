---
paths:
  - "**/*"
---

# Vite + React + TypeScript 프로젝트

이 프로젝트는 Vite + React + TypeScript 기반입니다.
사용자가 /init 호출 시, 이 파일과 아래 규칙 파일들을 기반으로 `.claude/CLAUDE.md`를 생성하세요.

> 이 룰셋은 React 룰셋과 함께 적용됩니다. React 공통 규칙은 React 룰셋을 따르고, 이 파일들은 Vite 전용 규칙만 다룹니다.

## 규칙 매핑

- 컴포넌트 생성/수정 시 → `rules/react/components.md`
- 파일, 변수, 함수 이름 지을 때 → `rules/vite/naming.md`
- 스타일/CSS/TailwindCSS 작업 시 → `rules/react/styling.md`
- 설계 판단이 필요할 때 → `rules/react/design-principles.md`
- 인터랙티브 UI 작업 시 → `rules/react/accessibility.md`
- 폼 구현 시 → `rules/react/form.md`
- API 호출/데이터 패칭 시 → `rules/react/api.md`
- 보안 관련 코드 작성 시 → `rules/vite/security.md`
- 성능 최적화 필요 시 → `rules/vite/performance.md`
- 코드 리뷰/셀프 체크 시 → `rules/react/code-quality.md`
- 테스트 작성 시 → `rules/react/testing.md`
- 폴더 구조/파일 배치/프로젝트 scaffolding 시 → `rules/vite/structure.md`
- 에러 처리 구현 시 → `rules/react/error-handling.md`
- 비동기 데이터의 로딩/에러/빈 상태 처리 시 → `rules/react/async-states.md`
- features/ 안 api.ts/service.ts/hooks.ts 작성 시 → `rules/react/domain.md`
- 커스텀 훅 작성 시 → `rules/react/hooks.md`
- 상태 관리 판단 시 → `rules/react/state-management.md`
