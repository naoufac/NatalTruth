# Frontend ↔ api.nataltruth.com

## What was wired

| UI | Calls |
|----|--------|
| **Chart** (`/chart`) | `POST /v1/calculate/swiss` (or moshier if `localStorage.nataltruth_engine=moshier`) |
| **Gematria** (`/gematria`) | `POST /v1/name/full` |
| **Numerology** (`/numerology`) | `POST /v1/name/full` |
| **API base** | `https://api.nataltruth.com` (no `/api` prefix) |

Adapter: `src/lib/nataltruth.js`  
Config: `src/lib/apiConfig.js` + `.env`

## Auth truth

`api.nataltruth.com` has **no** auth endpoints.  
Registration/login store a **local profile** (birth data + lat/lon) for calculate.  
Other pages (chat, payments, admin, …) still call paths that **do not exist** on the calc API — they will fail until those APIs exist.

## Run

```bash
cd frontend
cp .env.example .env   # already points at api.nataltruth.com
yarn install   # or npm install
yarn start
```

## Required profile fields for chart

- full name  
- birth_date  
- birth_place label  
- **latitude + longitude** (registration step 2)  
- optional birth_time, utc_offset  
