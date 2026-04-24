# Do's and Don'ts

## Do

- Use semi-transparent `rgba(0,0,0,0.08)` for card borders — integrates naturally on any background
- Apply negative letter-spacing at all display sizes (32px+) — minimum `-0.32px`
- Reserve brand color exclusively for interactive elements — CTAs, focus rings, links only
- Default buttons use Rounded (12px); Pill only for marketing CTAs and tags
- Apply focus ring consistently: `2px solid brand-primary, outline-offset: 2px`
- Use `surface-muted` (#f4f4f5) for section backgrounds — expresses hierarchy without shadows
- Always apply uppercase + letter-spacing +0.08em to Overline labels
- Keep all shadows neutral black — no brand-tinted or warm-tinted shadow colors
- Use Level 3+ shadow with 1px ring for floating elements (dropdowns, modals)

## Don't

- Never use font weight 700+ — 600 (Semibold) is the maximum
- Never hardcode brand colors — always use tokens (`var(--color-brand-primary)`)
- Never use `border-radius` below 20px on cards — minimum is `--radius-lg`
- Never create shadows beyond Level 5 — stay within the defined token range
- Never use Korean text below 12px
- Never apply borders stronger than `rgba(0,0,0,0.15)` outside of form inputs
- Never add gradients to UI components — gradient is reserved for logo and hero decoration only (use `--color-brand-gradient-*` tokens)
- Never add blur (glassmorphism) effects
- Never use positive letter-spacing on body text — 0 is the floor; negative only at display sizes
