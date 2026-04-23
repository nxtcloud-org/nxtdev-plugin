---
paths:
  - "src/**/*"
  - "index.html"
  - "vite.config.*"
---

# Vite + React 프로젝트 구조

## 프로젝트 생성

```bash
npm create vite@latest [프로젝트명] -- --template react-ts
```

## 기본 생성 구조

```
my-app/
├── index.html               ← 앱 진입점 (Vite는 index.html이 엔트리)
├── vite.config.ts            ← Vite 설정
├── tsconfig.json             ← TypeScript 설정
├── tsconfig.app.json         ← 앱 전용 TS 설정
├── tsconfig.node.json        ← Node 전용 TS 설정 (vite.config용)
├── eslint.config.js          ← ESLint 설정
├── package.json
├── public/                   ← 정적 자산 (변환 없이 그대로 서빙)
│   └── vite.svg
└── src/
    ├── App.tsx               ← 루트 컴포넌트
    ├── App.css
    ├── main.tsx              ← 앱 엔트리 (ReactDOM.createRoot)
    ├── index.css             ← 전역 스타일
    ├── vite-env.d.ts         ← Vite 타입 선언 (import.meta.env 등)
    └── assets/               ← import로 참조되는 자산 (빌드 시 해시)
        └── react.svg
```

## 직접 추가 (프로젝트 생성 후)

```bash
# 1. TailwindCSS + shadcn/ui (선택)
npx shadcn@latest init --defaults

# 2. 환경 변수 파일
touch .env .env.local .env.example

# 3. src/ 하위 디렉토리
mkdir -p src/{components,features,hooks,lib,utils,types,stores,contexts,constants}

# 4. 선택적 디렉토리
mkdir -p src/{i18n,config}
```

## 프로젝트 구조 (확장 후)

```
src/
  components/            ← UI 컴포넌트
    ui/                  ← UI 라이브러리 컴포넌트 (shadcn/ui 등)
  features/              ← 도메인별 모듈
    auth/
      api.ts             ← API 호출만 (도메인 언어로 메서드 정의)
      service.ts         ← 순수 비즈니스 로직 (React 의존 없음)
      types.ts
      schemas.ts
      hooks.ts
  hooks/                 ← 전역 공통 훅만
  lib/                   ← 외부 라이브러리 설정/래퍼
    utils.ts
  utils/                 ← 순수 유틸리티 함수
  types/                 ← 글로벌 타입 (여러 도메인 공유)
  stores/                ← Zustand 스토어
  contexts/              ← React Context Provider
  constants/             ← 글로벌 상수
  pages/                 ← 페이지 컴포넌트 (라우터 엔트리)
  App.tsx                ← 루트 컴포넌트 + 라우터
  main.tsx               ← ReactDOM.createRoot
```

## Vite 핵심 차이 (Next.js와 비교)

- `index.html`이 앱 진입점 (Next.js는 app/layout.tsx)
- `public/` 자산은 변환 없이 그대로 서빙 (/ 경로로 접근)
- `src/assets/` 자산은 import 시 빌드 파이프라인 통과 (해시 추가)
- SSR 없음 (기본) — 모든 코드가 클라이언트에서 실행
- `vite-env.d.ts`: Vite 타입 선언 (수동 편집 가능 — env 타입 확장)

## 라우팅

- React Router 사용: 중앙 라우트 정의 (App.tsx 또는 routes.tsx)
- 라우트 보호: PrivateRoute 컴포넌트로 인증 래핑
- 404: catch-all 라우트(`*`)에 NotFound 컴포넌트
- 코드 스플리팅: `React.lazy()` + `Suspense`로 라우트 단위 지연 로딩
