# Master state.md Template

Saved at `docs/masterplans/YYYY-MM-DD-<feature-slug>/state.md`. Read and updated by `/nxtdev:run-masterplan` during execution.

```markdown
# Masterplan State: [Feature Name]

**Created:** YYYY-MM-DD HH:MM
**Last Updated:** YYYY-MM-DD HH:MM
**Status:** masterplan-locked | executing | paused | completed | failed

**Verification Strategy:**
- **Level:** [e2e | integration | skill/agent | test-suite | build-only]
- **Command:** [exact verification command]
- **What it validates:** [what passing proves]

## Milestones

| ID | Name | Status | Attempts | Dependencies | Plan File | Abort Point |
|----|------|--------|----------|--------------|-----------|-------------|
| M1 | [name] | pending | 0 | — | — | Yes/No |
| M2 | [name] | pending | 0 | M1 | — | Yes/No |
| M3 | [name] | pending | 0 | M1, M2 | — | No |
| M_final | Integration Verification | pending | 0 | M1, M2, M3 | — | No |

**Status values:** pending | planning | executing | validating | completed | failed | skipped
**Attempts:** number of plan-execute cycles attempted (incremented when a milestone enters `planning`)

## Execution Log

| Timestamp | Event | Details |
|-----------|-------|---------|
| YYYY-MM-DD HH:MM | masterplan-locked | N milestones approved by user |
| YYYY-MM-DD HH:MM | milestone-start | M1 entered planning phase |
| YYYY-MM-DD HH:MM | milestone-complete | M1 passed final verification |
```

Write-then-verify discipline: after updating state.md, re-read it to confirm the change persisted before taking the next action.
