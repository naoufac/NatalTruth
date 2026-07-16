---
title: NatalTruth full linking plan
date: 2026-07-16
status: execution — make all pages 0 error / 0 404
---

# Execution note (2026-07-16)

User directive: **make all pages working — 0 error and 404 — 0 guessing.**  
This file is the saved plan on the laptop under .

Scope of this execution pass:
1. Every primary and secondary SPA page either calls a **live** NatalTruth API via the adapter, or shows an **honest unavailable** state **without** HTTP to missing routes.
2. No silent 404s from leftover Gab44 paths.
3. Chart / name / chat remain fully live.

### Execution status (2026-07-16) — DONE for zero-404 SPA pass

- Plan saved: this file.
- SPA rebuilt + published to `nataltruth.com`.
- Dead API calls removed from all pages/components; only live paths remain in source HTTP: `/chat*`, calculate via adapter, `name/full` via adapter.
- Unimplemented features use `FeatureUnavailable` or toast — **no HTTP**.
- Live smoke: name/full 200, chat 200, spa /chart 200.

Remaining product work (not this pass): nao admin backend, AI model picker, editable prompts, natal context packs.

---

# Plan: Full frontend↔API linking + nao admin (AI prompts & model choice)

## Goal
Make NatalTruth **100% coherent** with the live backend: every user-facing path either uses a real API via the adapter, or is explicitly demoted (not a silent 404). Put **real admin backend** behind **nao.nataltruth.com**. Enable **AI model choice**, **editable system prompts**, and clear **AI context** (which natal data the model may see).

**Standard:** absolute truth — no invented Stripe/auth/DB unless in scope below as minimal file-backed admin store.

---

## Current truth (inspected 2026-07-16)

| Host | Role | State |
|------|------|--------|
| `nataltruth.com` | Public SPA | Live; adapter partial; many pages still call dead Gab44 paths |
| `api.nataltruth.com` | Node calc + chat | Live v0.4.0; OpenRouter configured |
| `nao.nataltruth.com` | Admin | **Static placeholder only** — no backend |

### Live API inventory (ours — 16 product/ops routes)

| # | Method | Path | Utility for product / AI |
|---|--------|------|---------------------------|
| 1 | POST | `/v1/calculate` | Chart + engineMode body |
| 2 | POST | `/v1/calculate/swiss` | Precision chart (Ultra report path) |
| 3 | POST | `/v1/calculate/moshier` | Lighter chart |
| 4 | GET | `/v1/name/systems` | Metadata for UI / AI tool list |
| 5–9 | POST | `/v1/name/{pythagorean,chaldean,abjad,hebrew,vedic}` | Per-system name |
| 10 | POST | `/v1/name/full` | All systems + core numbers |
| 11 | POST | `/v1/gematria` | Alias of full (needs birthDate) |
| 12 | POST | `/chat` | AI coach (legacy FE path) |
| 13 | POST | `/v1/chat` | Canonical AI coach |
| 14 | GET | `/chat/sessions` | List in-memory sessions |
| 15 | GET | `/chat/history/:id` | Load session |
| 16 | DELETE | `/chat/session/:id` | Drop session |
| — | GET | `/health` | Process only — not product |

**Missing today (needed for this goal):** admin auth, prompt CRUD, model allowlist, chat `model` + structured natal context injection, nao SPA + API routes.

### Frontend gap (obsession)

| Page | Should use | Today |
|------|------------|--------|
| Chart | calculate swiss/moshier | **OK** via adapter |
| Numerology / Gematria / Dashboard numbers | name/full (+ optional per-system) | **OK** / partial |
| Chat | chat + context + model | Works bare message; **no** natal snapshot context; **no** model pick |
| Share (chart body) | calculate | OK for data; image/share 404 |
| Settings | local profile only | OK until real auth |
| Transits, Friend, Compatibility, Horoscope, PublicChart, Admin (on main site), Payments, Subscribe | — | **Dead 404** — must strip or stub honestly |

---

## Solution mindmap (logic + navigation + API + utility)

