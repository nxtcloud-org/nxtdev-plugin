---
name: plan
description: "명확한 작업 범위를 실행 가능한 계획 문서로 변환. Context Brief를 받아 Worker-Validator 구조의 태스크로 분해한다."
argument-hint: "[context-brief-path]"
---

# Plan Crafting

Writes an executable plan document from a clearly defined work scope. Designed so tasks can be spawned as worker-validator pairs in parallel.

## Core Principle

A plan document must be executable by a worker with zero codebase context, without any additional questions. All ambiguity must be resolved at the planning stage.

## Hard Gates

1. **Context Brief 없으면 먼저 물어본다.** Context Brief 파일이 없고 사용자 요청에 goal, scope boundary, success criteria 중 하나라도 빠져 있으면, **코드 탐색이나 계획 작성 전에 반드시 `AskUserQuestion`으로 선택지를 제시**한다. 탐색부터 시작하지 않는다.
2. **Every step must be executable.** Placeholders (TBD, TODO, "implement later") are never allowed.
3. **Task conflicts must be prevented.** Tasks modifying the same file must not run in parallel. Tasks with dependencies must wait for predecessor completion.
4. **Self-Review is mandatory.** After writing the plan, verify its completeness yourself.
5. **Tasks decompose to minimal feature units.** One task produces one clear deliverable.

## When To Use

- After `/nxtdev:clarify` completes and a Context Brief file has been generated
- When the user explicitly requests plan creation with a clear prompt
- When multi-step implementation is needed and task ordering with dependencies must be defined

## When NOT To Use

- When work scope is still ambiguous (return to `/nxtdev:clarify`)
- Single-file edits, simple bug fixes, or other single-step tasks
- When the user explicitly says "skip the plan, just do it"

## Input

This skill takes a **Context Brief file** as input. If `$ARGUMENTS` is provided, read it as the Context Brief path.

**If no Context Brief is provided**, check whether the user's request contains all three: explicit goal, scope boundary (in/out), and success criteria.

- **All three present** → proceed directly
- **Any missing** → use `AskUserQuestion` to present the choice:

```
Context Brief가 없습니다. 어떻게 진행할까요?

1. `/nxtdev:clarify` 먼저 (추천) — 요구사항을 구체화한 뒤 다시 plan을 실행
2. 바로 plan 작성 — 필수 정보만 빠르게 확인하고 plan 작성 진행
```

Option 1 선택 시 (기본 추천): 스킬을 종료하고 `/nxtdev:clarify` 실행을 안내합니다. clarify가 코드베이스 탐색 + 반복 Q&A로 스코프를 확정하므로 계획 품질이 높아집니다.
Option 2 선택 시: goal, scope boundary (in/out), success criteria를 `AskUserQuestion`으로 하나씩 확인한 뒤 진행합니다. 이 경우에도 Technical Context는 `Agent` with `subagent_type: "Explore"`로 코드베이스를 탐색하여 보충합니다.

**절대로 사용자 확인 없이 스코프를 자체 결정하지 마십시오.**

| Context Brief Field | Plan Header Mapping |
|---|---|
| Goal | **Goal** |
| Scope (In/Out) | **Work Scope** (included/excluded) |
| Technical Context | **Architecture** + **Tech Stack** + basis for file structure mapping |
| Constraints | Reflected as constraints during task decomposition |
| Success Criteria | Used as Self-Review criteria |
| Open Questions | Reflected as assumptions in the plan, then confirmed with the user |

## Plan Document Structure

Save to: `docs/plans/YYYY-MM-DD-<feature-name>.md` (follow user preference if specified).

See [plan-template.md](examples/plan-template.md) for the complete template.

The plan document contains:

1. **Header** — Goal, Architecture, Tech Stack, Work Scope, Verification Strategy
2. **File Structure Mapping** — Which files will be created or modified
3. **Tasks** — Ordered, dependency-aware, with Worker-Validator structure
4. **Final Verification Task** — Always last, depends on all other tasks

### Verification Discovery

Before defining tasks, discover the project's highest-level verification capability. See [verification-discovery.md](references/verification-discovery.md) for the full discovery process.

Record the result in the plan header:

```markdown
**Verification Strategy:**
- **Level:** [e2e | integration | skill/agent | test-suite | build-only]
- **Command:** [exact command to run]
- **What it validates:** [what passing proves]
```

### File Structure Mapping

Before defining tasks, map out which files will be created or modified:

- Each file should have one clear responsibility
- Files that change together should live together. Split by responsibility, not by layer
- Follow existing codebase patterns
- File structure informs task decomposition — each task should produce a self-contained change

## Task Decomposition

### 1. Parallelism and Dependencies

Tasks should be designed for maximum parallel execution. However, these cases require waiting:

