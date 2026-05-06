---
name: run-masterplan
description: "마일스톤 DAG를 topological order로 실행. 각 마일스톤마다 `/plan` → `/run-plan`을 호출하고 state.md를 원자적으로 갱신한다. 중단/재개 가능."
argument-hint: "[masterplan-directory-path]"
---

# Run Masterplan

`/nxtdev:masterplan`이 생성한 마일스톤 DAG를 topological order로 실행합니다. 각 마일스톤은 `/plan` → 사용자 승인 → `/run-plan` 파이프라인을 통과합니다.

## Core Principle

다일(multi-day) 실행은 **재개 가능, 감사 가능, 실패 안전**해야 합니다. 모든 상태 전이는 디스크에 먼저 기록된 후 다음 액션이 시작됩니다. 중단(rate limit, crash, user pause, context loss)이 발생해도 마지막 체크포인트에서 재개할 수 있습니다.

## Hard Gates

1. **마일스톤은 실행 전에 존재해야 합니다.** `/nxtdev:masterplan`이 생성한 디렉터리에서만 시작. 실행 중 인라인으로 마일스톤을 생성하지 않습니다.
2. **state.md는 모든 전이 전후에 갱신됩니다.** 메모리 전용 상태 금지. **디스크에 없으면 일어나지 않은 것으로 간주.** Write-then-verify.
3. **각 마일스톤은 전체 파이프라인을 완수해야 합니다.** `/plan` → 사용자 승인 → `/run-plan` → Integration Check → Checkpoint. 단축 경로 없음.
4. **실패한 마일스톤은 의존 마일스톤을 차단합니다.** M2가 M1에 의존하는데 M1이 실패하면, M2는 시작되지 않습니다.
5. **게이트에서 사용자 확인은 `AskUserQuestion` 도구로.** 각 마일스톤의 plan 생성 후, 실행 전에 사용자 승인. 첫 시작 시 현재 상태 보고 후 계속/일시정지/중단 선택. 작은 고정 선택지(2-4개)인 모든 분기점에 동일 — 모델이 채팅에 번호 매긴 텍스트 메뉴를 렌더링하지 않습니다.
6. **완료된 마일스톤을 수정하지 않습니다.** `completed` 상태 마일스톤의 파일은 잠깁니다. 이후 마일스톤이 선행 작업에 변경이 필요하면 그것은 **새 마일스톤**입니다.
7. **V1은 직렬 실행.** DAG에 병렬 그룹이 있어도 한 번에 하나씩 실행. 병렬 마일스톤은 향후 버전에서 지원.

## When To Use

- `/nxtdev:masterplan`이 마일스톤 DAG를 생성한 후
- 중단된 masterplan 실행을 재개할 때
- 사용자가 `/nxtdev:run-masterplan <디렉터리>` 명시적 호출 시

## When NOT To Use

- 마일스톤이 아직 존재하지 않음 → `/nxtdev:masterplan` 먼저
- 마일스톤이 1개뿐 → `/nxtdev:plan` + `/nxtdev:run-plan` 직접
- 작업 스코프가 모호 → `/nxtdev:clarify`

## Input

Masterplan 디렉터리 경로 (예: `docs/masterplans/2026-04-20-auth-rebuild/`)

디렉터리에 `state.md`와 `milestones/M*.md` 파일들이 있어야 합니다.

`$ARGUMENTS`가 없거나 경로에 state.md가 없으면 사용자에게 `/nxtdev:masterplan` 먼저 실행을 안내합니다.

## Process

### Phase 1: Load and Validate State

1. `state.md` 읽기
2. `milestones/` 아래 모든 마일스톤 파일 읽기
3. 검증:
   - state.md의 Milestones 테이블에 나열된 모든 ID에 대응하는 파일 존재
   - Dependency DAG가 유효 (순환 없음, topological sort 가능)
   - 어떤 마일스톤도 비일관적 상태가 아님 (예: plan 파일 없이 `executing`)
4. 현재 위치 파악:
   - 완료된 마일스톤
   - Ready 마일스톤 (모든 dependency가 `completed`)
   - 중단 상태 마일스톤 (`planning` / `executing`)
   - `failed` 마일스톤
5. 사용자에게 상태 요약 제시 (형식은 [resume-protocol.md](references/resume-protocol.md) 참조)
6. **`AskUserQuestion`**으로 3택 입력 받기:
   - **계속 (추천)** — 첫 ready 마일스톤부터 파이프라인 시작
   - **일시정지** — 현재 상태 그대로 종료, 같은 디렉터리로 재호출 시 재개
   - **중단** — 세션 중지

**재개 시나리오의 상세 규칙:** [resume-protocol.md](references/resume-protocol.md)

### Phase 2: Milestone Execution Loop

Topological order로 각 마일스톤을 처리합니다. 마일스톤 파이프라인의 상세는 [milestone-pipeline.md](references/milestone-pipeline.md).

각 마일스톤에 대해:

1. **Gate Check** — dependency 모두 `completed`? → planning으로 전이, state.md 갱신 (write-then-verify)
2. **Plan Crafting** — `/nxtdev:plan <milestone-path>` 호출. 마일스톤 파일이 Context Brief 역할
3. **User Approval** — plan 검토, 승인 대기
4. **Run Plan** — `/nxtdev:run-plan <plan-path>` 호출. Attempts +1. `/run-plan`의 Worker-Validator 루프와 Final Verification이 마일스톤 검증을 담당
5. **Integration Check** — 마일스톤 Success Criteria 확인 + cross-milestone interface 호환성
6. **Checkpoint** — status `completed`, Execution Log 기록 (write-then-verify)
7. **Next** — 다음 ready 마일스톤으로 이동 전 `AskUserQuestion`으로 계속/일시정지 2택 확인

