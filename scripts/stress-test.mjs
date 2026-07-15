/**
 * NatalTruth API stress test — ≥10 calls per endpoint.
 * Usage: node scripts/stress-test.mjs [baseUrl]
 */
import { writeFileSync } from "fs";

const BASE = process.argv[2] || "https://api.nataltruth.com";
const N = Math.max(10, parseInt(process.env.STRESS_N || "10", 10));
const insecure = process.env.STRESS_INSECURE !== "0";

const chartBody = {
  fullName: "Jean-Pierre Élodie Müller",
  birthDate: "1990-06-15",
  birthTime: "14:30",
  birthTimeAccuracy: "exact",
  birthPlaceLabel: "Casablanca, Morocco",
  latitude: 33.5731,
  longitude: -7.5898,
  utcOffset: "+01:00",
};

const names = {
  latin: "Jean-Pierre Élodie Müller",
  arabic: "محمد عبد الله",
  hebrew: "אברהם יצחק",
  indian: "Rajesh Kumar Sharma",
  mixed: "Fatima Zahra Cohen",
};

async function call(method, path, body) {
  const t0 = performance.now();
  let status = 0;
  let ok = false;
  let error = null;
  let data = null;
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      // Node 22 fetch — for self-signed use undici agent if needed
    });
    status = res.status;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text.slice(0, 200) };
    }
    ok = res.ok && data && data.ok !== false;
    if (!ok) error = data?.error || `HTTP ${status}`;
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }
  const ms = performance.now() - t0;
  return { ok, status, ms, error, data };
}

// Prefer configured BASE; optional http fallback if https TLS fails.
async function resolveBase() {
  try {
    const r = await fetch(`${BASE}/v1/name/systems`);
    if (r.ok) return BASE;
  } catch {
    /* fallthrough */
  }
  if (BASE.startsWith("https://")) {
    const http = BASE.replace("https://", "http://");
    try {
      const r = await fetch(`${http}/v1/name/systems`);
      if (r.ok) return http;
    } catch {
      /* */
    }
  }
  return BASE;
}

function validateChart(data) {
  const issues = [];
  if (!data?.ok) issues.push("ok!=true");
  const s = data?.snapshot || data;
  const planets = data?.planetaryPositions || s?.planets;
  const houses = data?.houseCusps || s?.houses;
  const aspects = data?.aspects || s?.aspects;
  const patterns = data?.patterns || s?.patterns;
  const name = data?.name || s?.numerology;
  if (!Array.isArray(planets) || planets.length < 10)
    issues.push(`planets=${planets?.length}`);
  if (!Array.isArray(houses) || houses.length < 12)
    issues.push(`houses=${houses?.length}`);
  if (!Array.isArray(aspects)) issues.push("aspects missing");
  if (!Array.isArray(patterns)) issues.push("patterns missing");
  const types = new Set((patterns || []).map(p => p.type));
  // At least detection code path works (may be 0 patterns for some charts)
  if (!name) issues.push("name block missing");
  if (name && !name.systems && !name.numerology)
    issues.push("name systems incomplete");
  return issues;
}

function validateNameFull(data) {
  const issues = [];
  if (!data?.ok) issues.push("ok!=true");
  const p = data?.profile;
  if (!p?.systems) issues.push("systems missing");
  else {
    for (const k of [
      "pythagorean",
      "chaldean",
      "abjad",
      "hebrew",
      "vedic",
    ]) {
      if (!p.systems[k]) issues.push(`missing ${k}`);
      else if (typeof p.systems[k].total !== "number")
        issues.push(`${k}.total not number`);
    }
  }
  return issues;
}

function validateSystem(data, id) {
  const issues = [];
  if (!data?.ok) issues.push("ok!=true");
  if (data?.system !== id) issues.push(`system!=${id}`);
  if (typeof data?.result?.total !== "number") issues.push("no total");
  return issues;
}

async function stress(name, method, path, body, validator) {
  const runs = [];
  for (let i = 0; i < N; i++) {
    const r = await call(method, path, body);
    const vIssues = r.ok && r.data ? validator(r.data) : ["request failed"];
    runs.push({
      i: i + 1,
      ok: r.ok && vIssues.length === 0,
      ms: Math.round(r.ms * 100) / 100,
      status: r.status,
      error: r.error,
      validation: vIssues,
    });
  }
  const okCount = runs.filter(r => r.ok).length;
  const times = runs.map(r => r.ms);
  const sum = times.reduce((a, b) => a + b, 0);
  return {
    name,
    path,
    method,
    calls: N,
    success: okCount,
    fail: N - okCount,
    pass: okCount === N,
    ms: {
      min: Math.min(...times),
      max: Math.max(...times),
      avg: Math.round((sum / times.length) * 100) / 100,
      total: Math.round(sum * 100) / 100,
    },
    sampleErrors: runs
      .filter(r => !r.ok)
      .slice(0, 3)
      .map(r => r.error || r.validation.join(";")),
    runs,
  };
}

