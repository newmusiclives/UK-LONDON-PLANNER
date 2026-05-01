// netlify/functions/_lib/github-commit.js
// Commit a JSON-file mutation directly to main via the GitHub Contents API.
// One call = one commit, attributed to the reviewer (not the PAT owner).
//
// Required env vars:
//   GITHUB_PAT     — fine-grained personal access token, contents:write on this repo
// Optional env vars (with defaults):
//   GITHUB_REPO    — default: newmusiclives/UK-LONDON-PLANNER
//   GITHUB_BRANCH  — default: main
//
// Usage:
//   await commitJsonUpdate({
//     filePath: 'data/restaurants.json',
//     transform: (items) => { items.find(i => i.id === 'foo').verification.status = 'auto-verified'; },
//     message: 'listings: confirm Foo (auto-verified)',
//     author: { name: 'Paul', email: 'paul@lightworkdigital.com' },
//   });

const DEFAULT_REPO = 'newmusiclives/UK-LONDON-PLANNER';
const DEFAULT_BRANCH = 'main';
const API_BASE = 'https://api.github.com';

function getPat() {
  const pat = process.env.GITHUB_PAT;
  if (!pat) throw new Error('GITHUB_PAT env var missing');
  return pat;
}

function getRepo() {
  return process.env.GITHUB_REPO || DEFAULT_REPO;
}

function getBranch() {
  return process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
}

async function ghFetch(path, init = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${getPat()}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'londonplanned-listings-review',
    ...(init.headers || {}),
  };
  const res = await fetch(url, { ...init, headers });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const err = new Error(`GitHub API ${res.status} ${res.statusText}: ${typeof body === 'object' ? body?.message || JSON.stringify(body) : body}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

async function getFile(filePath) {
  const repo = getRepo();
  const branch = getBranch();
  const data = await ghFetch(`/repos/${repo}/contents/${encodeURIComponent(filePath).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`);
  // Single file responses have `content` (base64) and `sha`. Directories return arrays — we don't expect those here.
  if (Array.isArray(data)) throw new Error(`Path is a directory: ${filePath}`);
  const content = Buffer.from(data.content, data.encoding || 'base64').toString('utf8');
  return { sha: data.sha, content };
}

async function putFile({ filePath, content, sha, message, author }) {
  const repo = getRepo();
  const branch = getBranch();
  const encoded = Buffer.from(content, 'utf8').toString('base64');
  const body = {
    message,
    content: encoded,
    sha,
    branch,
  };
  if (author?.name && author?.email) {
    body.author = { name: author.name, email: author.email };
    body.committer = { name: author.name, email: author.email };
  }
  return ghFetch(`/repos/${repo}/contents/${encodeURIComponent(filePath).replace(/%2F/g, '/')}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

// Public helper: read current JSON file, run transform, commit the result.
// Transform receives the parsed JSON and may either mutate in place (return undefined)
// or return a replacement value.
async function commitJsonUpdate({ filePath, transform, message, author }) {
  if (!filePath || typeof filePath !== 'string') throw new Error('filePath required');
  if (typeof transform !== 'function') throw new Error('transform function required');
  if (!message) throw new Error('commit message required');

  const { sha, content } = await getFile(filePath);
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error(`Failed to parse ${filePath} as JSON: ${e.message}`);
  }

  const transformed = transform(parsed);
  const next = transformed === undefined ? parsed : transformed;
  const serialised = JSON.stringify(next, null, 2) + '\n';

  // No-op short-circuit: if the transform produced no change, skip the commit.
  if (serialised === content) {
    return { changed: false };
  }

  const result = await putFile({
    filePath,
    content: serialised,
    sha,
    message,
    author,
  });

  return {
    changed: true,
    commitSha: result.commit?.sha,
    commitUrl: result.commit?.html_url,
    contentSha: result.content?.sha,
  };
}

module.exports = {
  commitJsonUpdate,
  // Exposed for testing / advanced use:
  _internals: { getFile, putFile, ghFetch, getRepo, getBranch },
};
