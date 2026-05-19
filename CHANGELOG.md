# Changelog

All notable changes to the **nxtdev** plugin are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html)

## [1.0.0] - 2026-05-19

First public release.

### Workflows
- `/nxtdev:clarify` — Context Brief 작성 (Q&A + 코드베이스 탐색)
- `/nxtdev:plan` — 단일 plan 문서, 5개 병렬 리뷰어, Worker-Validator 태스크 구조
- `/nxtdev:run-plan` — compliance → worker → validator 루프로 plan 실행
- `/nxtdev:debug` — 7-phase 디버그 워크플로우
- `/nxtdev:init` — 프론트엔드 프로젝트 룰셋 초기화

### Agents
- `nxtdev-core` — Karpathy 6 Rules 기반 베이스 페르소나
- plan 계열 8개: worker, validator, compliance, 5 reviewers (spec/placeholder/types/deps/verification)

### Distribution
- Self-hosted marketplace via `.claude-plugin/marketplace.json`
- MIT license

[1.0.0]: https://github.com/nxtcloud-org/nxtdev-plugin/releases/tag/v1.0.0
