---
name: init
description: "프론트엔드 프로젝트 초기 설정. 프레임워크(Next.js/Vite)를 감지하거나 선택받아 .claude/rules/에 규칙 파일을 세팅한다. 또는 NxtCloud 디자인 시스템(`design`)을 단독 세팅한다."
argument-hint: "[nextjs|vite|design]"
allowed-tools: "Read Write Glob AskUserQuestion Bash(ls *) Bash(mkdir *) Bash(cp *) Bash(find *)"
---

# Frontend Project Init

프론트엔드 프로젝트의 `.claude/` 디렉토리에 규칙 파일을 세팅한다.

> 빈 디렉토리(package.json 없음)에서도 실행 가능하다. 룰셋을 먼저 세팅한 뒤 Claude에게 프로젝트 생성을 맡기는 워크플로우를 지원한다.

## 1. 프레임워크 감지

인자가 `design`이면 이 섹션을 건너뛰고 **4a로 이동**한다.

인자가 `nextjs` 또는 `vite`면 그대로 사용. 그 외 인자는 무시하고 자동 감지 단계로 진행.

인자가 없거나 유효하지 않으면 자동 감지:

```
next.config.* 존재 → nextjs
vite.config.* 존재 → vite
그 외 → AskUserQuestion으로 nextjs/vite 중 선택 요청
```

선택지:

1. **nextjs** — Next.js (App Router) + React + TypeScript
2. **vite** — Vite + React + TypeScript

자동 감지로 결정된 경우에만 사용자에게 확인받는다: "Next.js 프로젝트로 감지했습니다. 맞나요?"
인자 또는 AskUserQuestion으로 명시 선택된 경우엔 재확인 없이 다음 단계로 진행한다.

## 2. 규칙 조합

### framework 경로

React는 베이스로 **항상 자동 포함**된다. 사용자가 별도로 선택할 필요 없다.

| 선택 | 실제 적용 |
|------|----------|
| **nextjs** | nxtdev-react (자동) + nxtdev-nextjs |
| **vite** | nxtdev-react (자동) + nxtdev-vite |

### design 경로

규칙 조합 없음. NxtCloud 디자인 시스템은 **단일 `DESIGN.md` 파일**로 관리된다.

- 한 파일 안에 YAML 프론트매터(토큰)와 마크다운 본문(원칙·Do/Don't·반응형 등) 모두 포함
- 위치: `.claude/rules/nxtdev-design/DESIGN.md` (rules 자동 로드 + 프론트매터의 `paths` 필터로 디자인 관련 파일 작업 시에만 적용)

## 3. 파일 배치

소스 경로: `${CLAUDE_SKILL_DIR}/references/`

### framework 경로

대상 프로젝트의 `.claude/`에 프레임워크별 하위 디렉토리로 복사한다:

```
<project-root>/.claude/
├── rules/
│   ├── nxtdev-react/       ← frontend/nxtdev-react/rules/*.md (항상 포함)
│   └── nxtdev-nextjs/      ← frontend/nxtdev-nextjs/rules/*.md (nextjs 선택 시)
│   또는
│   └── nxtdev-vite/        ← frontend/nxtdev-vite/rules/*.md (vite 선택 시)
└── references/             ← frontend/nxtdev-react/reference/*.md (항상 포함)
```

- rules는 프레임워크별 하위 디렉토리로 분리 (겹치는 파일명 공존)
- references는 플랫하게 배치
- 디자인 시스템은 framework 경로에 포함되지 않는다. 별도로 `/init design`으로 갱신한다.

### design 경로

`nxtdev-design/DESIGN.md` 단일 파일을 `.claude/rules/nxtdev-design/DESIGN.md`로 복사한다:

```
<project-root>/.claude/
└── rules/
    └── nxtdev-design/
        └── DESIGN.md        ← nxtdev-design/DESIGN.md (1개)
```

- 단일 파일에 토큰(YAML) + 본문(8섹션 + Responsive)이 모두 포함됨
- 프론트매터의 `paths` 필터로 `*.tsx`, `*.css`, `components/**`, `styles/**` 등 디자인 관련 파일 작업 시에만 자동 로드

## 4. 실행 절차

### 4a. `/init design` — 디자인 시스템 단독 업데이트

1. `.claude/rules/nxtdev-design/DESIGN.md`가 이미 존재하면 덮어쓸지 확인
2. 디렉토리 생성: `mkdir -p <project>/.claude/rules/nxtdev-design`
3. DESIGN.md 복사: `nxtdev-design/DESIGN.md` → `.claude/rules/nxtdev-design/DESIGN.md`
4. 결과 출력

### 4b. `/init [nextjs|vite]` — 풀 셋업

1. 프레임워크 감지 또는 인자 확인
2. 사용자 확인
3. `.claude/rules/`가 이미 존재하면 덮어쓸지 확인
4. 디렉토리 생성:
   - `mkdir -p <project>/.claude/rules/nxtdev-react`
   - `mkdir -p <project>/.claude/rules/nxtdev-<framework>` (nextjs 또는 vite 선택 시)
   - `mkdir -p <project>/.claude/references`
5. React 규칙 복사: `frontend/nxtdev-react/rules/*.md` → `rules/nxtdev-react/`
6. React 참조 복사: `frontend/nxtdev-react/reference/*.md` → `references/`
7. 프레임워크 규칙 복사: `frontend/nxtdev-<framework>/rules/*.md` → `rules/nxtdev-<framework>/`
8. `init.md`, `README.md` 파일은 복사하지 않는다
9. 빈 파일은 복사하지 않는다
10. `.claude/CLAUDE.md` 병합 생성:
    - `.claude/CLAUDE.md`가 이미 있으면: 건드리지 않음 (사용자 수정분 보호)
    - 없으면 아래 세 파일을 순서대로 병합하여 저장:
      a. `${CLAUDE_SKILL_DIR}/references/frontend/CLAUDE.md` (공통 베이스, 항상)
      b. `${CLAUDE_SKILL_DIR}/references/frontend/nxtdev-react/rules/init.md` (React 공통 매핑, 항상)
      c. `${CLAUDE_SKILL_DIR}/references/frontend/nxtdev-<framework>/rules/init.md` (nextjs 또는 vite 매핑)
      - 병합 순서: base → react 매핑 → framework 매핑
      - 각 init.md의 "규칙 매핑" 섹션을 순차적으로 베이스 뒤에 붙임
    - `.claude/CLAUDE.md`는 Claude Code가 자동 로드하는 공식 경로이며, `create-next-app`의 화이트리스트(`.claude`)에 포함되어 있어 후속 scaffolding과 충돌하지 않음.
11. 결과 출력

## 5. 출력 형식

`/init design` 실행 시:
```
[nxtdev:init] 디자인 시스템 업데이트 완료

.claude/rules/nxtdev-design/
  └── DESIGN.md         (YAML 토큰 + 본문 8섹션 + 반응형)

총 1개 파일 생성
```

`/init [framework]` 실행 시:
```
[nxtdev:init] {framework} 프로젝트 규칙 세팅 완료

.claude/rules/
  ├── nxtdev-react/       (N개)
  │   ├── accessibility.md
  │   ├── ...
  └── nxtdev-nextjs/      (N개)
      ├── components.md
      ├── ...
.claude/references/ (N개)
  ├── axios.md
  ├── ...

총 N개 파일 생성
```

## 주의사항

- `.claude/CLAUDE.md`가 이미 있으면 건드리지 않는다 (사용자 수정 보호)
- init.md, README.md는 복사 대상에서 제외 (init.md는 CLAUDE.md 병합 재료로만 사용)
- 빈 파일은 복사하지 않는다
