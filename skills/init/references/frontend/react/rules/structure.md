---
paths:
  - "src/**/*"
---

# React 프로젝트 구조

```
src/
  components/       ← UI 컴포넌트
    ui/             ← UI 라이브러리 컴포넌트 (shadcn/ui 등)
    Button/
      index.tsx
  features/         ← 도메인별 모듈
    auth/
      api.ts        ← API 함수
      types.ts      ← 타입 정의
      schemas.ts    ← Zod 스키마
      hooks.ts      ← 커스텀 훅
  hooks/            ← 전역 공통 훅만
  lib/              ← 외부 라이브러리 설정/래퍼
    utils.ts        ← cn() 등
  utils/            ← 순수 유틸리티 함수
  types/            ← 글로벌 타입 (여러 도메인 공유)
  stores/           ← Zustand 스토어 (클라이언트 전역 상태)
  contexts/         ← React Context Provider
  constants/        ← 글로벌 상수 (라우트 경로, 에러 코드 등)
  pages/            ← 페이지 컴포넌트 (라우터 엔트리)
  App.tsx
  main.tsx
```

## 규칙

### 배치 기준

- features/: 도메인 로직 (API, 타입, 스키마, 훅)
- components/: 재사용 UI 컴포넌트
- 함께 수정되는 파일은 같은 디렉토리에

### 글로벌 vs 도메인 기준

- 2개 이상 도메인에서 쓰면 → 글로벌 (`types/`, `constants/`)
- 1개 도메인에서만 쓰면 → `features/[domain]/` 안에

### lib/ vs utils/

- `lib/`: 외부 라이브러리 인스턴스 생성/래퍼 (axios, auth)
- `utils/`: 순수 함수 (format-date, validate-email — 외부 의존 없음)

### stores/ vs contexts/

- `stores/`: Zustand — Provider 불필요, 컴포넌트 밖에서도 접근 가능
- `contexts/`: React Context — Provider로 감싸야 함, React 트리 안에서만

## 라우팅

- React Router: 중앙 라우트 정의 (App.tsx 또는 routes.tsx)
- 라우트 보호: PrivateRoute 컴포넌트로 인증 래핑
- 404: catch-all 라우트(`*`)에 NotFound 컴포넌트

## 상태 관리

- 로컬 상태: useState/useReducer
- 서버 상태: TanStack Query
- 전역 상태: Context API (소규모) 또는 Zustand (대규모)
