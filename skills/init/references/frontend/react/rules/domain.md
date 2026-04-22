---
paths:
  - "src/features/**/*"
---

# 도메인 레이어 규칙

## 파일 역할 분리

| 파일 | 역할 | 금지 |
|------|------|------|
| `api.ts` | 서버 통신만 | 비즈니스 로직, React 훅 |
| `service.ts` | 순수 비즈니스 로직 | axios, React 훅 |
| `hooks.ts` | React 연결 | 직접 axios 호출, 비즈니스 로직 |

## api.ts — 객체 방식

```ts
export const UserApi = {
  findMe: () => axios.get('/users/me'),
  save: (data: CreateUserInput) => axios.post('/users', data),
  remove: (id: string) => axios.delete(`/users/${id}`),
}
```

- 도메인명 + Api 접미사 (UserApi, OrderApi)
- 메서드명은 도메인 언어로 (find, save, remove)
- 기술 용어 금지: getData → findAll, postUser → save

## service.ts — 순수 함수

```ts
export function isAdmin(user: User): boolean {
  return user.role === 'ADMIN'
}
```

- React import 금지
- 외부 의존성 없는 순수 함수만
- 테스트 가능한 단위로 작성

## Ubiquitous Language

도메인 용어를 코드에 그대로 사용한다.

| 금지 | 사용 |
|------|------|
| `fetchData` | `findOrders` |
| `handleData` | `processPayment` |
| `userInfo` | `userProfile` |
| `getData` | `findAll` |
