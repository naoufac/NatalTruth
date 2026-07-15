# NatalTruth

**Private project notes for the founder.**  
This is **not** a finished product page. It is an honest map of what exists, what works, and what is still empty.

| Host | Role | Status |
|------|------|--------|
| [nataltruth.com](https://nataltruth.com) | Public frontend (scratch UI) | Live static SPA (HTTP 200); legacy branding may still appear in HTML; may be rebuilt |
| [api.nataltruth.com](https://api.nataltruth.com) | Calculation API | Live v0.3.0 |
| [nao.nataltruth.com](https://nao.nataltruth.com) | Admin | Placeholder only |

**Standard for the work:** truth and precision. No fake “we’re done.” Deep reports (when built) must be complete, useful, and honest — not thin web horoscopes.

---

## What this product is aiming at

NatalTruth is a **precision natal calculation + deep interpretation** system:

1. **Calculate** birth chart (planets, houses, aspects, patterns)  
2. **Calculate** full-name letter systems (multiple traditions / languages)  
3. **Compose deep reports** that *combine* those layers and analyze them (standard quality: long-form, multi-part, personal, actionable — see report standard reference below)  
4. Ship that through a **frontend** (current one is temporary) and later **plans / Ultra** for coaches  

**Report generation rule (locked):** Swiss Ephemeris **only** for the **$199 Ultra** tier report path.  
Other tiers’ engines / name systems / report depths: **UNDECIDED** — see **ROADMAP §1.1** matrix (do not invent gates).

---

## Plans (commercial — framing only; not fully coded)

| Plan | Price | Intent (truth) |
|------|-------|----------------|
| Free | $0 | Entry; limited calc/report surface (not fully gated in code yet) |
| Monthly | **$19** | Ongoing access tier (gating not fully built) |
| Premium | **$49** | Higher access (gating not fully built) |
| Ultra | **$199** | Coaches / professionals / precision maniacs — **Swiss** chart + deepest reports + denser chart & social-dynamics information |

**Code reality:** plan billing, paywalls, and tier routing are **not finished**. Do not read this table as “live Stripe products.”

---

## Calculation APIs — inventory (truthful)

Canonical contract + schemas: **[docs/nataltruth.md](./docs/nataltruth.md)**  
### A. Live and usable now (validated)

These run on production `api.nataltruth.com` (cPanel Node app). Stress history: **`docs/STRESS_TEST_REPORT.md`**. Product verification uses **calculate / name / chat** — not health polling as a goal.

#### Chart (ephemeris)

| # | Capability | Endpoint | Engine | Returns (always full for chart) |
|---|------------|----------|--------|----------------------------------|
| 1 | Full natal chart | `POST /v1/calculate/swiss` | **Swiss** | Planets, houses, aspects, patterns + name block |
| 2 | Full natal chart | `POST /v1/calculate/moshier` | **Moshier** | Same shape; different ephemeris backend |
| 3 | Full natal chart | `POST /v1/calculate` | body `engineMode` | Same as above |

Chart includes: planetary positions · house cusps · aspects · patterns (grand_trine, t_square, yod, stellium, grand_cross, …) · multi-system name payload.

#### Name / letter systems

| # | Capability | Endpoint | Range / notes |
|---|------------|----------|----------------|
| 4 | All systems at once | `POST /v1/name/full` | Pythagorean + Chaldean + Abjad + Hebrew + Vedic + core numbers |
| 5 | Pythagorean | `POST /v1/name/pythagorean` | 1–9 · EN/FR Latin |
| 6 | Chaldean | `POST /v1/name/chaldean` | 1–8 · no letter 9 |
| 7 | Arabic Abjad | `POST /v1/name/abjad` | 1–1000 · Arabic script |
| 8 | Hebrew (Mispar Hechrechi) | `POST /v1/name/hebrew` | 1–400 · Hebrew script |
| 9 | Indian Vedic practice | `POST /v1/name/vedic` | 1–8 · Chaldean on Latin |
| 10 | List systems | `GET /v1/name/systems` | Metadata |
| 11 | Alias | `POST /v1/gematria` | Same family as name/full |
| 12 | Chat (OpenRouter) | `POST /chat` or `POST /v1/chat` | Model `qwen/qwen3.5-122b-a10b` |
| — | Process liveness | `GET /health` | Hosting only — **not** a product feature |

**How we will use them:** not all at once for every user/plan. Situation + plan choose which endpoints and which engine (e.g. Swiss reserved for Ultra reports). That routing is **roadmap**, not fully coded.

### B. Sitting / not yet configured as product APIs

These are **goals or UI leftovers**, not live NatalTruth calc product endpoints:

| # | Capability | Status |
|---|------------|--------|
| 1 | Deep multi-part AI reports (PDF-depth standard) | **Not built** as API |
| 2 | Plan / subscription / payment gating | **Not built** |
| 3 | Auth + Postgres user/chart storage | **Not built** (frontend uses local profile) |
| 4 | Relocated charts / astrocartography product API | **Not built** |
| 5 | Compatibility / synastry product API | **Not built** (UI may still call dead paths) |
| 6 | Transits / daily horoscope product API | **Not built** |
| 7 | Admin (`nao`) real dashboard | **Placeholder only** |
| 8 | CMS content system | **Not built** |
| 9 | Chat / coach backend | **Not built** (UI leftover) |
| 10 | Full production email / push | **Not built** |

Do **not** jump from “API calc works” to “product finished.”

---

## Report standard (quality bar — not an API yet)

Reference sample on this Mac:

`/Users/Naoufal/Dropbox/Gab 44/core_themes perso_and_guidance_summary.md.pdf`

That document is the **depth bar**: multi-part narrative that fuses birth data, numerology, chart nature, life arc, gifts, mission, recurring guidance, self-care.  
Industry short “daily horoscope” pages are **not** the target.

When report APIs exist, they must:

- Pull **real** calc outputs (Swiss for $199)  
- Fuse **multiple** systems where the plan requires it  
- Stay **precise, useful, truthful** — no fluff that invents positions  

---

## Frontend (honest)

| Item | Truth |
|------|--------|
| Source | `frontend/` (from a prior UI scratch; may be heavily changed or replaced) |
| Wired to | `https://api.nataltruth.com` for **chart + name** pages |
| Session | Local birth profile (no real auth API) |
| Other pages | Many still call **non-existent** old backend paths — expected to fail until rebuilt |

Details: `frontend/WIRED.md`

---

## Repo layout

```
NatalTruth/
├── engine/          # pure calc (ephemeris, patterns, name systems)
├── server/          # Express API → api.nataltruth.com
├── frontend/        # scratch UI → nataltruth.com
├── docs/
│   ├── nataltruth.md   # API contract + schemas
│   ├── HOSTING.md
│   └── API.md
├── ROADMAP.md       # steps / TODO — where we are going
├── ARCHITECTURE.md
└── README.md        # this file
```

---

## Quick ops

```bash
# Product smoke (API on cPanel)
curl -sS -X POST https://api.nataltruth.com/v1/name/full \
  -H 'content-type: application/json' \
  -d '{"fullName":"Jane Example","birthDate":"1990-06-15"}'

# Local API
pnpm install && pnpm build && pnpm start:api

# Frontend (dev)
cd frontend && npm install --legacy-peer-deps && npm start

# Publish SPA to cPanel
cd frontend && npm run build && rsync -avz --delete build/ cpanel:nataltruth.com/
```

cPanel: API app `nataltruth-app` · SPA `nataltruth.com` · see **docs/HOSTING.md**

---

## Related docs

| Doc | Purpose |
|-----|---------|
| **[ROADMAP.md](./ROADMAP.md)** | Ordered steps / TODO — status of the journey |
| **[docs/nataltruth.md](./docs/nataltruth.md)** | API schemas & how to call calcs |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Technical shape |
| **[docs/HOSTING.md](./docs/HOSTING.md)** | cPanel map |
| **[frontend/WIRED.md](./frontend/WIRED.md)** | What the UI actually calls |

---

*Last honest sync: README for founder only. Project is in progress. Precision over completion theater.*
