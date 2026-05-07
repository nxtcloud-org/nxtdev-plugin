---
name: masterplan
description: "복잡한 다일(multi-day) 작업을 5개의 병렬 리뷰어로 분석하고 합성해 마일스톤 DAG로 분해한다. `/plan` 한 사이클(≤ 8 태스크)로 감당할 수 없는 작업의 진입점."
argument-hint: "[context-brief-path]"
---

# Masterplan (Milestone Decomposition)

Decomposes a complex task into milestones by dispatching 5 parallel reviewer agents, synthesizing their independent analyses, and producing a milestone dependency DAG.

## Core Principle

Milestones are the unit of multi-day execution. A bad milestone decomposition cascades into days of wasted work. Therefore milestone generation must be **adversarial** — multiple independent perspectives must challenge each other before milestones are locked.

## Hard Gates

1. **Dispatch all 5 reviewer `Agent` calls in a single message.** Sequential execution is prohibited — parallelism requires a single-message multi-tool call.
2. **Each reviewer receives the full Problem Brief.** Do not split or filter per reviewer. Every reviewer sees everything.
3. **Reviewers must not see each other's findings.** The `Agent` tool provides context isolation automatically — do not include prior reviewer output in another reviewer's prompt.
4. **Synthesis must address every reviewer's concern.** Each finding is accepted, rejected with reason, or deferred to a specific milestone.
5. **Every milestone must have measurable success criteria.** "Working correctly" is not a criterion. Test commands, file existence checks, or behavioral assertions are required — at least 2 per milestone.
6. **Milestone dependencies must form a DAG.** Circular dependencies are a plan failure. Every milestone must have a clear topological ordering.
7. **Do not generate milestones for trivial tasks.** If the problem fits in a single `/nxtdev:plan` cycle (fewer than ~8 tasks), stop and tell the user to use `/nxtdev:plan` directly.
8. **Reviewer outputs must be passed verbatim to the synthesis agent.** No summarizing, filtering, reframing, or editorial framing. See `references/synthesis-agent.md` for the rule.

## When To Use

- `/nxtdev:clarify`가 Complexity Assessment에서 "Complex (score 9-15)"로 라우팅한 경우
- 명확히 다일(multi-day) 분량의 작업, 8 태스크 이상으로 보이는 작업
- 여러 독립 구현 단계가 필요한 작업

## When NOT To Use

- 단일 사이클로 끝나는 작업 (`/nxtdev:plan` 직접 사용)
- 작업 범위가 여전히 모호한 경우 (`/nxtdev:clarify` 먼저)
- 마일스톤이 이미 정의되어 있고 실행만 필요한 경우 (`/nxtdev:run-masterplan` 사용)

## Input

이 스킬은 **Context Brief 파일**을 입력으로 받습니다. `$ARGUMENTS`가 제공되면 Context Brief 경로로 읽습니다.

**Context Brief가 없는 경우**, 사용자 요청에 goal / scope (in/out) / success criteria가 모두 포함되어 있는지 확인합니다.

- **세 가지 모두 있음** → 바로 진행
- **하나라도 빠짐** → `AskUserQuestion`으로 선택지 제시:

```
Context Brief가 없습니다. 어떻게 진행할까요?

1. `/nxtdev:clarify` 먼저 (추천) — 요구사항을 구체화한 뒤 masterplan 재실행. 복잡 작업일수록 clarify의 복잡도 점수가 중요합니다.
2. 바로 masterplan 작성 — 필수 정보만 확인 후 진행. 리뷰어 품질이 떨어질 수 있습니다.
```

**절대로 사용자 확인 없이 스코프를 자체 결정하지 마십시오.**

## Process

### Phase 1: Problem Framing

1. Context Brief (또는 사용자 요청) 읽기
2. Goal / Scope / Technical Context / Constraints / Success Criteria 식별
3. 코드베이스가 관련된 경우, `Agent({ subagent_type: "Explore", ... })`를 디스패치하여 관련 아키텍처 매핑
4. **Verification Discovery** — `skills/plan/references/verification-discovery.md`의 절차를 따라 프로젝트의 최상위 검증 수단 발견 (e2e → integration → skill/agent → test-suite → build-only)
5. **Problem Brief 작성** — `examples/problem-brief-template.md` 형식으로 자기완결적 문서 작성. 이것이 5개 리뷰어 모두가 받는 유일한 입력.

### Phase 2: Parallel Reviewer Dispatch

