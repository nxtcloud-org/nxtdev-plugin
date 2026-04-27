# Defense-in-Depth Validation

## Overview

잘못된 데이터로 인한 버그를 수정할 때, 한 곳에서만 검증하면 충분해 보인다. 하지만 다른 코드 경로, 리팩토링, 모킹으로 인해 그 단일 검증이 우회될 수 있다.

**핵심 원칙:** 데이터가 통과하는 모든 레이어에서 검증한다. 버그를 구조적으로 불가능하게 만든다.

## Why Multiple Layers

단일 검증: "버그를 고쳤다"
다중 레이어: "버그를 불가능하게 만들었다"

## The Four Layers

### Layer 1: Entry Point Validation
API 경계에서 명백히 잘못된 입력을 거부한다.

```typescript
function createProject(name: string, workingDirectory: string) {
  if (!workingDirectory || workingDirectory.trim() === '') {
    throw new Error('workingDirectory cannot be empty');
  }
  if (!existsSync(workingDirectory)) {
    throw new Error(`workingDirectory does not exist: ${workingDirectory}`);
  }
}
```

### Layer 2: Business Logic Validation
해당 연산에 데이터가 유의미한지 검증한다.

```typescript
function initializeWorkspace(projectDir: string, sessionId: string) {
  if (!projectDir) {
    throw new Error('projectDir required for workspace initialization');
  }
}
```

### Layer 3: Environment Guards
특정 컨텍스트에서 위험한 연산을 방지한다.

```typescript
async function gitInit(directory: string) {
  if (process.env.NODE_ENV === 'test') {
    const normalized = normalize(resolve(directory));
    const tmpDir = normalize(resolve(tmpdir()));
    if (!normalized.startsWith(tmpDir)) {
      throw new Error(
        `Refusing git init outside temp dir during tests: ${directory}`
      );
    }
  }
}
```

### Layer 4: Debug Instrumentation
포렌식을 위한 컨텍스트를 캡처한다.

```typescript
async function gitInit(directory: string) {
  logger.debug('About to git init', {
    directory,
    cwd: process.cwd(),
    stack: new Error().stack,
  });
}
```

## Applying the Pattern

버그를 찾으면:

1. **데이터 흐름 추적** — 잘못된 값의 출처와 사용처
2. **모든 체크포인트 매핑** — 데이터가 통과하는 모든 지점
3. **각 레이어에 검증 추가** — Entry, Business, Environment, Debug
4. **각 레이어 테스트** — Layer 1 우회 시도, Layer 2가 잡는지 확인

**한 곳에서만 검증하고 멈추지 마라.** 모든 레이어에 검증을 추가하라.
