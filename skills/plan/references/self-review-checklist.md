# Self-Review: 5 Parallel Reviewers

Plan self-review is performed by 5 independent reviewer agents dispatched in parallel. Each reviewer checks one dimension of plan quality from an isolated context.

## Why Parallel Reviewers

- **Confirmation bias prevention** — the agent that wrote the plan will overlook its own gaps. Independent reviewers in fresh contexts catch what the author cannot.
- **Speed** — 5 checks run simultaneously (~45s) instead of sequentially (~3min).
- **Context isolation** — each reviewer sees only the plan, not the author's reasoning. Agent tool starts each reviewer in a fresh context window.

## The 5 Reviewers

### 1. Spec Coverage (`plan-review-spec`)

Reads the source specification (Context Brief or user request) and the plan. For each requirement, finds the corresponding task. Reports requirements with no task.

**Catches:** forgotten requirements, implicit requirements in constraints/success criteria, scope items marked "in scope" but not implemented.

### 2. Placeholder Scan (`plan-review-placeholder`)

Searches the plan for forbidden patterns that would block a worker:

- "TBD", "TODO", "implement later"
- "Add appropriate error handling"
- "Write tests for the above" (without code)
- "Similar to Task N"
- Code steps without code blocks
- Undefined type/function references

**Catches:** the most common plan failure — vague steps that seem actionable but aren't.

### 3. Type Consistency (`plan-review-types`)

Cross-references every named entity across all tasks:

- Function names match between definition and usage
- Type/interface names consistent
- Property names don't drift (userId vs user_id)
- Import paths match file creation paths
- Function signatures (params, return types) consistent

**Catches:** subtle bugs that surface during execution when Task 7 calls a function with a different name than Task 3 defined.

### 4. Dependency Verification (`plan-review-deps`)

Builds the full dependency graph and checks:

- Missing dependencies (Task B uses Task A's output but doesn't list the dependency)
- File conflicts between parallel tasks
- Shared state conflicts (DB schema, config)
- Circular dependencies
- False dependencies (tasks marked dependent that could be parallel)

**Catches:** execution-time failures — file conflicts, race conditions, tasks that block on incomplete predecessors.

### 5. Verification Coverage (`plan-review-verification`)

Checks the entire verification chain:

- Verification Strategy exists in header
- Final Verification Task is present and last
- Final task depends on all others
- Test commands are concrete (not "run tests")
- Per-task verification steps exist
- Success criteria are covered in final task

**Catches:** plans that produce code but have no way to prove it works.

## Synthesis

After all 5 reviewers return:

1. Collect all FAIL verdicts
2. Fix every issue inline in the plan
3. If fixes were significant, re-dispatch only the affected reviewers to verify

A plan is ready for execution only when all 5 reviewers report PASS.
