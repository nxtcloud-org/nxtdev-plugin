# Reviewer Prompt Templates

Each of the 5 reviewers is dispatched via a single `Agent` tool call. All 5 calls go in **one message** (parallel dispatch). Replace `{PROBLEM_BRIEF}` with the full Problem Brief composed in Phase 1.

## Dispatch Pattern

In a single message, make 5 `Agent` tool calls:

```
Agent({ description: "Feasibility review",   subagent_type: "masterplan-review-feasibility",   prompt: "<Feasibility prompt with Problem Brief injected>" })
Agent({ description: "Architecture review",  subagent_type: "masterplan-review-architecture",  prompt: "<Architecture prompt with Problem Brief injected>" })
Agent({ description: "Risk review",          subagent_type: "masterplan-review-risk",          prompt: "<Risk prompt with Problem Brief injected>" })
Agent({ description: "Dependency review",    subagent_type: "masterplan-review-dependency",    prompt: "<Dependency prompt with Problem Brief injected>" })
Agent({ description: "User value review",    subagent_type: "masterplan-review-user-value",    prompt: "<User value prompt with Problem Brief injected>" })
```

Each prompt follows the same structure: `## Problem Brief\n{PROBLEM_BRIEF}\n\n## Your Task\n[reviewer-specific task]`. The reviewer agents already define their analysis dimensions and output format in their agent files — the prompt just injects the Problem Brief.

## Reviewer 1: Feasibility Analyst

```
## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Analyze the feasibility of solving this problem. Follow your agent instructions:
technical feasibility, effort classification (Small/Medium/Large/Uncertain),
underestimation risks, suggested milestone boundaries. Output in the format
specified in your agent file.
```

## Reviewer 2: Architecture Analyst

```
## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Analyze architectural implications and suggest milestone boundaries that respect
interface boundaries, data flow, and dependency direction. Each milestone must
leave the system in a working state. Output in the format specified in your
agent file.
```

## Reviewer 3: Risk Analyst

```
## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Identify risks that could derail multi-day execution and suggest milestone ordering
that minimizes cumulative risk. Cover integration risk, ambiguity risk, dependency
risk, regression risk, and recovery cost. Output in the format specified in your
agent file.
```

## Reviewer 4: Dependency Analyst

```
## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Map all dependencies — between milestones, between files, between external systems.
Produce a dependency DAG, file conflict matrix, parallelizable groups, and external
dependency list. Output in the format specified in your agent file.
```

## Reviewer 5: User Value Analyst

```
## Problem Brief

{PROBLEM_BRIEF}

## Your Task

Evaluate milestone ordering for value delivery: value ordering, demo-ability, feedback
loops, minimum viable milestone, natural abort points. Output in the format specified
in your agent file.
```

## Failure Handling (Phase 2.5)

After all 5 return:

1. **Timeout or error:** Re-dispatch the failed reviewer once with the same prompt. If it fails again, proceed without it.
2. **Empty/unusable output** (< 3 sentences or did not address the Problem Brief): re-dispatch once. If still unusable, proceed without it.
3. **Log missing perspective:** If proceeding with <5, the synthesis handoff must note: `Missing perspective: [reviewer name] — [reason]. Milestone plan may have a blind spot in [area].`
4. **Minimum viable count:** At least 3 of 5 must succeed. If fewer than 3 complete, stop and report to the user — the problem may be too ambiguous for automated review, return to `/nxtdev:clarify`.