```
                         ┌─────────────────────────────┐
                         │     NatalTruth Product       │
                         └─────────────┬───────────────┘
           ┌───────────────────────────┼───────────────────────────┐
           ▼                           ▼                           ▼
   nataltruth.com SPA          api.nataltruth.com            nao.nataltruth.com
   (user product)              (single Node backend)         (admin product UI)
           │                           │                           │
   ┌───────┴────────┐         ┌────────┴────────┐         ┌───────┴────────┐
   │ Navigation     │         │ API domains     │         │ Admin UI        │
   │ / → landing    │         │ A. Calc engine  │         │ / login         │
   │ /auth profile  │         │ B. Name systems │         │ / prompts       │
   │ /dashboard     │         │ C. AI chat      │         │ / models        │
   │ /chart         │────────►│ D. Admin config │◄────────│ / ai-context    │
   │ /numerology    │         │ E. Health ops   │         │ / inventory     │
   │ /gematria      │         └─────────────────┘         └────────────────┘
   │ /chat + model  │
   │ /settings      │
   │ /pricing (info)│
   └────────────────┘

User journey (working spine)
  Register local profile (name, date, time, place, lat, lon)
       │
       ├─► Chart ──► POST /v1/calculate/swiss|moshier
       │                 returns planets, houses, aspects, patterns, name
       ├─► Name  ──► POST /v1/name/full (+ optional single systems)
       └─► Chat  ──► POST /chat { message, session_id, model?, context packs }
                          │
                          ▼
                    OpenRouter (chosen model)
                    System prompt (from admin store)
                    + injected natal packets (see AI access)
```

### Utility of each API to the frontend + AI

| API group | Frontend use | AI use (“wish information”) |
|-----------|--------------|------------------------------|
| **Swiss calc** | Chart page, Share data, Chat “use my chart” | Full positions, houses, aspects, patterns, engine meta |
| **Moshier calc** | Engine toggle; free/quick | Same shape, note backend=moshier |
| **name/full** | Numerology, Gematria, Dashboard | All 5 systems + core numbers |
| **name/{system}** | Gematria tabs / deep dive | Single-system breakdown when prompt asks |
| **name/systems** | Labels in UI | Tell model which systems exist |
| **gematria** | Alias | Prefer name/full |
| **chat** | Coach UI | Orchestrator; pulls other APIs server-side into context |
| **sessions** | Sidebar history | Continuity only (not natal truth) |

**Principle:** AI must **not invent** positions. Server builds a **context pack** from real calc/name responses before calling OpenRouter.

---

## AI access model (what the model may see)

Admin configures **which packs** are allowed (defaults on for coach). Chat request (or server auto-build from local profile payload) attaches:

| Pack ID | Source API | Contents (truth) | Default |
|---------|------------|------------------|---------|
| `profile_input` | Client body | fullName, birthDate, birthTime, place, lat/lon (no password) | ON |
| `chart_swiss` | calculate/swiss | planetaryPositions, houseCusps, aspects, patterns, ephemeris | ON when lat/lon present |
| `chart_moshier` | calculate/moshier | same shape | OFF (opt-in compare) |
| `name_full` | name/full | 5 systems + coreNumbers | ON when name present |
| `name_single` | name/{id} | one system letters/total | OFF unless UI selects |
| `session_history` | in-memory chat | prior turns | ON (truncated) |
| `admin_notes` | admin config | optional founder notes string | OFF |

**Never sent to AI:** API keys, admin password, payment data (none yet), other users’ data.

**Server-side assembly (preferred):**  
`POST /chat` accepts optional `birth` + flags `include: { chart, name, engine }` → server runs calc/name → compresses to JSON/text block → appends as system message. Frontend does not paste raw secrets; only birth profile fields.

---

## Model choice

| Layer | Behavior |
|-------|----------|
| Default | `qwen/qwen3.5-122b-a10b` (current) |
| Allowlist | Admin-editable list (seed: Qwen3.5-122B, Qwen3-32B, Qwen3-8B, optional GPT-4o-mini) |
| User UI | Chat dropdown **only among allowlisted** models |
| Request | `POST /chat` body: `{ message, session_id?, model?, birth?, include? }` |
| Persistence | Chosen model stored per session; admin default in config store |

