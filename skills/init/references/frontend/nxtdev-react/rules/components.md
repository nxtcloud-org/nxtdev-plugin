---
paths:
  - "src/**/*.tsx"
  - "src/components/**/*"
---

# 컴포넌트 규칙

## 구조

- 디렉토리/index.tsx 패턴 필수 (단일 파일 컴포넌트 금지)
- Named export 필수, default export 금지
- 선언 방식: `export const` 사용 (`export function` 금지)
- 단일 책임: 한 컴포넌트는 하나의 관심사만 담당
- 너무 많은 역할을 하면 더 작은 컴포넌트로 분리

## 순수성 (공식 규칙)

- 컴포넌트는 순수 함수: 같은 입력(props, state) → 같은 출력
- 렌더링 중 side effect 금지 (DOM 조작, API 호출, 외부 변수 변경)
- Props, State, Context는 읽기 전용 — 직접 변경 금지 (불변 업데이트)
- Side effect는 이벤트 핸들러 또는 useEffect에서 처리

## 선언

- 상태 업데이트 시 함수형 업데이터 필수 (`prev =>` 패턴)
- localStorage 접근은 useEffect 안에서만
- useState 초기값이 비용 큰 계산이면 lazy initializer 사용

## 패턴

- Compound Components: 서브컴포넌트를 네임스페이스로 묶기
- Props Drilling 3단계 이상 시 children 패턴 또는 Context API
- useTransition으로 비긴급 업데이트 분리
- 상태 끌어올리기: 여러 컴포넌트가 공유하는 상태는 가장 가까운 공통 부모로

## 리스트 렌더링

- 모든 리스트 항목에 유니크한 `key` prop 필수
- key는 데이터 ID 사용 (배열 인덱스 금지)

## Import 순서

1. React
2. 외부 라이브러리
3. UI 컴포넌트
4. 내부 컴포넌트
5. Hooks/Utils
6. 타입/상수

## 금지

- 조건부 렌더링에 삼항연산자 중첩
- HTML UI 요소 직접 사용 (UI 라이브러리 우선)
- 렌더링 중 외부 변수 변경
- Props/State 직접 mutation
