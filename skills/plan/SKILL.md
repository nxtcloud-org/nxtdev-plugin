---
name: plan
description: "Context Brief를 점검하고 plan 워크플로우(작성→검토→수정 루프)를 발동하는 문지기. plan을 직접 쓰지 않는다."
argument-hint: "[context-brief-path]"
---

<!-- ===================================================================
SKELETON v3 — 문지기. 작성 규칙은 plan-author.md, 검토 강제는 plan.js가 정본.
이 파일은 (1)게이트 점검 (2)워크플로우 발동 (3)결과 안내만 한다.
==================================================================== -->

# Plan (문지기)

이 스킬은 plan을 직접 작성하지 않는다. Context Brief를 점검하고 plan 워크플로우
(헤드리스 자동 루프: 작성→검토→수정)를 발동한 뒤, 결과를 사용자에게 안내한다.

## When To Use

- `/nxtdev:clarify`가 끝나 Context Brief 파일이 생성된 뒤
- 사용자가 명확한 요청으로 plan 작성을 직접 요청할 때
- 다단계 구현 + 의존성 있는 태스크 순서 정의가 필요할 때

## When NOT To Use

- 작업 스코프가 아직 모호할 때 (→ `/nxtdev:clarify`로)
- 단일 파일 편집, 단순 버그 수정 등 한 단계 작업
- 사용자가 "plan 생략하고 바로 해"라고 할 때

## 게이트 (사용자 개입은 여기까지)

[G] **데이터 인계의 시작점.** 게이트가 확정한 내용은 반드시 Context Brief **파일에**
기록되어야 한다 — 워크플로우는 파일 경로만 받고, 헤드리스 작성자는 그 파일만 읽는다.

1. **Context Brief 읽기** (`$ARGUMENTS`).
2. **점검**: goal / scope(in·out) / success criteria 중 누락이 있는가?
   - 가벼운 누락(필드·간단한 확인) → `AskUserQuestion`으로 보강
     → **★ 보강한 답을 Context Brief 파일에 `Write`로 반영** ([G] 인계 필수)
   - 코드 조사가 필요한 근본 모호 → `/nxtdev:clarify` 권유(강제 회부 안 함)
3. **절대 사용자 확인 없이 스코프를 자체 결정하지 않는다.**
4. 완전한 Context Brief 도달 → 발동.

<!-- 점검 기준은 게이트 1(Context Brief 완전성)뿐이다. 작성 규칙(옛 Hard Gate 2~5)은
     plan-author가, 검토 강제(옛 Hard Gate 6)는 plan.js가 책임진다. 여기서 중복 점검하지 않는다. -->

## 발동

```javascript
Workflow({ name: "nxtdev:plan", args: briefPath })
```

## 결과 해석

- `finalVerdict: "PASS"` → "plan.md 완성. `/nxtdev:run-plan` 실행할까요?"
- **3라운드 다 돌고도 FAIL** → plan.md + `remaining`(남은 FAIL 리뷰어) 보여주고
  사용자 판단 요청. (무한 루프 방지)

## 독립 검토는 생략되지 않는다 (사용자 안내용)

[B] plan은 작성 직후 5개 독립 리뷰어의 검토를 **반드시** 받는다 — plan.js가 코드로
강제한다. 작성자 본인은 자기 plan의 허점을 못 본다(confirmation bias). "작아서"/
"명확해서"/"토큰 절약"은 검토를 건너뛸 사유가 아니다. 상세: `references/independent-review.md`.

## Workflow 도구 불가 시 폴백

[B] Workflow 도구를 못 쓰는 환경에서는: plan-author 에이전트로 작성 → 5개
`nxtdev:plan-review-*` 에이전트를 병렬 `Agent`로 직접 호출 → FAIL 항목 수동 수정 →
재검토를, **PASS까지** 안내한다. 이 경로에서도 검토는 생략되지 않는다.
