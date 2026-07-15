# Next step — UX / UI

## Validated backend (do not re-litigate)

- API: `https://api.nataltruth.com`
- Chart: Swiss + Moshier → planets, houses, aspects, patterns + full name block
- Name: Pythagorean, Chaldean, Abjad, Hebrew, Vedic + `/v1/name/full`
- Contract: `docs/nataltruth.md`
- Stress 100% pass reports: `docs/STRESS_TEST_REPORT.md` (+ `.json`; also under `local-only/` copy). Tracked in workspace; push to GitHub when committing.

## Hosts

| Host | Role | Status (observed) |
|------|------|-------------------|
| nataltruth.com | Public UX (this step) | Live static SPA (scratch; may still show legacy branding) |
| api.nataltruth.com | Calc API (done) | Live v0.3.0 |
| nao.nataltruth.com | Admin UX (after public) | Placeholder HTML only |

## Suggested UX scope (when starting)

1. Public landing + nav shell on `nataltruth.com`
2. Create-chart journey → call calculate swiss/moshier
3. Chart + name results UI
4. Later: full AI report, CMS, admin

## Laptop vs GitHub

- Laptop: full tree + secrets (`.secrets/` never commit) + local `dist/`/`node_modules`
- GitHub `naoufac/NatalTruth`: production source only (engine/server/frontend/docs) — audited clean 2026-07-15 (no `node_modules`/`dist`/secrets monorepo noise). Stress reports present on laptop; on GitHub after next push of un-ignored `docs/STRESS_*`.
