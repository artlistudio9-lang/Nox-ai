---
name: nox-operations
description: Use when planning, inspecting, or safely integrating the local-first NOX AI project with developer services such as GitHub, Vercel, Supabase, and OpenAI.
---

# NOX AI local operations

- Treat the local NOX web app and the ChatGPT plugin package as separate components.
- Never claim a provider is connected unless a real authenticated API check succeeds.
- Never request, print, commit, or expose API keys, access tokens, passwords, or service-role secrets.
- Store local secrets only in an ignored `.env` file and provide `.env.example` with placeholders.
- Before changing repositories, deployments, database schemas, or production data, explain the planned change and require explicit approval.
- Prefer read-only health checks and dry-run plans before any write operation.
- Mark each integration as `not_configured`, `configured_unverified`, `verified`, or `error`; include evidence and timestamp where available.
- For GitHub, begin with repository metadata and status; for Vercel, begin with project/deployment inspection; for Supabase, begin with connection validation and schema read-only inspection; for OpenAI, begin with a minimal model/API availability check.
- Do not deploy or modify production resources unless the user explicitly asks and credentials are configured.
