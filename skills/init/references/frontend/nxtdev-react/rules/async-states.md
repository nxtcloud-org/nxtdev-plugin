---
paths:
  - "src/**/*.tsx"
  - "app/**/*.tsx"
---

# 비동기 상태 처리 규칙

## 상태 종류

| 상태 | 조건 |
|------|------|
| **loading** | 첫 로딩 중 (데이터 없음) |
| **success** | 데이터 있음 |
| **empty** | 요청 성공, 데이터 없음 |
| **error** | 요청 실패 |
| **refetching** | 데이터 있는 상태에서 백그라운드 갱신 |
| **optimistic** | mutation 후 응답 오기 전 |

## 처리 원칙

### loading
- Skeleton 사용 — 실제 콘텐츠와 같은 크기/레이아웃으로 작성
- spinner는 크기를 예측할 수 없는 경우에만 사용

### empty vs success 구분 필수
- 빈 배열과 undefined는 다르게 처리
- empty state는 빈 화면 금지 — 행동 유도 문구 또는 버튼 포함

### error
- 전역 오류: Error Boundary
- 인라인 오류: 재시도 버튼 포함
- 사용자에게 기술적 에러 메시지(스택, 코드) 노출 금지

### refetching
- 기존 데이터 유지, 전체 Skeleton으로 교체 금지
- subtle indicator (상단 bar 또는 작은 spinner)로 표시

### optimistic
- 즉시 UI 반영
- 실패 시 롤백 + 실패 토스트 알림

## 처리 순서

```tsx
if (isLoading) return <Skeleton />
if (isError)   return <ErrorMessage onRetry={retry} />
if (!data?.length) return <EmptyState />

return (
  <>
    {isRefetching && <RefetchIndicator />}
    {/* 실제 UI */}
  </>
)
```

## 금지

- loading과 empty를 같은 UI로 처리
- error 상태에서 재시도 수단 없이 끝내기
- refetching 때 전체 Skeleton 재표시
- optimistic 업데이트 실패 시 무음 처리
