# Markaz Al Safa Honey — Salla theme

A black & gold Salla **React** theme, built on Salla's official React starter (`theme-raed-react`).

## What it adds

| Block in the theme editor           | What it shows |
|---|---|
| الصفاء: الواجهة الرئيسية مع النحل | Headline, two framed photos, flying bees |
| الصفاء: فوائد العسل               | Benefits of honey with icons |
| الصفاء: المنتجات                  | Your real Salla products in gold cards (sparkles + tilt on hover) |
| الصفاء: ما نقدّمه                 | Raw honey + full guarantee cards |
| الصفاء: تواصل معنا والموقع        | Phone, WhatsApp, address, opening hours (open/closed now), map |

Every text field is optional: leave it empty to keep the built-in Arabic / English wording.
The whole store (header, footer, product page, cart) is dark with gold accents, and a WhatsApp button shows on every page.

Code: `app/components/home/AlSafa.tsx`, `app/hooks/useAlSafaMotion.ts`, `app/lib/alsafaText.ts`,
`app/styles/06-alsafa/alsafa.scss`, images in `app/assets/alsafa/`, blocks declared in `twilight.json`.

## Put it on the store

1. Salla Partners → Themes → **Import theme** → choose this repository.
2. Preview it on your store.
3. In the theme editor: remove the default home blocks, then add the five "الصفاء" blocks in order
   (الواجهة الرئيسية ← فوائد العسل ← المنتجات ← ما نقدّمه ← تواصل معنا) and pick your products in "المنتجات".
4. In your Salla dashboard set the products' sizes as options:
   Sidr Honey 1 kg (59) · 2 kg (119) · 7 kg (399); The Formula 250 g (100) · 500 g (180).
   Upload your logo and set the main colour to gold (#F5B82E).

## Developers

```
pnpm install
pnpm build && pnpm typecheck && pnpm test && pnpm check:manifest
```
