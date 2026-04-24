# Color Palette & Roles

## Brand Colors

| Token | Value | Role |
|-------|-------|------|
| `--color-brand-primary` | `#2E83F2` | CTA, focus, interactive |
| `--color-brand-primary-hover` | `#1B6BD8` | Hover / pressed |
| `--color-brand-primary-muted` | `rgba(46, 131, 242, 0.12)` | Focus ring, tint background |
| `--color-brand-on-primary` | `#ffffff` | Text on brand background |
| `--color-brand-gradient-from` | `#2E83F2` | Logo & hero gradient start (decoration only) |
| `--color-brand-gradient-to` | `#F24BE7` | Logo & hero gradient end (decoration only) |

> ⚠️ `#2E83F2` white text contrast ratio ~3.7:1. Acceptable for buttons at 14px bold or larger. Avoid on small labels or body text.
> Gradient tokens (`--color-brand-gradient-*`) are strictly for logomark, hero sections, and marketing surfaces. Never apply gradients to interactive UI components.

## Neutral Scale (Zinc)

Slight blue-violet tint — neither warm nor cool.

| Token | Value |
|-------|-------|
| `--color-neutral-0` | `#ffffff` |
| `--color-neutral-50` | `#fafafa` |
| `--color-neutral-100` | `#f4f4f5` |
| `--color-neutral-200` | `#e4e4e7` |
| `--color-neutral-300` | `#d1d1d6` |
| `--color-neutral-400` | `#a1a1aa` |
| `--color-neutral-500` | `#71717a` |
| `--color-neutral-600` | `#52525b` |
| `--color-neutral-700` | `#3f3f46` |
| `--color-neutral-800` | `#27272a` |
| `--color-neutral-900` | `#18181b` |
| `--color-neutral-950` | `#09090b` |

## Surface

| Token | Value | Role |
|-------|-------|------|
| `--color-surface-page` | `#ffffff` | Page background |
| `--color-surface-default` | `#ffffff` | Card, container default |
| `--color-surface-subtle` | `#fafafa` | Alternate card background |
| `--color-surface-muted` | `#f4f4f5` | Section background, Flat card |
| `--color-surface-inset` | `#f0f0f1` | Inset container |

> The contrast between `surface-muted` → `surface-default` creates elevation without shadows.

## Text

| Token | Value | Role |
|-------|-------|------|
| `--color-text-primary` | `#18181b` | Headings, body |
| `--color-text-secondary` | `#52525b` | Descriptions, subheadings |
| `--color-text-tertiary` | `#71717a` | Metadata, placeholders |
| `--color-text-disabled` | `#a1a1aa` | Disabled state |
| `--color-text-on-dark` | `#fafafa` | Text on dark backgrounds |

## Border (Semi-transparent)

| Token | Value | Role |
|-------|-------|------|
| `--color-border-subtle` | `rgba(0, 0, 0, 0.05)` | Dividers, subtle boundaries |
| `--color-border-default` | `rgba(0, 0, 0, 0.08)` | Card borders, components |
| `--color-border-strong` | `rgba(0, 0, 0, 0.15)` | Input borders, emphasis |
| `--color-border-focus` | `var(--color-brand-primary)` | Focus state |

> Semi-transparent rgba instead of fixed hex — integrates naturally regardless of background color.

## Semantic

| Token | Value | Background |
|-------|-------|------------|
| `--color-success` | `#16a34a` | `#f0fdf4` |
| `--color-warning` | `#d97706` | `#fffbeb` |
| `--color-danger` | `#dc2626` | `#fef2f2` |
| `--color-info` | `#2563eb` | `#eff6ff` |

## Gradient System

UI components: none — depth is expressed through shadows and surface color contrast only.
Logo & hero decoration: `linear-gradient(to right, var(--color-brand-gradient-from), var(--color-brand-gradient-to))`
