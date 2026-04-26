---
name: NxtCloud Design System
version: alpha
description: Korean-first cloud platform design system. A single confident blue anchors interactive moments on a crisp white canvas; logo gradient is reserved exclusively for brand decoration.
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/*.ts"
  - "**/*.css"
  - "**/*.scss"
  - "**/components/**"
  - "**/styles/**"

colors:
  primary: "#2E83F2"
  brand-primary: "#2E83F2"
  brand-primary-hover: "#1B6BD8"
  brand-on-primary: "#ffffff"
  brand-gradient-from: "#2E83F2"
  brand-gradient-to: "#F24BE7"

  neutral-0: "#ffffff"
  neutral-50: "#fafafa"
  neutral-100: "#f4f4f5"
  neutral-200: "#e4e4e7"
  neutral-300: "#d1d1d6"
  neutral-400: "#a1a1aa"
  neutral-500: "#71717a"
  neutral-600: "#52525b"
  neutral-700: "#3f3f46"
  neutral-800: "#27272a"
  neutral-900: "#18181b"
  neutral-950: "#09090b"

  surface-page: "#ffffff"
  surface-default: "#ffffff"
  surface-subtle: "#fafafa"
  surface-muted: "#f4f4f5"
  surface-inset: "#f0f0f1"

  text-primary: "#18181b"
  text-secondary: "#52525b"
  text-tertiary: "#71717a"
  text-disabled: "#a1a1aa"
  text-on-dark: "#fafafa"

  success: "#15803d"
  success-bg: "#f0fdf4"
  warning: "#a35508"
  warning-bg: "#fffbeb"
  danger: "#b91c1c"
  danger-bg: "#fef2f2"
  info: "#2563eb"
  info-bg: "#eff6ff"

typography:
  display-xl:
    fontFamily: Pretendard Variable
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: -1.8px
  display-l:
    fontFamily: Pretendard Variable
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -1.12px
  display-m:
    fontFamily: Pretendard Variable
    fontSize: 40px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.8px
  heading-l:
    fontFamily: Pretendard Variable
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.32px
  heading-m:
    fontFamily: Pretendard Variable
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.24px
  heading-s:
    fontFamily: Pretendard Variable
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.4
  body-l:
    fontFamily: Pretendard Variable
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-m:
    fontFamily: Pretendard Variable
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-s:
    fontFamily: Pretendard Variable
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-m:
    fontFamily: Pretendard Variable
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  overline:
    fontFamily: Pretendard Variable
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.08em
  code:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6

rounded:
  xs: 6px
  sm: 10px
  md: 12px
  lg: 20px
  xl: 32px
  full: 9999px

spacing:
  base: 8px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  "24": 96px
  "32": 128px

components:
  button-primary-md:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.brand-on-primary}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 18px
    typography: "{typography.body-s}"
  button-primary-md-hover:
    backgroundColor: "{colors.brand-primary-hover}"
  button-primary-sm:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.brand-on-primary}"
    rounded: "{rounded.md}"
    height: 32px
    padding: 0 14px
  button-primary-lg:
    backgroundColor: "{colors.brand-primary}"
    textColor: "{colors.brand-on-primary}"
    rounded: "{rounded.md}"
    height: 48px
    padding: 0 22px
  button-secondary-md:
    backgroundColor: transparent
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 18px
  button-ghost-md:
    backgroundColor: transparent
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 18px
  button-destructive-md:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.brand-on-primary}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 0 18px

  card-default:
    backgroundColor: "{colors.surface-default}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-elevated:
    backgroundColor: "{colors.surface-default}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-flat:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-interactive:
    backgroundColor: "{colors.surface-default}"
    rounded: "{rounded.lg}"
    padding: 24px

  badge-neutral:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: 3px 10px
  badge-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    rounded: "{rounded.full}"
    padding: 3px 10px
  badge-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    rounded: "{rounded.full}"
    padding: 3px 10px
  badge-danger:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    rounded: "{rounded.full}"
    padding: 3px 10px
  badge-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info}"
    rounded: "{rounded.full}"
    padding: 3px 10px

  input-default:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    height: 40px
  input-search:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    height: 40px

  border-subtle:
    backgroundColor: "rgba(0,0,0,0.05)"
  border-default:
    backgroundColor: "rgba(0,0,0,0.08)"
  border-strong:
    backgroundColor: "rgba(0,0,0,0.15)"
  brand-primary-muted:
    backgroundColor: "rgba(46,131,242,0.12)"

  logo-mark:
    backgroundColor: "{colors.brand-gradient-from}"
  hero-decoration:
    backgroundColor: "{colors.brand-gradient-to}"
