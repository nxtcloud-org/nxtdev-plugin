---
paths:
  - "app/**/page.tsx"
  - "app/**/layout.tsx"
---

# SEO 규칙

## 기본 Metadata (정적)

모든 page.tsx, layout.tsx에 metadata export 필수.

```ts
export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명 (150자 이내)',
}
```

## 동적 Metadata

params에 따라 달라지는 페이지:

```ts
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const task = await TaskApi.findById(params.id)
  return {
    title: task.title,
    description: task.description,
  }
}
```

## title 템플릿

```ts
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    template: '%s | 서비스명',
    default: '서비스명',
  }
}
// 각 page.tsx에서 title만 지정하면 자동으로 '제목 | 서비스명' 완성
```

## Open Graph

```ts
export const metadata: Metadata = {
  openGraph: {
    title: '제목',
    description: '설명',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  }
}
```

## 금지

- metadata 없는 page.tsx
- title/description 없는 metadata
- 동적 페이지에 정적 metadata (generateMetadata 사용)
