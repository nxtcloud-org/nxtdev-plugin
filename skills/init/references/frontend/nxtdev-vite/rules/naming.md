---
paths:
  - "src/**/*.{ts,tsx}"
---

# 네이밍 규칙 (Vite)

코드 네이밍은 [React 공통 네이밍 규칙](../react/naming.md)을 따른다.

## React 공통 규칙과의 차이

### pages/ 컴포넌트

- 파일명: PascalCase + Page 접미사 (`HomePage.tsx`, `NotFoundPage.tsx`, `UserDetailPage.tsx`)
- 디렉토리 + index.tsx 패턴 불필요 — 단일 파일로 충분

### React Router 파라미터

- URL 파라미터: camelCase (`:userId`, `:postId`)

### PrivateRoute

- 이름: `PrivateRoute` 고정 (`AuthGuard`, `RouteGuard` 등 혼용 금지)
