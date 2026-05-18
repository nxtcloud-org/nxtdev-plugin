# Changelog

All notable changes to the **nxtdev** plugin are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added
- `.claude-plugin/marketplace.json` — self-hosted marketplace manifest enabling `/plugin marketplace add nxtcloud-org/nxtdev-plugin`
- `LICENSE` — MIT license file
- `CHANGELOG.md` — this file
- `plugin.json` `license` and `keywords` fields
- README installation guide block

## [0.1.0] - 2026-05-15

### Changed
- **agents/nxtdev-core.md** — Karpathy 가이드라인을 9규칙(Hard Gates 4 + Rules 5)에서 6규칙으로 통합. Mnilax 30-codebase follow-up 연구의 Rule 5 (Code Decides, Model Judges)와 Rule 6 (Fail Loud) 흡수. 14/200줄 천장 가설 준수 (#15).
- **agents/plan-worker.md** — L43-80 블록을 6규칙 1줄 요약 + worker-특화 anti-patterns로 동기화 (#15).

### Added
- Initial plugin skeleton with `skills/` and `agents/` directories
- `/nxtdev:clarify`, `/nxtdev:plan`, `/nxtdev:run-plan` workflow
- `/nxtdev:masterplan`, `/nxtdev:run-masterplan` multi-day workflow
- `plan-worker`, `nxtdev-core` 등 코어 에이전트

[Unreleased]: https://github.com/nxtcloud-org/nxtdev-plugin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/nxtcloud-org/nxtdev-plugin/releases/tag/v0.1.0
