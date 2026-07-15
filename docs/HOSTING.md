# NatalTruth hosting map (cPanel)

| Host | Role | Docroot |
|------|------|---------|
| **nataltruth.com** | Public site / future CMS + app shell | `/home/nchobahc/nataltruth.com` |
| **api.nataltruth.com** | Calculation API (Node) | `/home/nchobahc/api.nataltruth.com` |
| **nao.nataltruth.com** | Admin dashboard | `/home/nchobahc/nao.nataltruth.com` |

IP: `69.72.248.210` (account `nchobahc`)

## Order of work (from product notes)

1. **API calculation** live + GitHub  
2. Document how to call it  
3. User journey + front **after** API is solid  

## Admin seed (local only)

See `.secrets/admin.seed.env` on the Mac (mode 600).  
**Never** commit or put admin passwords in public HTML.

## Node app (API) — LIVE

CloudLinux Node selector app:

| Field | Value |
|-------|--------|
| App root | `/home/nchobahc/nataltruth-app` |
| Domain | `api.nataltruth.com` |
| Node | 22 (`nodevenv/nataltruth-app/22`) |
| Startup | `app.js` → `dist/server/src/index.js` |
| Env | `NODE_ENV=production`, `PORT=3000`, `OPENROUTER_API_KEY` (or `OPENROUTER`), `OPENROUTER_MODEL=qwen/qwen3.5-122b-a10b` |
| `.env` | `/home/nchobahc/nataltruth-app/.env` mode 600 — never commit |

**OpenRouter:** GitHub Environment `Openrouter` secret name `OPENROUTER`. Prefer that key on the server. Workflow: `.github/workflows/sync-openrouter-to-cpanel.yml`.

### Public SPA

| Field | Value |
|-------|--------|
| Docroot | `/home/nchobahc/nataltruth.com` |
| Source | `frontend/build` after `cd frontend && npm run build` |
| Publish | `rsync -avz --delete frontend/build/ cpanel:nataltruth.com/` |
| SPA | `.htaccess` rewrite → `index.html` |

### Rebuild API after code change

```bash
# from Mac: rsync dist/ engine/ server/ then
ssh cpanel
export PATH="/home/nchobahc/nodevenv/nataltruth-app/22/bin:$PATH"
cd ~/nataltruth-app
npm install --omit=dev
cloudlinux-selector restart --json --interpreter nodejs --app-root /home/nchobahc/nataltruth-app
```

### Verify (product paths — not health-as-goal)

```bash
curl -sS -X POST https://api.nataltruth.com/v1/calculate/swiss -H 'content-type: application/json' -d '{...}'
curl -sS -X POST https://api.nataltruth.com/v1/name/full -H 'content-type: application/json' -d '{"fullName":"Jane","birthDate":"1990-06-15"}'
curl -sS -X POST https://api.nataltruth.com/chat -H 'content-type: application/json' -d '{"message":"Hello"}'
# Process liveness only (hosting): GET /health
```

### SSL

AutoSSL certs exist for `api` / `nao`. If browser warns, re-run AutoSSL for `nataltruth.com` in cPanel.
