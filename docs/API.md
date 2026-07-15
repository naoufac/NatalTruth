# NatalTruth API (short)

Canonical usage + JSON schemas: **[nataltruth.md](./nataltruth.md)**

## Quick map

| Engine | Call |
|--------|------|
| Swiss Ephemeris | `POST /v1/calculate/swiss` |
| Moshier | `POST /v1/calculate/moshier` |
| Either via body | `POST /v1/calculate` + `"engineMode":"swiss"\|"moshier"` |

Base: `https://api.nataltruth.com`  
Health: `GET /health`

Always returned: ephemeris · patterns · gematria/numerology (full name).
