# Responsive Behavior

## Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | < 640px | 1 column, 20px gutter, section padding 48px |
| Tablet | 640px – 1024px | 2 columns, 40px gutter, simplified nav |
| Desktop | 1024px – 1280px | Full layout, 80px gutter |
| Wide | > 1280px | 1200px container, centered |

## Touch Targets

- Minimum button height 40px (md size) — Apple, ElevenLabs
- Mobile primary CTAs: full-width pill buttons
- Minimum tap target 44×44px

## Collapsing Strategy

- **Display text**: 72px → 48px → 36px (Desktop → Tablet → Mobile)
- **Section vertical padding**: 96px → 64px → 48px
- **Card grid**: 3 columns → 2 columns → 1 column
- **Navigation**: full horizontal menu → hamburger menu at < 640px
- **Hero layout**: side-by-side text + image → stacked vertically

## Image Behavior

- Maintain aspect ratio within containers (`aspect-ratio` fixed)
- Scale only — no art direction changes across breakpoints