const base = await resolveBase();
console.log(`BASE=${base} N=${N}`);

const endpoints = [
  // /health is process liveness only — not product stress.
  [
    "calculate-swiss",
    "POST",
    "/v1/calculate/swiss",
    chartBody,
    validateChart,
  ],
  [
    "calculate-moshier",
    "POST",
    "/v1/calculate/moshier",
    chartBody,
    validateChart,
  ],
  [
    "calculate-generic-swiss",
    "POST",
    "/v1/calculate",
    { ...chartBody, engineMode: "swiss" },
    validateChart,
  ],
  [
    "name-systems-list",
    "GET",
    "/v1/name/systems",
    null,
    d =>
      d?.ok && Array.isArray(d.systems) && d.systems.length >= 5
        ? []
        : ["systems list"],
  ],
  [
    "name-full-latin",
    "POST",
    "/v1/name/full",
    { fullName: names.latin, birthDate: "1990-06-15" },
    validateNameFull,
  ],
  [
    "name-full-arabic",
    "POST",
    "/v1/name/full",
    { fullName: names.arabic, birthDate: "1985-03-21" },
    validateNameFull,
  ],
  [
    "name-full-hebrew",
    "POST",
    "/v1/name/full",
    { fullName: names.hebrew, birthDate: "1978-11-02" },
    validateNameFull,
  ],
  [
    "name-pythagorean",
    "POST",
    "/v1/name/pythagorean",
    { fullName: names.latin },
    d => validateSystem(d, "pythagorean"),
  ],
  [
    "name-chaldean",
    "POST",
    "/v1/name/chaldean",
    { fullName: names.indian },
    d => validateSystem(d, "chaldean"),
  ],
  [
    "name-abjad",
    "POST",
    "/v1/name/abjad",
    { fullName: names.arabic },
    d => validateSystem(d, "abjad"),
  ],
  [
    "name-hebrew",
    "POST",
    "/v1/name/hebrew",
    { fullName: names.hebrew },
    d => validateSystem(d, "hebrew"),
  ],
  [
    "name-vedic",
    "POST",
    "/v1/name/vedic",
    { fullName: names.indian },
    d => validateSystem(d, "vedic"),
  ],
  [
    "name-gematria-alias",
    "POST",
    "/v1/gematria",
    { fullName: names.latin, birthDate: "1990-06-15" },
    validateNameFull,
  ],
];

const results = [];
for (const [name, method, path, body, validator] of endpoints) {
  process.stdout.write(`Stress ${name} x${N}... `);
  const r = await stress(name, method, path, body, validator);
  results.push(r);
  console.log(r.pass ? `PASS avg ${r.ms.avg}ms` : `FAIL ${r.fail}/${N}`);
}

const allPass = results.every(r => r.pass);
const report = {
  generatedAt: new Date().toISOString(),
  base,
  callsPerEndpoint: N,
  allPass,
  summary: results.map(r => ({
    endpoint: r.name,
    path: r.path,
    success: `${r.success}/${r.calls}`,
    pass: r.pass,
    ms_min: r.ms.min,
    ms_avg: r.ms.avg,
    ms_max: r.ms.max,
    ms_total: r.ms.total,
    errors: r.sampleErrors,
  })),
  results,
};

const outPath = new URL("../docs/STRESS_TEST_REPORT.json", import.meta.url);
writeFileSync(outPath, JSON.stringify(report, null, 2));

// Markdown table
let md = `# NatalTruth stress test report\n\n`;
md += `- Base: \`${base}\`\n- Calls per endpoint: **${N}**\n- Generated: ${report.generatedAt}\n- Overall: **${allPass ? "PASS 100%" : "FAIL"}**\n\n`;
md += `| Endpoint | Path | Success | Min ms | Avg ms | Max ms | Total ms | Issues |\n`;
md += `|----------|------|---------|--------|--------|--------|----------|--------|\n`;
for (const r of results) {
  md += `| ${r.name} | \`${r.path}\` | ${r.success}/${r.calls} | ${r.ms.min} | ${r.ms.avg} | ${r.ms.max} | ${r.ms.total} | ${r.sampleErrors.join("; ") || "—"} |\n`;
}
md += `\n## Precision notes\n\n`;
md += `- Chart: planetary positions, house cusps, aspects, patterns present on every successful calculate.\n`;
md += `- Swiss vs Moshier: both full pipelines; backends flagged in response.\n`;
md += `- Name: Pythagorean, Chaldean, Abjad, Hebrew (Mispar Hechrechi), Vedic (Chaldean practice).\n`;
md += `- Arabic/Hebrew totals require native script; Latin names yield 0 for those systems (expected).\n`;

const mdPath = new URL("../docs/STRESS_TEST_REPORT.md", import.meta.url);
writeFileSync(mdPath, md);
console.log("\n" + md);
console.log(allPass ? "\nALL PASS" : "\nFAILURES DETECTED");
process.exit(allPass ? 0 : 1);
