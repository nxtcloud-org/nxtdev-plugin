// ====================================================================
// SKELETON v3 — plan 작성→검토→수정 루프의 정본(SSOT).
// 이 파일이 "검토 강제 + 루프 제어"의 주인이다.
//   [C] Gate6과 Independent Review는 같은 사안 → 여기 한 곳에서만 강제한다.
//       (plan-author는 "검토를 대비"만, SKILL.md는 "결과를 안내"만 한다.)
//   [B] 검토는 코드로 강제되므로 정상 경로에선 회피 자체가 불가능하다.
//       폴백(아래 주석)에서만 작성자 설득문구가 의미를 가진다.
// ====================================================================

export const meta = {
  name: "plan",
  description: "Context Brief로 plan 작성 → 검토 → 수정 루프(최대 3라운드)",
  phases: [{ title: "Write" }, { title: "Review" }, { title: "Revise" }],
};

const briefPath = args;
if (!briefPath) throw new Error("Context Brief 파일 경로를 args로 전달하세요.");

const MAX = 3;

// 1. 작성 — plan-author가 Context Brief 파일만 읽고 plan.md 작성, 경로 반환
phase("Write");
const WRITE_SCHEMA = {
  type: "object",
  properties: { planPath: { type: "string" } },
  required: ["planPath"],
};
const written = await agent(
  `Context Brief 파일(${briefPath})을 읽고 plan.md를 작성하라.\n` +
    `저장 경로 규칙: docs/plans/YYYY-MM-DD-<feature>.md\n` +
    `완료 후 저장한 경로를 planPath로 반환하라.`,
  {
    agentType: "nxtdev:plan-author",
    schema: WRITE_SCHEMA,
    label: "write",
    phase: "Write",
  },
);
const planPath = written?.planPath;
if (!planPath) throw new Error("plan-author가 planPath를 반환하지 않았습니다."); // Fail Loud

// 2~4. 검토 → (FAIL이면) 수정 → 재검토 루프 ([C] 검토 강제의 정본)
// [①fix] 불변식: return하는 review는 "항상 디스크 현재 plan을 검토한 결과"다.
//   수정한 뒤에는 반드시 재검토하므로(루프 마지막 동작이 늘 '검토'),
//   보고된 verdict와 디스크 산출물이 절대 어긋나지 않는다.
//   (옛 for 루프는 마지막 라운드에서 '수정 후 검토 없이' 종료 → 보고·파일 불일치 버그)
phase("Review");
let review = await workflow("nxtdev:plan-review", planPath); // 초안 검토
let rounds = 0; // 실제 수정 횟수
while (review.overallVerdict !== "PASS" && rounds < MAX) {
  rounds++;

  // FAIL → synthesis(수정 지시문)대로 수정. 구분자로 인젝션 차단.
  phase("Revise");
  await agent(
    `plan.md(${planPath})를 아래 수정 지시문대로 고쳐라.\n` +
      `<수정지시문>\n${review.synthesis}\n</수정지시문>`,
    { agentType: "nxtdev:plan-author", label: `revise:${rounds}`, phase: "Revise" },
  );

  // [①fix] 수정본을 반드시 재검토 → review는 늘 최신 plan 기준
  phase("Review");
  review = await workflow("nxtdev:plan-review", planPath);
}

// [F6] "3라운드 다 돌고도 FAIL"이면 멈추고 남은 문제를 반환(무한루프 방지)
return {
  planPath,
  finalVerdict: review.overallVerdict,
  remaining: review.failedReviewers,
  rounds,
};

// --------------------------------------------------------------------
// [B] 폴백 메모: Workflow 도구를 못 쓰는 환경에서는 SKILL.md가 이 루프 대신
//     "plan-author 작성 + plan-review-* 5개 Agent 수동 병렬 호출 + 수동 수정"을
//     안내한다. 그 경로에선 회피 주체가 작성자이므로, 검토 생략 금지 설득문구가
//     plan-author.md 본문([B][C] 블록)에 있어야 효과를 가진다. (그래서 거기 둔다.)
// --------------------------------------------------------------------
