# React Hook Form

폼 상태 관리 라이브러리.

## 공식 문서

- https://react-hook-form.com/

## 사내 사용 패턴

### Zod + shadcn/ui Form 조합

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '8자 이상 입력하세요'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormValues) => {
    // API 호출
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? '처리 중...' : '로그인'}
        </Button>
      </form>
    </Form>
  );
}
```

## 규칙

- 스키마 위치: `src/features/[domain]/schemas.ts`
- 타입: `z.infer<typeof schema>` (별도 interface 금지)
- Submit: `form.handleSubmit()` 사용 (e.preventDefault 직접 금지)
- 로딩: `form.formState.isSubmitting` (별도 useState 금지)
- 서버 에러: `form.setError('fieldName')` 또는 `form.setError('root')`
- register() 직접 사용 금지 → FormField + FormControl 사용
