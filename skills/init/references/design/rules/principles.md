# Design Principles

## General

- Crisp white canvas (`#ffffff`) — blue earns visibility through restraint everywhere else
- Single UI color `#2E83F2` — exclusive to interactive elements (CTAs, focus rings, links); never decorative in components
- Logo gradient `#2E83F2` → `#F24BE7` — reserved for logomark, hero sections, and marketing surfaces only
- Pretendard Variable — Korean-first geometric sans-serif with tight negative tracking at display sizes (32px+)
- Cool-leaning Zinc neutral scale (slight blue-violet tint) — naturally complements the blue primary
- No gradients in UI components — gradient lives only in logo and hero decoration
- Semi-transparent `rgba` borders throughout — integrates naturally on any background color
- Five-level shadow scale from border-only (Level 0) to full overlay (Level 5)

## Typography

- **Negative tracking at display sizes (32px+)** — tight, authoritative headlines
- **Body weight capped at 600** — never use 700+
- **Overline** — section labels and category markers only. Always uppercase + letter-spacing +0.08em
- **Korean minimum size** — never below 12px

## Elevation

- **Level 0: border-only** — separation through border alone, no shadow. Nested context, Flat cards
- **Level 1–2: layered subtle shadows** — opacity 0.04–0.06, 2-layer stack for natural lift
- **Level 3–5: ring + deep shadow** — 1px ring defines the edge, blur creates lift. Overlay components only
