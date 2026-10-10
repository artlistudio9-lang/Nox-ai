#!/usr/bin/env node
/**
 * Minimal stdio MCP server for NOX AI. No external provider integrations are
 * performed in this starter. Keep stdout reserved for MCP protocol messages.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'nox-ai-local', version: '0.1.0' });

server.tool('nox_health', 'Return local NOX plugin status without contacting external services.', {}, async () => ({
  content: [{ type: 'text', text: JSON.stringify({
    service: 'nox-ai-local', status: 'ok', mode: 'local-starter',
    integrations: { github: 'not_configured', vercel: 'not_configured', supabase: 'not_configured', openai: 'not_configured' },
    note: 'This health check does not verify external accounts or credentials.'
  }, null, 2) }]
}));

server.tool('nox_integration_plan', 'Create a safe setup checklist for a NOX integration. Does not connect or modify external services.', {
  provider: z.enum(['github', 'vercel', 'supabase', 'openai', 'database', 'other']),
  goal: z.string().min(3).max(500)
}, async ({ provider, goal }) => {
  const steps = {
    github: ['Choose the repository and required permissions.', 'Prefer a fine-grained token with read-only scope initially.', 'Store credentials in local environment variables.', 'Verify repository metadata before enabling write operations.'],
    vercel: ['Identify the Vercel team and project.', 'Use least-privilege access.', 'Inspect current deployments before changing settings.', 'Run a preview deployment before production promotion.'],
    supabase: ['Identify project URL and public anon key.', 'Keep service-role keys server-side only.', 'Review Row Level Security policies.', 'Test against development data before migrations.'],
    openai: ['Create an API key for the intended project.', 'Keep the key server-side and outside source control.', 'Set usage limits and select an allowed model.', 'Verify with a minimal request and handle rate limits.'],
    database: ['Choose the database engine and environment.', 'Define schema and migration ownership.', 'Set backups and least-privilege roles.', 'Test migrations against disposable development data.'],
    other: ['Document the provider and exact capability needed.', 'Review authentication, permissions, cost, and data handling.', 'Implement a read-only health check first.', 'Require explicit approval before external writes.']
  };
  return { content: [{ type: 'text', text: JSON.stringify({ provider, goal, status: 'plan_only', steps: steps[provider], requires_credentials: true, external_changes_made: false }, null, 2) }] };
});

const transport = new StdioServerTransport();
await server.connect(transport);
