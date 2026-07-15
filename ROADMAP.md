# NatalTruth — ROADMAP / TODO

**Audience:** founder only.  
**Rule:** do not mark done what is not done. Truth and precision first.

---

## North star

Build a **clean** NatalTruth stack that:

1. Calculates natal data with absolute precision (Swiss when the plan requires it)  
2. Calculates multi-tradition name systems  
3. Produces **deep** reports (standard depth: multi-part fusion of calc layers — not thin web blurbs)  
4. Ships a real product UX + plans (Free / $19 / $49 / $199 Ultra)  

**Ultra ($199):** Swiss + densest information (chart mechanics + social dynamics framing for pros/coaches).

---

## Status legend

| Tag | Meaning |
|-----|---------|
| DONE | Live / validated |
| PARTIAL | Exists but incomplete or temporary |
| TODO | Not built |
| LATER | Intentionally after earlier steps |

---

## Phase 0 — Foundation (API calc)

| Step | Item | Status |
|------|------|--------|
| 0.1 | Swiss chart API (planets, houses, aspects, patterns) | **DONE** |
| 0.2 | Moshier chart API (same shape) | **DONE** |
| 0.3 | Name systems: Pythagorean, Chaldean, Abjad, Hebrew, Vedic + full | **DONE** |
| 0.4 | Stress validation of live calc endpoints | **DONE** (report on laptop only) |
| 0.5 | Deploy API on cPanel `api.nataltruth.com` | **DONE** |
| 0.6 | Clean GitHub production tree for API | **DONE** |
| 0.7 | Honest docs (this ROADMAP + README) | **IN PROGRESS → this commit** |

---

## Phase 1 — Product truth layer (next real work)

| Step | Item | Status |
|------|------|--------|
| 1.1 | Define **exactly** which calcs each plan may call (matrix Free / 19 / 49 / 199) | **TODO** — agree in writing |
| 1.2 | Auth + user DB (no dual systems) | **TODO** |
| 1.3 | Persist charts + calculation snapshots | **TODO** |
| 1.4 | Birth place → lat/lon/tz pipeline (precision) | **TODO** (manual lat/lon today) |
| 1.5 | Report composer API: fuse chart + name → deep multi-part report | **TODO** |
| 1.6 | Swiss-only enforcement for $199 report path | **TODO** |
| 1.7 | Report quality bar aligned to deep standard PDF | **TODO** (standard studied; generator not built) |

---

## Phase 2 — Frontend product

| Step | Item | Status |
|------|------|--------|
| 2.1 | Scratch frontend captured + wired chart/name to API | **PARTIAL** |
| 2.2 | Strip dead routes / old backend assumptions | **TODO** |
| 2.3 | Create-chart journey (name, date, time, place → API) | **TODO** |
| 2.4 | Chart + name results UI (full blocks, readable) | **TODO** |
| 2.5 | Report reader UI (deep report layout) | **TODO** |
| 2.6 | Decide keep / rewrite frontend shell | **OPEN** (scratch may change completely) |
| 2.7 | Deploy SPA to nataltruth.com | **PARTIAL** (live build; branding leftovers possible) |

---

## Phase 3 — Plans, money, Ultra

| Step | Item | Status |
|------|------|--------|
| 3.1 | Free / $19 / $49 / $199 product definitions in code | **TODO** |
| 3.2 | Payments + entitlements | **TODO** |
| 3.3 | Ultra framing for coaches/pros (precision + social dynamics info) | **TODO** |
| 3.4 | Rate limits / abuse protection on API | **TODO** |

---

## Phase 4 — Admin & ops

| Step | Item | Status |
|------|------|--------|
| 4.1 | `nao.nataltruth.com` real admin | **TODO** (placeholder only) |
| 4.2 | CMS for public content | **TODO** |
| 4.3 | Monitoring, backups, SSL hygiene | **TODO** / PARTIAL |

---

## Phase 5 — Later product calcs (only after 1–2 solid)

| Step | Item | Status |
|------|------|--------|
| 5.1 | Relocated chart / location analysis API | **LATER** |
| 5.2 | Synastry / compatibility API | **LATER** |
| 5.3 | Transits / daily product API | **LATER** |
| 5.4 | Coaching chat product | **LATER** |

---

## How calcs will be used (intent — not all coded)

| Situation | Likely engines / APIs |
|-----------|------------------------|
| Quick / free exploration | Moshier chart and/or limited name systems |
| Paid mid tiers | Broader name + chart; report depth TBD |
| Ultra $199 | **Swiss** full chart + full name fusion + **deep** report |
| Coach workflow | Ultra + denser technical + dynamics language |

Exact matrix is **step 1.1** — do not invent gates before agreement.

---

## Explicit non-goals right now

- Declaring the product “finished”  
- Building every old UI page’s backend  
- Shipping shallow horoscope content as the report standard  
- Mixing abandoned monorepo debt into NatalTruth  

---

## Suggested next single step (after docs land)

**Agree plan × calc matrix (1.1)** — then either:

- **A)** Auth + store charts (1.2–1.3), or  
- **B)** Deep report API prototype (1.5–1.7) on Swiss  

Pick one track; do not run both half-finished.

---

*Update this file whenever a step’s status changes. Truth over optimism.*
