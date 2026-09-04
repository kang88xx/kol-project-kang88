@AGENTS.md

## Design System

Always read `DESIGN.md` before making visual or UI decisions.
Use `--semantic-*` CSS custom properties from `wds-tokens.css`; do not hard-code colors, shadows, or letter-spacing. Never reference `--atomic-*` directly in component CSS.
Do not deviate from DESIGN.md without explicit user approval. In QA mode, flag code that does not match it.
Source of truth: wanted-design local catalog (Wanted Montage, MIT) — resync with `/wanted-design update`.

Brand: product name is **Uplink** (code name KOLpulse). Logo lives in `src/components/brand.tsx`; wordmark uses `--font-family-wanted-sans`. Type scale utilities: `text-title-1 … text-caption-2` (see globals.css). Cards use the `surface` utility; toggles use `segmented` / `segmented-item`.