---

# NxtCloud Design System

## Overview

NxtCloud's interface opens on a crisp white canvas where a single confident blue anchors all interactive moments — CTAs, focus rings, and links. The logo tells the full brand story: a gradient sweeping from blue (`#2E83F2`) to magenta (`#F24BE7`), bold and kinetic. But the UI system distills that energy into one color. Where most cloud platforms dissolve into generic blues, NxtCloud's blue is deliberate and saturated — a direct signal of technical clarity. The white-dominant surface keeps everything purposeful; the blue earns its presence precisely because it appears so selectively.

The typography is built on Pretendard Variable, a geometric sans-serif designed for Korean and Latin harmony. This choice reflects NxtCloud's identity as a Korean-first platform without compromising international legibility. At display sizes (32px+), tight negative letter-spacing creates compressed, authoritative headlines — an engineering confidence expressed through type. The monospace companion, Geist Mono, anchors code, terminal output, and technical labels with quiet precision.

What distinguishes NxtCloud's system is its **two-register color strategy**. The logo gradient (blue → magenta) lives in brand moments — hero sections, marketing surfaces, the logomark itself. The UI chrome steps back into blue-only discipline: one interactive color, Zinc neutrals, no decorative gradients in components. Depth comes from surface color contrast and a precise five-level shadow scale. The result is a design language that feels alive in brand moments and razor-focused in product.

### Key Characteristics

- Crisp white canvas (`#ffffff`) — blue earns visibility through restraint everywhere else
- Single UI color `#2E83F2` (`{colors.brand-primary}`) — exclusive to interactive elements (CTAs, focus rings, links); never decorative in components
- Logo gradient `#2E83F2` → `#F24BE7` — reserved for logomark, hero sections, and marketing surfaces only
- Pretendard Variable — Korean-first geometric sans-serif with tight negative tracking at display sizes (32px+)
- Cool-leaning Zinc neutral scale (slight blue-violet tint) — naturally complements the blue primary
- No gradients in UI components — gradient lives only in logo and hero decoration
- Semi-transparent `rgba` borders throughout — integrate naturally on any background color
- Five-level shadow scale from border-only (Level 0) to full overlay (Level 5)

## Colors

The palette anchors a confident interactive blue with cool-leaning Zinc neutrals. Token values live in the YAML front matter; the prose below describes role and intent.

- **Brand (`#2E83F2`):** Saturated blue reserved exclusively for interactive moments — CTAs, focus rings, links. Never decorative in components.
- **Brand Gradient (`#2E83F2` → `#F24BE7`):** Logo and hero decoration only. Strictly excluded from UI components.
- **Neutral (Zinc, 13 levels):** From `#ffffff` (`neutral-0`) to `#09090b` (`neutral-950`). Slight blue-violet tint that complements the brand blue without leaning warm or cool.
- **Surface:** Page (`#ffffff`), subtle (`#fafafa`), muted (`#f4f4f5`), inset (`#f0f0f1`). The contrast between `surface-muted` → `surface-default` creates elevation without shadows.
- **Text:** Primary (`#18181b`), secondary (`#52525b`), tertiary (`#71717a`), disabled (`#a1a1aa`).
- **Borders (semi-transparent rgba):** subtle `0.05`, default `0.08`, strong `0.15`. Integrate naturally regardless of background color. Implementations apply via `border-default`, `border-subtle`, `border-strong` component tokens.
- **Semantic:** Success (`#15803d`), warning (`#a35508`), danger (`#b91c1c`), info (`#2563eb`), each paired with a tinted background for status surfaces. Text colors are tuned for WCAG AA contrast against their tinted backgrounds.

> ⚠️ `#2E83F2` against white text yields a contrast ratio of ~3.7:1 — acceptable for buttons at 14px bold or larger, but avoid on small labels or body text.
> Gradient tokens are strictly for logomark, hero sections, and marketing surfaces. Never apply gradients to interactive UI components.

