# NatalTruth

Clean natal calculation product.

| Host | Role |
|------|------|
| https://nataltruth.com | Public |
| https://api.nataltruth.com | Calculation API |
| https://nao.nataltruth.com | Admin |

## Validated now

**Full chart API** — always: ephemeris + patterns + gematria (full name).

| Engine | Endpoint |
|--------|----------|
| Swiss Ephemeris | `POST /v1/calculate/swiss` |
| Moshier | `POST /v1/calculate/moshier` |

Canonical how-to + JSON schemas: **[docs/nataltruth.md](./docs/nataltruth.md)**

```bash
curl -k https://api.nataltruth.com/health
```

## Local

```bash
pnpm install
pnpm build
pnpm start:api
```

## Docs

- [docs/nataltruth.md](./docs/nataltruth.md) — schemas & usage  
- [ARCHITECTURE.md](./ARCHITECTURE.md)  
- [docs/HOSTING.md](./docs/HOSTING.md)  
