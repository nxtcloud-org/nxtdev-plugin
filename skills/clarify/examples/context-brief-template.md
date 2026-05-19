# Context Brief Template

```markdown
## Context Brief: [Task Title]

### Goal
[One-sentence task goal]

### Scope
- **In scope**: [Included work]
- **Out of scope**: [Explicitly excluded work]

### Technical Context
[Technical facts discovered through code exploration]
- Current implementation state
- Affected areas
- Existing patterns to follow

### Constraints
[Identified constraints]
- External constraints
- Technical constraints
- Time/priority constraints

### Success Criteria
[Specific criteria for the completed state]

### Open Questions (if any)
[Questions still open — unresolved but not blocking]

### Suggested Next Step
Proceed to `/nxtdev:plan`.
```

## Context Brief → Plan Mapping

| Context Brief Field | Plan Input |
|---|---|
| Goal | Plan header "목표" |
| Scope (In/Out) | Plan header "작업 범위" |
| Technical Context | Architecture + tech stack + file structure basis |
| Constraints | Task decomposition constraints |
| Success Criteria | Self-review criteria |
| Open Questions | Reflected as assumptions, confirmed by user |
