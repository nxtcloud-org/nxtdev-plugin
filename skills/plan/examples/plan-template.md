# Plan Document Template

```markdown
# [Feature Name] Implementation Plan

> **Worker note:** Execute this plan task-by-task using `/nxtdev:run-plan` or subagents. Each step uses checkbox (`- [ ]`) syntax for progress tracking.

**Goal:** [One sentence describing what this plan builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Work Scope:**
- **In scope:** [What will be implemented]
- **Out of scope:** [What is explicitly excluded]

**Verification Strategy:**
- **Level:** [e2e | integration | skill/agent | test-suite | build-only]
- **Command:** [exact command to run the verification]
- **What it validates:** [what passing this verification proves]

---

## File Structure

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/path/to/new-file.ts` | [what this file does] |
| Modify | `src/path/to/existing.ts:45-60` | [what changes] |
| Create | `tests/path/to/test.ts` | [what it tests] |

---

### Task 1: [Component Name]

**Dependencies:** None (can run in parallel)
**Files:**
- Create: `exact/path/to/file`
- Test: `tests/exact/path/to/test-file`

- [ ] **Step 1: Write the failing test**

[actual test code in a code block]

- [ ] **Step 2: Run test to verify it fails**

Run: `[exact test command]`
Expected: FAIL with "[expected error message]"

- [ ] **Step 3: Write minimal implementation**

[actual implementation code in a code block]

- [ ] **Step 4: Run test to verify it passes**

Run: `[exact test command]`
Expected: PASS

- [ ] **Step 5: Commit**

Run: `git add [files] && git commit -m "feat: [description]"`

---

### Task 2: [Component Name]

**Dependencies:** Runs after Task 1 completes
**Files:**
- Modify: `exact/path/to/file:line-range`
- Test: `tests/exact/path/to/test-file`

[steps follow same pattern]

---

### Task N (Final): End-to-End Verification

**Dependencies:** All preceding tasks
**Files:** None (read-only verification)

- [ ] **Step 1: Run highest-level verification**

Run: `[verification command from Verification Strategy]`
Expected: ALL PASS

- [ ] **Step 2: Verify plan success criteria**

Manually check each success criterion:
- [ ] [criterion 1]
- [ ] [criterion 2]

- [ ] **Step 3: Run full test suite for regressions**

Run: `[full test suite command]`
Expected: No regressions — all pre-existing tests still pass
```

## Context Brief → Plan Mapping

| Context Brief Field | Plan Header |
|---|---|
| Goal | Goal |
| Scope (In/Out) | Work Scope |
| Technical Context | Architecture + Tech Stack + File Structure basis |
| Constraints | Task decomposition constraints |
| Success Criteria | Self-Review criteria + Final Verification |
| Open Questions | Assumptions in plan (confirmed at the gate before handoff) |
