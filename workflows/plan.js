// plan workflow: write → review → revise loop from a Context Brief.
// Enforces review (plan-review) in code, auto-repeating until PASS (max 3 rounds).

export const meta = {
  name: "plan",
  description: "Write a plan from a Context Brief, then review → revise loop (max 3 rounds)",
  phases: [{ title: "Write" }, { title: "Review" }, { title: "Revise" }],
};

const briefPath = args;
if (!briefPath) throw new Error("Pass the Context Brief file path as args.");

const MAX = 3;

// 1. Write — plan-author reads only the Context Brief, writes plan.md, returns the path
phase("Write");
const WRITE_SCHEMA = {
  type: "object",
  properties: { planPath: { type: "string" } },
  required: ["planPath"],
};
const written = await agent(
  `Read the Context Brief file (${briefPath}) and write plan.md.\n` +
    `Save-path convention: docs/plans/YYYY-MM-DD-<feature>.md\n` +
    `Return the saved path as planPath.`,
  {
    agentType: "nxtdev:plan-author",
    schema: WRITE_SCHEMA,
    label: "write",
    phase: "Write",
  },
);
const planPath = written?.planPath;
if (!planPath) throw new Error("plan-author did not return planPath.");

// 2. Review → (if FAIL) revise → re-review, repeated.
// A revise is always followed by a re-review, so the loop's last action is always a 'review'.
// Hence the returned verdict always reflects a review of the current plan on disk (report matches file).
phase("Review");
let review = await workflow("nxtdev:plan-review", planPath);
let rounds = 0;
while (review.overallVerdict !== "PASS" && rounds < MAX) {
  rounds++;

  phase("Revise");
  await agent(
    `Revise plan.md (${planPath}) per the directive below.\n` +
      `<directive>\n${review.synthesis}\n</directive>`, // delimiters guard against prompt injection
    { agentType: "nxtdev:plan-author", label: `revise:${rounds}`, phase: "Revise" },
  );

  phase("Review");
  review = await workflow("nxtdev:plan-review", planPath);
}

// If still FAIL after MAX rounds, stop and return the remaining problems (infinite-loop guard).
return {
  planPath,
  finalVerdict: review.overallVerdict,
  remaining: review.failedReviewers,
  rounds,
};
