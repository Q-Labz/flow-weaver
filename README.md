# Flow Weaver

Node-based automations for developers. Draft on a React Flow canvas, publish immutable versions, and keep workspace data in Neon Postgres.

This is a rebuild of the original Flowforge / Flow Weaver Lovable app. Supabase is replaced with **Neon + Drizzle + Better Auth**.

## What you can do

- Sign up / sign in with email and password
- Create workspaces and workflows
- Design a graph from a node catalog
- Save drafts and publish version snapshots
- Ask the AI panel to lay out a flow in plain language (e.g. website form → Slack). Works without `OPENAI_API_KEY`; that key only upgrades free-form replies.
- Ask the floating site guide to explain pages and walk you there
- Connect integrations with API tokens or keys (verified against the provider, stored encrypted)
- First-class **Neon** (API key and/or `neon.tech` connection string) and **Craft** (Imagine API Connection for docs, notes, and projects)
- **Grok** (xAI API key) and **Grok Bot** (routine webhook URL + key)
- SQL, document, warehouse, and vector databases: Postgres, MySQL, MariaDB, SQL Server, Oracle, SQLite, DuckDB, Cockroach, Timescale, PlanetScale, Supabase, Turso, MongoDB, Redis, Upstash, DynamoDB, Firestore, Cassandra, Cosmos DB, Elasticsearch, ClickHouse, Snowflake, BigQuery, Redshift, InfluxDB, Pinecone, Qdrant, Weaviate, Convex

Not included: a hosted workflow runtime or per-node config panels. OAuth apps are not required — each connector uses a token or key.

## Run locally

```bash
npm install
cp .env.example .env.local
# fill DATABASE_URL, DATABASE_URL_DIRECT, and BETTER_AUTH_SECRET
npm run db:push
npm run dev
```

The app serves at `http://127.0.0.1:43127`.

## Deploy on Netlify

The site uses `@netlify/vite-plugin-tanstack-start` so SSR and server functions run on Netlify Functions.

```bash
npx netlify login
npx netlify init --manual
npx netlify env:set DATABASE_URL "<neon pooled url>" --secret
npx netlify env:set DATABASE_URL_DIRECT "<neon direct url>" --secret
npx netlify env:set BETTER_AUTH_SECRET "<openssl rand -hex 32>" --secret
npx netlify env:set BETTER_AUTH_URL "https://<site>.netlify.app"
npx netlify deploy --prod --build
```

Build settings in [`netlify.toml`](netlify.toml): `npm run build` → `dist/client`.

### Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon pooled connection (app queries) |
| `DATABASE_URL_DIRECT` | Neon direct connection (Drizzle migrations) |
| `BETTER_AUTH_URL` | Public origin, e.g. `http://127.0.0.1:43127` |
| `BETTER_AUTH_SECRET` | Session signing secret (`openssl rand -hex 32`) |
| `OPENAI_API_KEY` | Optional. Without it, the assistant uses a deterministic mock |

## Database

Schema lives in [`src/db/schema.ts`](src/db/schema.ts). SQL migrations are in [`drizzle/`](drizzle/).

This environment was bootstrapped with a [claimable Neon](https://neon.new) database. Unclaimed databases expire after 72 hours. Claim it to keep the data:

https://neon.new/claim/01a13305-c79f-7322-adaf-8a68b87819b2

## Stack

TanStack Start, React 19, Tailwind 4, shadcn/ui, React Flow, Neon, Drizzle, Better Auth.
