# CLAUDE.md

## 언어

- 모든 응답은 한국어로 작성
- 코드 식별자, 기술 용어는 원문 유지

## 기술 스택

- TypeScript strict 모드
- TailwindCSS + cn() 유틸리티
- ESLint + Prettier

## 코드 규칙

### 금지 항목

- `any` 타입 사용 금지
- `console.log` 금지 (디버깅 후 제거)
- 인라인 스타일 금지
- `!important` 금지
- 이모지 사용 금지

### 필수 항목

- Named export (default export 금지, 프레임워크 규약 파일 제외)
- Props 타입은 `interface`로 정의
- 환경변수는 `.env` + `process.env` 또는 `import.meta.env`로 접근

## 커밋 메시지

- 한국어로 작성
- Conventional Commits 형식: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`

## 규칙 파일

`.claude/rules/` 하위에 상황별 규칙 파일이 있다. 해당 작업 시 자동으로 참조된다.
