---
name: run-plan
description: "실행 가능한 계획 문서를 Worker-Validator 루프로 실행. 의존성 순서대로 태스크 실행, 병렬 디스패치, 독립 검증."
argument-hint: "[plan-file-path]"
---

# Run Plan

Loads a written plan document, reviews it critically, then executes tasks in dependency order using a worker-validator loop.

## Core Principle

Do not follow plans blindly. If the plan has issues, flag them before executing. But if the plan is clear, execute it faithfully.

## Hard Gates

1. **Read and review the plan first.** Always review the entire plan before executing.
2. **Follow steps exactly.** Do not skip or alter steps in the plan arbitrarily.
3. **Never skip verification.** Test runs, expected output checks, and other verifications must be performed.
4. **Parallelizable tasks MUST run in parallel.** Tasks with no dependencies and no shared file modifications must be dispatched concurrently. Sequential grouping is prohibited.
5. **Worker and Validator must be separate agents.** The main agent must NOT perform worker or validator roles inline. Each must be dispatched as an independent agent via the `Agent` tool.
6. **Validator must not receive worker output.** The validator agent receives only the plan's task goal and acceptance criteria. It must never receive the worker's diff, logs, or implementation details.
7. **Stop when blocked.** Do not guess. Ask the user.

## When To Use

- After a plan has been crafted with `/nxtdev:plan`
- When the user says "run this plan" or "execute the plan"
- When a plan document exists and implementation should begin

## When NOT To Use

- When no plan document exists yet (use `/nxtdev:plan` first)
- When work scope is still ambiguous (return to `/nxtdev:clarify`)
- Single-step tasks that don't need a plan

## Process

### Step 0: Project Capability Discovery

1. **Verification infrastructure** — read the plan's `Verification Strategy` header. If present, use it. If absent, discover using the same process as `/nxtdev:plan` (see plan skill's verification discovery).
2. **Available agents** — this plugin provides `plan-worker`, `plan-validator`, and `plan-compliance` agents. Verify they are accessible.

### Step 1: Load and Review Plan

1. Read the plan file (from `$ARGUMENTS` or ask the user for the path)
2. Review critically:
   - Are task dependencies correct?
   - Do file paths exist (for files to be modified)?
   - Are there any placeholders in steps?
   - Is anything unclear?
3. If issues found: notify the user before starting
4. If no issues: proceed to task execution

### Step 2: Task Execution Loop

Each task runs through a **Compliance → Worker → Validator** cycle.

```
Compliance check → Worker implements → Validator reviews → Pass? → Next task
                                                          Fail? → Worker retries
```

For each task:

**2-1. Compliance Check**

Dispatch the `plan-compliance` agent:

```
Agent({
  description: "Compliance check for Task N",
  prompt: "[task details, predecessor list, file list]",
  subagent_type: "plan-compliance"
})
```

If BLOCKED: resolve the blocker before proceeding.

**2-2. Worker Implementation**

Dispatch the `plan-worker` agent:

```
Agent({
  description: "Execute Task N: [task name]",
  prompt: "[complete task from plan — all steps, code blocks, commands, expected outputs]",
  subagent_type: "plan-worker"
})
```

The worker receives the complete task specification from the plan and executes it step by step.

**2-3. Validator Review (Information-Isolated)**

The validator operates under a **3-layer information barrier**:

| Layer | Mechanism | What it blocks |
|-------|-----------|---------------|
| **L1: Context isolation** | The `Agent` tool starts the validator in a fresh context window — no parent conversation history | Worker output, diffs, logs are automatically blocked |
| **L2: Tool restriction** | `plan-validator` agent has no Write/Edit tools — read-only + test execution only | Validator cannot modify code, only judge it |
| **L3: Fixed prompt template** | Only 4 fields from the plan document are copied into the prompt | Prevents the orchestrator from accidentally including worker context |

Construct the validator prompt using the fixed template from [validator-template.md](references/validator-template.md). **Copy the 4 fields verbatim from the plan document. Do not paraphrase. Do not add context from the worker's output.**

```
Agent({
  description: "Validate Task N: [task name]",
  prompt: "[constructed from fixed template — see references/validator-template.md]",
  subagent_type: "plan-validator"
})
```

**Validation results:**
- **Pass:** Mark the task as completed, move to the next task
- **Fail:** Deliver the validator's feedback to a new worker dispatch for re-implementation. Do not augment the feedback with your own interpretation.
- **Retry limit:** 2 consecutive failures → suggest `/nxtdev:debug` for systematic root-cause investigation. A third retry without understanding the cause is prohibited. If the user declines debug, escalate with full failure context.

### Parallel Execution Rules

Tasks that can run in parallel **must** be dispatched in parallel. Make multiple `Agent` tool calls in a single response.

**Parallel conditions (all must be met):**
- No dependencies on other tasks
- No modifications to the same file
- No changes to shared state (DB schema, config files, etc.)

**When running in parallel:**
- Dispatch an independent `plan-worker` agent per task (multiple `Agent` calls in one message)
- After each worker completes, dispatch an independent `plan-validator` agent for review
- After all parallel tasks complete, aggregate results before proceeding to the next dependent task

### Step 3: E2E Verification Gate

After all tasks are complete, run the highest-level verification as an independent gate:

1. Run the discovered verification command from the plan's Verification Strategy
2. Run the full test suite for regression check
3. Verify all plan success criteria are met

**If all pass:** Report success summary to the user.

**If E2E verification fails:** Follow the failure response protocol in [e2e-failure-protocol.md](references/e2e-failure-protocol.md). Maximum 2 fix attempts before escalating to user.

## When To Stop

Stop executing immediately and ask the user when:

- A blocker occurs (missing dependency, test fails, instruction unclear)
- The plan has critical gaps preventing execution
- You don't understand an instruction
- Verification fails repeatedly

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|---|---|
| Executing without reviewing the plan | Plan errors propagate into implementation |
| Skipping verification steps | Errors accumulate, debugging cost increases later |
| Guessing when blocked | Spec drift, rework required |
| Running parallelizable tasks sequentially | Wasted time, unnecessary delay |
| Running non-parallelizable tasks in parallel | File conflicts, dependency tangles |
| Main agent performing worker/validator roles inline | Defeats independent verification; confirmation bias |
| Passing worker output to the validator | Validator anchors on worker's framing instead of judging independently |
| Composing the validator prompt freely | Unconsciously leaks worker context through word choice |
| Skipping the E2E gate | Task-level pass ≠ system-level pass |
| Retrying E2E failures >2 times without escalation | Wastes budget; user may have root cause context |
| Retrying task failures without root-cause analysis | Same fix applied blindly; use `/nxtdev:debug` after 2 failures |

## Transition

After plan execution is complete:

- To wrap up → report results to the user and suggest next steps
- If the plan needs modification → return to `/nxtdev:plan`
- If ambiguity is discovered → return to `/nxtdev:clarify`
- If a bug blocks progress or repeated failures occur → suggest `/nxtdev:debug`

This skill **does not invoke the next skill.** It ends by reporting execution results and letting the user choose.
