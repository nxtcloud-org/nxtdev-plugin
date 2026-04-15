# NxtCloud Design System

---

## 1. Visual Theme & Atmosphere

NxtCloud's interface opens on a crisp white canvas (`#ffffff`) where a single confident blue (`#2E83F2`) anchors all interactive moments — CTAs, focus rings, and links. The logo tells the full brand story: a gradient sweeping from blue (`#2E83F2`) to magenta (`#F24BE7`), bold and kinetic. But the UI system distills that energy into one color. Where most cloud platforms dissolve into generic blues, NxtCloud's blue is deliberate and saturated — a direct signal of technical clarity. The white-dominant surface keeps everything purposeful; the blue earns its presence precisely because it appears so selectively.

The typography is built on Pretendard Variable, a geometric sans-serif designed for Korean and Latin harmony. This choice reflects NxtCloud's identity as a Korean-first platform without compromising international legibility. At display sizes (32px+), tight negative letter-spacing (-0.32px to -1.8px) creates compressed, authoritative headlines — an engineering confidence expressed through type. The monospace companion, Geist Mono, anchors code, terminal output, and technical labels with quiet precision.

What distinguishes NxtCloud's system is its two-register color strategy. The logo gradient (blue → magenta) lives in brand moments — hero sections, marketing surfaces, the logomark itself. The UI chrome steps back into blue-only discipline: one interactive color, Zinc neutrals, no decorative gradients in components. Depth comes from surface color contrast and a precise five-level shadow scale. The result is a design language that feels alive in brand moments and razor-focused in product.

**Key Characteristics:**
- Crisp white canvas (`#ffffff`) — blue earns visibility through restraint everywhere else
- Single UI color `#2E83F2` — exclusive to interactive elements (CTAs, focus rings, links); never decorative in components
- Logo gradient `#2E83F2` → `#F24BE7` — reserved for logomark, hero sections, and marketing surfaces only
- Pretendard Variable — Korean-first geometric sans-serif with tight negative tracking at display sizes (32px+)
- Cool-leaning Zinc neutral scale (slight blue-violet tint) — naturally complements the blue primary
- No gradients in UI components — gradient lives only in logo and hero decoration
- Semi-transparent `rgba` borders throughout — integrates naturally on any background color
- Five-level shadow scale from border-only (Level 0) to full overlay (Level 5)

---

## 2. Color Palette & Roles

### Brand Colors

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

### Neutral Scale (Zinc)

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

### Surface

| Token | Value | Role |
|-------|-------|------|
| `--color-surface-page` | `#ffffff` | Page background |
| `--color-surface-default` | `#ffffff` | Card, container default |
| `--color-surface-subtle` | `#fafafa` | Alternate card background |
| `--color-surface-muted` | `#f4f4f5` | Section background, Flat card |
| `--color-surface-inset` | `#f0f0f1` | Inset container |

> The contrast between `surface-muted` → `surface-default` creates elevation without shadows.

### Text

| Token | Value | Role |
|-------|-------|------|
| `--color-text-primary` | `#18181b` | Headings, body |
| `--color-text-secondary` | `#52525b` | Descriptions, subheadings |
| `--color-text-tertiary` | `#71717a` | Metadata, placeholders |
| `--color-text-disabled` | `#a1a1aa` | Disabled state |
| `--color-text-on-dark` | `#fafafa` | Text on dark backgrounds |

### Border (Semi-transparent)

| Token | Value | Role |
|-------|-------|------|
| `--color-border-subtle` | `rgba(0, 0, 0, 0.05)` | Dividers, subtle boundaries |
| `--color-border-default` | `rgba(0, 0, 0, 0.08)` | Card borders, components |
| `--color-border-strong` | `rgba(0, 0, 0, 0.15)` | Input borders, emphasis |
| `--color-border-focus` | `var(--color-brand-primary)` | Focus state |

> Semi-transparent rgba instead of fixed hex — integrates naturally regardless of background color.

### Semantic

| Token | Value | Background |
|-------|-------|------------|
| `--color-success` | `#16a34a` | `#f0fdf4` |
| `--color-warning` | `#d97706` | `#fffbeb` |
| `--color-danger` | `#dc2626` | `#fef2f2` |
| `--color-info` | `#2563eb` | `#eff6ff` |

### Gradient System

UI components: none — depth is expressed through shadows and surface color contrast only.
Logo & hero decoration: `linear-gradient(to right, var(--color-brand-gradient-from), var(--color-brand-gradient-to))`

