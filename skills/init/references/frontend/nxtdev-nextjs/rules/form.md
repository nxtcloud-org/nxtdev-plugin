---
paths:
  - "src/**/*form*"
  - "src/**/*Form*"
  - "src/features/**/schemas.*"
  - "app/**/*form*"
---

# Next.js 폼 규칙 (React 공통 위에 추가)

## Server Actions 연동

- useActionState: Server Action 결과 + 폼 상태 + pending 상태 관리

```tsx
'use client';
import { useActionState } from 'react';
import { createUserAction } from '@/app/actions';

export function SignupForm() {
  const [state, formAction, pending] = useActionState(createUserAction, { message: '' });
  return (
    <form action={formAction}>
      <input name="email" />
      {state?.errors?.email && <p>{state.errors.email}</p>}
      <button disabled={pending}>{pending ? '처리 중...' : '가입'}</button>
    </form>
  );
}
```

- useOptimistic: 낙관적 UI 업데이트
- useFormStatus: pending 상태 (별도 submit 버튼 컴포넌트에서 사용)
- 클라이언트/서버 검증 스키마 공유 (Zod)

## 점진적 향상

- Server Component의 form + Server Action → JavaScript 없이도 작동
- Client Component에서는 하이드레이션 후 작동
