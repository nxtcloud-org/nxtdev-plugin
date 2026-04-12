---
paths:
  - "src/**/*.test.*"
  - "src/**/__tests__/**/*"
  - "e2e/**/*"
  - "tests/**/*"
  - "app/**/*.test.*"
---

# Next.js 테스트 규칙 (React 공통 위에 추가)

## Server Component 테스트

- async 컴포넌트: await로 렌더 결과 확인
- Server Actions: 직접 함수 호출로 테스트 (입력 → 출력 검증)
- fetch mocking: Server Component 내 fetch를 모킹

## Route Handler 테스트

- NextRequest 객체 생성 → 핸들러 함수 직접 호출 → Response 검증

```ts
import { GET } from '@/app/api/health/route';
import { NextRequest } from 'next/server';

it('should return 200', async () => {
  const request = new NextRequest('http://localhost/api/health');
  const response = await GET(request);
  expect(response.status).toBe(200);
});
```

## next/navigation 모킹

```ts
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams('q=test'),
  redirect: vi.fn(),
}));
```

## Middleware 테스트

- NextRequest + middleware 함수 직접 호출 → NextResponse 검증
- matcher 패턴별 요청 시나리오 테스트
