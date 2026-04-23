---
paths:
  - "app/**/*.{ts,tsx}"
  - "src/**/*.{ts,tsx}"
---

# 네이밍 규칙 (Next.js)

코드 네이밍은 [React 공통 네이밍 규칙](../react/naming.md)을 따른다.

파일/폴더 패턴 (Route Group, Dynamic Segments, Parallel Routes, Private Folders 등)은 [structure.md](structure.md) 참조.

## React 공통 규칙과의 차이

### default export 예외

React 공통 규칙은 Named export를 강제하지만, Next.js 예약 파일은 **default export 필수**:

- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- `not-found.tsx`, `template.tsx`, `global-error.tsx`, `default.tsx`

그 외 컴포넌트/훅/유틸은 Named export 유지.

### 폴더 패턴 예외

Next.js App Router 특수 구문은 kebab-case 규칙 적용 안 됨:

- Route Group: `(groupname)` — 괄호 포함
- Dynamic Segment: `[id]`, `[slug]` — 대괄호 포함
- Parallel Route: `@slot` — @ 포함
- Intercepting Route: `(.)folder`, `(..)folder`
- Private Folder: `_components` — 언더스코어 접두사