---

## 3. Typography Rules

### Font Family

- **Primary**: `Pretendard Variable` — Korean + Latin support, geometric sans-serif  
  Fallback: `Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `system-ui`, `sans-serif`
- **Monospace**: `Geist Mono` — code, terminal, meta labels  
  Fallback: `ui-monospace`, `SFMono-Regular`, `Menlo`

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Display XL | 72px | 700 | 1.0 | -1.8px |
| Display L | 56px | 700 | 1.05 | -1.12px |
| Display M | 40px | 700 | 1.1 | -0.8px |
| Heading L | 32px | 600 | 1.2 | -0.32px |
| Heading M | 24px | 600 | 1.3 | -0.24px |
| Heading S | 20px | 600 | 1.4 | 0 |
| Body L | 18px | 400 | 1.6 | 0 |
| Body M | 16px | 400 | 1.5 | 0 |
| Body S | 14px | 400 | 1.5 | 0 |
| Label M | 14px | 500 | 1.4 | 0 |
| Overline | 12px | 600 | 1.3 | +0.08em / UPPERCASE |
| Code | 14px | 400 | 1.6 | 0 (mono) |

### Principles
- **Negative tracking at display sizes (32px+)** — tight, authoritative headlines
- **Body weight capped at 600** — never use 700+
- **Overline** — section labels and category markers only. Always uppercase + letter-spacing +0.08em
- **Korean minimum size** — never below 12px

---

## 4. Component Stylings

### Buttons

**Shape**

| Shape | Radius | Usage |
|-------|--------|-------|
| Rounded | 12px (`--radius-md`) | Default UI buttons |
| Pill | 9999px (`--radius-full`) | Marketing CTAs, tag-style buttons |

**Sizes**

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 0 14px | 13px |
| md | 40px | 0 18px | 14px |
| lg | 48px | 0 22px | 15px |

**Variants**

| Variant | Treatment |
|---------|-----------|
| Primary | Brand background + inset shadow `rgba(255,255,255,0.18) 0px 0.5px 0px inset, rgba(0,0,0,0.12) 0px 1px 3px` |
| Secondary | Transparent background + `border: 1px solid rgba(0,0,0,0.15)` |
| Ghost | Transparent background, hover applies `surface-muted` tint |
| Destructive | `#dc2626` background + inset shadow |

**States**
- Focus: `outline: 2px solid brand-primary; outline-offset: 2px`
- Disabled: `opacity: 0.38; pointer-events: none`

### Cards

- `border-radius: 20px`
- Internal padding: `24px`

| Variant | Treatment | Usage |
|---------|-----------|-------|
| Default | border + shadow-2 | Most content containers |
| Elevated | border + shadow-3 | Feature cards, key CTAs |
| Flat | surface-muted + border-subtle | Nested context, inner components |
| Interactive | hover: shadow-4 + translateY(-2px) | Clickable cards |

### Badges

- `border-radius: 9999px` (pill)
- `padding: 3px 10px; font-size: 12px; font-weight: 500`
- Variants: success / warning / danger / info / neutral

### Form Inputs

- `height: 40px; border-radius: 10px`
- `border: 1px solid rgba(0,0,0,0.15)`
- Focus: `border-color: brand-primary; box-shadow: 0 0 0 3px brand-primary-muted`
- Error: `border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.12)`
- Search: `border-radius: 9999px` (pill)

---

## 5. Layout Principles

### Spacing Scale (8px base)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon-text gap, minimal spacing |
| `--space-2` | 8px | Badge padding, button icon gap |
| `--space-3` | 12px | Input padding, small components |
| `--space-4` | 16px | Default component internal padding |
| `--space-5` | 20px | Button horizontal padding |
| `--space-6` | 24px | Card padding, component gap |
| `--space-8` | 32px | Group spacing within sections |
| `--space-10` | 40px | Page gutter (tablet) |
| `--space-12` | 48px | Small section padding |
| `--space-16` | 64px | Section vertical padding |
| `--space-20` | 80px | Page gutter (desktop) |
| `--space-24` | 96px | Large section vertical padding |
| `--space-32` | 128px | Hero vertical padding |

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | 6px | Tooltips, code tags |
| `--radius-sm` | 10px | Form inputs |
| `--radius-md` | 12px | Default buttons |
| `--radius-lg` | 20px | Cards |
| `--radius-xl` | 32px | Modals, large cards |
| `--radius-full` | 9999px | Pill buttons, badges |

