# Changelog

All notable changes to the **nxtdev** plugin are documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/spec/v2.0.0.html)

## [2.0.0] - 2026-06-09

### Removed
- **(BREAKING)** `/nxtdev:init` 스킬 제거. 프론트엔드 룰셋·디자인 시스템은 별도 저장소(`nxtdev-rules`)에서 관리한다. 플러그인은 워크플로우(clarify/plan/run-plan/debug)에 집중한다.

### Changed
- 레포 public 전환에 맞춰 설치 안내 단순화 (private/SSH 사전 세팅 제거)

## [1.0.1] - 2026-05-29

### Fixed
- `nxtdev-nextjs` 룰셋을 Next.js 16에 맞춰 갱신
  - `middleware.ts` → `proxy.ts` 리네임 반영 (structure.md, testing.md, security.md)
  - Edge Runtime 기본 → Node.js Runtime 기본 (Next 16+) 문서화
  - `runtime` config 옵션 사용 시 에러 발생 경고 추가
  - Server Action이 proxy matcher를 우회할 수 있다는 보안 경고 추가

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

[2.0.0]: https://github.com/nxtcloud-org/nxtdev-plugin/releases/tag/v2.0.0
[1.0.1]: https://github.com/nxtcloud-org/nxtdev-plugin/releases/tag/v1.0.1
[1.0.0]: https://github.com/nxtcloud-org/nxtdev-plugin/releases/tag/v1.0.0
