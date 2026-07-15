# NatalTruth — validated API (use this)

**Base URL:** `https://api.nataltruth.com`  
**Version:** 0.3.0  
**Status:** Chart + multi-system name APIs validated (stress 10× each, 100% pass). Front/CMS later.

Nothing else is implied. Only endpoints listed here are live.  
Stress report: [STRESS_TEST_REPORT.md](./STRESS_TEST_REPORT.md)

---

## Chart engines (both required)

| Engine | Route | Flag | Notes |
|--------|-------|------|--------|
| **Swiss Ephemeris** | `POST /v1/calculate/swiss` | SEFLG_SWIEPH \| SPEED | High precision. Default for premium. |
| **Moshier** | `POST /v1/calculate/moshier` | SEFLG_MOSEPH \| SPEED | Semi-analytic; no external ephemeris files. |

Generic: `POST /v1/calculate` + `"engineMode": "swiss" | "moshier"` (default **swiss**).

### Always returned on calculate

| Block | JSON field | Contents |
|-------|------------|----------|
| Planetary positions | `planetaryPositions` | Sun→Pluto, Node, Chiron, PoF, South Node, Lilith, … |
| House cusps | `houseCusps` | 12 houses (Placidus default) |
| Aspects | `aspects` | Full aspect list with orbs |
| Patterns | `patterns` | Grand Trine, T-Square, Yod, Stellium, Grand Cross, … |
| Name (all systems) | `name` | Full multi-system name profile |

No lite mode. No skipped blocks.

---

## Letter-to-number systems (all required)

| System | Range | Used for | Route |
|--------|-------|----------|--------|
| **Pythagorean** | 1–9 | English + French (Latin; accents stripped) | `POST /v1/name/pythagorean` |
| **Chaldean** | 1–8 | Indian + Arabic (Latin transliteration); no letter 9 | `POST /v1/name/chaldean` |
| **Arabic Abjad** | 1–1000 | Arabic script names | `POST /v1/name/abjad` |
| **Hebrew Gematria** | 1–400 | Hebrew script — Mispar Hechrechi | `POST /v1/name/hebrew` |
| **Indian (Vedic)** | 1–8 | Indian names — Chaldean practice on Latin | `POST /v1/name/vedic` |
| **All at once** | — | Full profile + core numbers | `POST /v1/name/full` |
| List systems | — | Metadata | `GET /v1/name/systems` |

### Name request body

```json
{
  "fullName": "string (required)",
  "birthDate": "YYYY-MM-DD (optional; used for life path / core numbers on full)"
}
```

**Truth:** Abjad needs Arabic letters; Hebrew needs Hebrew letters. Latin-only input correctly returns total 0 for those two systems.

---

## JSON Schema — request body

Used by:

- `POST /v1/calculate`
- `POST /v1/calculate/swiss`
- `POST /v1/calculate/moshier`  
  (`engineMode` ignored on the two explicit routes — path fixes the engine)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://nataltruth.com/schema/calculate-request.json",
  "title": "NatalTruthCalculateRequest",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "fullName",
    "birthDate",
    "birthTimeAccuracy",
    "birthPlaceLabel",
    "latitude",
    "longitude"
  ],
  "properties": {
    "fullName": {
      "type": "string",
      "minLength": 1,
      "description": "Full legal name — source for gematria/numerology"
    },
    "birthDate": {
      "type": "string",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$",
      "description": "YYYY-MM-DD"
    },
    "birthTime": {
      "type": ["string", "null"],
      "description": "HH:mm or HH:mm:ss when known"
    },
    "birthTimeAccuracy": {
      "type": "string",
      "enum": ["exact", "approximate", "unknown"]
    },
    "birthPlaceLabel": {
      "type": "string",
      "minLength": 1,
      "description": "Display label e.g. Casablanca, Morocco"
    },
    "latitude": {
      "type": "number",
      "minimum": -90,
      "maximum": 90
    },
    "longitude": {
      "type": "number",
      "minimum": -180,
      "maximum": 180
    },
    "timeZoneId": {
      "type": ["string", "null"],
      "description": "IANA timezone id when known"
    },
    "utcOffset": {
      "type": ["string", "null"],
      "description": "Offset at birth e.g. +01:00 (strongly recommended for precision)"
    },
    "engineMode": {
      "type": "string",
      "enum": ["swiss", "moshier"],
      "default": "swiss",
      "description": "Only used on POST /v1/calculate"
    },
    "houseSystem": {
      "type": "string",
      "description": "Optional house system code (default Placidus)"
    }
  }
}
```

### Example — Swiss

```bash
curl -k -X POST https://api.nataltruth.com/v1/calculate/swiss \
  -H 'content-type: application/json' \
  -d '{
    "fullName": "Jane Example",
    "birthDate": "1990-06-15",
    "birthTime": "14:30",
    "birthTimeAccuracy": "exact",
    "birthPlaceLabel": "Casablanca, Morocco",
    "latitude": 33.5731,
    "longitude": -7.5898,
    "utcOffset": "+01:00"
  }'
