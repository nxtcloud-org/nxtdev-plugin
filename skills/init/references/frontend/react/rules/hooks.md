---
paths:
  - "src/hooks/**/*"
  - "src/**/hooks.*"
  - "src/**/use*"
---

# 커스텀 훅 규칙

## 네이밍

- `use` 접두사 필수 (useAuth, useDebounce, useLocalStorage)
- 파일명: kebab-case (use-debounce.ts, use-local-storage.ts)

## 위치

- 전역 공통 훅 → `src/hooks/`
- 도메인 전용 훅 → `src/features/[domain]/hooks.ts`
- 2개 이상 도메인에서 쓰면 → `src/hooks/`로 이동

## 반환값

- 값 2개: 배열 `[value, setter]` (useState 컨벤션)
- 값 3개 이상: 객체 `{ data, isLoading, error }` (구조 분해 시 이름 명확)

## 파라미터

- 옵션 2개 이하: 개별 인자 `(value, delay)`
- 옵션 3개 이상: 객체 `({ enabled, interval, onSuccess })`

## 책임

- 한 가지 관심사만 담당
- 너무 크면 작은 훅으로 분리 후 조합

```ts
// 좋은 예: 단일 관심사
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// 나쁜 예: 관심사 혼합
function useAuth() {
  // 로그인 + 회원가입 + 비번 리셋 + 프로필 + 토큰
  // → useLogin, useSignup, useResetPassword로 분리
}
```

## cleanup

- useEffect 사용 시 cleanup 함수 반드시 반환
- 타이머, 이벤트 리스너, 구독 → 정리 필수

## 금지

- 훅 안에서 컴포넌트 렌더링 (JSX 반환 금지 — 훅은 로직만)
- 훅 이름에 `use` 없이 내부에서 다른 훅 호출
