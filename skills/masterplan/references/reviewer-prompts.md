# Reviewer Prompt Templates

Each of the 5 reviewers is dispatched via a single `Agent` tool call. All 5 calls go in **one message** (parallel dispatch). Each prompt has two variables to substitute:

- `{PROBLEM_BRIEF}` — the full Problem Brief composed in Phase 1 (same value for all 5 reviewers)
- `{PLAN_ID}` — the masterplan slug, e.g. `2026-05-07-fsd-violations-fix`. Established in Phase 2.0 before dispatch. Same value for all 5 reviewers.

The reviewer name (`feasibility` / `architecture` / `risk` / `dependency` / `user-value`) is fixed per reviewer and already encoded in each agent file's Output Protocol — the dispatch prompt does not need to inject it separately.

## Dispatch Pattern

In a single message, make 5 `Agent` tool calls. **Prerequisite:** Phase 2.0 has already created `docs/masterplans/{PLAN_ID}/_reviews/`.

```
Agent({ description: "Feasibility review",   subagent_type: "masterplan-review-feasibility",   prompt: "<Feasibility prompt with Problem Brief and PLAN_ID injected>" })
Agent({ description: "Architecture review",  subagent_type: "masterplan-review-architecture",  prompt: "<Architecture prompt with Problem Brief and PLAN_ID injected>" })
Agent({ description: "Risk review",          subagent_type: "masterplan-review-risk",          prompt: "<Risk prompt with Problem Brief and PLAN_ID injected>" })
Agent({ description: "Dependency review",    subagent_type: "masterplan-review-dependency",    prompt: "<Dependency prompt with Problem Brief and PLAN_ID injected>" })
Agent({ description: "User value review",    subagent_type: "masterplan-review-user-value",    prompt: "<User value prompt with Problem Brief and PLAN_ID injected>" })
```

Each prompt follows the same structure: `## Plan ID\n{PLAN_ID}\n\n## Problem Brief\n{PROBLEM_BRIEF}\n\n## Your Task\n[reviewer-specific task]`. The reviewer agents already define their analysis dimensions, output format, and self-write Output Protocol in their agent files — the prompt just injects `PLAN_ID` and the Problem Brief.

## Reviewer 1: Feasibility Analyst

```
## Plan ID

{PLAN_ID}

## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Analyze the feasibility of solving this problem. Follow your agent instructions:
technical feasibility, effort classification (Small/Medium/Large/Uncertain),
underestimation risks, suggested milestone boundaries. Output in the format
specified in your agent file, then write that output to your review file per the
Output Protocol in your agent file (target: docs/masterplans/{PLAN_ID}/_reviews/feasibility.md).
```

## Reviewer 2: Architecture Analyst

```
## Plan ID

{PLAN_ID}

## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Analyze architectural implications and suggest milestone boundaries that respect
interface boundaries, data flow, and dependency direction. Each milestone must
leave the system in a working state. Output in the format specified in your
agent file, then write that output to your review file per the Output Protocol
in your agent file (target: docs/masterplans/{PLAN_ID}/_reviews/architecture.md).
```

## Reviewer 3: Risk Analyst

```
## Plan ID

{PLAN_ID}

## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Identify risks that could derail multi-day execution and suggest milestone ordering
that minimizes cumulative risk. Cover integration risk, ambiguity risk, dependency
risk, regression risk, and recovery cost. Output in the format specified in your
agent file, then write that output to your review file per the Output Protocol in
your agent file (target: docs/masterplans/{PLAN_ID}/_reviews/risk.md).
```

## Reviewer 4: Dependency Analyst

```
## Plan ID

{PLAN_ID}

## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Map all dependencies — between milestones, between files, between external systems.
Produce a dependency DAG, file conflict matrix, parallelizable groups, and external
dependency list. Output in the format specified in your agent file, then write that
output to your review file per the Output Protocol in your agent file (target:
docs/masterplans/{PLAN_ID}/_reviews/dependency.md).
```

## Reviewer 5: User Value Analyst

```
## Plan ID

{PLAN_ID}

## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Evaluate milestone ordering for value delivery: value ordering, demo-ability, feedback
loops, minimum viable milestone, natural abort points. Output in the format specified
in your agent file, then write that output to your review file per the Output Protocol
in your agent file (target: docs/masterplans/{PLAN_ID}/_reviews/user-value.md).
```

## Failure Handling (Phase 2.5)

After all 5 return, the main agent inspects each return value. A successful reviewer returns the single line `REVIEW_WRITTEN: docs/masterplans/{PLAN_ID}/_reviews/<reviewer>.md` AND the file exists at that path. Any other shape is a failure.

1. **Timeout, error, or `Write` failure** (no `REVIEW_WRITTEN:` line, or file missing): re-dispatch the failed reviewer once with the same prompt. If it fails again, proceed without it.
2. **Empty/unusable file** (file exists but < 3 sentences, or did not address the Problem Brief — verify by `Read`-ing the file before proceeding): re-dispatch once. If still unusable, delete the offending file and proceed without that reviewer.
3. **Log missing perspective:** If proceeding with <5, the synthesis dispatch prompt must include: `Missing perspective: [reviewer name] — [reason]. Milestone plan may have a blind spot in [area].` The synthesis agent records this verbatim in the Conflict Resolution Log.
4. **Minimum viable count:** At least 3 of 5 must succeed. If fewer than 3 complete, stop and report to the user — the problem may be too ambiguous for automated review, return to `/nxtdev:clarify`.