### Container & Grid

- **Max width**: 1200px (centered)
- **Gutter**: 80px (desktop) / 40px (tablet) / 20px (mobile)
- **Columns**: 12-column base; feature sections use 2–3 columns

### Whitespace Philosophy

- Section vertical spacing: 64–96px
- Breathing room over content density
- `surface-muted` sections act as natural visual separators without dividers

---

## 6. Depth & Elevation

### Shadow Scale

| Level | CSS Value | Usage |
|-------|-----------|-------|
| Level 0 | `border: 1px solid rgba(0,0,0,0.08)` | Flat, nested context |
| Level 1 | `rgba(0,0,0,0.04) 0px 1px 2px` | Badges, inline tags |
| Level 2 | `rgba(0,0,0,0.06) 0px 2px 8px, rgba(0,0,0,0.04) 0px 1px 2px` | Cards, panels |
| Level 3 | `rgba(0,0,0,0.10) 0px 4px 16px, rgba(0,0,0,0.06) 0px 2px 4px, rgba(0,0,0,0.04) 0px 0px 0px 1px` | Dropdowns, popovers |
| Level 4 | `rgba(0,0,0,0.14) 0px 8px 32px, rgba(0,0,0,0.08) 0px 4px 8px, rgba(0,0,0,0.04) 0px 0px 0px 1px` | Modals, dialogs |
| Level 5 | `rgba(0,0,0,0.18) 0px 16px 48px, rgba(0,0,0,0.10) 0px 8px 16px, rgba(0,0,0,0.06) 0px 0px 0px 1px` | Toasts, command palette |

### Philosophy

- **Level 0: border-only** — separation through border alone, no shadow. Nested context, Flat cards
- **Level 1–2: layered subtle shadows** — opacity 0.04–0.06, 2-layer stack for natural lift
- **Level 3–5: ring + deep shadow** — 1px ring defines the edge, blur creates lift. Overlay components only

---

## 7. Do's and Don'ts

### Do
- Use semi-transparent `rgba(0,0,0,0.08)` for card borders — integrates naturally on any background
- Apply negative letter-spacing at all display sizes (32px+) — minimum `-0.32px`
- Reserve brand color exclusively for interactive elements — CTAs, focus rings, links only
- Default buttons use Rounded (12px); Pill only for marketing CTAs and tags
- Apply focus ring consistently: `2px solid brand-primary, outline-offset: 2px`
- Use `surface-muted` (#f4f4f5) for section backgrounds — expresses hierarchy without shadows
- Always apply uppercase + letter-spacing +0.08em to Overline labels
- Keep all shadows neutral black — no brand-tinted or warm-tinted shadow colors
- Use Level 3+ shadow with 1px ring for floating elements (dropdowns, modals)

### Don't
- Never use font weight 700+ — 600 (Semibold) is the maximum
- Never hardcode brand colors — always use tokens (`var(--color-brand-primary)`)
- Never use `border-radius` below 20px on cards — minimum is `--radius-lg`
- Never create shadows beyond Level 5 — stay within the defined token range
- Never use Korean text below 12px
- Never apply borders stronger than `rgba(0,0,0,0.15)` outside of form inputs
- Never add gradients to UI components — gradient is reserved for logo and hero decoration only (use `--color-brand-gradient-*` tokens)
- Never add blur (glassmorphism) effects
- Never use positive letter-spacing on body text — 0 is the floor; negative only at display sizes

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 640px | 1 column, 20px gutter, section padding 48px |
| Tablet | 640px – 1024px | 2 columns, 40px gutter, simplified nav |
| Desktop | 1024px – 1280px | Full layout, 80px gutter |
| Wide | > 1280px | 1200px container, centered |

### Touch Targets
- Minimum button height 40px (md size) — Apple, ElevenLabs
- Mobile primary CTAs: full-width pill buttons
- Minimum tap target 44×44px

### Collapsing Strategy
- **Display text**: 72px → 48px → 36px (Desktop → Tablet → Mobile)
- **Section vertical padding**: 96px → 64px → 48px
- **Card grid**: 3 columns → 2 columns → 1 column
- **Navigation**: full horizontal menu → hamburger menu at < 640px
- **Hero layout**: side-by-side text + image → stacked vertically

### Image Behavior
- Maintain aspect ratio within containers (`aspect-ratio` fixed)
- Scale only — no art direction changes across breakpoints
