# nxtdev

A Claude Code plugin for NxtCloud AI agent development workflows.

## Installation

In Claude Code, run:

```text
/plugin marketplace add nxtcloud-org/nxtdev-plugin
/plugin install nxtdev@nxtdev
/reload-plugins
```

Verify with `/plugin list` — `nxtdev` should appear as enabled. Skills are then invokable as `/nxtdev:<skill>`.

For local development:

```bash
claude --plugin-dir /path/to/nxtdev-plugin
```

## Plugin Structure

```
nxtdev-plugin/
├── .claude-plugin/
│   └── plugin.json       # Plugin manifest
├── agents/               # Custom subagent definitions
├── skills/               # Slash-command skills
├── CLAUDE.md             # Claude Code instructions
└── README.md
```

## Components

### Skills

User-invocable slash commands. Each skill is a directory under `skills/` containing a `SKILL.md` file with frontmatter and instructions.

```bash
# Invoke a skill
/nxtdev:skill-name
```

#### Skill Directory Structure

```
skills/
└── my-skill/
    ├── SKILL.md          # Required: frontmatter + instructions (max 500 lines)
    ├── references/       # Optional: detailed docs (loaded on-demand)
    │   ├── api-patterns.md
    │   └── edge-cases.md
    ├── examples/         # Optional: sample outputs, templates
    │   ├── sample-output.md
    │   └── config-template.yaml
    ├── scripts/          # Optional: executable helpers (not read, executed)
    │   ├── validate.sh
    │   └── deploy.py
    └── assets/           # Optional: static resources (HTML, CSS, images)
```

| Directory | Role | Loading |
|-----------|------|---------|
| `references/` | API docs, patterns, edge cases | On-demand |
| `examples/` | Code samples, expected outputs, templates | On-demand |
| `scripts/` | Executable code (Bash, Python, Node.js) | Executed via `${CLAUDE_SKILL_DIR}/scripts/` |
| `assets/` | Static resources (HTML, CSS, images) | Not loaded into context |

SKILL.md contains core instructions (1,500-2,000 words). Detailed content goes in subdirectories and is loaded on-demand when Claude references them.

#### SKILL.md Frontmatter

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill name (kebab-case, max 64 chars) |
| `description` | string | When to use (max 250 chars) |
| `disable-model-invocation` | boolean | Only user can invoke via `/` |
| `user-invocable` | boolean | Set `false` to hide from `/` menu (Claude-only) |
| `argument-hint` | string | Autocomplete hint (e.g. `"[issue-number]"`) |
| `allowed-tools` | string\|array | Tools without per-use prompting |
| `model` | string | Override model: `opus`, `sonnet`, `haiku` |
| `effort` | string | Effort level: `low`, `medium`, `high`, `max` |
| `context` | string | `fork` for isolated subagent context |
| `agent` | string | Subagent type: `Explore`, `Plan`, `general-purpose` |
| `paths` | string\|array | Glob patterns to auto-activate |
| `shell` | string | `bash` or `powershell` |

#### String Substitutions

- `${CLAUDE_SESSION_ID}` — session ID
- `${CLAUDE_SKILL_DIR}` — skill directory path
- `$ARGUMENTS` / `$0`, `$1` — skill arguments

#### Dynamic Content Injection

Run shell commands before Claude processes the prompt:

```markdown
Current branch: !`git branch --show-current`
```

#### Supporting Files

Reference subdirectory files from SKILL.md:

```markdown
For API details, see [api-patterns.md](references/api-patterns.md)
Run validation: `python ${CLAUDE_SKILL_DIR}/scripts/validate.py`
```

### Agents

Custom subagents with specialized roles, tool restrictions, and model overrides. Each agent is a `.md` file in `agents/`.

## Workflow

```
/nxtdev:clarify  →  /nxtdev:plan  →  /nxtdev:run-plan
```

- **`/nxtdev:clarify`** — builds a Context Brief
- **`/nxtdev:plan`** — single plan document, 5 parallel reviewers, Worker-Validator tasks
- **`/nxtdev:run-plan`** — executes the plan via compliance → worker → validator loop

## Development

```bash
# Test locally
claude --plugin-dir .

# Debug loading
claude --debug

# Reload after changes (in-session)
/reload-plugins
```

