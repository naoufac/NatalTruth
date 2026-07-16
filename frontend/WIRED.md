# Frontend ↔ api.nataltruth.com (zero-404 pass 2026-07-16)

**Rule:** SPA must only HTTP routes that exist on the calc API, or make **no** request.

## Live API calls from SPA

| UI | API |
|----|-----|
| Chart, Share (data) | `POST /v1/calculate/swiss` \| `moshier` |
| Numerology, Gematria, Dashboard numbers | `POST /v1/name/full` |
| Chat | `POST /chat`, sessions/history/delete |
| Auth / Settings profile | **localStorage only** |

Adapter: `src/lib/nataltruth.js` · live list: `src/lib/liveApis.js`

## Pages with no HTTP (honest UI)

Transits, Friend, Compatibility, Horoscope today, Public chart, Reading thanks, Verify email, Reset password, Admin (redirect messaging), Pricing checkout, Buy reading, Voice, Newsletter subscribe, Share PNG/token, Settings push/billing/resend verify.

## Env

`REACT_APP_BACKEND_URL=https://api.nataltruth.com`
