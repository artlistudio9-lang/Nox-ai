import { injectSpeedInsights } from '@vercel/speed-insights';

// Vercel Speed Insights sends performance measurements only when deployed to a supported Vercel project.
injectSpeedInsights();

const names = { github: 'GitHub', vercel: 'Vercel', supabase: 'Supabase', openai: 'OpenAI API', qdrant: 'Qdrant', upstash: 'Upstash Redis', redis_local: 'Local Redis' };
const descriptions = {
  github: 'Repository access and code workflows',
  vercel: 'Preview and deployment management',
  supabase: 'Database and authentication',
  openai: 'Model access and AI workflows',
  qdrant: 'Vector search and retrieval',
  upstash: 'Hosted Redis-compatible cache and queues',
  redis_local: 'Local Redis-compatible development service'
};

async function refresh() {
  const out = document.querySelector('#output');
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error(`Health endpoint returned ${response.status}`);
    const data = await response.json();
    out.textContent = JSON.stringify(data, null, 2);
    document.querySelector('#providers').innerHTML = Object.entries(names).map(([key, name]) =>
      `<article class="card"><h3>${name}</h3><p class="muted">${descriptions[key]}</p><span class="status"><span class="dot"></span>${data.integrations[key]}</span></article>`
    ).join('');
  } catch {
    out.textContent = 'Could not reach the local API. Start the API server and refresh.';
  }
}

document.querySelector('#refresh').addEventListener('click', refresh);
document.querySelector('#copy').addEventListener('click', async () => {
  const checklist = 'NOX AI setup checklist\n1. Configure credentials in website/.env\n2. Keep secrets server-side and out of Git\n3. Verify each provider with a real read-only API request\n4. Test with development resources\n5. Require approval before writes or production deployment';
  try {
    await navigator.clipboard.writeText(checklist);
    alert('Checklist copied.');
  } catch {
    document.querySelector('#output').textContent = checklist;
  }
});
refresh();
