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
    notes: 'Real-time weather/whats-on/GA4/GHL data not yet wired. Use date and season to reason about timeliness.',
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
    const body = JSON.stringify({
      model,
      max_tokens: 4096,
      system,
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

  const userMessage = [
    `## Today's context`,
    '```json',
    JSON.stringify(ctx, null, 2),
    '```',
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
