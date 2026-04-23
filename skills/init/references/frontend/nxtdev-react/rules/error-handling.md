---
paths:
  - "src/**/*.{ts,tsx}"
---

# React 에러 처리

## 3계층 구조

1. **API 계층**: Axios 인터셉터 (401 자동 갱신)
2. **폼 계층**: React Hook Form + Zod (검증 에러)
3. **렌더링 계층**: ErrorBoundary (런타임 에러)

## ErrorBoundary

- react-error-boundary 사용 또는 직접 구현
- 페이지/기능 단위로 배치
- fallback에 재시도 버튼 제공

## 이벤트 핸들러 에러

인터셉터가 못 커버하는 영역 — 직접 try/catch 처리.

**폼 제출**

```ts
const onSubmit = async (data: FormData) => {
  try {
    await TaskApi.save(data)
  } catch (error) {
    if (error instanceof AxiosError) {
      form.setError('root', {
        message: error.response?.data?.message ?? '저장에 실패했습니다'
      })
    }
  }
}
```

**일반 액션**

```ts
const handleDelete = async () => {
  try {
    await TaskApi.remove(id)
    toast.success('삭제되었습니다')
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message ?? '삭제에 실패했습니다')
    }
  }
}
```

**규칙**

- try/catch 필수
- `error instanceof AxiosError` 타입 가드 필수
- 폼 에러 → `form.setError('root')`
- 일반 에러 → `toast.error()`
- 서버 메시지 우선, 없으면 폴백 메시지

## 에러 메시지

- 사용자 친화적 메시지만 표시
- 기술 정보(스택 트레이스, 서버 구조) 숨김
- 에러 로깅: onError 콜백에서 외부 서비스로 전송
