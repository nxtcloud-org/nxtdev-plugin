# Complexity Assessment (5-Signal Scoring)

Assess task complexity using these 5 signals. Score each signal, then determine routing.

| Signal | Low (1) | Medium (2) | High (3) |
|--------|---------|-----------|----------|
| **Scope breadth** | Single feature or component | 2-3 related components | 4+ components or cross-cutting concerns |
| **File impact** | ≤3 files | 4-8 files | 9+ files or across 3+ directories |
| **Interface boundaries** | Works within existing interfaces | Extends existing interfaces | Defines new interfaces or modifies contracts |
| **Dependency depth** | No ordering constraints | Linear dependency chain | Branching dependencies requiring DAG |
| **Risk surface** | No integration risk | Internal integration between components | External systems, schema changes, backward compatibility |

## Scoring

- **Score range:** 5-15 (sum of all signals)
- **Simple:** 5-8
- **Complex:** 9-15
- **Borderline:** 8-9 (present both options to user)

## Routing

| Verdict | Route | Rationale |
|---------|-------|-----------|
| Simple (5-8) | `/nxtdev:plan` | Task fits in a single plan cycle. Direct planning sufficient. |
| Complex (9-15) | `/nxtdev:masterplan` | Task requires multiple plan cycles. Milestone decomposition needed. |
| Borderline (8-9) | Present both with recommendation | "This scores 9 — borderline complex. I recommend `/nxtdev:masterplan` because [dominant factor], but `/nxtdev:plan` could work if [condition]. Which do you prefer?" |

## Override

The user can always override the routing:
- "Just plan it" for a complex task → route to `/nxtdev:plan`
- "Break it into milestones" for a simple task → route to `/nxtdev:masterplan`
