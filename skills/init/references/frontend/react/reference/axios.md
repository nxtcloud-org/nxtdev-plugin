# Axios

HTTP 클라이언트 라이브러리.

## 공식 문서

- https://axios-http.com/docs/intro

## 사내 사용 패턴

- 인스턴스: `src/lib/api/axios.ts`에서 생성
- 요청 인터셉터: 토큰 추가
- 응답 인터셉터: 401 시 refresh token 자동 갱신 (무한 루프 방지)
- API 함수 패턴: `[동사][명사]Api` (getMeApi, createUserApi)

## 기본 설정

```ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 또는 process.env.NEXT_PUBLIC_API_URL
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터 (401 자동 갱신)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```
