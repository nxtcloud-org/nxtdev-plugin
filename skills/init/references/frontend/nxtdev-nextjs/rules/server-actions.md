---
paths:
  - "app/**/*action*"
  - "src/**/actions.*"
  - "src/**/actions/**/*"
  - "app/**/actions.*"
---

# Server Actions 규칙

## 정의

- "use server"는 파일 최상단 또는 함수 내부에 선언
- 파일 단위 선언 권장: `actions.ts` 파일에 "use server" 최상단
- 위치: `app/[route]/actions.ts` 또는 `src/features/[domain]/actions.ts`

## 네이밍

- 함수명: [동사][명사]Action (createUserAction, deletePostAction)
- 파일명: actions.ts

## 입력 검증

- Zod로 입력값 반드시 검증 (클라이언트 검증과 별도로)
- 검증 실패 시 에러 객체 반환 (throw 금지)

```ts
"use server";

import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

export async function createUserAction(prevState: any, formData: FormData) {
  const parsed = schema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  // ...
}
```

## 반환 패턴

- 성공/실패를 명시적 객체로 반환
- `{ success: true, data }` 또는 `{ errors: {...} }`
- 인수와 반환값은 React가 직렬화 가능해야 함

## redirect 주의

- redirect()는 try/catch 밖에서 호출 (Next.js가 내부적으로 throw하므로)
- revalidatePath/revalidateTag → redirect 순서로

```ts
export async function createPostAction(formData: FormData) {
  try {
    // 데이터 변조
  } catch (error) {
    return { error: '실패' };
  }
  revalidateTag('posts');
  redirect(`/posts`); // try/catch 밖
}
```

## 캐시 무효화

- 데이터 변경 후 반드시 revalidatePath() 또는 revalidateTag() 호출
- 관련 경로만 정확히 무효화 (전체 무효화 금지)

## 폼 연동

- useActionState: Server Action 결과 + 폼 상태 + pending 상태
- useFormStatus: submit 버튼 pending 표시 (별도 컴포넌트에서)
- useOptimistic: 낙관적 UI 업데이트

```tsx
'use client';
import { useActionState } from 'react';
import { createUserAction } from '@/app/actions';

export function SignupForm() {
  const [state, formAction, pending] = useActionState(createUserAction, { message: '' });
  return (
    <form action={formAction}>
      <input name="email" />
      <p>{state?.errors?.email}</p>
      <button disabled={pending}>{pending ? '처리 중...' : '가입'}</button>
    </form>
  );
}
```

## cookies / headers 접근

```ts
'use server';
import { cookies, headers } from 'next/headers';

export async function exampleAction() {
  const value = (await cookies()).get('name')?.value;
  const userAgent = (await headers()).get('user-agent');
}
```

## 보안

- Server Action에서 사용자 권한 반드시 확인 (누구나 호출 가능)
- 클로저 변수는 Next.js가 자동 암호화
- POST 메서드만 지원, Origin 헤더 자동 검증 (CSRF 방지)
- allowedOrigins 설정: next.config.ts에서 프록시 도메인 허용

## 금지

- Server Action을 GET 요청 대용으로 사용 (데이터 조회는 Server Component에서)
- 클라이언트에서 Server Action을 useEffect 안에서 호출
- redirect()를 try/catch 안에 넣기
