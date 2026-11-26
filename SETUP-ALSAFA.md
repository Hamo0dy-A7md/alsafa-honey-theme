# Markaz Al Safa Honey — Salla theme setup

This folder is your Salla store design, built on Salla's official starter theme ("Raed").
It has your black & gold look, flying bees, golden product cards, benefits, "what we do" and contact sections.

## What's in it

| Section (in your Salla dashboard)  | What it shows |
|---|---|
| الصفاء: الواجهة الرئيسية مع النحل | Headline, two framed photos, flying bees |
| الصفاء: فوائد العسل               | Benefits of honey with icons |
| الصفاء: المنتجات                  | Your real Salla products in the gold cards |
| الصفاء: ما نقدّمه                 | Raw honey + full guarantee cards |
| الصفاء: تواصل معنا والموقع        | Phone, WhatsApp, address, hours, map |

Every text is editable from the dashboard. Leave a field empty to keep the default wording (Arabic and English).
The header, footer, product page and cart are restyled black & gold. A WhatsApp button shows on every page.

## Steps to put it on your store

1. **Create accounts (free)**
   - Salla Partners: https://salla.partners
   - GitHub: https://github.com
2. **Put this folder on GitHub.** Create a new empty repository and upload this folder to it (Claude can do this once you're signed in).
3. **Import it in Salla Partners.** My Themes → Import theme → choose the repository.
4. **Preview and install.** Preview the theme on your store from the Partners portal, then install it on مركز عسل الصفاء.
5. **Arrange the home page.** In your Salla dashboard, open the store design / home page editor:
   - Remove the default sections.
   - Add the five "الصفاء" sections in this order: الواجهة الرئيسية ← فوائد العسل ← المنتجات ← ما نقدّمه ← تواصل معنا.
   - In "المنتجات", choose Sidr Honey and The Formula.
6. **Set up products in Salla** so checkout matches:
   - Sidr Honey: options 1 kg (59), 2 kg (119), 7 kg (399).
   - The Formula: options 250 g (100), 500 g (180).
   - Upload your logo, and set the store's main color to gold (#F5B82E).

## For developers

```
pnpm install
pnpm run production   # builds into /public
```