---

## Editable prompts (Admin panel)

Store (file-backed on cPanel, no Postgres required for v1):

Path: `/home/nchobahc/nataltruth-app/data/ai-config.json` (mode 600)

```json
{
  "version": 1,
  "defaultModel": "qwen/qwen3.5-122b-a10b",
  "allowedModels": ["qwen/qwen3.5-122b-a10b", "qwen/qwen3-32b", "qwen/qwen3-8b"],
  "systemPrompt": "You are NatalTruth...",
  "contextInstructions": "When natal JSON is provided, cite only those numbers...",
  "includeDefaults": { "chart": true, "name": true, "engine": "swiss" },
  "updatedAt": "ISO"
}
```

Admin API (Bearer admin token from env `ADMIN_TOKEN` / seed):

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/admin/login` | Returns token if password matches `ADMIN_PASSWORD` |
| GET | `/admin/ai-config` | Read prompts + models + include defaults |
| PUT | `/admin/ai-config` | Update prompts, allowlist, defaults |
| GET | `/admin/inventory` | Lists live routes + which FE pages bind them |
| GET | `/admin/sessions` | Optional: count active chat sessions |

**nao.nataltruth.com:** dedicated admin SPA (small React or static+JS) that **only** talks to `https://api.nataltruth.com/admin/*` + inventory. User insisted **backend is the same API** — correct: one Node app; nao is the admin frontend shell.

---

## Full linking: frontend 100% working strategy

### Phase 1 — Adapter is the only HTTP client for product paths

Expand `frontend/src/lib/nataltruth.js`:

- Keep: `calculateChart`, `nameFull`, `nameSystem`, chat helpers  
- Add: `listNameSystems`, `buildChatContext` (client hint), `chatMessage({ message, sessionId, model, birth, include })`  
- Add: `getAiPublicConfig()` → `GET /v1/ai/config` (public: allowed models + default only — **not** full system prompt)

### Phase 2 — Wire every **kept** page exclusively through adapter

| Page | Changes |
|------|---------|
| ChatPage | Use adapter; pass `loadLocalProfile()` as birth; model select; no dead Bearer requirement |
| Chart / Numerology / Gematria / Dashboard / Share (data) | Already / finish via adapter |
| Settings | Profile fields include lat/lon/utc; engine preference |

### Phase 3 — Demote dead product surfaces (honest UI)

Do **not** leave 404 spam:

- Transits, Friend, Compatibility, HoroscopeToday, Zodiac API calls, PublicChart, BuyReading, payments, Landing `/subscribe` → show **“Not available on NatalTruth API yet”** or remove nav entries  
- Main-site `/admin` → redirect to `https://nao.nataltruth.com`  
- `AdminRoute` on main SPA no longer hosts full admin

### Phase 4 — nao admin app

- Scaffold `admin/` (or `frontend-admin/`) minimal Vite/React or plain HTML+JS  
- Publish to `/home/nchobahc/nao.nataltruth.com`  
- Pages: Login, System prompt editor, Context instructions, Model allowlist + default, Context pack toggles, API inventory mindmap view (read-only)

---

## Backend implementation sketch

```
server/src/
  index.ts          # routes
  openrouter.ts     # chatCompletion(model, messages)
  aiConfig.ts       # load/save data/ai-config.json
  adminAuth.ts      # token check
  contextPack.ts    # birth → calc + name → compact text/JSON for system msg
```

Chat pipeline:

1. Load ai-config (prompt, default model, allowlist)  
2. Resolve model = request.model if in allowlist else default  
3. If include.chart/name → run engine functions (same as routes, no HTTP loop)  
4. Build system messages: [systemPrompt, contextInstructions, natal packs]  
5. OpenRouter completion  
6. Return `{ ok, response, session_id, model, packsUsed: [...] }`

CORS: add no change for nataltruth.com; nao.nataltruth.com already in list.

---

## Navigation (final product map)

