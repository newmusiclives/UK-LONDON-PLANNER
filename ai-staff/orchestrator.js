#!/usr/bin/env node
// ai-staff/orchestrator.js
// Loads registry.json, runs agents against the Anthropic API, writes drafts to queue/.
//
// Usage:
//   node ai-staff/orchestrator.js status         # show config status
//   node ai-staff/orchestrator.js list           # list agents
//   node ai-staff/orchestrator.js run <agent-id> # run a single agent now
//   node ai-staff/orchestrator.js tick           # run all agents whose schedule is due (no-op while schedulesEnabled=false)
//   node ai-staff/orchestrator.js queue          # list queued drafts
//   node ai-staff/orchestrator.js approve <path> # mark a queued draft as approved → moves to published/
//
// Schedules are intentionally disabled until the owner finishes manual testing.

const fs = require('fs');
const path = require('path');
const https = require('https');
const config = require('./config');

const ROOT = path.resolve(__dirname);
const REPO = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'registry.json');
const QUEUE_DIR = path.join(ROOT, 'queue');
const PUBLISHED_DIR = path.join(ROOT, 'published');
const LOGS_DIR = path.join(ROOT, 'logs');

function ensureDirs() {
  for (const d of [QUEUE_DIR, PUBLISHED_DIR, LOGS_DIR]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }
}

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
}

function loadAgentPrompt(agent) {
  const p = path.join(ROOT, agent.promptFile);
  if (!fs.existsSync(p)) throw new Error(`Prompt file missing: ${agent.promptFile}`);
  return fs.readFileSync(p, 'utf8');
}

// Load the most recent editor-in-chief brief so downstream agents can align
// their output with the day's thread. Checks both queue/plans/ and
// published/plans/ — approving a brief in the review UI shouldn't break
// chaining. Returns null if no brief exists anywhere.
function loadLatestEditorBrief() {
  const candidates = [
    path.join(QUEUE_DIR, 'plans'),
    path.join(PUBLISHED_DIR, 'plans'),
  ];
  const all = [];
  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('__editor-in-chief.md')) all.push({ dir, f });
    }
  }
  if (!all.length) return null;
  // Filenames start with ISO timestamp — alpha sort gives chronological order.
  all.sort((a, b) => b.f.localeCompare(a.f));
  const pick = all[0];
  const raw = fs.readFileSync(path.join(pick.dir, pick.f), 'utf8');
  const fenceMatch = raw.match(/```json\s*\n([\s\S]*?)\n```/);
  const jsonText = fenceMatch ? fenceMatch[1] : raw.trim();
  let brief = null;
  try { brief = JSON.parse(jsonText); } catch { /* keep brief null */ }
  return { raw, brief, file: pick.f };
}

function gatherContext() {
  // Lightweight context bundle every agent receives. Real wiring (weather, GA4)
  // happens after credentials are added — until then we send the basics.
  const today = new Date();
  return {
    date: today.toISOString().slice(0, 10),
    day_of_week: today.toLocaleDateString('en-GB', { weekday: 'long' }),
    iso_week: getISOWeek(today),
    season: seasonFor(today),
    site: loadRegistry().site,
    campaign: {
      phase: 'pre-launch',
      launch_mode: 'coming-soon',
      primary_goal: 'Build a warm waitlist of 10,000 Americans planning a London trip before launch day. Drive K-factor > 0.4 via referral perks.',
      rules: [
        'The site is gated: / serves coming-soon.html. Itineraries are NOT yet purchasable — do not pitch paid products, prices, discounts on paid tiers, or "buy now" CTAs.',
        'Only public pages behind the gate: /, /gift, /partners, /share-trip, /free-guide, /coming-soon. Any link you write must resolve to one of these, the /admin tooling, or an off-site channel (social, blog posts you draft are queue-only until launch).',
        'The single call-to-action everywhere is: join the waitlist at londonplanned.com and share the personal ref link to climb tiers (tier-1/3/5/10/founding-member).',
        'Sellable perks are waitlist-exclusive and referral-gated: 40% off launch week, Insider\'s London Bundle PDF pack, Founding Member 15% lifetime, perk tiers unlocked by referrals. These are free to earn; do not frame them as a paid promotion.',
        'Content is educational / useful / buzz-building — London insider tips, neighbourhood depth, "best time to visit" seasonality. Every piece ends with a waitlist join CTA that includes the {{contact.share_code}} merge field where appropriate.',
        'Do NOT reference paid tiers ($50 / $75 / $150), "Spring in London itinerary", or Stripe checkout in any output during pre-launch.',
      ],
      reference_docs: [
        'Pre-launch campaign plan is authoritative — see ai-staff/README.md and the Pre-Launch Campaign memory for per-agent assignments, 6-week phase plan, and KPIs.',
      ],
    },
    notes: 'Real-time weather/whats-on/GA4/GHL data not yet wired. Use date and season to reason about timeliness. RESPECT the campaign.rules above — the site is not yet live for paid product sales.',
  };
}

