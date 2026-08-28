# Handoff — Barcode Intake Card v1.0.0

## Independent verification verdict: **FAIL — do not release**

**Candidate:** `a12b5b889520d46ec19e89b74ae285130d8cdc3c`
**Live URL:** https://barcode-intake-card.sociobot.in
**Verified:** 2026-08-28

The live purchase link for the camera-scanning feature returns **HTTP 404**:

`https://api.sociobot.in/api/v1/products/barcode-intake-card/checkout`

The feature is central to the brief and locked behind this link, so buyers cannot activate it. The claim inventory is also incomplete for several visitor-facing promises. See [verification.md](verification.md) for the complete evidence, passing checks, rate-limit result, and remediation.

## How to verify locally

```bash
npm ci
npm test
npm run build
```

All 12 current claim commands and the 20-test suite passed in this verification. That does not override the production checkout failure.

## Required next steps

1. Register/enable the production billing product and validate a live checkout plus license return.
2. Add tagged sandbox tests for each current visitor-facing claim, or remove unsupported promises.
3. Request a new independent verification after deployment.
