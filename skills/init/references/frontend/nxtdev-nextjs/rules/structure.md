---
paths:
  - "app/**/*"
  - "src/**/*"
---

# Next.js App Router 프로젝트 구조

## 사내 표준 초기화

```bash
npx create-next-app@latest [프로젝트명]
```

프롬프트에서 아래와 같이 선택:

```
✔ Would you like to use the recommended Next.js defaults? › No, customize settings
✔ Would you like to use TypeScript? › Yes
✔ Which linter would you like to use? › ESLint
✔ Would you like to use React Compiler? › Yes
✔ Would you like to use Tailwind CSS? › Yes
✔ Would you like your code inside a `src/` directory? › Yes
✔ Would you like to use App Router? (recommended) › Yes
✔ Would you like to customize the import alias (`@/*` by default)? › No
✔ Would you like to include AGENTS.md? › Yes
```

## 기본 생성 구조 (create-next-app 결과)

```
my-app/
├── .gitignore
├── AGENTS.md                ← 코딩 에이전트 가이드
├── CLAUDE.md                ← Claude Code 가이드
├── README.md
├── eslint.config.mjs        ← ESLint 설정
├── next-env.d.ts            ← Next.js 타입 선언 (자동 생성, 수동 편집 금지)
├── next.config.ts           ← Next.js 설정
├── package.json
├── postcss.config.mjs       ← PostCSS 설정 (Tailwind v4)
├── tsconfig.json            ← TypeScript 설정 + @/ 경로 별칭
├── public/                  ← 정적 자산
│   └── *.svg
└── src/
    └── app/
        ├── favicon.ico      ← 파비콘
        ├── globals.css      ← 전역 스타일
        ├── layout.tsx       ← Root Layout
        └── page.tsx         ← 홈 페이지
```

> Tailwind v4는 CSS 기반 설정이므로 `tailwind.config.ts` 불필요.
> `next-env.d.ts`는 `next build`/`next dev` 시 자동 재생성되므로 수동 편집 금지.

## 직접 추가 (프로젝트 생성 후 실행)

```bash
# 1. shadcn/ui 초기화 (선택) — 컴포넌트 라이브러리로 권장
npx shadcn@latest init --defaults

# 2. 환경 변수 파일 생성
touch .env .env.local .env.example

# 3. src/ 하위 디렉토리 생성
mkdir -p src/{components,features,hooks,lib,utils,types,stores,contexts,constants}

# 4. 선택적 디렉토리 (필요 시)
mkdir -p src/{i18n,config}

# 5. 선택적 루트 파일 (필요 시)
# touch proxy.ts                 ← 인증/리다이렉트 (구 middleware.ts, Next 16+)
# touch instrumentation.ts      ← OpenTelemetry/모니터링
# touch .env.development        ← 개발 환경 변수
# touch .env.production         ← 프로덕션 환경 변수
```

## 프로젝트 구조 (확장 후)

```
src/
  app/
    (auth)/              ← Route Group (URL에 미반영)
      login/
        page.tsx
      register/
        page.tsx
    (main)/
      dashboard/
        page.tsx
        loading.tsx
        error.tsx
      settings/
        page.tsx
    api/                 ← Route Handlers
      health/
        route.ts
    layout.tsx           ← Root Layout
    page.tsx             ← 홈
    not-found.tsx        ← 404
    global-error.tsx     ← 전역 에러
    globals.css
  components/            ← UI 컴포넌트
    ui/                  ← UI 라이브러리 컴포넌트 (shadcn/ui 등)
      button.tsx
      input.tsx
      ...
  features/              ← 도메인별 모듈
    auth/
      api.ts             ← API 호출만 (도메인 언어로 메서드 정의)
      service.ts         ← 순수 비즈니스 로직 (React 의존 없음)
      types.ts           ← 도메인 전용 타입 (LoginRequest, User)
      schemas.ts         ← Zod 검증 스키마 (loginSchema)
      hooks.ts           ← 도메인 전용 훅 (useAuth)
      actions.ts         ← Server Actions (loginAction)
  hooks/                 ← 전역 공통 훅만
  lib/                   ← 외부 라이브러리 설정/래퍼
    utils.ts             ← cn() 유틸 (shadcn/ui 사용 시 자동 생성, 미사용 시 수동 추가)
  utils/                 ← 순수 유틸리티 함수
  types/                 ← 글로벌 타입 (여러 도메인 공유)
  stores/                ← Zustand 스토어 (클라이언트 전역 상태)
  contexts/              ← React Context Provider
  constants/             ← 글로벌 상수 (라우트 경로, 에러 코드 등)
  i18n/                  ← 다국어 설정 (선택)
  config/                ← 런타임 설정 (선택)
```

## 라우팅 패턴

### Route Group `(name)`

```
app/(auth)/login/page.tsx      → /login
app/(auth)/register/page.tsx   → /register
app/(main)/dashboard/page.tsx  → /dashboard
```

- URL에 미반영, 레이아웃 공유용
- 인증/비인증 영역 분리에 사용

### Dynamic Routes

```
app/posts/[id]/page.tsx            → /posts/1, /posts/2         (단일 파라미터)
app/blog/[...slug]/page.tsx        → /blog/a, /blog/a/b/c       (catch-all, 1개 이상 필수)
app/docs/[[...slug]]/page.tsx      → /docs, /docs/a, /docs/a/b  (optional catch-all, 루트도 매칭)
```

### Parallel Routes `@folder`

```
app/
  @modal/
    default.tsx              ← 모달 안 열린 상태 (필수)
    (.)quotation/page.tsx    ← 모달로 열기
  layout.tsx                 ← children + modal 슬롯을 함께 받음
```

- 같은 레이아웃 안에서 여러 페이지를 동시에 렌더링
- 모달, 사이드바 등에 사용
- `default.tsx` 없으면 404

### Intercepting Routes

```
(.)folder          ← 같은 레벨 인터셉트
(..)folder         ← 부모 레벨 인터셉트
(..)(..)folder     ← 2단계 위 인터셉트
(...)folder        ← 루트에서 인터셉트
```

- Parallel Routes와 세트로 사용 (모달 패턴)
- 소프트 네비게이션 시 인터셉트, 하드 네비게이션(새로고침) 시 원본 페이지

### Private Folders `_folder`

```
app/
  _components/Header.tsx    ← 라우팅에서 제외됨
  _lib/utils.ts             ← 라우팅에서 제외됨
```

- `_` 접두사 폴더는 라우팅 시스템에서 완전 무시
- app/ 안에 라우팅 안 되는 헬퍼 파일을 둘 때 사용

## 규칙

### 배치 기준

- app/: 라우팅 + 페이지만 (비즈니스 로직 금지)
- src/features/: 도메인 로직 (API, 타입, 스키마, 훅, Server Actions)
- src/components/: 재사용 UI 컴포넌트
- 함께 수정되는 파일은 같은 디렉토리에

### 글로벌 vs 도메인 기준

- 2개 이상 도메인에서 쓰면 → 글로벌 (`types/`, `constants/`)
- 1개 도메인에서만 쓰면 → `features/[domain]/` 안에

### lib/ vs utils/

- `lib/`: 외부 라이브러리 인스턴스 생성/래퍼 (axios, supabase, auth)
- `utils/`: 순수 함수 (format-date, validate-email — 외부 의존 없음)

### stores/ vs contexts/

- `stores/`: Zustand — Provider 불필요, 컴포넌트 밖에서도 접근 가능
- `contexts/`: React Context — Provider로 감싸야 함, React 트리 안에서만

## Next.js 규약 파일

### 라우팅

- `page.tsx`: 라우트 UI (default export 필수)
- `layout.tsx`: 공유 레이아웃 (children props)
- `loading.tsx`: Suspense 로딩 UI
- `error.tsx`: 에러 바운더리 ("use client" 필수)
- `not-found.tsx`: 404 UI
- `global-error.tsx`: Root Layout 에러 ("use client" 필수, html/body 포함)
- `template.tsx`: 네비게이션마다 리마운트되는 레이아웃
- `route.ts`: API 엔드포인트 — 외부에서 우리 서버를 호출할 때 (웹훅, 외부 연동)
- `default.tsx`: Parallel Route 폴백 — `@folder` 사용 시 필수

### SEO (공개 서비스)

- `sitemap.ts`: 검색 엔진용 사이트맵 (동적 생성)
- `robots.ts`: 크롤링 허용/차단 제어
