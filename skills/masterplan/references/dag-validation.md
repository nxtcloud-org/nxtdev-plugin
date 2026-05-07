# Independent DAG Validation (Phase 3.6)

After synthesis produces the milestone plan and the main agent appends the Integration Verification Milestone, the **main agent** independently validates the full DAG before presenting to the user. Do not rely on the synthesis agent's self-reported validation.

## Checks

1. **Circular dependency check.** For each milestone, trace its dependency chain. If any milestone appears as both an ancestor and a descendant of another, the DAG is invalid.
   - **On failure:** re-dispatch synthesis with the specific cycle identified as an additional constraint.

2. **File conflict check for parallel milestones.** For milestones with no dependency relationship (i.e., those in the same parallelizable group), verify their "Files Affected" lists do not overlap.
   - **On failure:** add a dependency between the conflicting milestones, or flag for user decision.

3. **Orphan check.** Every milestone except M1 must have at least one dependency, OR be explicitly marked as independently parallelizable with rationale.
   - **On failure:** re-dispatch synthesis to add the missing dependency.

4. **Success criteria measurability check.** Every milestone must have at least 2 success criteria, and each must be specific and measurable (test commands, file existence, behavioral assertions). Vague phrases ("working correctly", "properly integrated") trigger re-dispatch.
   - **On failure:** re-dispatch synthesis with the specific vague criteria quoted.

5. **M_final dependency completeness.** The Integration Verification Milestone must list ALL other milestones as dependencies.
   - **On failure:** the main agent fixes this directly (M_final is structurally generated, not from synthesis).

6. **Milestone count guard.**
   - 3-7 milestones: proceed.
   - 8-10 milestones: present a warning — "This plan has N milestones. Consider whether the problem should be split into separate projects."
   - &gt;10 milestones: require explicit user approval before proceeding.

## Do Not

- Present an invalid DAG to the user. Fix all validation failures first.
- Silently fix synthesis output. If the synthesis has a real problem, re-dispatch so the reasoning is visible.
- Let the milestone count guard be skipped.