**Hard Gate #1-3:** 한 메시지 안에 5개의 `Agent` 호출을 병렬로 넣습니다. 각 리뷰어는 전체 Problem Brief를 받습니다. 서로의 결과를 보지 않습니다.

디스패치 패턴과 각 리뷰어 프롬프트는 [reviewer-prompts.md](references/reviewer-prompts.md) 참조.

리뷰어는 읽기 전용 분석가입니다 — 코드를 수정하지 않습니다.

### Phase 2.5: Reviewer Failure Handling

5개 리뷰어가 모두 완료될 때까지 기다립니다. 실패 처리 규칙은 [reviewer-prompts.md](references/reviewer-prompts.md#failure-handling-phase-25)를 따릅니다.

핵심: **최소 3개 리뷰어가 성공해야 합니다.** 3개 미만이면 중단하고 사용자에게 보고 — 문제가 너무 모호하므로 `/nxtdev:clarify`로 되돌아가십시오.

### Phase 3: Synthesis

5개 리뷰가 모두 완료되면 **Synthesis Agent**를 디스패치합니다. 모든 리뷰어 출력을 받아 최종 마일스톤 계획을 생성합니다.

**Verbatim Handoff (Hard Gate #8):** 각 리뷰어의 전체 출력을 Synthesis 프롬프트의 `{..._OUTPUT}` 자리에 요약/필터링/재구성/추가 설명 없이 그대로 복사합니다. 상세: [synthesis-agent.md](references/synthesis-agent.md).

### Phase 3.5: Integration Verification Milestone (자동)

Synthesis가 반환한 후, main agent가 **Integration Verification Milestone (M_final)**을 DAG의 마지막 마일스톤으로 **자동** 추가합니다. 리뷰어나 Synthesis가 생성하지 않는 구조적 보장입니다.

M_final 템플릿은 [milestone-template.md](examples/milestone-template.md#integration-verification-milestone-m_final) 참조. Dependencies에 **나머지 모든 마일스톤**을 나열합니다.

검증은 Phase 1에서 발견한 Verification Strategy를 재사용합니다. 검증 인프라가 없는 경우, M_final의 `/plan` 단계에서 Task 0으로 검증을 먼저 만듭니다 (`/plan`의 기본 동작과 동일).

### Phase 3.6: Independent DAG Validation

M_final을 추가한 후, main agent가 **독립적으로** 전체 DAG를 검증합니다. Synthesis의 자체 보고 검증에 의존하지 않습니다.

체크 항목과 실패 시 재디스패치 규칙: [dag-validation.md](references/dag-validation.md).

검증 실패 시 해당 문제를 추가 제약으로 삼아 Synthesis를 재디스패치합니다. 유효하지 않은 DAG를 사용자에게 제시하지 마십시오.

### Phase 4: User Review and Lock

1. Synthesized 마일스톤 계획 제시
2. Conflict Resolution Log 표시 — 사용자가 리뷰어 간 불일치 지점을 볼 수 있어야 함
3. Execution Order (병렬 그룹 포함) 표시
4. 총 마일스톤 개수 표시 및 count guard 경고 (8-10: 경고, >10: 명시적 승인 필요)
5. 사용자에게 승인 / 수정 / 거부 요청
6. **승인** → 산출물 저장 (Phase 5)
7. **수정 요청** → 변경 적용 후 재제시
8. **거부** → 제약 업데이트하여 Phase 1부터 재시작

### Phase 5: Save Masterplan Artifacts

산출물 저장 경로: `docs/masterplans/YYYY-MM-DD-<feature-slug>/`

```
docs/masterplans/YYYY-MM-DD-<feature-slug>/
├── state.md                         # 마스터 상태 파일 (state-template.md 참조)
├── synthesis.md                     # Synthesis Agent 출력 원문 (Conflict Resolution Log + Milestone DAG)
└── milestones/
    ├── M1-<name>.md                 # 개별 마일스톤 (milestone-template.md 참조)
    ├── M2-<name>.md
    ├── ...
    └── M_final-integration-verification.md
```

리뷰어 원문은 저장하지 않습니다. 마일스톤 결정의 근거는 `synthesis.md`의 Conflict Resolution Log와 Rejected Proposals 표로 추적합니다 — 리뷰어 5명의 출력 전체를 디스크에 보관하는 비용이 절감되는 audit 정밀도보다 크다고 판단했기 때문입니다 (이전 측정치: 5개 review 파일 직렬 Write에 9분 21초 소요).

#### Hard Gate: 단일 메시지 Batch Write

Phase 5의 모든 `Write` 호출(`synthesis.md`, `milestones/M1-...md` ~ `M_final-...md`, `state.md`)은 **단일 응답에 다중 도구 호출로 묶어 발행**해야 합니다. 파일을 하나씩 별개 응답으로 쓰지 마십시오.

순차 Write 안티패턴 (금지):
- 응답 N: `Write(synthesis.md)` → 도구 결과 대기
- 응답 N+1: `Write(milestones/M1-...md)` → 도구 결과 대기
- 응답 N+2: `Write(milestones/M2-...md)` → ...

각 응답마다 LLM round-trip이 발생하여 milestone 6개 + state.md 작성에 약 2분 24초가 추가로 소요됨이 측정되었습니다 (2026-05-07 세션).

올바른 패턴: 단일 응답에서 모든 산출물 `Write` 호출을 동시에 발행합니다. 이는 Phase 2의 5개 리뷰어 단일 메시지 디스패치(Hard Gate #1)와 동일한 메커니즘입니다.

Synthesis 출력은 Phase 3 종료 시점 메인 에이전트 컨텍스트에 있고, 마일스톤 본문도 Synthesis 출력으로부터 도출되어 단일 응답 안에서 모두 구성 가능합니다.

## Execution Handoff

저장 완료 후 사용자에게 안내:

**"Masterplan 저장됨 (`docs/masterplans/<slug>/`). 마일스톤 N개 확정. `/nxtdev:run-masterplan docs/masterplans/<slug>/` 로 실행을 시작하세요."**

이 스킬은 **다음 스킬을 자동 호출하지 않습니다.** 마일스톤 계획을 제시하고 사용자가 다음 단계를 선택하도록 합니다 (`/plan`, `/clarify`와 동일 정책).

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|---|---|
| 리뷰어를 순차 실행 | 시간 낭비, 리뷰어는 독립적 |
| Synthesis 생략하고 리뷰어 출력 단순 병합 | 충돌이 해소되지 않아 마일스톤 경계가 일관되지 않음 |
| 측정 불가능한 성공 기준 허용 | 완료 판정이 주관화됨 |
| 마일스톤이 너무 큼(>12 태스크) | 단일 `/plan` 사이클 초과, 컨텍스트 손실 위험 |
| 마일스톤이 너무 작음(1-2 태스크) | `/plan` + `/run-plan` 오버헤드가 작업보다 큼 |
| 10개 초과 마일스톤 사용자 승인 없이 진행 | 리스크 누적, 프로젝트 분할이 더 나을 가능성 |
| 리뷰어 충돌 무시 | 실행 단계에서 드러날 때 수정 비용이 훨씬 큼 |
| 사용자 승인 건너뛰기 | 다일 작업 중간에 방향 어긋남 발견 |
| 산출물 파일을 한 번에 하나씩 별개 응답으로 Write | 응답마다 LLM round-trip 발생 → Phase 5에 수 분 누적 (2026-05-07 측정 약 2분 24초). 단일 메시지 batch가 필수 |

## Minimal Checklist

- [ ] Problem Brief에 goal / scope / constraints / success criteria / Verification Strategy 모두 포함
- [ ] 5개 리뷰어를 단일 메시지에서 병렬 디스패치
- [ ] 각 리뷰어가 **전체** Problem Brief를 받음
- [ ] Synthesis Agent가 5개 리뷰어 출력을 **verbatim**으로 받음
- [ ] 모든 리뷰어 충돌이 명시적으로 해소됨 (Conflict Resolution Log)
- [ ] 모든 마일스톤이 측정 가능한 성공 기준 2개 이상 보유
- [ ] 마일스톤 DAG에 순환 없음, topological order 유효
- [ ] 첫 번째 마일스톤이 minimum viable milestone
- [ ] Integration Verification Milestone (M_final)이 DAG 마지막에 추가됨
- [ ] 사용자가 마일스톤 계획을 승인
- [ ] 모든 산출물이 `docs/masterplans/<slug>/`에 저장됨

## Transition

마일스톤 계획 확정 후:

- 실행 시작 → `/nxtdev:run-masterplan docs/masterplans/<slug>/`
- 모호성이 드러남 → `/nxtdev:clarify`로 복귀
- 작업이 마일스톤 수준이 아님이 판명 → `/nxtdev:plan` 직접 사용
