# Problem Brief Template

Composed during Phase 1 (Problem Framing) from a Context Brief or user request. Passed verbatim to all 5 reviewer agents.

```markdown
## Problem Brief

**Goal:** [What must be achieved]

**Scope:**
- In: [What is included]
- Out: [What is explicitly excluded]

**Technical Context:**
[Relevant architecture, existing code, constraints. Populate via `Agent({subagent_type: "Explore", ...})` if codebase involved.]

**Constraints:**
[Time, compatibility, dependencies, performance requirements]

**Success Criteria:**
[Specific, measurable outcomes]

**Verification Strategy:**
- **Level:** [e2e | integration | skill/agent | test-suite | build-only]
- **Command:** [exact command to run the verification]
- **What it validates:** [what passing this verification proves]
```

The Verification Strategy is discovered via the same process described in `skills/plan/references/verification-discovery.md`.
