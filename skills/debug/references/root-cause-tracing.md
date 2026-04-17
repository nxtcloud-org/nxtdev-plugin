# Root Cause Tracing

## Overview

버그는 종종 콜 스택 깊은 곳에서 나타난다. 본능적으로 에러가 나타난 곳을 고치지만, 그것은 증상을 치료하는 것이다.

**핵심 원칙:** 콜 체인을 역추적하여 원래 트리거를 찾고, 소스에서 수정한다.

## When to Use

- 에러가 진입점이 아닌 깊은 곳에서 발생
- 스택 트레이스가 긴 콜 체인을 보여줌
- 잘못된 데이터의 출처가 불명확
- 어떤 테스트/코드가 문제를 트리거하는지 찾아야 함

## The Tracing Process

### 1. 증상 관찰
```
Error: git init failed in /Users/jesse/project/packages/core
```

### 2. 직접적 원인 찾기
```typescript
await execFileAsync('git', ['init'], { cwd: projectDir });
```

### 3. 호출자 추적
```typescript
WorktreeManager.createSessionWorktree(projectDir, sessionId)
  → called by Session.initializeWorkspace()
  → called by Session.create()
  → called by test at Project.create()
```

### 4. 계속 역추적
- `projectDir = ''` (빈 문자열!)
- 빈 문자열의 `cwd`는 `process.cwd()`로 해석됨
- 소스 코드 디렉토리에서 git init 실행됨

### 5. 원래 트리거 찾기
```typescript
const context = setupCoreTest(); // Returns { tempDir: '' }
Project.create('name', context.tempDir); // beforeEach 전에 접근!
```

## Adding Stack Traces

수동 추적이 어려울 때 계측을 추가한다:

```typescript
async function gitInit(directory: string) {
  const stack = new Error().stack;
  console.error('DEBUG git init:', {
    directory,
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
    stack,
  });
  await execFileAsync('git', ['init'], { cwd: directory });
}
```

**테스트에서는 `console.error()` 사용** — logger는 표시되지 않을 수 있음.

**실행 및 캡처:**
```bash
npm test 2>&1 | grep 'DEBUG git init'
```

## Key Principle

**에러가 나타난 곳만 고치지 마라.** 원래 트리거까지 역추적하라.
