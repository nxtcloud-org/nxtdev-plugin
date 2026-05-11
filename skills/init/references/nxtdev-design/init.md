---
paths:
  - "**/*"
---

# NxtCloud 디자인 시스템

이 프로젝트는 NxtCloud 디자인 시스템을 사용합니다.
UI 작업 시 `.claude/rules/nxtdev-design/DESIGN.md`를 반드시 참조하세요.

## 디자인 시스템 규칙

- 컬러·radius·shadow는 항상 CSS 변수 참조 — hex 하드코딩 금지
- UI 컴포넌트에 그라디언트 금지 — 로고·히어로 전용
- 카드 `border-radius` 최소 20px (`rounded-[20px]`)
- 폰트 weight 최대 600 (Semibold)
- 한국어 텍스트 최소 12px

## Tailwind 클래스 매핑

| 용도 | 클래스 |
|------|--------|
| 브랜드 색상 | `bg-brand`, `text-brand`, `outline-brand` |
| 브랜드 hover | `hover:bg-brand-hover` |
| danger | `bg-danger` |
| 중립 텍스트 | `text-neutral-900`, `text-neutral-500` |
| 섹션 배경 | `bg-surface-muted` |
| 중립 배경 | `bg-neutral-50`, `bg-neutral-100` |

## 규칙 매핑

- UI 컴포넌트 작성/수정 시 → `rules/nxtdev-design/DESIGN.md`
- 컬러·타이포그래피·간격 결정 시 → `rules/nxtdev-design/DESIGN.md`
- 컴포넌트 상태(hover·focus·disabled) 구현 시 → `rules/nxtdev-design/DESIGN.md`
