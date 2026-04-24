---
name: init
description: "프론트엔드 프로젝트 초기 설정. 프레임워크(Next.js/React/Vite) 규칙 파일 세팅 또는 NxtCloud 디자인 시스템(`design`) 단독 세팅한다."
argument-hint: "[nextjs|vite|react|design]"
allowed-tools: "Read Write Glob Bash(ls *) Bash(mkdir *) Bash(cp *) Bash(find *)"
---

# Frontend Project Init

프론트엔드 프로젝트의 `.claude/` 디렉토리에 규칙 파일을 세팅한다.

## 1. 프레임워크 감지

인자가 `design`이면 이 섹션을 건너뛰고 **4a로 이동**한다.

인자가 주어지면 그대로 사용: `$ARGUMENTS`

인자가 없으면 자동 감지:

```
next.config.* 존재 → nextjs
vite.config.* 존재 → vite
package.json에 "react" 있음 → react
그 외 → 사용자에게 선택 요청
```

선택지:

1. **nextjs** — Next.js (App Router) + React + TypeScript
2. **vite** — Vite + React + TypeScript
3. **react** — React + TypeScript (프레임워크 없이)

감지 결과를 사용자에게 확인받는다: "Next.js 프로젝트로 감지했습니다. 맞나요?"

## 2. 규칙 조합

### framework 경로

React는 베이스로 **항상 자동 포함**된다. 사용자가 별도로 선택할 필요 없다.

| 선택 | 실제 적용 |
|------|----------|
| **nextjs** | react (자동) + nextjs |
| **vite** | react (자동) + vite |
| **react** | react만 |

### design 경로

규칙 조합 없음. 디자인 시스템 문서를 rules / reference로 나눠 배치한다.
- 원칙(Key Characteristics, Typography Principles, Elevation Philosophy, Do/Don't) → `rules/design/`
- 값·스펙(색 토큰, 타입 스케일, 컴포넌트 스펙, 레이아웃, 섀도우, 반응형) → `references/` (라이브러리 파일과 flat 공존)

## 3. 파일 배치

소스 경로: `${CLAUDE_SKILL_DIR}/references/`

### framework 경로

대상 프로젝트의 `.claude/`에 프레임워크별 하위 디렉토리로 복사한다:

```
<project-root>/.claude/
├── rules/
│   ├── react/       ← frontend/react/rules/*.md (항상 포함)
│   └── nextjs/      ← frontend/nextjs/rules/*.md (nextjs 선택 시)
│   또는
│   └── vite/        ← frontend/vite/rules/*.md (vite 선택 시)
└── references/      ← frontend/react/reference/*.md (항상 포함)
```

- rules는 프레임워크별 하위 디렉토리로 분리 (겹치는 파일명 공존)
- references는 모두 플랫하게 배치 (라이브러리 + 디자인 파일 공존, 이름 충돌 없음)

### design 경로

`design/rules/*.md` → `.claude/rules/design/`, `design/reference/*.md` → `.claude/references/`(flat)에 배치한다:

```
<project-root>/.claude/
├── rules/
│   └── design/              ← design/rules/*.md (2개)
│       ├── principles.md
│       └── do-donts.md
└── references/              ← design/reference/*.md (7개, 라이브러리와 flat 공존)
    ├── visual-theme.md
    ├── color.md
    ├── typography.md
    ├── components.md
    ├── layout.md
    ├── elevation.md
    └── responsive.md
```

## 4. 실행 절차

### 4a. `/init design` — 디자인 시스템 단독 업데이트

1. `.claude/rules/design/`가 존재하거나 `.claude/references/`에 디자인 파일(visual-theme, color, typography, components, layout, elevation, responsive) 중 하나라도 있으면 덮어쓸지 확인
2. 디렉토리 생성:
   - `mkdir -p <project>/.claude/rules/design`
   - `mkdir -p <project>/.claude/references`
3. 디자인 원칙 복사: `design/rules/*.md` → `.claude/rules/design/`
4. 디자인 참조 복사: `design/reference/*.md` → `.claude/references/`
5. 결과 출력

### 4b. `/init [nextjs|vite|react]` — 풀 셋업

1. 프레임워크 감지 또는 인자 확인
2. 사용자 확인
3. `.claude/rules/`가 이미 존재하면 덮어쓸지 확인
4. 디렉토리 생성:
   - `mkdir -p <project>/.claude/rules/react`
   - `mkdir -p <project>/.claude/rules/<framework>` (nextjs 또는 vite 선택 시)
   - `mkdir -p <project>/.claude/references`
5. React 규칙 복사: `frontend/react/rules/*.md` → `rules/react/`
6. React 참조 복사: `frontend/react/reference/*.md` → `references/`
7. 프레임워크 규칙 복사: `frontend/<framework>/rules/*.md` → `rules/<framework>/`
8. `init.md`, `README.md` 파일은 복사하지 않는다
9. 빈 파일은 복사하지 않는다
10. 결과 출력

## 5. 출력 형식

`/init design` 실행 시:
```
[nxtdev:init] 디자인 시스템 업데이트 완료

.claude/rules/design/ (2개)
  ├── principles.md
  └── do-donts.md
.claude/references/ (+7개)
  ├── visual-theme.md
  ├── color.md
  ├── typography.md
  ├── components.md
  ├── layout.md
  ├── elevation.md
  └── responsive.md
```

`/init [framework]` 실행 시:
```
[nxtdev:init] {framework} 프로젝트 규칙 세팅 완료

.claude/rules/
  ├── react/       (N개)
  │   ├── accessibility.md
  │   ├── ...
  └── nextjs/      (N개)
      ├── components.md
      ├── ...
.claude/references/ (N개)
  ├── axios.md
  ├── ...

총 N개 파일 생성
```

## 주의사항

- `.claude/CLAUDE.md`는 건드리지 않는다
- init.md, README.md는 복사 대상에서 제외
- 빈 파일은 복사하지 않는다
