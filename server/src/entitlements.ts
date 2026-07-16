/**
 * Email → plan entitlements (file-backed until billing exists).
 * Ultra: swiss report path intent + full calc access flag for FE.
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  renameSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export type PlanId = "free" | "monthly" | "premium" | "ultra";

export type Entitlement = {
  email: string;
  plan: PlanId;
  engineDefault: "swiss" | "moshier";
  notes?: string;
  updatedAt: string;
};

type Store = {
  version: 1;
  byEmail: Record<string, Entitlement>;
};

function dataPath(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // dist/server/src → ../../../data  |  server/src → ../../data
  const candidates = [
    join(here, "../../../data/entitlements.json"),
    join(here, "../../data/entitlements.json"),
    join(process.cwd(), "data/entitlements.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p) || existsSync(dirname(p))) return p;
  }
  return candidates[0];
}

function normalizeEmail(email: string): string {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function defaultStore(): Store {
  const now = new Date().toISOString();
  return {
    version: 1,
    byEmail: {
      // Founder seed — Ultra
      "nchobah@gmail.com": {
        email: "nchobah@gmail.com",
        plan: "ultra",
        engineDefault: "swiss",
        notes: "Founder seed Ultra",
        updatedAt: now,
      },
    },
  };
}

function load(): Store {
  const path = dataPath();
  try {
    if (!existsSync(path)) {
      const s = defaultStore();
      save(s);
      return s;
    }
    const raw = JSON.parse(readFileSync(path, "utf8")) as Store;
    if (!raw.byEmail) raw.byEmail = {};
    // Ensure founder ultra always present
    const founder = "nchobah@gmail.com";
    if (!raw.byEmail[founder] || raw.byEmail[founder].plan !== "ultra") {
      raw.byEmail[founder] = {
        email: founder,
        plan: "ultra",
        engineDefault: "swiss",
        notes: "Founder seed Ultra",
        updatedAt: new Date().toISOString(),
      };
      save(raw);
    }
    return raw;
  } catch {
    return defaultStore();
  }
}

function save(store: Store): void {
  const path = dataPath();
  mkdirSync(dirname(path), { recursive: true });
  const tmp = path + ".tmp";
  const body = JSON.stringify(store, null, 2);
  writeFileSync(tmp, body, { mode: 0o600 });
  renameSync(tmp, path);
}

export function getEntitlement(email: string): Entitlement {
  const key = normalizeEmail(email);
  if (!key) {
    return {
      email: "",
      plan: "free",
      engineDefault: "moshier",
      updatedAt: new Date().toISOString(),
    };
  }
  const store = load();
  if (store.byEmail[key]) return store.byEmail[key];
  return {
    email: key,
    plan: "free",
    engineDefault: "moshier",
    updatedAt: new Date().toISOString(),
  };
}

export function setEntitlement(
  email: string,
  plan: PlanId,
  notes?: string
): Entitlement {
  const key = normalizeEmail(email);
  if (!key) throw new Error("email required");
  const store = load();
  const row: Entitlement = {
    email: key,
    plan,
    engineDefault: plan === "ultra" ? "swiss" : "moshier",
    notes,
    updatedAt: new Date().toISOString(),
  };
  store.byEmail[key] = row;
  save(store);
  return row;
}

export function listEntitlements(): Entitlement[] {
  return Object.values(load().byEmail).sort((a, b) =>
    a.email.localeCompare(b.email)
  );
}
