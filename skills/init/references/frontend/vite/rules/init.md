---
paths:
  - "**/*"
---

# Vite + React + TypeScript 프로젝트

이 프로젝트는 Vite + React + TypeScript 기반입니다.
사용자가 /init 호출 시, 이 파일과 아래 규칙 파일들을 기반으로 `.claude/CLAUDE.md`를 생성하세요.

> 이 룰셋은 React 룰셋과 함께 적용됩니다. React 공통 규칙은 React 룰셋을 따르고, 이 파일들은 Vite 전용 규칙만 다룹니다.

## 규칙 매핑

- 폴더 구조/파일 배치 시 → `rules/vite/structure.md`
- 성능 최적화 필요 시 → `rules/vite/performance.md`
- 보안 관련 코드 작성 시 → `rules/vite/security.md`
