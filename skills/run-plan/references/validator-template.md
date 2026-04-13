# Validator Prompt Template (Fixed)

This is a **fixed template**. The orchestrator must use it exactly as written, filling only the four designated fields by copying verbatim from the plan document.

## Why a Fixed Template

The main agent has seen the worker's output. Even with good intentions, it may unconsciously frame the validator's task in terms of what the worker did — a word choice like "check if the refactoring was done correctly" leaks that a refactoring was performed.

A fixed template eliminates this channel. The validator sees only the plan's original specification, not the main agent's post-worker understanding.

## The Template

```
You are an independent validator. You have no knowledge of how this task
was implemented. Your job is to judge whether the codebase currently meets
the goal described below, by reading files and running tests yourself.

## Task Goal

{TASK_GOAL}
— Copy the task's goal statement verbatim from the plan.

## Acceptance Criteria

{ACCEPTANCE_CRITERIA}
— Copy the task's acceptance criteria verbatim from the plan.
  Each criterion is a concrete, verifiable condition.

## Files To Inspect

{FILE_LIST}
— Copy the list of files this task is expected to create or modify,
  as listed in the plan.

## Test Commands

{TEST_COMMANDS}
— Copy any test execution commands or verification steps
  specified in the plan for this task.

## Your Review Process

1. Read each file in the file list directly from disk.
2. For each acceptance criterion, determine whether it is met
   based on what you see in the code. Record PASS or FAIL per criterion.
3. Run every test command listed above. Record results.
4. Run the full test suite to check for regressions.
5. Check for residual issues: placeholder code (TODO, FIXME, stubs),
   debug code (console.log, print statements), commented-out blocks.

## Your Output

Report your verdict as PASS or FAIL.

- If PASS: confirm which criteria were verified and which tests passed.
- If FAIL: list exactly which criteria failed and why, with file paths
  and line numbers. Do not suggest fixes — only describe what is wrong.
```

## Construction Rules

1. **Copy verbatim.** The four fields ({TASK_GOAL}, {ACCEPTANCE_CRITERIA}, {FILE_LIST}, {TEST_COMMANDS}) must be copied directly from the plan document. Do not paraphrase, summarize, or rephrase.
2. **No additions.** Do not add context, explanations, or hints beyond the four fields.
3. **No worker references.** The following must NEVER appear in the validator prompt:
   - The worker's diff, logs, output, or return message
   - The worker's implementation approach or strategy
   - Any paraphrasing or summarization by the main agent
   - Framing language that hints at the worker's approach

## Why This Works (3-Layer Defense)

| Layer | Mechanism | Effect |
|-------|-----------|--------|
| **L1: Context isolation** | `Agent` tool starts the validator in a fresh context — no parent conversation | Worker output is structurally invisible to the validator |
| **L2: Tool restriction** | `plan-validator` agent has read-only tools (no Write/Edit) | Validator cannot modify code, only judge |
| **L3: This template** | Only plan-sourced fields enter the prompt | Prevents the orchestrator from leaking worker context through the prompt |

L1 is the strongest barrier — the validator literally cannot see the parent conversation. L3 guards the one remaining channel: the prompt string that the orchestrator composes.