- Tasks modifying the same file (prevents file conflicts)
- Tasks where one task's output is referenced by another (interface dependency)
- Tasks that modify shared state (database schema, config files, etc.)

Dependencies are stated in the task header:

```markdown
### Task N: [Task Name]

**Dependencies:** Runs after Task K completes
**Files:**
- Create: `path/to/file`
- Modify: `path/to/existing-file:line-range`
- Test: `path/to/test-file`
```

### 2. Worker-Validator Structure

Each task is designed for independent execution and verification:

- **Worker** (`plan-worker` agent): Executes the task's steps exactly as written. Makes no judgments beyond what the plan specifies.
- **Validator** (`plan-validator` agent): Reviews the worker's output after completion. Checks test pass/fail, code quality, and spec compliance. Operates under an information barrier — never sees the worker's process, only the result in the codebase.

This structure enables spawning multiple tasks simultaneously via parallel `Agent` tool calls.

### 3. Task Granularity

Each step is one action (2-5 minutes):

- "Write the failing test" — one step
- "Run it to make sure it fails" — one step
- "Write the minimal code to make the test pass" — one step
- "Run the tests and make sure they pass" — one step
- "Commit" — one step

See [task-format.md](examples/task-format.md) for concrete format examples.

### Final Verification Task

Every plan must end with a **Final Verification Task** that runs the discovered highest-level verification. Always the last task, depends on all other tasks, cannot be parallelized.

## No Placeholders

Every step must contain the actual content a worker needs. These are **plan failures** — never write them:

- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — workers may read tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Self-Review (Parallel Reviewers)

After writing the complete plan, dispatch **5 reviewer agents in parallel** — one `Agent` call per reviewer, all in a single message. Each reviewer independently judges one dimension of plan quality.

**Dispatch all 5 concurrently:**

```
Agent({ description: "Review spec coverage",   prompt: "[plan path]", subagent_type: "plan-review-spec" })
Agent({ description: "Scan for placeholders",   prompt: "[plan path]", subagent_type: "plan-review-placeholder" })
Agent({ description: "Check type consistency",   prompt: "[plan path]", subagent_type: "plan-review-types" })
Agent({ description: "Verify dependencies",      prompt: "[plan path]", subagent_type: "plan-review-deps" })
Agent({ description: "Check verification coverage", prompt: "[plan path]", subagent_type: "plan-review-verification" })
```

Each reviewer's prompt must include the full plan file path so it can read the plan independently. Reviewers do not see each other's findings (Agent tool provides context isolation automatically).

**After all 5 return, synthesize:**

1. Collect all FAIL verdicts and their specific findings
2. Fix every issue found — add missing tasks, replace placeholders, correct names, fix dependency chains, add verification
3. If any reviewer reported FAIL, the plan is not ready. Fix and re-check (or re-dispatch only the failed reviewers)

**Do NOT skip the parallel review.** Inline self-review by the plan author suffers from confirmation bias — the same context that wrote the plan will overlook its own gaps. Independent reviewers in isolated contexts catch what the author cannot.

See [self-review-checklist.md](references/self-review-checklist.md) for what each reviewer checks in detail.

## Remember

- Exact file paths always
- Complete code in every step — if a step changes code, show the code
- Exact commands with expected output
- DRY, YAGNI, TDD, frequent commits

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`."**

**"How would you like to proceed?"**

1. **Subagent execution (recommended)** — dispatch a fresh `plan-worker` agent per task via the `Agent` tool, validate with `plan-validator` between tasks
2. **Inline execution** — execute tasks in this session using `/nxtdev:run-plan`

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|---|---|
| Marking tasks that modify the same file as parallel | File conflicts, unmergeable changes |
| Listing tasks without dependencies | Execution order tangles, interface mismatches |
| Steps that assume "the worker will figure it out" | Worker's arbitrary interpretation → spec drift |
| Approving a plan with placeholders | Blocked at execution stage, must return to planning |
| Completing a plan without Self-Review | Missing spec coverage, type mismatches, dependency errors go undetected |

## Minimal Checklist

Self-check when plan writing is complete:

- [ ] Do all tasks have exact file paths?
- [ ] Do all steps contain executable code/commands?
- [ ] Are there no file conflicts between parallel tasks?
- [ ] Are dependency chains accurately stated?
- [ ] Does the plan cover all spec requirements?
- [ ] Are there no placeholders?
- [ ] Is there a Verification Strategy in the plan header?
- [ ] Is the Final Verification Task the last task in the plan?

## Transition

After plan approval:

- Ready to execute → `/nxtdev:run-plan`
- Ambiguity discovered → return to `/nxtdev:clarify`

This skill **does not invoke the next skill.** It ends by presenting the plan and letting the user choose.
