# Zoe Conference 2026 — "In the Beginning…" Website

An immersive, scroll-through-the-garden site for Zoe Conference 2026
(September 25–26, 2026 · The Life Church · Memphis).

## Pages
- `index.html` — main experience (hero video → Genesis journey → Pastor Leslie's letter →
  speakers → schedule → rates → Life Women's Foundation → FAQ preview → register)
- `faqs.html` — all 19 FAQs
- `scholarship.html` — scholarship application page (form embed pending, see below)

## Before launch — 3 things to drop in
1. **Registration link** — open `js/main.js`, top of the file:
   `var REGISTER_URL = '';` → paste the live registration URL between the quotes.
   Every Register button on all three pages picks it up automatically.
   (Until then, register buttons scroll to the register section / fall back to emailing zoe@.)
2. **Scholarship Google Form** — in `scholarship.html`, replace the commented-out
   `<iframe>` with the real form's `/viewform?embedded=true` URL and delete the placeholder note.
3. **Pastor Leslie's letter** — the welcome letter in `index.html` is *draft copy* written
   to the 2026 "In the Beginning…" theme (the copy doc noted new letter copy was needed).
   Have Pastor Leslie review/replace before launch.

## Local preview
Any static server works, e.g.:
`npx http-server "Zoe Conference Main Site/site" -p 8123`
No build step — plain HTML/CSS/JS. GSAP, ScrollTrigger and Lenis are vendored in `js/`.

## Asset notes
- `video/hero-loop-web.(mp4|webm)` — golden-garden hero loop
- `video/bluehour-loop.mp4` — fireflies ambience (Friday evening card), generated with
  fal.ai Seedance from `images/gen-bluehour_1.jpg`
- `video/botanical-loop.mp4` — swaying roses (Foundation section), generated with
  fal.ai Seedance from `images/gen-botanical.jpg`
- `images/gen-morning.jpg` — Saturday-morning sunrise, generated with fal.ai FLUX
- `images/paper-cut.webp` — the handmade-paper texture with the white backdrop keyed out
- `images/title-gold-trim.webp` — title art trimmed + converted from the PSD export
- Ambient videos lazy-load and pause offscreen; everything respects `prefers-reduced-motion`.

## Fonts
- **The Quality Brave** — blackletter display (matches the title art)
- **CL Antique No 44 (F00044)** — antique roman (numerals, subheads, nav)
- **CL Antique No 1** — ornamental illuminated initials (drop caps only — it has no digits
  and every glyph is a decorated square)