### Public (nataltruth.com)

| Path | Purpose | APIs |
|------|---------|------|
| `/` | Landing | none (or name/full demo optional) |
| `/auth` | Local profile | none |
| `/pricing` | Static tiers | none |
| `/dashboard` | Hub | name/full |
| `/chart` | Chart | calculate/* |
| `/numerology` | Numbers | name/full |
| `/gematria` | Systems | name/full + name/{id} |
| `/chat` | AI coach | chat + server packs |
| `/settings` | Profile + engine + preferred model | local + GET /v1/ai/config |
| `/share` | Share **data** view | calculate only |

### Admin (nao.nataltruth.com)

| Path | Purpose | APIs |
|------|---------|------|
| `/` | Login | POST /admin/login |
| `/prompts` | Edit system + context instructions | GET/PUT /admin/ai-config |
| `/models` | Allowlist + default | same |
| `/context` | Default include packs | same |
| `/inventory` | Mindmap of routes ↔ pages | GET /admin/inventory |

---

## Implementation order (PRs / steps)

1. **Server: aiConfig + admin auth + GET/PUT admin + public GET /v1/ai/config**  
2. **Server: contextPack + chat model + include** (drive real calculateFullChart / name profile)  
3. **Adapter + ChatPage + Settings model/engine** — full link spine  
4. **Demote/strip dead FE calls** — 100% no silent 404 on primary nav  
5. **nao admin SPA** + publish to cPanel  
6. **Docs:** update WIRED.md, ARCHITECTURE mindmap, nataltruth.md contract  
7. **Verify live:** chart, name/full, chat with packs, admin prompt edit round-trip, model switch  

---

## Non-goals (this goal)

- Postgres user DB / real Stripe  
- Phase-5 synastry/transits product APIs  
- PDF report composer  
- Multi-tenant admin RBAC  

---

## Risks

| Risk | Mitigation |
|------|------------|
| File store race on ai-config | Single-writer; atomic write rename |
| Chat packs = heavy swiss calc latency | Cache last chart per session key; optional moshier for speed |
| Admin token in SPA | Short-lived token memory only; HTTPS only; never commit password |
| Main-site AdminPage confusion | Redirect to nao |
| OpenRouter model not in allowlist | Reject 400 with list |

---

## Acceptance criteria

1. Primary nav paths (dashboard, chart, numerology, gematria, chat, settings) **never** call non-existent API routes.  
2. Chat can send **real** chart+name context (server-built) and returns `packsUsed`.  
3. User can pick model from **admin allowlist**; default is Qwen3.5-122B.  
4. Admin on **nao.nataltruth.com** can edit system prompt + context instructions; next chat uses new prompt.  
5. `GET /admin/inventory` (or docs page) describes full mindmap: navigation ↔ API ↔ utility.  
6. Live smoke: swiss calc, name/full, chat+model, admin GET/PUT config.  

---

## Key files to touch

| File | Action |
|------|--------|
| `server/src/aiConfig.ts` | **New** |
| `server/src/contextPack.ts` | **New** |
| `server/src/adminAuth.ts` | **New** |
| `server/src/openrouter.ts` | Model param; prompt from config |
| `server/src/index.ts` | Admin + enhanced chat + public ai config |
| `frontend/src/lib/nataltruth.js` | Full adapter |
| `frontend/src/pages/ChatPage.jsx` | Model + context |
| `frontend/src/App.js` / nav | Drop dead routes or stub |
| `admin/` (new) | nao SPA |
| `docs/ARCHITECTURE.md`, `frontend/WIRED.md` | Mindmap + map |

---

## Verify plan

1. `pnpm build` API; deploy nataltruth-app; set ADMIN_PASSWORD in .env  
2. curl admin login → put prompt → chat sees new behavior  
3. curl chat with birth include chart+name → packsUsed non-empty  
4. curl chat model=qwen/qwen3-8b (if allowlisted) → model echo  
5. Publish FE + nao; browser path chart + chat + nao prompts  
6. Grep FE for `\${API}/` dead paths on primary nav pages → zero  
