---
paths:
  - "src/**/*.{ts,tsx}"
  - "app/**/*.{ts,tsx}"
---

# Next.js 보안 규칙 (React 공통 위에 추가)

## 환경 변수

- 서버 전용: `process.env.SECRET_KEY` (접두사 없음)
- 클라이언트 노출: `NEXT_PUBLIC_` 접두사 필수 (빌드 시 인라인, 런타임 변경 불가)
- 공개되어도 괜찮은 것만 NEXT_PUBLIC_ 사용
- 민감한 환경 변수: NEXT_PUBLIC_ 접두사 금지

### .env 파일 로딩 우선순위 (먼저 찾으면 중단)

1. `process.env` (시스템 환경 변수)
2. `.env.$(NODE_ENV).local` (예: `.env.development.local`)
3. `.env.local` (NODE_ENV=test일 때 무시됨)
4. `.env.$(NODE_ENV)` (예: `.env.development`)
5. `.env`

## 서버/클라이언트 경계

- 서버 전용 코드에 `import 'server-only'` 추가 (클라이언트 번들 유입 방지)

```ts
import 'server-only';

export async function getData() {
  const res = await fetch('https://api.com/data', {
    headers: { authorization: process.env.API_KEY },
  });
  return res.json();
}
```

## 인증

- proxy.ts: 인증 필요 경로 보호 (Next 16+, 기본 Node.js Runtime)
- 클라이언트에서만 권한 체크 금지 (proxy + 서버 검증 필수)

## Server Actions 보안

- Server Action에서 사용자 권한 반드시 확인 (누구나 호출 가능하므로)
- Zod로 입력값 서버에서 반드시 재검증 (클라이언트 검증과 별도)
- POST 메서드만 지원, Origin 헤더 자동 검증 (CSRF 방지)
- allowedOrigins: next.config.ts에서 프록시 도메인 허용
- Server Action은 proxy matcher와 별개로 인증/인가 직접 검증 (matcher 제외 경로의 Server Action은 proxy를 우회)

## Proxy 상세 (구 Middleware, Next 16+)

- 인증/권한 확인, 리디렉션에 사용
- Node.js Runtime 기본 (Next 16+). runtime config 옵션은 에러 발생
- 무거운 작업 금지 (복잡한 DB 쿼리, 대량 계산)

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증 체크
  const token = request.cookies.get('token')?.value;
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 헤더 추가
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

export const config = {
  matcher: [
    // 정적 자산, _next 제외
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Proxy 사용 사례

- 인증/권한: 토큰 확인 → 미인증 시 로그인 리다이렉트
- 경로 리다이렉트: 이전 URL → 새 URL
- 헤더 설정: 요청/응답 헤더 추가
- 봇 감지: User-Agent 기반 차단
- 국제화: Accept-Language → 적절한 locale 리다이렉트
