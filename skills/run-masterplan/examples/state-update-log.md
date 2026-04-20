# state.md Update Log Examples

Every state transition is written to disk **before** the next action begins. Use the Execution Log table in `state.md` to record transitions.

## Example Log Progression

```markdown
## Execution Log

| Timestamp | Event | Details |
|-----------|-------|---------|
| 2026-04-20 09:00 | masterplan-locked | 4 milestones approved by user |
| 2026-04-20 09:05 | milestone-start | M1 entered planning phase |
| 2026-04-20 09:08 | milestone-plan-saved | M1 plan: docs/plans/2026-04-20-m1-auth-scaffold.md |
| 2026-04-20 09:10 | milestone-plan-approved | M1 plan approved by user |
| 2026-04-20 09:10 | milestone-executing | M1 executing via /nxtdev:run-plan, attempt 1 |
| 2026-04-20 10:30 | milestone-completed | M1 passed final verification |
| 2026-04-20 10:31 | milestone-start | M2 entered planning phase |
| 2026-04-20 11:45 | milestone-executing | M2 executing via /nxtdev:run-plan, attempt 1 |
| 2026-04-20 12:20 | milestone-failed | M2 /run-plan reported failure on Task 3 after 3 retries |
| 2026-04-20 12:20 | user-escalation | Reported to user; dependent milestones M3, M_final blocked |
```

## Milestone Status Transitions

Valid transitions:

- `pending` → `planning` (when run-masterplan starts work on it)
- `planning` → `executing` (after `/plan` produces an approved plan)
- `planning` → `failed` (if `/plan` cannot produce a valid plan)
- `executing` → `completed` (after `/run-plan` succeeds + integration check passes)
- `executing` → `failed` (after `/run-plan` exhausts retries)
- `failed` → `planning` (only on explicit user retry decision)
- `completed` → terminal (do not re-execute completed milestones)

## Write-Then-Verify Pattern

```
1. Compute the state update (milestone ID, new status, timestamp)
2. Write to state.md
3. Re-read state.md
4. Confirm the update is present
5. Only then proceed to the next action (dispatch /plan, dispatch /run-plan, etc.)
```

If step 4 shows the update is missing, stop and report — the filesystem is in an inconsistent state.
