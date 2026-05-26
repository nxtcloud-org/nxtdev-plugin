# nxtdev

NxtCloud AI 에이전트 개발 워크플로우를 위한 Claude Code 플러그인.

## 시작하기

```text
/plugin marketplace add nxtcloud-org/nxtdev-plugin
/plugin install nxtdev@nxtdev
/reload-plugins
```

상세 설치·개발 가이드는 [guide.md](guide.md) 참고.

## 워크플로우

```
요구사항(모호)  →  /nxtdev:clarify  →  Context Brief
                                          ↓
                                     /nxtdev:plan  →  Plan 문서 (Worker-Validator 태스크)
                                                          ↓
                                                     /nxtdev:run-plan  →  검증된 코드 변경
```

"이거 만들고 싶어요" 수준의 모호한 요청에서 출발해 **검증된 코드 변경**까지 도달하는 3단계 파이프라인이다. 각 단계는 다음 단계의 입력이 되는 **명확한 산출물**(Context Brief → Plan 문서 → 실행된 변경사항)을 만든다.

핵심 설계 원칙:

- **구현 전에 명확성 확보**: 코드를 짜기 전에 범위·제약·완료 기준을 문서로 못박는다. 중간에 "사실 그게 아니었어요"를 막는다.
- **계획과 실행의 분리**: plan 단계에서 5명의 리뷰어가 병렬로 계획을 검토한 뒤에야 run-plan이 시작된다. 잘못된 계획으로 코드를 짜는 일을 줄인다.
- **태스크 단위 독립 검증**: 모든 태스크는 Worker(구현) + Validator(독립 검증) 쌍으로 구성된다. Worker가 "다 됐어요"라고 해도 Validator가 통과시키지 않으면 다음 태스크로 넘어가지 않는다.

버그·테스트 실패·예상과 다른 동작은 이 루프가 아니라 `/nxtdev:debug`로 진입한다.

## nxtdev-core 에이전트

- 모든 plan 계열 에이전트(worker / validator / compliance / 5 reviewers)가 상속받는 **베이스 페르소나**.
- LLM이 코드 생성 시 자주 저지르는 실수를 사전 차단하는 6가지 엔지니어링 규율을 강제한다.
- 원본은 Karpathy의 4가지 원칙(read before write, surgical changes, verify assumptions, define success) + Mnilax의 30-codebase 후속 연구 2가지(Code Decides, Fail Loud)를 결합

#### **Karpathy 6 Rules**:

1. **Think Before Coding** — 쓰기 전에 읽는다. "아마 그럴 것"이라는 단어가 머릿속에 떠오르면 모르는 것이다. 함수를 수정하기 전에 끝까지 읽고, 호출자를 찾고, 타입 정의를 확인한다.
2. **Simplicity First** — 오늘 필요한 것만 만든다. "혹시 모르니 null 가드", "나중에 설정 가능하게", "범용 유틸리티로" 같은 충동은 모두 차단한다. 미래는 미래의 컨텍스트에서 푼다.
3. **Surgical Changes** — 요청된 변경만 한다. 지나가는 길에 발견한 "개선 사항"·리팩토링·주석 추가·타입 어노테이션 부착 금지. 한 태스크, 한 변경.
4. **Goal-Driven Execution** — 코드 작성 전에 "done"의 정의를 검증 가능한 체크리스트로 못박는다. "기능이 동작한다"는 완료 기준이 아니다.
5. **Code Decides, Model Judges** — 정답은 결정론적 도구가 판정한다. `tsc --noEmit`·`pytest`·`rg`의 출력이 LLM의 "이렇게 동작할 거예요"보다 우선한다. 도구가 fail이라면 fail이다.
6. **Fail Loud** — 에러는 보이게 만든다. `try: ... except: pass`, `value or default`로 누락 필드 가리기, 비-200 응답을 빈 본문으로 200 변환 등은 명시적 요청이 없으면 금지. 오늘의 silent fallback은 다음 주의 디버깅 세션이다.

상세 내용은 [agents/nxtdev-core.md](agents/nxtdev-core.md) 참고.

## 스킬

### 메인 워크플로우

