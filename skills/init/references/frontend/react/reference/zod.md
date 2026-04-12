# Zod

TypeScript 우선 스키마 검증 라이브러리.

## 공식 문서

- https://zod.dev/

## 사내 사용 패턴

### 스키마 정의

```ts
// src/features/auth/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '8자 이상'),
});

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, '이름은 2자 이상'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword'],
});

// 타입 추출
export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;
```

### 서버 검증 (Server Actions / API)

```ts
export async function createUserAction(formData: FormData) {
  const parsed = signupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  // parsed.data는 타입 안전
}
```

## 규칙

- 스키마 위치: `src/features/[domain]/schemas.ts`
- 타입: `z.infer<typeof schema>`로 추출 (별도 interface 금지)
- 클라이언트/서버 검증 스키마 공유
- 복잡한 검증: `.refine()` 또는 `.superRefine()` 사용
