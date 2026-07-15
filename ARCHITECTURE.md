# NatalTruth — Architecture (honest)

Founder-facing technical map. Not a completion claim.

## Hosts

| Host | Process | Path |
|------|---------|------|
| api.nataltruth.com | Node 22 Passenger | `/home/nchobahc/nataltruth-app` |
| nataltruth.com | Static SPA | `/home/nchobahc/nataltruth.com` |
| nao.nataltruth.com | Placeholder | `/home/nchobahc/nao.nataltruth.com` |

## Runtime split

```
frontend/     → nataltruth.com (scratch UI)
server/       → Express on api.nataltruth.com
engine/       → pure calc (no HTTP)
```

## Live calc pipeline

```
Birth input → birthMoment (offset/tz) → ephemeris (swiss|moshier)
           → patterns → name systems → ChartSnapshot / name profile
```

**Swiss** = SEFLG_SWIEPH (Ultra report path, when reports exist).  
**Moshier** = SEFLG_MOSEPH (available API; tier use TBD).

## What is intentionally missing

Auth DB, payments, deep report generator, CMS, real admin, most “social product” APIs.

See **README.md** (inventory) and **ROADMAP.md** (steps).

## Docs

- `docs/nataltruth.md` — API contract  
- `docs/HOSTING.md` — cPanel ops  
- `frontend/WIRED.md` — which UI calls which API  
