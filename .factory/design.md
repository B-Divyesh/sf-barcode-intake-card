# Barcode Intake Card — visual system

## Direction

**Monochrome typographic broadsheet.** Receiving stock is a small act of publishing: raw marks arrive at the bench and leave as a clear record. The interface borrows the hierarchy, rules, folios, registration marks, and dense captions of a workshop newspaper. It avoids the dashboard look of stock software and keeps the item itself central.

## Palette

The product is intentionally single-mode, like ink on warm newsprint.

| Token | Value | Use |
| --- | --- | --- |
| Paper | `#f1eee5` | page background |
| Sheet | `#fffdf6` | working surfaces |
| Ink | `#171714` | primary type and rules |
| Muted ink | `#5d5b54` | secondary copy; 6.1:1 on paper |
| Signal red | `#a22b1f` | scan state, focus, destructive actions |
| Signal dark | `#711e16` | pressed red and accessible small text |
| Good | `#235b3a` | saved state with a text label |
| Warning | `#775314` | warning state with a text label |

No gradients. Fine black rules and offset shadows create depth. Color never carries meaning alone.

## Typography

- Display: Georgia, Times New Roman, serif. Tall editorial headlines make the tool feel like an intake sheet, not a SaaS dashboard.
- Body and controls: Arial, Helvetica, sans-serif. It stays legible on workshop screens and requires no network or font download.
- Codes and record numbers: ui-monospace. Tabular figures align scans and quantities.
- Scale: 13 / 16 / 20 / 32 / 52 px. Body remains 16 px or larger.

## Spacing and shape

- Eight-pixel base rhythm: 8, 16, 24, 32, 48, 64, 96.
- Reading measure: 68 characters. App form width: 1180 px.
- Corners stay nearly square (0–3 px). Section rules are 1 px; primary controls use 2 px.
- Buttons and inputs are at least 44 px high. Mobile stacks all columns and hides only ornamental folios.

## Interaction grammar

Scanning is the lead story. A moving red registration line crosses the scanner frame while active. Saving stamps the record into the intake ledger; duplicate candidates appear as clipped notices directly beside the barcode field. Every action gives a text status in a polite live region. Destructive actions name the target and require confirmation or offer undo.

## Motion policy

One signature motion: the scanner registration line travels vertically in 1.8 seconds only while the camera is active. Panels enter with a short 180 ms opacity and translate transition tied to navigation. With `prefers-reduced-motion: reduce`, the scan line becomes a fixed red rule and all navigation is instant. Nothing loops unless the user started scanning.

## Asset plan and provenance

- Hero: an original monochrome editorial still life of a workshop receiving desk, composed as a newspaper engraving with an empty right margin. It clarifies the move from miscellaneous parts to a labelled card. Generated with the factory image model on 2026-08-28, then converted to WebP. No people, brands, product promises, or readable text.
- UI icons and barcode marks: hand-authored SVG/CSS primitives in this repository.
- Social card: composed locally from the hero art and live product typography.

### Prompt sheet

Use case: stylized-concept. Asset: editorial landing illustration. Subject: overhead workshop receiving desk with a plain cardboard carton, small metal fittings, coiled cable, handheld barcode scanner, blank adhesive label, and ruled intake card. World: practical micro-seller packing bench. Medium: high-detail monochrome linocut and newspaper wood engraving, visible halftone dots and ink texture. Composition: landscape, objects gathered on the left and centre, calm paper space on the right, no border. Light: hard window light with crisp engraved shadows. Palette words: black ink, warm ivory newsprint, one tiny muted dark-red registration mark. Avoid: readable text, logos, brands, hands, people, gradients, glossy 3D rendering, fake interface, watermark, distorted barcodes.