### Adding a Skill

1. Create `skills/my-skill/SKILL.md`
2. Add frontmatter (`name`, `description`, etc.)
3. Write instructions in markdown body
4. Optionally add supporting files (`reference.md`, `scripts/`)
5. Test with `claude --plugin-dir .` then invoke `/nxtdev:my-skill`

### Adding an Agent

1. Create `agents/my-agent.md`
2. Add frontmatter (`name`, `description`, `model`, `tools`, etc.)
3. Write system prompt in markdown body

## Release Strategy

- **Branching**: GitHub Flow. Protect `main`; do work on short-lived `<type>/<topic>` branches (`feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`), merge via PR, then delete the branch.
- **Versioning**: [SemVer](https://semver.org) `vMAJOR.MINOR.PATCH`. Tags are placed on `main` HEAD.
- **When to release**: bump the version only when functional changes (skills/agents) have accumulated. Docs-only changes are not re-released — they ride along with the next functional release.
- **Release steps**:
  1. Update `version` in `plugin.json` and `marketplace.json`
  2. Update `CHANGELOG.md` (Keep a Changelog format)
  3. `git tag vX.Y.Z` on `main` HEAD
  4. Update `ref` in `marketplace.json` to the new tag
- **Distribution**: `marketplace.json`'s `ref` always points to the latest **stable tag**. Marketplace installs are based on this tag.

## License

MIT

---

# nxtdev (한국어)

NxtCloud AI 에이전트 개발 워크플로우를 위한 Claude Code 플러그인입니다.

## 설치

Claude Code에서 실행:

```text
/plugin marketplace add nxtcloud-org/nxtdev-plugin
/plugin install nxtdev@nxtdev
/reload-plugins
```

`/plugin list`로 확인 — `nxtdev`가 enabled로 표시되어야 합니다. 이후 스킬은 `/nxtdev:<skill>` 형식으로 호출할 수 있습니다.

로컬 개발 시:

```bash
claude --plugin-dir /path/to/nxtdev-plugin
```

## 플러그인 구조

```
nxtdev-plugin/
├── .claude-plugin/
│   └── plugin.json       # 플러그인 매니페스트
├── agents/               # 커스텀 서브에이전트 정의
├── skills/               # 슬래시 커맨드 스킬
├── CLAUDE.md             # Claude Code 지침
└── README.md
```

## 구성 요소

### Skills (스킬)

사용자가 슬래시 명령어로 호출하는 기능입니다. 각 스킬은 `skills/` 아래 디렉토리에 `SKILL.md` 파일을 포함합니다.

```bash
# 스킬 호출
/nxtdev:skill-name
```

#### 스킬 디렉토리 구조

```
skills/
└── my-skill/
    ├── SKILL.md          # 필수: 프론트매터 + 지침 (최대 500줄)
    ├── references/       # 선택: 상세 문서 (필요 시 로드)
    │   ├── api-patterns.md
    │   └── edge-cases.md
    ├── examples/         # 선택: 샘플 출력, 템플릿
    │   ├── sample-output.md
    │   └── config-template.yaml
    ├── scripts/          # 선택: 실행 가능한 헬퍼 (읽지 않고 실행)
    │   ├── validate.sh
    │   └── deploy.py
    └── assets/           # 선택: 정적 리소스 (HTML, CSS, 이미지)
```

| 디렉토리 | 역할 | 로딩 방식 |
|-----------|------|-----------|
| `references/` | API 문서, 패턴, 엣지 케이스 | 필요 시 로드 |
| `examples/` | 코드 샘플, 예상 출력, 템플릿 | 필요 시 로드 |
| `scripts/` | 실행 코드 (Bash, Python, Node.js) | `${CLAUDE_SKILL_DIR}/scripts/`로 실행 |
| `assets/` | 정적 리소스 (HTML, CSS, 이미지) | 컨텍스트에 로드되지 않음 |

SKILL.md에 핵심 지침(1,500-2,000단어)을 작성하고, 상세 내용은 하위 디렉토리에 배치합니다. Claude가 참조할 때 필요 시 로드됩니다.

#### SKILL.md 프론트매터

| 필드 | 타입 | 설명 |
|------|------|------|
| `name` | string | 스킬 이름 (kebab-case, 최대 64자) |
| `description` | string | 사용 시점 설명 (최대 250자) |
| `disable-model-invocation` | boolean | 사용자만 `/`로 호출 가능 |
| `user-invocable` | boolean | `false` 설정 시 `/` 메뉴에서 숨김 (Claude만 호출) |
| `argument-hint` | string | 자동완성 힌트 (예: `"[issue-number]"`) |
| `allowed-tools` | string\|array | 승인 없이 사용 가능한 도구 |
| `model` | string | 모델 오버라이드: `opus`, `sonnet`, `haiku` |
| `effort` | string | 노력 수준: `low`, `medium`, `high`, `max` |
| `context` | string | `fork` 설정 시 격리된 서브에이전트에서 실행 |
| `agent` | string | 서브에이전트 타입: `Explore`, `Plan`, `general-purpose` |
| `paths` | string\|array | 자동 활성화 glob 패턴 |
| `shell` | string | `bash` 또는 `powershell` |

#### 문자열 치환

- `${CLAUDE_SESSION_ID}` — 세션 ID
- `${CLAUDE_SKILL_DIR}` — 스킬 디렉토리 경로
- `$ARGUMENTS` / `$0`, `$1` — 스킬 인자

#### 동적 콘텐츠 주입

Claude가 프롬프트를 처리하기 전에 셸 명령어를 실행합니다:

```markdown
현재 브랜치: !`git branch --show-current`
```

#### 보조 파일 참조

SKILL.md에서 하위 디렉토리 파일을 참조합니다:

```markdown
API 상세: [api-patterns.md](references/api-patterns.md) 참조
검증 실행: `python ${CLAUDE_SKILL_DIR}/scripts/validate.py`
```

### Agents (에이전트)

특화된 역할, 도구 제한, 모델 오버라이드가 가능한 커스텀 서브에이전트입니다. 각 에이전트는 `agents/` 디렉토리의 `.md` 파일입니다.

## 워크플로우

```
/nxtdev:clarify  →  /nxtdev:plan  →  /nxtdev:run-plan
```

- **`/nxtdev:clarify`** — Context Brief 작성
- **`/nxtdev:plan`** — 단일 plan 문서, 5개 병렬 리뷰어, Worker-Validator 태스크 구조
- **`/nxtdev:run-plan`** — compliance → worker → validator 루프로 plan 실행

## 개발 방법

```bash
# 로컬 테스트
claude --plugin-dir .

# 디버그 모드
claude --debug

# 변경 후 플러그인 리로드 (세션 내)
/reload-plugins
```

### 스킬 추가

1. `skills/my-skill/SKILL.md` 파일 생성
2. 프론트매터 작성 (`name`, `description` 등)
3. 마크다운 본문에 지침 작성
4. 필요 시 보조 파일 추가 (`reference.md`, `scripts/`)
5. `claude --plugin-dir .`로 테스트 후 `/nxtdev:my-skill`로 호출

### 에이전트 추가

1. `agents/my-agent.md` 파일 생성
2. 프론트매터 작성 (`name`, `description`, `model`, `tools` 등)
3. 마크다운 본문에 시스템 프롬프트 작성

## 릴리스 전략

- **브랜치**: GitHub Flow. `main`을 보호하고, 작업은 `<type>/<주제>` 단기 브랜치(`feat/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`)에서 진행한 뒤 PR로 머지하고 브랜치는 삭제한다.
- **버전**: [SemVer](https://semver.org) `vMAJOR.MINOR.PATCH`. 태그는 `main` HEAD에 부여한다.
- **릴리스 시점**: 스킬·에이전트 등 기능 변경이 쌓였을 때만 버전을 올린다. docs-only 변경은 재릴리스하지 않는다(다음 기능 릴리스에 함께 포함).
- **릴리스 절차**:
  1. `plugin.json`·`marketplace.json`의 `version` 갱신
  2. `CHANGELOG.md` 업데이트 (Keep a Changelog 형식)
  3. `git tag vX.Y.Z` (main HEAD)
  4. `marketplace.json`의 `ref`를 새 태그로 갱신
- **배포**: `marketplace.json`의 `ref`는 항상 최신 **안정 태그**를 가리킨다. 마켓플레이스 설치는 이 태그 기준으로 이뤄진다.

## 라이선스

MIT
