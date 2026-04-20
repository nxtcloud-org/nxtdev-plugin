# Single Milestone Pipeline

각 마일스톤은 아래 파이프라인을 통과해야 완료됩니다. V1에서는 **한 번에 하나의 마일스톤만** 실행됩니다.

```
┌─────────────────────────────────────────────────────────┐
│                  Milestone Pipeline                     │
│                                                         │
│   Gate Check → /plan → User Approval → /run-plan →      │
│   Integration Check → Checkpoint → Next                 │
└─────────────────────────────────────────────────────────┘
```

## Step 1: Gate Check

마일스톤 시작 전:

1. 모든 dependency 마일스톤의 status가 `completed`인지 확인
2. 하나라도 `failed`이면 이 마일스톤을 `skipped`로 마킹하고 스킵
3. state.md 업데이트: 이 마일스톤의 status를 `planning`으로. write-then-verify.
4. Execution Log에 `milestone-start` 이벤트 기록

## Step 2: Plan Crafting (`/plan` 호출)

마일스톤 파일 자체가 `/plan`의 Context Brief 역할을 합니다 — `milestone-template.md`는 Context Brief 필드와 동형으로 설계됨.

1. `/nxtdev:plan docs/masterplans/<slug>/milestones/M{N}-<name>.md` 를 호출 (사용자에게 알림 후)
2. `/plan`이 만든 plan 파일 경로를 수집
3. state.md에 plan 파일 경로를 기록 (Milestones 테이블의 "Plan File" 컬럼)
4. Execution Log에 `milestone-plan-saved` 이벤트 기록

**제약:** `/plan`은 수정하지 않습니다. 마일스톤 파일이 Context Brief 계약을 만족하는 한 `/plan`은 그대로 동작합니다.

## Step 3: User Approval Gate

Plan이 작성된 후, 실행 전에 사용자 승인을 받습니다:

```
M{N} plan이 작성되었습니다: <plan-path>
plan을 검토하고 실행을 승인하시겠습니까? (승인 / 수정 요청 / 중단)
```

- **승인** → Step 4
- **수정 요청** → 사용자 피드백을 Context Brief 제약으로 추가하고 Step 2 재실행 (state.md에 plan 파일 새로 기록)
- **중단** → 이 세션 종료. state.md는 planning 상태로 남음 — 다음 호출에서 resume 가능

## Step 4: Run Plan (`/run-plan` 호출)

1. state.md 업데이트: status `executing`, Attempts 카운터 +1. write-then-verify.
2. `/nxtdev:run-plan <plan-path>` 호출
3. `/run-plan`은 Worker-Validator 루프 + Final Verification Task를 이미 포함 — 별도 리뷰 단계 불필요 (V1 단순화)
4. 결과 수집:
   - **모든 태스크 통과 + Final Verification 통과** → Step 5
   - **`/run-plan`이 태스크 실패 보고** → 실패 처리 (아래)

### `/run-plan` 실패 처리

`/run-plan` 자체가 3회 재시도를 수행한 후 실패를 보고합니다. `/run-masterplan` 레벨에서는:

1. Attempts 카운터 확인
   - Attempts == 1: `/run-plan`을 다시 호출 (같은 plan으로 재실행 — `/run-plan` 내부에서 이미 Worker 재시도를 소진했지만, 환경적 문제였을 수 있음)
   - Attempts == 2: Step 2로 돌아가 재계획 (`/plan` 재호출, 실패 메시지를 Context Brief의 Constraints에 추가)
   - Attempts >= 3: status를 `failed`로 마킹, 실행 로그에 기록, **중단**하고 사용자에게 보고
2. 실패 시 의존하는 마일스톤 자동 차단:
   - 이 마일스톤에 depend하는 모든 마일스톤을 순회하며 status를 `skipped`로 마킹
   - Execution Log에 `milestones-blocked` 이벤트 기록
3. 사용자에게 `/nxtdev:debug` 사용을 제안

## Step 5: Integration Check

`/run-plan`의 Final Verification Task가 이미 마일스톤의 Verification Strategy를 실행했으므로, 추가 cross-milestone 검증만:

1. 마일스톤의 Success Criteria 각 항목을 수동으로 또는 명시된 명령으로 확인
2. 이 마일스톤이 interface를 정의하거나 선행 마일스톤의 interface를 소비한다면, 두 마일스톤 파일의 "Files Affected" 목록을 교차 확인하여 호환성 검사

**Integration Check 실패 시:**

1. 1회 targeted 수정 시도 (`/run-plan`이 아닌 단순 `Edit`) → 재검사
2. 여전히 실패 → 사용자에게 보고, 옵션 제시:
   - Corrective 마일스톤 추가 (masterplan 재실행 필요)
   - 이전 상태로 rollback (git reset, 사용자 확인 필수)
   - 통합 격차를 수용하고 계속 (사용자 명시 승인)

## Step 6: Checkpoint

Integration Check 통과 후:

1. state.md 업데이트: status `completed`. write-then-verify.
2. Execution Log에 `milestone-completed` 이벤트 + duration 기록
3. Milestones 테이블에서 이 마일스톤의 "Files Changed" (옵션) 기록 — 다음 마일스톤의 `/plan`이 선행 파일을 참조할 수 있도록

## Step 7: Next

1. 다음 ready 마일스톤 선택 (모든 dependency가 `completed`인 것 중 첫 번째)
2. 사용자에게 계속할지 확인:
   ```
   M{N} 완료. 다음: M{K}. 계속하시겠습니까? (계속 / 일시정지)
   ```
3. 계속 → Step 1 재시작 with 다음 마일스톤
4. 모든 마일스톤(M_final 포함) 완료 → Completion Summary

## M_final (Integration Verification)

마지막 마일스톤 M_final은 read-only 검증이므로 특별 처리:

1. Step 1-3은 동일 (plan 생성, 승인)
2. Step 4의 `/run-plan`은 Final Verification Task 하나만 실행 (M_final의 plan은 단순)
3. Step 5의 Integration Check는 **프로젝트 최상위 verification을 전체 코드베이스에 실행**하고 모든 이전 마일스톤의 Success Criteria가 여전히 유효한지 재확인
4. 실패 시 corrective 마일스톤 제안 (이는 masterplan 재실행을 요함)
5. 통과 시 전체 Masterplan `completed`, Completion Summary 생성
