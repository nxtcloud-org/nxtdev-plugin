# Component Stylings

## Buttons

### Shape

| Shape | Radius | Usage |
|-------|--------|-------|
| Rounded | 12px (`--radius-md`) | Default UI buttons |
| Pill | 9999px (`--radius-full`) | Marketing CTAs, tag-style buttons |

### Sizes

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| sm | 32px | 0 14px | 13px |
| md | 40px | 0 18px | 14px |
| lg | 48px | 0 22px | 15px |

### Variants

| Variant | Treatment |
|---------|-----------|
| Primary | Brand background + inset shadow `rgba(255,255,255,0.18) 0px 0.5px 0px inset, rgba(0,0,0,0.12) 0px 1px 3px` |
| Secondary | Transparent background + `border: 1px solid rgba(0,0,0,0.15)` |
| Ghost | Transparent background, hover applies `surface-muted` tint |
| Destructive | `#dc2626` background + inset shadow |

### States

- Focus: `outline: 2px solid brand-primary; outline-offset: 2px`
- Disabled: `opacity: 0.38; pointer-events: none`

## Cards

- `border-radius: 20px`
- Internal padding: `24px`

| Variant | Treatment | Usage |
|---------|-----------|-------|
| Default | border + shadow-2 | Most content containers |
| Elevated | border + shadow-3 | Feature cards, key CTAs |
| Flat | surface-muted + border-subtle | Nested context, inner components |
| Interactive | hover: shadow-4 + translateY(-2px) | Clickable cards |

## Badges

- `border-radius: 9999px` (pill)
- `padding: 3px 10px; font-size: 12px; font-weight: 500`
- Variants: success / warning / danger / info / neutral

## Form Inputs

- `height: 40px; border-radius: 10px`
- `border: 1px solid rgba(0,0,0,0.15)`
- Focus: `border-color: brand-primary; box-shadow: 0 0 0 3px brand-primary-muted`
- Error: `border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.12)`
- Search: `border-radius: 9999px` (pill)
