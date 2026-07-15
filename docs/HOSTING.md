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
| Env | `NODE_ENV=production`, `PORT=3000` |

### Rebuild after code change

```bash
ssh cpanel
export PATH="/home/nchobahc/nodevenv/nataltruth-app/22/bin:$PATH"
cd ~/nataltruth-app
# rsync new code from Mac first
npm install --include=dev
./node_modules/.bin/tsc --noEmit false --outDir dist
cloudlinux-selector restart --json --interpreter nodejs --app-root /home/nchobahc/nataltruth-app
```

### Verify

```bash
curl -k https://api.nataltruth.com/health
curl -k -X POST https://api.nataltruth.com/v1/calculate -H 'content-type: application/json' -d '{...}'
```

### SSL

AutoSSL certs exist for `api` / `nao`. If browser warns, re-run AutoSSL for `nataltruth.com` in cPanel.
