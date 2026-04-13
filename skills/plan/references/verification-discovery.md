# Verification Discovery

Before decomposing tasks, discover the project's highest-level verification capability. This determines the **Final Verification Task** that closes every plan.

## Discovery Order (use the first match)

| Level | What to search for |
|-------|-------------------|
| 1. **e2e tests** | `e2e/`, `tests/e2e/`, `cypress/`, `playwright/`, `test:e2e` in package.json, `e2e` targets in Makefile/Taskfile |
| 2. **Integration tests** | `tests/integration/`, `integration_test`, `test:integration` scripts |
| 3. **Verification skill or agent** | Project skills/agents named `verify`, `validate`, `e2e`, or `test` |
| 4. **Project test suite** | Any test runner (`pytest`, `jest`, `go test`, `cargo test`, etc.) with broad coverage |
| 5. **Build + lint** | If no tests exist, the highest available is a successful build + lint pass |

Use the `Agent` tool with `subagent_type: "Explore"` to search for these patterns across the project.

## When No Tests Exist (Level 5 Only)

Add a **Task 0: Create Verification Infrastructure** to the plan:

1. Identify the project's tech stack and appropriate test framework
2. Create an e2e or integration test that exercises the plan's core success criteria
3. This test should **fail before implementation** and **pass after all tasks complete**

Example:

```markdown
### Task 0: Create Verification Infrastructure

**Dependencies:** None (must complete before all other tasks)
**Files:**
- Create: `tests/e2e/feature-name.test.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Install test framework**

Run: `npm install -D vitest @testing-library/react`

- [ ] **Step 2: Write e2e test for core success criteria**

[actual test code here — no placeholders]

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/e2e/feature-name.test.ts`
Expected: FAIL (feature not yet implemented)
```

## Record in Plan Header

```markdown
**Verification Strategy:**
- **Level:** [e2e | integration | skill/agent | test-suite | build-only]
- **Command:** [exact command to run the verification]
- **What it validates:** [what passing this verification proves]
```
