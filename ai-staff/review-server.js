#!/usr/bin/env node
// ai-staff/review-server.js
// Tiny local HTTP server that lets you review, approve, or reject drafts
// produced by the AI Staff. Runs on localhost:4242.
//
// Usage:
//   node ai-staff/review-server.js
//   (or: npm run ai:review)
//
// Endpoints:
//   GET  /                      review UI
//   GET  /api/drafts            list all queued drafts grouped by agent
//   GET  /api/drafts/:file      read a draft's raw content
//   POST /api/approve           { rel } → moves file from queue/ → published/
//   POST /api/reject            { rel } → moves file from queue/ → rejected/
//   GET  /api/agents            agent registry (id, name, humanGated)

const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname);
const REPO = path.resolve(__dirname, '..');
const QUEUE_DIR = path.join(ROOT, 'queue');
const PUBLISHED_DIR = path.join(ROOT, 'published');
const REJECTED_DIR = path.join(ROOT, 'rejected');
const REGISTRY_PATH = path.join(ROOT, 'registry.json');
const UI_PATH = path.join(ROOT, 'review-ui.html');

const PORT = 4242;

function ensureDirs() {
  for (const d of [QUEUE_DIR, PUBLISHED_DIR, REJECTED_DIR]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }
}

function loadRegistry() {
  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
}

function walkQueue() {
  const items = [];
  function walk(dir, baseDir) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      if (name === 'index.json') continue;
      const p = path.join(dir, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) walk(p, baseDir);
      else {
        const rel = path.relative(baseDir, p);
        items.push({
          rel,
          absPath: p,
          size: st.size,
          mtime: st.mtime.toISOString(),
          agentId: inferAgentFromFilename(name),
          subdir: path.relative(baseDir, path.dirname(p)) || '(root)',
        });
      }
    }
  }
  walk(QUEUE_DIR, QUEUE_DIR);
  return items.sort((a, b) => b.mtime.localeCompare(a.mtime));
}

function inferAgentFromFilename(name) {
  // filename format: 2026-04-20T23-15-44-589Z__<agent-id>.<ext>
  const m = name.match(/__([a-z0-9-]+)\.(md|html|json|txt)$/);
  return m ? m[1] : 'unknown';
}

function moveFile(rel, targetDir) {
  const src = path.join(QUEUE_DIR, rel);
  if (!fs.existsSync(src)) throw new Error(`Not found: ${rel}`);
  const dst = path.join(targetDir, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.renameSync(src, dst);
  return path.relative(REPO, dst);
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store',
    ...headers,
  });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = '';
    req.on('data', (c) => (chunks += c));
    req.on('end', () => {
      try {
        resolve(chunks ? JSON.parse(chunks) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/') {
      if (!fs.existsSync(UI_PATH)) return send(res, 500, { error: 'review-ui.html missing' });
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(UI_PATH));
    }

    if (req.method === 'GET' && url.pathname === '/api/drafts') {
      ensureDirs();
      const reg = loadRegistry();
      const byId = Object.fromEntries(reg.agents.map((a) => [a.id, a]));
      const drafts = walkQueue().map((d) => ({
        ...d,
        agentName: byId[d.agentId]?.name || d.agentId,
        humanGated: !!byId[d.agentId]?.humanGated,
        absPath: undefined,
      }));
      return send(res, 200, { drafts });
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/drafts/')) {
      const rel = decodeURIComponent(url.pathname.replace(/^\/api\/drafts\//, ''));
      const p = path.join(QUEUE_DIR, rel);
      if (!p.startsWith(QUEUE_DIR)) return send(res, 400, { error: 'Bad path' });
      if (!fs.existsSync(p)) return send(res, 404, { error: 'Not found' });
      return send(res, 200, {
        rel,
        content: fs.readFileSync(p, 'utf8'),
        size: fs.statSync(p).size,
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/approve') {
      const { rel } = await readJsonBody(req);
      if (!rel) return send(res, 400, { error: 'rel required' });
      const newPath = moveFile(rel, PUBLISHED_DIR);
      return send(res, 200, { ok: true, newPath });
    }

    if (req.method === 'POST' && url.pathname === '/api/reject') {
      const { rel } = await readJsonBody(req);
      if (!rel) return send(res, 400, { error: 'rel required' });
      const newPath = moveFile(rel, REJECTED_DIR);
      return send(res, 200, { ok: true, newPath });
    }

    if (req.method === 'GET' && url.pathname === '/api/agents') {
      const reg = loadRegistry();
      return send(res, 200, {
        agents: reg.agents.map((a) => ({
          id: a.id,
          name: a.name,
          title: a.title,
          humanGated: !!a.humanGated,
          outputDir: a.outputDir,
        })),
      });
    }

    send(res, 404, { error: 'Not found' });
  } catch (e) {
    send(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`AI Staff review server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop.');
});