### Phase 2.5: Failure Handling

`/run-plan`이 실패를 보고하면:

- Attempts 1: 같은 plan으로 `/run-plan` 재호출
- Attempts 2: `/plan` 재호출하여 재계획 (실패 메시지를 Constraints에 추가)
- Attempts 3+: 마일스톤 `failed` 마킹, 의존 마일스톤 `skipped` 마킹, **중단**, 사용자에게 `/nxtdev:debug` 제안

Integration Check 실패는 [milestone-pipeline.md#step-5-integration-check](references/milestone-pipeline.md)의 프로토콜을 따릅니다.

### Phase 3: Final Milestone (M_final)

모든 비-M_final 마일스톤 완료 후:

1. M_final (Integration Verification)을 일반 마일스톤 파이프라인으로 실행
2. M_final의 plan은 read-only 검증만 포함 — `/run-plan`의 Final Verification Task가 프로젝트 최상위 verification을 전체 코드베이스에 실행
3. 통과 → Phase 4
4. 실패 → `AskUserQuestion`으로 3택 제시: corrective 마일스톤 추가 (masterplan 재실행) / 이전 상태로 rollback / 통합 격차 수용 (상세는 [milestone-pipeline.md Step 5](references/milestone-pipeline.md))

### Phase 4: Completion

1. state.md 업데이트: 전체 status `completed` (write-then-verify)
2. Completion Summary 생성 및 사용자에게 제시:

```markdown
# Masterplan Complete: [Feature Name]

**Started:** YYYY-MM-DD
**Completed:** YYYY-MM-DD
**Total milestones:** N (실패 0, 건너뜀 0)
**Total attempts:** [모든 마일스톤 attempts 합계]

## Milestone Summary

| Milestone | Status | Attempts | Duration |
|-----------|--------|----------|----------|
| M1: [name] | ✓ completed | 1 | 2h |
| M2: [name] | ✓ completed | 2 | 4h |
| ... |
| M_final | ✓ completed | 1 | 0.5h |

## Files Changed (Total)
[모든 마일스톤에 걸친 집계 파일 목록]
```

3. **`AskUserQuestion`**으로 다음 단계 4택 제시 (Transition 섹션과 정합):
   - **`/simplify` 실행 (추천)** — 마스터플랜 직후 코드 품질 점검
   - **`/nxtdev:masterplan` 재실행** — corrective 마일스톤 추가가 필요한 경우
   - **`/nxtdev:debug`** — 발견된 이슈를 별도로 디버깅
   - **종료** — 별도 액션 없이 세션 마무리

## Execution Handoff

이 스킬은 완료 후 **다음 스킬을 자동 호출하지 않습니다.** 사용자에게 Completion Summary를 제시하고 종료합니다.

## Anti-Patterns

| Anti-Pattern | Why It Fails |
|---|---|
| state.md 갱신을 스킵 | 중단 시 재개 불가, 중복 실행 위험 |
| `failed` 마일스톤 사용자 승인 없이 자동 재시도 | 같은 실패 반복, 근본 원인 미해결 |
| 완료된 마일스톤 파일 수정 | 이전 검증 결과가 무효화됨 — 새 마일스톤으로 처리해야 함 |
| 의존 마일스톤 차단 없이 실패 무시하고 진행 | 실패한 선행의 미완성 출력 위에 빌드 → 카스케이드 실패 |
| `/plan` 또는 `/run-plan`을 거치지 않고 인라인 구현 | 마일스톤 경계 흐려짐, 감사 불가 |
| Attempts 카운터 미증가 | 재시도 한계가 무의미해짐, 무한 루프 위험 |
| write-then-verify 스킵 | 파일 시스템 이슈 시 메모리 상태와 디스크 상태 불일치 |
| 사용자 확인 없이 다음 마일스톤으로 연속 실행 | 다일 작업 중간에 방향 수정 기회 상실 |

## Minimal Checklist

- [ ] state.md 로드 및 일관성 검증 완료
- [ ] 시작 시 사용자에게 상태 요약 제시
- [ ] 각 마일스톤이 Gate Check → /plan → 승인 → /run-plan → Integration Check → Checkpoint 파이프라인 완주
- [ ] 모든 state 전이가 디스크에 기록된 후 다음 액션 진행
- [ ] Attempts 카운터가 실행마다 정확히 증가
- [ ] 실패한 마일스톤이 의존 마일스톤을 차단
- [ ] 완료된 마일스톤 파일은 수정되지 않음
- [ ] M_final (Integration Verification)이 마지막에 실행됨
- [ ] Completion Summary가 사용자에게 제시됨

## Transition

Masterplan 실행 완료 후:

- 코드 품질 점검 → `/simplify`
- 중단된 경우 → 같은 디렉터리로 `/nxtdev:run-masterplan` 재호출하여 재개
- 실패한 마일스톤 해결 → `/nxtdev:debug` 후 수동 재시도
- Corrective 마일스톤 필요 → `/nxtdev:masterplan` 재실행하여 DAG 업데이트

상세 파이프라인: [milestone-pipeline.md](references/milestone-pipeline.md)
재개 프로토콜: [resume-protocol.md](references/resume-protocol.md)
상태 갱신 로그 예시: [state-update-log.md](examples/state-update-log.md)
