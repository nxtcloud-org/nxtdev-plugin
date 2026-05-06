# Resume Protocol

`/run-masterplan`은 언제든 중단될 수 있어야 하고(rate limit, crash, user pause, context loss), 같은 디렉터리로 재호출하면 마지막 체크포인트에서 재개해야 합니다.

## 재진입 규칙 (by milestone status)

state.md를 로드한 후, 각 마일스톤의 status를 보고 다음과 같이 처리합니다.

| Status | 의미 | 재진입 시 행동 |
|---|---|---|
| `pending` | 아직 시작되지 않음 | 의존성이 충족되면 정상 시작 |
| `planning` | 중단 시 `/plan` 진행 중이었음 | 해당 마일스톤의 plan 파일 경로가 state.md에 기록되어 있는지 확인. 있으면 executing 단계로, 없으면 `planning`을 재시작 |
| `executing` | 중단 시 `/run-plan` 진행 중이었음 | 사용자에게 상황 설명 후 **재실행 or 재계획** 선택 (아래 "실행 중 크래시" 참조). Attempts는 이미 증가됨 — 재실행 시 증가시키지 않음 |
| `validating` | 중단 시 검증 단계였음 (V1에서는 거의 사용 안 함) | 검증부터 재시작 |
| `completed` | 완료됨 | 건너뜀. 재실행 금지 |
| `failed` | 이전 세션에서 실패 | **사용자 승인 없이 재시도하지 않음.** `AskUserQuestion`으로 재시도 / 건너뛰기 / 중단 3택 제시 |
| `skipped` | 의존 마일스톤 실패로 건너뜀 | 재실행 금지 |

## 실행 중 크래시 (status = `executing`)

Run-plan이 일부 태스크를 완료한 상태에서 중단된 경우:

1. state.md의 "Attempts" 카운터를 확인
2. 해당 마일스톤의 plan 파일을 다시 읽음
3. `AskUserQuestion`으로 3택 제시 (질문 본문에 `M{N}이 실행 중 중단되었습니다 (Attempts: K)` 컨텍스트 포함):
   - **같은 plan으로 재실행** — `/nxtdev:run-plan <plan-path>` 재호출. run-plan이 이미 완료된 태스크는 건너뛰는 멱등성을 전제
   - **재계획** — plan을 폐기하고 `/plan`부터 다시. 이전 실행의 부분 결과 확인 후 선택
   - **중단하여 상태 보고** — 이 세션 중지
4. 선택에 따라 상태를 업데이트하고 진행

## 시작 시 상태 요약

`/run-masterplan`은 매번 호출될 때 현재 상태를 사용자에게 보여주고 `AskUserQuestion`으로 3택을 받습니다 — 채팅에 번호 매긴 텍스트 메뉴를 직접 출력하지 않습니다.

상태 요약 형식:

```
## Masterplan Status: [Feature Name]

**Progress:** N/M 마일스톤 완료
**Current:** M{K} ([status])
**Next ready:** M{K+1}

완료: M1 ✓, M2 ✓
진행 중: M3 (executing, 1/3 attempts)
대기: M4, M5, M_final
차단: 없음
```

이어서 `AskUserQuestion`: **계속 (추천)** / **일시정지** / **중단**.

## Do Not

- `failed` 마일스톤을 사용자 승인 없이 자동 재시도하지 마십시오
- `completed` 마일스톤의 파일을 수정하지 마십시오 (Hard Gate)
- state.md 없이 실행을 시작하지 마십시오 — 디렉터리가 비어있으면 `/nxtdev:masterplan`을 먼저 실행하도록 안내
- 중단 상태에서 state.md 없이 "아마 여기쯤이었겠지"로 추정하지 마십시오