function seasonFor(d) {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
}

function getISOWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

// ----- Anthropic API call -----
function callClaude({ model, system, user }) {
  return new Promise((resolve, reject) => {
    // Prompt caching: mark the agent's system prompt as cacheable.
    // Anthropic caches it for ~5 min by default; a second identical run
    // within that window reads the cache (~10% of the input-token cost).
    // Useful when tick() runs the same agent close together, and when we
    // re-run after a tweak during development.
    const systemBlocks = typeof system === 'string'
      ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }]
      : system;
    const body = JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemBlocks,
      messages: [{ role: 'user', content: user }],
    });
    const req = https.request(
      {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': config.anthropic.apiKey(),
          'anthropic-version': config.anthropic.version,
          'content-length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(chunks);
            if (res.statusCode >= 400) return reject(new Error(`Anthropic ${res.statusCode}: ${chunks}`));
            const text = (json.content || []).map((b) => b.text || '').join('');
            resolve({ text, raw: json });
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ----- Run a single agent -----
async function runAgent(agentId, { briefOverride = null } = {}) {
  const reg = loadRegistry();
  const agent = reg.agents.find((a) => a.id === agentId);
  if (!agent) throw new Error(`Unknown agent: ${agentId}`);

  ensureDirs();
  const prompt = loadAgentPrompt(agent);
  const ctx = gatherContext();
  const model = reg.model[agent.model] || reg.model.default;

  // Chain Margaret's daily brief into every downstream agent so they all
  // rally around the same thread. Editor-in-chief obviously doesn't read
  // its own prior brief.
  let dailyBriefSection = '';
  if (agent.id !== 'editor-in-chief') {
    const editorBrief = loadLatestEditorBrief();
    if (editorBrief) {
      const myBrief = editorBrief.brief?.briefs?.[agent.id] ?? null;
      const lines = [
        `\n## Today's editorial brief (from the Editor-in-Chief)`,
        `The Editor-in-Chief has set today's thread. Align your output with this thread. Respect the kill_list — do NOT cover anything on it. If no specific brief exists for your role, still honour the day's thread.`,
      ];
      if (editorBrief.brief) {
        lines.push(`\n**Today's thread:** ${editorBrief.brief.thread || '(not set)'}`);
        lines.push(`\n**Rationale:** ${editorBrief.brief.rationale || '(not set)'}`);
        if (Array.isArray(editorBrief.brief.kill_list)) {
          lines.push(`\n**Kill list (do NOT do):**`);
          for (const k of editorBrief.brief.kill_list) lines.push(`- ${k}`);
        }
        if (myBrief) {
          lines.push(`\n**Your specific brief for today:**`);
          lines.push('```json');
          lines.push(JSON.stringify(myBrief, null, 2));
          lines.push('```');
        } else {
          lines.push(`\n(No specific brief for your role today — follow the thread at your own discretion.)`);
        }
      } else {
        lines.push(`\n(Could not parse editor brief as JSON — raw file follows)`);
        lines.push('```');
        lines.push(editorBrief.raw.slice(0, 4000));
        lines.push('```');
      }
      dailyBriefSection = lines.join('\n');
    }
  }

  const userMessage = [
    `## Today's context`,
    '```json',
    JSON.stringify(ctx, null, 2),
    '```',
    dailyBriefSection,
    briefOverride ? `\n## Brief override\n${briefOverride}` : '',
    `\nProduce your output now, following the format rules in your role spec.`,
  ].join('\n');

  console.log(`▶ ${agent.name} (${model})`);
  const started = Date.now();

  let result;
  try {
    result = await callClaude({ model, system: prompt, user: userMessage });
  } catch (e) {
    logRun(agent, { ok: false, error: e.message, ms: Date.now() - started });
    throw e;
  }

  // Write draft to queue
  const outDir = path.join(ROOT, agent.outputDir);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const ext = agent.outputFormat || 'md';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${stamp}__${agent.id}.${ext}`;
  const outPath = path.join(outDir, filename);
  fs.writeFileSync(outPath, result.text);

  const ms = Date.now() - started;
  logRun(agent, { ok: true, ms, outPath, tokens: result.raw.usage });
  writeQueueIndex();
  console.log(`  ✓ ${ms}ms → ${path.relative(REPO, outPath)}`);
  return outPath;
}

function logRun(agent, info) {
  const logPath = path.join(LOGS_DIR, `${agent.id}.jsonl`);
  fs.appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), ...info }) + '\n');
}

// ----- Tick: run agents whose cron is due -----
async function tick() {
  const reg = loadRegistry();
  if (!reg.schedulesEnabled) {
    console.log('Schedules disabled (registry.schedulesEnabled = false). Owner will enable after manual test.');
    console.log('Use `run <agent-id>` to test a single agent manually.');
    return;
  }
  const now = new Date();
  for (const agent of reg.agents) {
    if (cronDue(agent.schedule, now)) {
      try {
        await runAgent(agent.id);
      } catch (e) {
        console.error(`✗ ${agent.id}: ${e.message}`);
      }
    }
  }
}

// Minimal cron matcher: minute hour dom month dow. Supports *, lists (a,b), and exact ints.
function cronDue(expr, now) {
  const [mn, hr, dom, mo, dow] = expr.split(/\s+/);
  const fields = [
    [mn, now.getMinutes()],
    [hr, now.getHours()],
    [dom, now.getDate()],
    [mo, now.getMonth() + 1],
    [dow, now.getDay()],
  ];
  return fields.every(([pat, val]) => {
    if (pat === '*') return true;
    return pat.split(',').map(Number).includes(val);
  });
}

// ----- Queue listing / approval -----
function listQueue() {
  ensureDirs();
  const items = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p);
      else items.push({ path: p, rel: path.relative(QUEUE_DIR, p), size: st.size, mtime: st.mtime });
    }
  }
  walk(QUEUE_DIR);
  return items.sort((a, b) => b.mtime - a.mtime);
}

function writeQueueIndex() {
  const items = listQueue().map((it) => ({
    rel: it.rel,
    size: it.size,
    mtime: it.mtime.toISOString(),
  }));
  fs.writeFileSync(
    path.join(QUEUE_DIR, 'index.json'),
    JSON.stringify({ generated: new Date().toISOString(), items }, null, 2)
  );
}

function approve(relPath) {
  const src = path.isAbsolute(relPath) ? relPath : path.join(QUEUE_DIR, relPath);
  if (!fs.existsSync(src)) throw new Error(`Not found: ${src}`);
  const rel = path.relative(QUEUE_DIR, src);
  const dst = path.join(PUBLISHED_DIR, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.renameSync(src, dst);
  writeQueueIndex();
  console.log(`Approved → ${path.relative(REPO, dst)}`);
}

// ----- CLI -----
async function main() {
  const [, , cmd, arg] = process.argv;
  switch (cmd) {
    case 'status': {
      const s = config.status();
      console.log('AI Staff config status:');
      for (const [k, v] of Object.entries(s)) console.log(`  ${v ? '✓' : '✗'} ${k}`);
      const reg = loadRegistry();
      console.log(`  ${reg.schedulesEnabled ? '✓' : '✗'} schedulesEnabled`);
      break;
    }
    case 'list': {
      const reg = loadRegistry();
      for (const a of reg.agents) {
        console.log(`  ${a.id.padEnd(24)} ${a.schedule.padEnd(15)} ${a.humanGated ? '[HUMAN-GATED]' : ''}`);
      }
      break;
    }
    case 'run': {
      if (!arg) throw new Error('Usage: orchestrator.js run <agent-id>');
      await runAgent(arg);
      break;
    }
    case 'tick': {
      await tick();
      break;
    }
    case 'queue': {
      const items = listQueue();
      if (!items.length) {
        console.log('Queue is empty.');
        break;
      }
      for (const it of items) console.log(`  ${it.mtime.toISOString()}  ${it.rel}  (${it.size}b)`);
      break;
    }
    case 'approve': {
      if (!arg) throw new Error('Usage: orchestrator.js approve <path>');
      approve(arg);
      break;
    }
    default:
      console.log('Usage: orchestrator.js <status|list|run|tick|queue|approve> [arg]');
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  });
}

module.exports = { runAgent, tick, listQueue, approve };
