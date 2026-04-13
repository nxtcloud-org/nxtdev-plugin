# E2E Failure Response Protocol

The E2E gate failure means individual tasks passed their validators but the system as a whole doesn't work. This is an **integration problem**, not a task-level problem.

## Protocol (Maximum 2 Attempts)

### Attempt 1: Diagnose and Fix

1. **Read the failure output carefully.** What test failed? What was the expected vs actual result?
2. **Identify which tasks' interactions** likely caused the failure. Look at shared interfaces, data flow between components, state management.
3. **Dispatch a `plan-worker` agent** to apply a targeted fix scoped to the diagnosed interaction.
4. **Re-run the E2E verification command.**

### Attempt 2: Re-diagnose

If the first fix didn't resolve it:

1. **Re-read the failure output.** The first diagnosis may have been wrong.
2. **Check for a different root cause.** Common second-look areas:
   - Race conditions or ordering issues
   - Missing initialization or cleanup
   - Type mismatches at integration boundaries
   - Environment-specific issues (missing env vars, config)
3. **Apply a second targeted fix.**
4. **Re-run the E2E verification command.**

### Escalate to User (After 2 Failed Attempts)

Do NOT keep retrying silently. Report to the user:

```
## E2E Verification Failed (2 attempts exhausted)

**What the verification tests:** [description]
**What failed:** [specific failure with output]

**Fix attempt 1:** [what was tried and why it didn't work]
**Fix attempt 2:** [what was tried and why it didn't work]

**Current hypothesis:** [best guess at root cause]

**Options:**
1. Continue debugging — [specific next thing to investigate]
2. Re-plan specific tasks — [which tasks likely need revision]
3. Accept partial completion — [what works and what doesn't]
```

Let the user decide. They may have context about the root cause that the agent doesn't.

## Key Rules

- **2 attempts maximum** before escalation. No exceptions.
- **Each attempt must have a different diagnosis.** Retrying the same fix is prohibited.
- **Targeted fixes only.** Do not rewrite entire tasks. The individual tasks already passed validation — the problem is in how they integrate.
- **Never skip the E2E gate.** Task-level pass does NOT equal system-level pass. Integration bugs hide between tasks.
