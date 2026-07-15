# NatalTruth — Architecture (clean)

**Brand:** NatalTruth  
**Domain:** nataltruth.com  
**API:** api.nataltruth.com  
**Admin:** nao.nataltruth.com  
**Repo:** https://github.com/naoufac/NatalTruth  

**Rule:** only validated steps land in this tree. No legacy brand names. No dual-auth archaeology.

---

## Locked product scope

| Capability | Status |
|------------|--------|
| Swiss Ephemeris natal calculation | Required — `POST /v1/calculate/swiss` |
| Moshier natal calculation | Required — `POST /v1/calculate/moshier` |
| Full pattern detection | Required — always on both engines |
| Gematria + numerology from full legal name | Required — always |
| City of birth (lat/lon + offset/tz) | Required |
| Birth time when known | Required (`exact` / `approximate` / `unknown`) |
| Full AI report from complete snapshot | Planned (not validated yet) |
| CMS public nav | Planned (not validated yet) |
| Clean single DB path | Planned with app (not validated yet) |

API usage contract: **`docs/nataltruth.md`**

---

## Validated now

```
Client
  → https://api.nataltruth.com
       GET  /health
       POST /v1/calculate/swiss
       POST /v1/calculate/moshier
       POST /v1/calculate   (engineMode)
       POST /v1/gematria

engine/
  birthMoment → ephemeris (swiss|moshier) → patterns → gematria
  → ChartSnapshot (identical shape for both engines)
```

### Ephemeris backends

| Mode | Implementation | Use |
|------|----------------|-----|
| `swiss` | SEFLG_SWIEPH \| SPEED via swisseph-wasm | Premium / high precision |
| `moshier` | SEFLG_MOSEPH \| SPEED via swisseph-wasm | Self-contained semi-analytic |

---

## Host map (cPanel)

| Host | Docroot / app | Role |
|------|---------------|------|
| nataltruth.com | `/home/nchobahc/nataltruth.com` | Public shell |
| api.nataltruth.com | app `/home/nchobahc/nataltruth-app` | Calc API (Node 22 Passenger) |
| nao.nataltruth.com | `/home/nchobahc/nao.nataltruth.com` | Admin (placeholder) |

---

## Repo layout (current)

```
NatalTruth/
├── engine/src/          # pure calc
│   ├── birthMoment.ts
│   ├── ephemeris.ts     # swiss + moshier flags
│   ├── patterns.ts
│   ├── gematria.ts
│   ├── calculate.ts
│   └── index.ts
├── server/src/index.ts  # Express API
├── app.js               # Passenger entry
├── docs/
│   ├── nataltruth.md    # schemas + how to use (canonical)
│   ├── API.md
│   └── HOSTING.md
├── ARCHITECTURE.md
└── README.md
```

---

## Build order (strict)

1. ~~Calc API (Swiss + Moshier)~~ **validated live**  
2. Keep docs/GitHub clean  
3. Auth + DB + reports — only when started as a new step  
4. CMS + public app — after API/auth  
5. Admin `nao` — after auth  

---

## Success for this phase

- Both engines callable via dedicated routes  
- Full snapshot always (no lite)  
- Zero non-NatalTruth brand noise in this repo  
- Deployed on `api.nataltruth.com`  
