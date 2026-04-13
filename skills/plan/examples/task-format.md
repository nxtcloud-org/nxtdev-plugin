# Task Format Examples

## Parallel Task (No Dependencies)

```markdown
### Task 1: User Authentication Service

**Dependencies:** None (can run in parallel)
**Files:**
- Create: `src/services/auth.ts`
- Create: `src/types/auth.ts`
- Test: `tests/services/auth.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest'
import { authenticateUser } from '../src/services/auth'

describe('authenticateUser', () => {
  it('returns a session token for valid credentials', async () => {
    const result = await authenticateUser('user@example.com', 'password123')
    expect(result.token).toBeDefined()
    expect(result.expiresAt).toBeInstanceOf(Date)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/services/auth.test.ts`
Expected: FAIL with "authenticateUser is not a function"

- [ ] **Step 3: Define types**

```typescript
// src/types/auth.ts
export interface AuthResult {
  token: string
  expiresAt: Date
}
```

- [ ] **Step 4: Write minimal implementation**

```typescript
// src/services/auth.ts
import type { AuthResult } from '../types/auth'

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthResult> {
  // implementation
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/services/auth.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

Run: `git add src/services/auth.ts src/types/auth.ts tests/services/auth.test.ts && git commit -m "feat: add user authentication service"`
```

## Dependent Task

```markdown
### Task 3: Login API Endpoint

**Dependencies:** Runs after Task 1 (auth service) completes
**Files:**
- Create: `src/routes/login.ts`
- Modify: `src/routes/index.ts:12-15`
- Test: `tests/routes/login.test.ts`

[steps follow same pattern, referencing Task 1's AuthResult type]
```

## Final Verification Task

```markdown
### Task 5 (Final): End-to-End Verification

**Dependencies:** All preceding tasks
**Files:** None (read-only verification)

- [ ] **Step 1: Run e2e tests**

Run: `npx vitest run tests/e2e/`
Expected: ALL PASS

- [ ] **Step 2: Verify success criteria**

- [ ] Login page renders and accepts credentials
- [ ] Valid credentials return a session token
- [ ] Invalid credentials show an error message
- [ ] Session persists across page refreshes

- [ ] **Step 3: Run full test suite for regressions**

Run: `npx vitest run`
Expected: No regressions
```
