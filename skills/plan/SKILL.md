---
name: plan
description: "Gates a Context Brief and launches the plan workflow (write → review → revise loop). Does not write the plan itself."
argument-hint: "[context-brief-path]"
---

# Plan (Gatekeeper)

This skill does not write the plan itself. It checks the Context Brief, launches the plan
workflow (headless auto-loop: write → review → revise), then reports the result to the user.

## When To Use

- After `/nxtdev:clarify` finishes and a Context Brief file is generated
- When the user explicitly requests plan creation with a clear prompt
- When multi-step implementation needs ordered, dependency-aware tasks

## When NOT To Use

- When work scope is still ambiguous (→ `/nxtdev:clarify`)
- Single-file edits, simple bug fixes, other single-step tasks
- When the user says "skip the plan, just do it"

## Gate (user involvement ends here)

**Start of the data handoff.** What the gate confirms MUST be recorded into the Context
Brief **file** — the workflow receives only the file path, and the headless author reads only that file.

1. **Read the Context Brief** (`$ARGUMENTS`).
2. **Check**: is goal / scope (in·out) / success criteria missing any?
   - Light gaps (fields, simple confirmation) → supplement via `AskUserQuestion`
     → **★ write the supplemented answers back into the Context Brief file with `Write`** (handoff required)
   - Fundamental ambiguity needing code investigation → recommend `/nxtdev:clarify` (no forced referral)
3. **Never decide scope yourself without user confirmation.**
4. Complete Context Brief reached → launch.

## Launch

```javascript
Workflow({ name: "nxtdev:plan", args: briefPath });
```

## Result Interpretation

- `finalVerdict: "PASS"` → "plan.md complete. Run `/nxtdev:run-plan`?"
- **FAIL after all 3 rounds** → show plan.md + `remaining` (failed reviewers) and ask the
  user to decide. (infinite-loop guard)

## Independent review is never skipped (user-facing note)

The plan is reviewed by 5 independent reviewers immediately after writing — plan.js enforces
this in code. The author cannot see the holes in their own plan (confirmation bias).
"It's small" / "it's clear" / "to save tokens" are not reasons to skip. Details: `references/independent-review.md`.

## Fallback when the Workflow tool is unavailable

When the Workflow tool cannot be used: write with the plan-author agent → call the 5
`nxtdev:plan-review-*` agents directly in parallel via `Agent` → manually fix FAIL items →
re-review, **until PASS**. Review is not skipped on this path either.