#### `/nxtdev:clarify`

모호한 요구사항을 정제해 **Context Brief**를 작성한다.

- **입력**: 자연어 요청 (예: "결제 페이지에 쿠폰 적용 기능 추가")
- **과정**: Q&A 반복 + 병렬 코드베이스 탐색. 관련 파일·기존 패턴·잠재적 충돌 지점을 미리 식별한다.
- **출력**: `context-brief.md` — 범위, 제약 조건, 완료 기준(Definition of Done), 영향받는 파일 목록
- **언제 쓰나**: 요청이 한 문장으로 끝나거나 "X 기능 추가"처럼 범위가 흐릿할 때. 이미 PRD나 상세 명세가 있다면 건너뛰고 `plan`으로 바로 가도 된다.

#### `/nxtdev:plan`

Context Brief를 **실행 가능한 plan 문서**로 변환한다.

- **입력**: Context Brief 경로
- **과정**: 단일 plan 문서를 초안 → 5명의 병렬 리뷰어가 동시에 검토
  - `spec` — 스펙 준수 여부
  - `placeholder` — 미해결 가정·TODO·placeholder 식별
  - `types` — 타입 정의·계약 일관성
  - `deps` — 의존성 순서·누락된 사전 조건
  - `verification` — 검증 가능성·완료 기준 명확성
- **출력**: `plan.md` — Worker-Validator 쌍으로 분해된 태스크 목록
- **특징**: 모든 태스크는 "구현자(worker)가 할 일"과 "검증자(validator)가 통과시킬 조건"이 함께 정의된다.

#### `/nxtdev:run-plan`

plan 문서를 의존성 순서대로 실행한다.

- **입력**: plan 문서 경로
- **과정**: 각 태스크마다 3단계 루프
  1. **compliance** — 태스크가 plan의 제약·규칙을 따르는지 사전 검증
  2. **worker** — 구현 (독립 태스크는 병렬 디스패치 가능)
  3. **validator** — Worker와 분리된 컨텍스트에서 독립 검증. 통과 못하면 worker로 되돌림.
- **출력**: 실행된 코드 변경 + 태스크별 검증 결과 로그
- **특징**: validator는 worker가 "됐다"고 한 말을 믿지 않고 직접 확인한다. "테스트는 안 돌려봤지만 될 거예요" 패턴을 차단.

### 디버그

#### `/nxtdev:debug`

7-phase 디버그 워크플로우. 무계획 디버깅을 방지한다.

1. **재현** — 안정적으로 재현 가능한 최소 케이스 확보
2. **격리** — 변수 좁히기 (어디까지가 정상, 어디부터가 비정상인가)
3. **가설** — 근본 원인 후보 나열
4. **failing test 잠금** — 버그를 드러내는 테스트를 먼저 작성·실패 확인
5. **단일 수정** — 한 가지 변경만 적용
6. **검증** — failing test 통과 + 기존 테스트 회귀 없음
7. **회고** — 왜 놓쳤는지·재발 방지 방법

산탄총 수정("일단 이것저것 고쳐보자") 대신 가설 검증 사이클을 강제한다.

### 프로젝트 셋업

#### `/nxtdev:init`

프론트엔드 프로젝트 초기 룰셋 세팅.

- **모드**:
  - `nextjs` — Next.js 프로젝트 룰셋
  - `vite` — Vite 프로젝트 룰셋
  - `design` — NxtCloud 디자인 시스템 룰셋 단독 적용
  - 인자 없이 호출하면 프로젝트를 감지하거나 선택지를 띄운다
- **출력**: `.claude/rules/` 아래 규칙 파일 + 필요 시 디자인 시스템 참조
- **특징**: `package.json`이 없는 빈 디렉토리에서도 동작한다. 룰셋을 먼저 세팅한 뒤 Claude에게 프로젝트 골격 생성을 맡기는 워크플로우를 지원한다.

## 문서

- [guide.md](guide.md) — 플러그인 구조, SKILL.md 프론트매터, 에이전트 작성법
- [CHANGELOG.md](CHANGELOG.md) — 버전별 변경 이력
- [LICENSE](LICENSE) — MIT