## Typography

**Primary:** `Pretendard Variable` — Korean + Latin support, geometric sans-serif. Fallback chain: `Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `system-ui`, `sans-serif`.
**Monospace:** `Geist Mono` — code, terminal, meta labels. Fallback: `ui-monospace`, `SFMono-Regular`, `Menlo`.

The type scale spans 12 levels from `display-xl` (72px / 700 weight) down to `code` (14px / 400 mono). Exact values live in `typography.*` tokens.

### Principles

- **Negative tracking at display sizes (32px+)** — tight, authoritative headlines (minimum `-0.32px`)
- **Body weight capped at 600** — never use 700+
- **Overline labels** — section labels and category markers only. Always uppercase + letter-spacing `+0.08em`
- **Korean minimum size** — never below 12px

## Layout

### Spacing

8px base scale exposed as `spacing.1` (4px) through `spacing.32` (128px). Common applications:

- Component internal padding: `spacing.4` (16px) default, `spacing.6` (24px) for cards
- Group spacing within sections: `spacing.8` (32px)
- Section vertical padding: `spacing.16` to `spacing.24` (64px–96px)
- Page gutter: `spacing.5` (20px) mobile / `spacing.10` (40px) tablet / `spacing.20` (80px) desktop

### Container & Grid

- **Max width:** 1200px (centered)
- **Columns:** 12-column base; feature sections use 2–3 columns

### Whitespace

- Section vertical spacing: 64–96px
- Breathing room over content density
- `surface-muted` sections act as natural visual separators without dividers

## Elevation & Depth

Depth is expressed through a five-level shadow scale, never gradients or backdrop blur. Shadow values exceed the eight standard component property tokens, so they live as prose here — implementations must apply them consistently.

| Level | CSS Value | Application |
|-------|-----------|-------------|
| 0 | `1px solid rgba(0,0,0,0.08)` border | Flat, nested context |
| 1 | `rgba(0,0,0,0.04) 0px 1px 2px` | Badges, inline tags |
| 2 | `rgba(0,0,0,0.06) 0px 2px 8px, rgba(0,0,0,0.04) 0px 1px 2px` | Cards, panels |
| 3 | `rgba(0,0,0,0.10) 0px 4px 16px, rgba(0,0,0,0.06) 0px 2px 4px, rgba(0,0,0,0.04) 0px 0px 0px 1px` | Dropdowns, popovers |
| 4 | `rgba(0,0,0,0.14) 0px 8px 32px, rgba(0,0,0,0.08) 0px 4px 8px, rgba(0,0,0,0.04) 0px 0px 0px 1px` | Modals, dialogs |
| 5 | `rgba(0,0,0,0.18) 0px 16px 48px, rgba(0,0,0,0.10) 0px 8px 16px, rgba(0,0,0,0.06) 0px 0px 0px 1px` | Toasts, command palette |

### Philosophy

- **Level 0 — border-only:** separation through border alone, no shadow. Nested context, Flat cards.
- **Level 1–2 — layered subtle shadows:** opacity 0.04–0.06, 2-layer stack for natural lift.
- **Level 3–5 — ring + deep shadow:** 1px ring defines the edge, blur creates lift. Overlay components only.

## Shapes

Six radius levels ranging from `rounded.xs` (6px) for tooltips to `rounded.full` (9999px) for pill buttons and avatars. Cards use `rounded.lg` (20px) — never below this for card-like containers. The 12px default for buttons (`rounded.md`) signals approachable confidence: small enough to feel engineered, large enough to feel modern.

| Token | Value | Usage |
|-------|-------|-------|
| `rounded.xs` | 6px | Tooltips, code tags |
| `rounded.sm` | 10px | Form inputs |
| `rounded.md` | 12px | Default buttons |
| `rounded.lg` | 20px | Cards |
| `rounded.xl` | 32px | Modals, large cards |
| `rounded.full` | 9999px | Pill buttons, badges |

## Components

### Buttons

Three sizes (`sm` 32px / `md` 40px / `lg` 48px) and four variants (primary / secondary / ghost / destructive). Default shape uses `rounded.md` (12px); pill (`rounded.full`) is reserved for marketing CTAs and tag-style buttons. Token-level styling lives under `components.button-*`.

Effects beyond the eight standard component property tokens:

- **Primary inset shadow:** `rgba(255,255,255,0.18) 0px 0.5px 0px inset, rgba(0,0,0,0.12) 0px 1px 3px`
- **Secondary border:** `1px solid rgba(0,0,0,0.15)`
- **Ghost hover:** applies `surface-muted` tint
- **Destructive inset shadow:** matches Primary inset pattern with `colors.danger` background

States:
- **Focus:** `outline: 2px solid {colors.brand-primary}; outline-offset: 2px`
- **Disabled:** `opacity: 0.38; pointer-events: none`

### Cards

Border-radius `rounded.lg` (20px), internal padding 24px. Four variants:

- **Default** — border + Level 2 shadow. Most content containers.
- **Elevated** — border + Level 3 shadow. Feature cards, key CTAs.
- **Flat** — `surface-muted` + `border-subtle`. Nested context, inner components.
- **Interactive** — hover applies Level 4 shadow + `translateY(-2px)`.

### Badges

Pill-shaped (`rounded.full`), padding `3px 10px`, font-size 12px / weight 500. Variants follow semantic colors (success / warning / danger / info / neutral).

### Form Inputs

Height 40px, `rounded.sm` (10px). Border `1px solid rgba(0,0,0,0.15)`.

- **Focus:** `border-color: {colors.brand-primary}; box-shadow: 0 0 0 3px rgba(46,131,242,0.12)`
- **Error:** `border-color: {colors.danger}; box-shadow: 0 0 0 3px rgba(220,38,38,0.12)`
- **Search variant:** `rounded.full` (pill).

## Do's and Don'ts

### Do

- Use semi-transparent `rgba(0,0,0,0.08)` for card borders — integrates naturally on any background
- Apply negative letter-spacing at all display sizes (32px+) — minimum `-0.32px`
- Reserve brand color exclusively for interactive elements — CTAs, focus rings, links only
- Default buttons use Rounded (12px); Pill only for marketing CTAs and tags
- Apply focus ring consistently: `2px solid {colors.brand-primary}, outline-offset: 2px`
- Use `surface-muted` for section backgrounds — expresses hierarchy without shadows
- Always apply uppercase + letter-spacing `+0.08em` to Overline labels
- Keep all shadows neutral black — no brand-tinted or warm-tinted shadow colors
- Use Level 3+ shadow with 1px ring for floating elements (dropdowns, modals)

### Don't

- Never use font weight 700+ — 600 (Semibold) is the maximum
- Never hardcode brand colors — always reference tokens (`{colors.brand-primary}`)
- Never use `border-radius` below 20px on cards — minimum is `rounded.lg`
- Never create shadows beyond Level 5 — stay within the defined range
- Never use Korean text below 12px
- Never apply borders stronger than `rgba(0,0,0,0.15)` outside of form inputs
- Never add gradients to UI components — gradient is reserved for logo and hero decoration only
- Never add blur (glassmorphism) effects
- Never use positive letter-spacing on body text — 0 is the floor; negative only at display sizes

## Responsive Behavior

> This section is outside the DESIGN.md spec's eight standard sections. Per spec consumer-behavior policy, unknown sections are preserved.

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 640px | 1 column, 20px gutter, section padding 48px |
| Tablet | 640px – 1024px | 2 columns, 40px gutter, simplified nav |
| Desktop | 1024px – 1280px | Full layout, 80px gutter |
| Wide | > 1280px | 1200px container, centered |

### Touch Targets

- Minimum button height 40px (md size)
- Mobile primary CTAs: full-width pill buttons
- Minimum tap target 44×44px

### Collapsing Strategy

- **Display text:** 72px → 48px → 36px (Desktop → Tablet → Mobile)
- **Section vertical padding:** 96px → 64px → 48px
- **Card grid:** 3 columns → 2 columns → 1 column
- **Navigation:** full horizontal menu → hamburger menu at < 640px
- **Hero layout:** side-by-side text + image → stacked vertically

### Image Behavior

- Maintain aspect ratio within containers (`aspect-ratio` fixed)
- Scale only — no art direction changes across breakpoints
