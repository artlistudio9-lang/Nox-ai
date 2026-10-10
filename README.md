# NOX AI — Local-first starter

This is a first implementation scaffold, not a completed autonomous AI operating system.

## Included
- `website/`: local dashboard with a status API, bound to `127.0.0.1` only.
- `server/`: local stdio MCP server with a health tool and integration planning tool.
- `skills/nox-operations/`: safe operating rules for future integrations.
- `plugin.json`, `mcp.json`: Plugin Creator package manifests.

## Requirements
- Node.js 20 or newer and npm
- Docker Desktop / Docker Engine + Docker Compose for the local Qdrant and Redis services

## Install dependencies
Use one package manager, not both:
```bash
cd website
npm install
# or, if your project standard is pnpm: pnpm install
```
The `@vercel/speed-insights` dependency is wired through the Vite frontend entry point.

## Run the website in development
Terminal 1:
```bash
cd website
npm install
cp .env.example .env
npm run dev:api
```
Terminal 2:
```bash
cd website
npm run dev
```
Open the Vite URL printed in Terminal 2. Vite proxies `/api` to the local API on port 3030.

## Build and run the production-style local server
```bash
cd website
npm install
npm run build
npm start
```
Open `http://127.0.0.1:3030`. The health endpoint reports configuration presence only; it does not prove credentials work.

## Docker: website + Qdrant + local Redis
```bash
cp website/.env.example website/.env
# Change REDIS_PASSWORD in your shell or compose environment before exposing this stack.
docker compose up --build -d
docker compose ps
```
The web app, Qdrant, and Redis ports are bound to loopback. Change the default local Redis password before use. Do not expose these ports publicly without authentication and a security review.

## Vercel Speed Insights
The frontend imports `injectSpeedInsights` from `@vercel/speed-insights`. Install dependencies, build the frontend, deploy the project to Vercel, and enable Speed Insights for that Vercel project. Local runs do not prove that Vercel is receiving telemetry.

## Upstash vs local Redis
Upstash is a hosted service, not a package that can be installed as a local Docker service. For local development, Compose runs Redis. For hosted Upstash, set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the Upstash dashboard; do not commit these values. The actual Upstash adapter still needs to be wired into application code.

## Run/check the MCP server
From this directory:
```bash
npm init -y
npm install @modelcontextprotocol/sdk zod
node server/index.mjs
```
The MCP server uses stdio. Its stdout is reserved for protocol messages.

## Integration status
All providers begin unconfigured. Real API adapters, authentication flows, permission review, and provider-specific tests must be implemented before any integration can be marked verified. No deploy, schema mutation, or external write is implemented.

## Security
- Never commit `.env` or paste secrets into chat.
- Use least-privilege credentials and development resources.
- Keep all API keys on the server, never in browser JavaScript.
- Bind the starter website to loopback only; do not expose it to the network without adding authentication, CSRF protections, rate limits, and a security review.
