export const meta = {
  name: 'plan-review',
  description: 'plan 문서를 5개 독립 리뷰어로 병렬 검토 후 FAIL 항목 합성',
  phases: [
    { title: 'Review', detail: '5개 리뷰어 병렬 실행' },
    { title: 'Synthesize', detail: 'FAIL 항목 종합 및 수정 지시문 생성' },
  ],
}

// args = plan 파일 경로 (string)
// 예: Workflow({ scriptPath: '...plan-review.js', args: 'docs/plans/2026-06-15-feature.md' })
const planPath = args

if (!planPath) {
  throw new Error('plan 파일 경로를 args로 전달하세요. 예: args: "docs/plans/xxx.md"')
}

// ─────────────────────────────────────────
// 리뷰어 5종 정의
// ─────────────────────────────────────────
const REVIEWERS = [
  { key: 'spec',          agentType: 'nxtdev:plan-review-spec',         label: 'review:spec' },
  { key: 'placeholder',   agentType: 'nxtdev:plan-review-placeholder',  label: 'review:placeholder' },
  { key: 'types',         agentType: 'nxtdev:plan-review-types',        label: 'review:types' },
  { key: 'deps',          agentType: 'nxtdev:plan-review-deps',         label: 'review:deps' },
  { key: 'verification',  agentType: 'nxtdev:plan-review-verification', label: 'review:verification' },
]

// 리뷰어가 반환할 구조
const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    verdict: {
      type: 'string',
      enum: ['PASS', 'FAIL'],
      description: '이 차원에서의 최종 판정',
    },
    findings: {
      type: 'array',
      description: 'FAIL인 경우 발견한 문제 목록. PASS면 빈 배열.',
      items: {
        type: 'object',
        properties: {
          issue:      { type: 'string', description: '발견한 문제 설명' },
          location:   { type: 'string', description: '해당 Task 번호 또는 섹션' },
          suggestion: { type: 'string', description: '구체적인 수정 방법' },
        },
        required: ['issue', 'suggestion'],
      },
    },
    summary: {
      type: 'string',
      description: '이 차원 리뷰 결과를 한 줄로 요약',
    },
  },
  required: ['verdict', 'findings', 'summary'],
}

// ─────────────────────────────────────────
// Phase 1: 5개 리뷰어 병렬 실행
// ─────────────────────────────────────────
phase('Review')

const results = await parallel(
  REVIEWERS.map(r => () =>
    agent(planPath, {
      agentType: r.agentType,
      schema: REVIEW_SCHEMA,
      label: r.label,
      phase: 'Review',
    }).then(result => ({ key: r.key, ...result }))
  )
)

const clean = results.filter(Boolean)
const failed = clean.filter(r => r.verdict === 'FAIL')
const passed = clean.filter(r => r.verdict === 'PASS')

log(`리뷰 완료: ${clean.length}/5 응답 | PASS ${passed.length} / FAIL ${failed.length}`)

// ─────────────────────────────────────────
// Phase 2: FAIL 항목 합성
// ─────────────────────────────────────────
phase('Synthesize')

let synthesis

if (failed.length === 0) {
  synthesis = '모든 리뷰어 PASS — 계획 즉시 실행 가능.'
  log('전체 PASS')
} else {
  synthesis = await agent(
    `plan 문서(${planPath})에 대한 독립 리뷰 결과 중 FAIL 항목만 정리하여 수정 지시문을 작성하라.\n\n` +
    `FAIL 리뷰어 결과 (JSON):\n${JSON.stringify(failed, null, 2)}\n\n` +
    `작성 규칙:\n` +
    `- 리뷰어 key별로 섹션 구분 (## spec / ## placeholder 등)\n` +
    `- 각 issue마다 location + 구체적 수정 방법 명시\n` +
    `- 중복 지적은 한 번만\n` +
    `- PASS 리뷰어는 언급하지 말 것\n` +
    `- 마지막에 "수정 후 재검토 필요 리뷰어: [key 목록]" 한 줄 추가`,
    { phase: 'Synthesize', label: 'synthesize' }
  )
  log(`수정 지시문 생성 완료 (${failed.length}개 차원)`)
}

return {
  planPath,
  overallVerdict:   failed.length === 0 ? 'PASS' : 'FAIL',
  passedReviewers:  passed.map(r => r.key),
  failedReviewers:  failed.map(r => r.key),
  perReviewer:      clean,
  synthesis,
}
