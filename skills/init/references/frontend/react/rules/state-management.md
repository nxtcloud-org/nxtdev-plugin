---
paths:
  - "src/**/*.{ts,tsx}"
---

# 상태 관리 규칙

## 판단 흐름

1. URL에 있어야 하는 값? (검색어, 페이지, 필터) → **URL 상태**
2. 서버에서 가져온 데이터? → **TanStack Query**
3. 이 컴포넌트에서만 쓰이는 값? → **useState**
4. 형제 2~3개가 공유? → **부모로 끌어올리기**
5. 앱 전체 + 자주 안 바뀜? (테마, 언어, 인증) → **Context API**
6. 앱 전체 + 자주 바뀜? (필터, UI 상태) → **Zustand**

## 로컬 상태 (useState / useReducer)

- useState: 단순 값 (boolean, string, number)
- useReducer: 상태 전환 로직이 복잡할 때 (여러 액션 타입)
- 파생 값은 useState 금지 → 렌더 중 계산

## 서버 상태 (TanStack Query)

- API 데이터는 useState로 관리 금지 → useQuery 사용
- 캐싱, 로딩/에러 상태, 백그라운드 갱신 자동 처리
- 상세 → `api.md`

## 전역 상태 — Context API

- 자주 변하지 않는 값에 적합 (테마, 인증 상태, 언어)
- Provider 안의 모든 consumer가 리렌더링됨 → 자주 바뀌는 값 금지
- 위치: `src/contexts/`

## 전역 상태 — Zustand

- 자주 바뀌고 여러 컴포넌트가 구독하는 값에 적합
- selector로 필요한 값만 구독 (리렌더링 최소화)
- 위치: `src/stores/`

```ts
// selector로 필요한 값만 구독
const filter = useFilterStore((state) => state.filter);
// 전체 구독 금지
const store = useFilterStore(); // 아무 값 바뀌어도 리렌더링
```

## URL 상태

- 공유/북마크 가능해야 하는 값 (검색어, 페이지 번호, 필터)
- useSearchParams (React Router) 또는 라우터 파라미터

## 금지

- 같은 데이터를 useState + TanStack Query 중복 관리
- Context에 자주 바뀌는 값 넣기 (리렌더링 폭탄)
- Zustand 스토어에서 전체 state 구독 (selector 없이)

> 상세 패턴: [reference/zustand.md](../../reference/zustand.md), [reference/tanstack-query.md](../../reference/tanstack-query.md)
