# Frontend ↔ api.nataltruth.com (cPanel)

**Hosted:** `https://nataltruth.com` → `/home/nchobahc/nataltruth.com`  
**API:** `https://api.nataltruth.com` → Node app `nataltruth-app`  
**Origin:** separate product UI (former Gab44 frontend) — mapped here; no access to original backend.

## Button / route → API map

| UI route / action | API call | Status |
|-------------------|----------|--------|
| Register / Auth save profile | Local `localStorage` only | Live (no auth API) |
| **Chart** `/chart` | `POST /v1/calculate/swiss` or `/moshier` | **Live** |
| **Gematria** `/gematria` | `POST /v1/name/full` | **Live** |
| **Numerology** `/numerology` | `POST /v1/name/full` | **Live** |
| **Dashboard** name numbers | `POST /v1/name/full` | **Live** |
| **Chat** `/chat` send | `POST /chat` → OpenRouter `qwen/qwen3.5-122b-a10b` | **Live** |
| Chat sessions list | `GET /chat/sessions` | In-memory on API process |
| Chat history / delete | `GET /chat/history/:id`, `DELETE /chat/session/:id` | In-memory |
| **Share** chart load | `POST /v1/calculate/*` via local profile | **Live** |
| **Pricing** | Static Free / $19 / $49 / $199 | No payments API |
| Settings profile save | Local profile | **Live** |
| Transits, compatibility, friend, payments, admin CMS | — | **Not on calc API** (UI may show empty/error) |

## Env

```
REACT_APP_BACKEND_URL=https://api.nataltruth.com
```

## SPA publish

```bash
cd frontend && npm run build
rsync -avz --delete frontend/build/ cpanel:nataltruth.com/
# .htaccess SPA rewrite must remain
```

## Health

`GET /health` is process liveness for hosting only — **not** a product feature or goal.
