---
name: clarify
description: Use when a user's request is vague, ambiguous, or underspecified. Launches iterative Q&A with parallel codebase exploration. Outputs a scoped context brief. Triggers on "I want to...", "I need...", "let's build...", or any request where scope isn't clear.
argument-hint: "[request]"
---

# Clarification Through Iterative Discovery

Narrows vague user requests into well-defined work scopes. Runs questions and code exploration in parallel to bring the user to a state where they can plan sharply.

## Core Principle

Ambiguity does not resolve in one pass. Multiple rounds of questions and code exploration intersect, gradually sharpening the picture. This skill's purpose is making "what the user wants" and "what state the codebase is in" vivid and clear — not writing code.

## Hard Gates

1. **One question per message.** Never bundle multiple questions into a single message.
2. **Always use subagents.** While conversing with the user, dispatch subagents to explore the codebase.
3. **Do not start implementation until ambiguity is resolved.** Understanding must be complete at the codebase level.
4. **Every question must narrow scope.** Do not repeat questions at the same level of ambiguity.
5. **Never dump raw exploration results on the user.** Summarize findings in context.

## When To Use

- The user says "I want to..." but the scope is unclear
- The request is vague enough that implementation could go in multiple directions
- The user hasn't fully articulated what they want
- There's a risk of clashing with existing codebase structure

## When NOT To Use

- The request is already specific and clear (proceed to `/nxtdev:plan`)
- The scope is obvious, like a simple bug fix or config change
- The user explicitly says "don't ask questions, just do it"

## Before Starting: Frontend Ruleset Check

Check whether `.claude/rules/react/` exists.

- If missing: ask the user "프론트엔드 룰셋이 세팅되어 있지 않습니다. `/nxtdev:init`을 먼저 실행하시겠습니까?"
- If present: proceed.

## The Two-Track Process

### Track 1: User Q&A (Ambiguity Resolution)

Ask the user questions using the `AskUserQuestion` tool. This ensures the question is clearly presented and the user's response is captured cleanly.

**Question principles:**
- One question per message
- Offer choices when possible (A/B/C)
- When a new ambiguity emerges, drill into it next
- Ask "which case?" rather than "why?" — draw out concrete scenarios
- If an answer contradicts a previous one, flag it immediately

**Question sequence guide:**
1. **Purpose**: "What is the end goal of this work?"
2. **Scope**: "What's included and what's excluded?"
3. **Constraints**: "Are there existing constraints?"
4. **Success criteria**: "What should the state look like when done?"
5. **Priority**: "If there are multiple paths, what matters most?"

After each question, briefly update "what we've established so far."

### Track 2: Codebase Exploration (Technical Context)

Use the `Agent` tool with `subagent_type: "Explore"` to explore the codebase in parallel with Q&A.

**How to dispatch exploration:**

Immediately after asking the user a question, launch an exploration agent:

```
Agent({
  description: "Explore codebase for [topic]",
  subagent_type: "Explore",
  prompt: "The user has requested [summarized request]. Investigate:
    1. Related files and the role of each
    2. Existing implementation patterns
    3. Boundary areas this work is likely to affect
    4. Recent related changes
    5. Existing test state
    Report only key findings concisely."
})
```

**Processing exploration results:**
1. Cross-validate against the user's answers
2. If technical constraints unknown to the user are discovered, reflect them in the next question
3. If a conflict with existing code is likely, notify the user

## The Loop

Each cycle:
1. Receive the user's answer
2. Merge exploration results if available
3. Update "remaining ambiguities" list
4. Pick the next question (prioritize what most affects scope)
5. If needed, launch additional exploration agents

## Output: Context Brief

When ambiguity is sufficiently resolved, present the Context Brief. See [context-brief-template.md](examples/context-brief-template.md) for the full format.

The Context Brief includes:
- **Goal** — one-sentence task goal
- **Scope** — in/out of scope
- **Technical Context** — facts discovered through exploration
- **Constraints** — external, technical, time/priority
- **Success Criteria** — verifiable outcome
- **Complexity Assessment** — 5-signal scoring (see [complexity-assessment.md](references/complexity-assessment.md))
- **Suggested Next Step** — auto-routed by complexity score

Save the Context Brief to: `docs/context/YYYY-MM-DD-<topic>-brief.md`
(Follow the user's preference if they specify a different location.)

## Routing Rules

After the Context Brief is approved, the Complexity Assessment determines the next step:

| Verdict | Route | Rationale |
|---------|-------|-----------|
| **Simple** (score 5-8) | `/nxtdev:plan` | Task fits in a single plan cycle |
| **Complex** (score 9-15) | `/nxtdev:masterplan` | Task requires milestone decomposition |
| **Borderline** (score 8-9) | Present both options with recommendation |

**Override:** The user can always override routing.

This skill **does not invoke the next skill.** It ends by presenting the Context Brief, saving it, and suggesting the routed next step.

## Red Flags

| Situation | Response |
|-----------|----------|
| User says "just figure it out" | Warn: at minimum, confirm purpose and success criteria |
| Same topic questioned 3+ times | Separate knowns from unknowns, present assumptions, confirm |
| Exploration finds conflicting code | Notify the user immediately |
| Request decomposes into multiple sub-tasks | Show decomposition, propose prioritizing one at a time |

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|--------------|-------------|
| Five questions in one message | Shallow answers, ambiguity persists |
| Questions without code exploration | Scope may conflict with existing code |
| Showing full exploration output | Too much noise |
| Deciding "that's enough" unilaterally | Always get user confirmation |
| Starting implementation | This skill ends at "clear context" |
