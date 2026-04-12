---
paths:
  - "src/**/*.{ts,tsx}"
  - ".env*"
---

# Vite 보안 규칙 (React 공통 위에 추가)

## 환경 변수

- 클라이언트 노출: `VITE_` 접두사 필수 (`import.meta.env.VITE_API_URL`)
- 민감한 정보: `VITE_` 접두사 금지 (API 시크릿, DB 비밀번호 등)
- `VITE_` 없는 변수는 클라이언트 코드에서 접근 불가

### 내장 환경 변수

- `import.meta.env.MODE`: 실행 모드 (development / production)
- `import.meta.env.BASE_URL`: 앱 기본 URL
- `import.meta.env.PROD`: 프로덕션 여부 (boolean)
- `import.meta.env.DEV`: 개발 모드 여부 (boolean)

### .env 파일 로딩 우선순위 (모드별 > 일반)

1. `.env.[mode].local` (예: `.env.development.local`)
2. `.env.[mode]` (예: `.env.development`)
3. `.env.local`
4. `.env`

> 이미 존재하는 환경 변수는 .env 파일로 덮어쓸 수 없음.

### TypeScript 타입 정의

```ts
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## 주의

- Vite는 기본 CSR (클라이언트 사이드 렌더링) — 모든 코드가 브라우저에 노출됨
- 서버 전용 로직이 필요하면 별도 백엔드 필요
- `VITE_` 변수는 빌드 시 인라인 — 런타임 변경 불가
