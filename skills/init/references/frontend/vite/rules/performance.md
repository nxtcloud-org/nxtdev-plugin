---
paths:
  - "src/**/*.{ts,tsx}"
  - "vite.config.*"
---

# Vite 성능 규칙 (React 공통 위에 추가)

## 코드 스플리팅

- 라우트 단위 지연 로딩: `React.lazy()` + `Suspense`

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

## 정적 자산

- `public/`: 변환 없이 그대로 서빙 (큰 파일, 절대 경로 필요 시)
- `src/assets/`: import로 참조 → 빌드 시 해시 추가 + 최적화
- 작은 자산 (< 4KB): 자동 base64 인라인

## 빌드 최적화

- CSS 코드 스플리팅: 기본 활성화 (비동기 chunk별 CSS 분리)
- Tree shaking: 기본 활성화 (사용하지 않는 코드 제거)
- 청크 분할: `build.rolldownOptions.output.codeSplitting`으로 커스터마이징

## Dynamic Import

- 변수로 경로 지정 시 `./` 또는 `../`로 시작 + 파일 확장자 명시 필수
- `import.meta.glob('./dir/*.ts')`: 여러 모듈 한 번에 로드 (lazy 기본, eager 옵션)

## vite.config.ts 설정

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' }, // tsconfig.json의 paths와 일치시킬 것
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 개발 중 백엔드 프록시 (CORS 우회)
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true, // 프로덕션 디버깅용 (필요 시)
  },
});
```

### 주의

- `resolve.alias`와 `tsconfig.json`의 `paths` 반드시 동기화
- proxy는 개발 서버에서만 작동 (프로덕션에서는 별도 설정 필요)
