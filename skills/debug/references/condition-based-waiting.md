# Condition-Based Waiting

## Overview

Flaky 테스트는 타이밍을 추측하는 임의 delay에서 비롯된다. 빠른 머신에서는 통과하지만 CI나 부하 상태에서 실패한다.

**핵심 원칙:** 소요 시간을 추측하지 말고, 실제 조건을 기다려라.

## When to Use

- 테스트에 임의 delay가 있을 때 (`setTimeout`, `sleep`, `time.sleep()`)
- 테스트가 flaky할 때 (때때로 통과, 부하 시 실패)
- 테스트가 병렬 실행 시 타임아웃
- 비동기 연산 완료 대기

**사용하지 않을 때:**
- 실제 타이밍 동작 테스트 (debounce, throttle)
- 임의 timeout 사용 시 반드시 WHY를 문서화

## Core Pattern

```typescript
// BAD: 타이밍 추측
await new Promise(r => setTimeout(r, 50));
const result = getResult();
expect(result).toBeDefined();

// GOOD: 조건 대기
await waitFor(() => getResult() !== undefined);
const result = getResult();
expect(result).toBeDefined();
```

## Quick Patterns

| Scenario | Pattern |
|----------|---------|
| 이벤트 대기 | `waitFor(() => events.find(e => e.type === 'DONE'))` |
| 상태 대기 | `waitFor(() => machine.state === 'ready')` |
| 개수 대기 | `waitFor(() => items.length >= 5)` |
| 파일 대기 | `waitFor(() => fs.existsSync(path))` |
| 복합 조건 | `waitFor(() => obj.ready && obj.value > 10)` |

## Implementation

```typescript
async function waitFor<T>(
  condition: () => T | undefined | null | false,
  description: string,
  timeoutMs = 5000
): Promise<T> {
  const startTime = Date.now();
  while (true) {
    const result = condition();
    if (result) return result;
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
    }
    await new Promise(r => setTimeout(r, 10));
  }
}
```

## Common Mistakes

- **Polling too fast** (`setTimeout(check, 1)`) → 10ms 간격 사용
- **No timeout** → 항상 타임아웃 + 명확한 에러 메시지 포함
- **Stale data** → 루프 안에서 getter 호출하여 최신 데이터 사용

## When Arbitrary Timeout IS Correct

```typescript
// Tool ticks every 100ms - 2 tick을 기다려 partial output 검증
await waitForEvent(manager, 'TOOL_STARTED'); // 먼저 조건 대기
await new Promise(r => setTimeout(r, 200));   // 그 다음 알려진 타이밍 대기
// 200ms = 100ms 간격의 2 tick — 문서화되고 정당화됨
```

요건: (1) 먼저 트리거 조건 대기, (2) 알려진 타이밍 기반, (3) WHY 주석.
