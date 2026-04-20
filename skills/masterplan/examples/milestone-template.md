# Milestone File Template

Saved at `docs/masterplans/YYYY-MM-DD-<feature-slug>/milestones/M{N}-<name>.md`. Each file is designed to be consumed as a Context Brief by `/nxtdev:plan` — field layout mirrors `skills/clarify/examples/context-brief-template.md` so `/plan <milestone-path>` works without adaptation.

```markdown
# Milestone M{N}: [Name]

**ID:** M{N}
**Status:** pending
**Dependencies:** [None | M1, M2, ...]
**Risk:** [Low/Medium/High]
**Effort:** [Small/Medium/Large]
**Abort Point:** [Yes/No]

## Goal

[One-sentence goal — what this milestone achieves]

## Scope

- **In:** [what this milestone includes]
- **Out:** [what this milestone explicitly excludes — deferred to later milestones or out of project]

## Technical Context

[Architecture facts, existing code references, patterns to follow. Copied/extracted from the Problem Brief's Technical Context for the parts relevant to this milestone.]

## Constraints

[Milestone-specific constraints: files not to touch, interfaces to preserve, performance budgets, etc.]

## Success Criteria

- [ ] [Specific, measurable criterion 1]
- [ ] [Specific, measurable criterion 2]
- [ ] [Specific, measurable criterion 3]

## Files Affected

- **Create:** [files to create]
- **Modify:** [files to modify]
- **Test:** [test files to create or extend]

## Verification Strategy

- **Level:** [e2e | integration | skill/agent | test-suite | build-only]
- **Command:** [exact command — usually the same as the masterplan-level strategy, scoped to this milestone's changes]
- **What it validates:** [what passing proves for this milestone]

## User Value

[What the user sees or can test after this milestone completes. If Abort Point = Yes, this should describe what's delivered if execution stops here.]

## Notes

[Special considerations surfaced by reviewer analysis — spike needs, integration risks, pattern alignment, etc. Populated from the synthesis agent's output.]
```

## Integration Verification Milestone (M_final)

Automatically appended by `/masterplan` after synthesis. Read-only verification, no new code.

```markdown
# Milestone M_final: Integration Verification

**ID:** M_final
**Status:** pending
**Dependencies:** [All other milestones]
**Risk:** Medium
**Effort:** Small
**Abort Point:** No

## Goal

Validate that all milestones work together as a complete system.

## Success Criteria

- [ ] Highest-level project verification passes (e2e, integration, or discovered verification)
- [ ] All milestone success criteria remain valid after full integration
- [ ] No regressions in pre-existing functionality
- [ ] Cross-milestone interfaces are exercised end-to-end

## Files Affected

None (read-only verification — no new code).

## Verification Strategy

- **Level:** [inherited from masterplan Verification Strategy]
- **Command:** [inherited]
- **What it validates:** End-to-end system integrity across all completed milestones.

## User Value

Confidence that the system works as a whole, not just per-milestone.
```