```

### Example — Moshier

```bash
curl -k -X POST https://api.nataltruth.com/v1/calculate/moshier \
  -H 'content-type: application/json' \
  -d '{
    "fullName": "Jane Example",
    "birthDate": "1990-06-15",
    "birthTime": "14:30",
    "birthTimeAccuracy": "exact",
    "birthPlaceLabel": "Casablanca, Morocco",
    "latitude": 33.5731,
    "longitude": -7.5898,
    "utcOffset": "+01:00"
  }'
```

### Example — generic with mode

```bash
curl -k -X POST https://api.nataltruth.com/v1/calculate \
  -H 'content-type: application/json' \
  -d '{
    "engineMode": "moshier",
    "fullName": "Jane Example",
    "birthDate": "1990-06-15",
    "birthTimeAccuracy": "unknown",
    "birthPlaceLabel": "Casablanca, Morocco",
    "latitude": 33.5731,
    "longitude": -7.5898,
    "utcOffset": "+01:00"
  }'
```

If `birthTimeAccuracy` is `unknown`, local **12:00** is used and flagged in `moment.notes`.

---

## JSON Schema — success response

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://nataltruth.com/schema/calculate-response.json",
  "title": "NatalTruthCalculateResponse",
  "type": "object",
  "required": ["ok", "snapshot"],
  "properties": {
    "ok": { "const": true },
    "snapshot": {
      "type": "object",
      "required": [
        "version",
        "engineMode",
        "ephemeris",
        "input",
        "moment",
        "planets",
        "houses",
        "aspects",
        "patterns",
        "numerology",
        "computedAt"
      ],
      "properties": {
        "version": { "const": 1 },
        "engineMode": { "enum": ["swiss", "moshier"] },
        "ephemeris": {
          "type": "object",
          "properties": {
            "backend": { "enum": ["swiss", "moshier"] },
            "flag": { "type": "integer" },
            "description": { "type": "string" }
          }
        },
        "input": { "type": "object" },
        "moment": {
          "type": "object",
          "properties": {
            "utcIso": { "type": "string" },
            "julianDay": { "type": "number" },
            "notes": { "type": "array", "items": { "type": "string" } }
          }
        },
        "planets": { "type": "array" },
        "houses": { "type": "array" },
        "aspects": { "type": "array" },
        "patterns": { "type": "array" },
        "numerology": {
          "type": "object",
          "properties": {
            "englishGematria": { "type": "object" },
            "hebrewGematria": { "type": "object" },
            "numerology": { "type": "object" },
            "letterBreakdown": { "type": "array" }
          }
        },
        "computedAt": { "type": "string", "format": "date-time" }
      }
    }
  }
}
```

Error shape:

```json
{ "ok": false, "error": "human-readable message" }
```

---

## Other validated endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/health` | Liveness + engine list |
| `POST` | `/v1/gematria` | Name + birthDate only (utility). Product flows should use full calculate. |

### Gematria body

```json
{
  "fullName": "Jane Example",
  "birthDate": "1990-06-15"
}
```

---

## Patterns (what “full pattern detection” means)

Returned on every calculate. Multi-planet natal configurations, e.g.:

| Type | Idea |
|------|------|
| grand_trine | Three ~120° links — ease/flow |
| t_square | Opposition + squares — drive via tension |
| yod | Quincunx “finger” — adjustment |
| stellium | Cluster of planets — concentration |
| grand_cross | Four-way tension structure |

Each item includes type, planets, strength, description.

---

## Hosts

| Host | Role | Status |
|------|------|--------|
| `api.nataltruth.com` | Calc API | Live |
| `nataltruth.com` | Public shell | Placeholder |
| `nao.nataltruth.com` | Admin | Placeholder |

---

## Rebuild API (cPanel)

```bash
# from Mac: rsync code then on host
export PATH="/home/nchobahc/nodevenv/nataltruth-app/22/bin:$PATH"
cd ~/nataltruth-app
npm install --include=dev
./node_modules/.bin/tsc --noEmit false --outDir dist
cloudlinux-selector restart --json --interpreter nodejs --app-root /home/nchobahc/nataltruth-app
```

---

*This file is the contract for what is validated. Do not invent endpoints that are not listed.*
