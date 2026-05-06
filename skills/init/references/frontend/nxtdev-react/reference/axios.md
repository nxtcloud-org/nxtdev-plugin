# Axios

HTTP 클라이언트 라이브러리.

## 공식 문서

- https://axios-http.com/docs/intro

## 사내 사용 패턴

- 인스턴스: `src/lib/api/axios.ts`에서 생성
- 요청 인터셉터: 토큰 추가
- 응답 인터셉터: 401 시 refresh token 자동 갱신 (무한 루프 방지)
- API 패턴: `[도메인]Api` 객체로 정의 (UserApi.findMe, UserApi.save)

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

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // 401: 토큰 갱신 후 재시도
    if (status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await refreshToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return api(error.config);
    }

    // 403: 권한 없음
    if (status === 403) {
      redirect('/forbidden');
    }

    // 500+: 서버 에러
    if (status >= 500) {
      toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }

    // 네트워크 에러 (서버 응답 없음)
    if (!error.response) {
      toast.error('네트워크 연결을 확인해주세요.');
    }

    return Promise.reject(error);
  }
);
```
