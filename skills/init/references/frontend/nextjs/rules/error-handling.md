---
paths:
  - "app/**/*.{ts,tsx}"
  - "src/**/*.{ts,tsx}"
---

# Next.js 에러 처리 (React 공통 위에 추가)

## Next.js 에러 계층

1. **라우트 계층**: error.tsx (세그먼트별 에러 바운더리)
2. **전역 계층**: global-error.tsx (Root Layout 에러)

## error.tsx

- "use client" 필수
- error prop (Error 객체) + reset prop (재시도 함수) 받음
- 사용자 친화적 메시지만 표시
- reset()으로 재시도 버튼 제공
- 에러 로깅: useEffect에서 외부 서비스로 전송

```tsx
"use client";

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { logError(error); }, [error]);
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
```

## not-found.tsx

- app/not-found.tsx: 전역 404
- notFound() 함수로 프로그래밍적 404 트리거
- 유용한 네비게이션 제공 (홈으로 가기, 검색)

## global-error.tsx

- Root Layout이 깨질 때만 사용
- html, body 태그 직접 포함해야 함
- "use client" 필수

## Server Action 에러

- throw 금지, 에러 객체 반환 패턴 사용
- redirect()는 try/catch 밖에서 (Next.js가 throw하므로)
