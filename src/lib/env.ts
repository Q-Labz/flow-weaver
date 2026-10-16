import { env as nodeEnv } from "node:process";

type NetlifyGlobal = {
  env?: {
    get?: (key: string) => string | undefined;
    toObject?: () => Record<string, string | undefined>;
  };
};

function fromNetlify(name: string): string | undefined {
  const netlify = (globalThis as { Netlify?: NetlifyGlobal }).Netlify;
  try {
    const direct = netlify?.env?.get?.(name);
    if (direct) return direct;
    const all = netlify?.env?.toObject?.();
    if (all?.[name]) return all[name];
  } catch {
    return undefined;
  }
  return undefined;
}

function processEnvBags(): Array<Record<string, string | undefined>> {
  const bags: Array<Record<string, string | undefined>> = [];
  if (nodeEnv) bags.push(nodeEnv as Record<string, string | undefined>);
  const globalEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  if (globalEnv && globalEnv !== nodeEnv) bags.push(globalEnv);
  return bags;
}

/** Read a server secret. Avoids Vite inlining `process.env.NAME` at build time. */
export function readEnv(name: string): string | undefined {
  const fromPlatform = fromNetlify(name);
  if (fromPlatform) return fromPlatform;
  for (const env of processEnvBags()) {
    const value = env[name];
    if (value) return value;
  }
  return undefined;
}

export function requireEnv(name: string, hint: string): string {
  const value = readEnv(name);
  if (!value) {
    const keys = new Set<string>();
    for (const env of processEnvBags()) {
      for (const key of Object.keys(env)) {
        if (/DB|DATA|AUTH|NEON|NETLIFY|URL|SECRET|POSTGRES|FLOW/i.test(key)) {
          keys.add(key);
        }
      }
    }
    throw new Error(`${hint} (available: ${[...keys].sort().join(", ") || "none"})`);
  }
  return value;
}

const DATABASE_URL_KEYS = [
  "FLOW_WEAVER_DATABASE_URL",
  "DATABASE_URL",
  "NETLIFY_DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "NEON_DATABASE_URL",
] as const;

export function requireDatabaseUrl(): string {
  for (const name of DATABASE_URL_KEYS) {
    const value = readEnv(name);
    if (value) return value;
  }
  return requireEnv(
    "FLOW_WEAVER_DATABASE_URL",
    "Missing database URL. Set FLOW_WEAVER_DATABASE_URL or DATABASE_URL on the Netlify site.",
  );
}
