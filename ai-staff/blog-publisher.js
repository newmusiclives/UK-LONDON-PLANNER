#!/usr/bin/env node
// ai-staff/blog-publisher.js
// Watches ai-staff/published/blog/ for approved blog posts, publishes one
// into /blog/ on the repo, commits + pushes, and schedules the next run
// for a randomised 1-2 day gap so the blog cadence feels human.
//
// Usage:
//   node ai-staff/blog-publisher.js            # publish if due
//   node ai-staff/blog-publisher.js status     # show when next publish fires
//   node ai-staff/blog-publisher.js force      # publish now regardless of schedule
//   node ai-staff/blog-publisher.js dry-run    # preview what would happen, no writes

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname);
const REPO = path.resolve(__dirname, '..');
const PUBLISHED_BLOG_DIR = path.join(ROOT, 'published', 'blog');
const ARCHIVED_BLOG_DIR = path.join(ROOT, 'archived', 'blog');
const BLOG_DIR = path.join(REPO, 'blog');
const STATE_FILE = path.join(ROOT, 'blog-publish-state.json');

function readState() {
  if (!fs.existsSync(STATE_FILE)) {
    return { lastPublished: null, nextAfter: null, lastSlug: null, published: [] };
  }
  return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
}

function saveState(s) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
}

function pendingFiles() {
  if (!fs.existsSync(PUBLISHED_BLOG_DIR)) return [];
  return fs
    .readdirSync(PUBLISHED_BLOG_DIR)
    .filter((f) => f.endsWith('.html'))
    .sort(); // timestamp prefix makes alpha = chronological
}

function extractSlug(content) {
  // Content writer wraps its output as "---\nslug: foo.html\n...---\n```html\n<html>...</html>\n```"
  const slugMatch = content.match(/^slug:\s*([^\n\s]+)/m);
  if (slugMatch) return slugMatch[1].replace(/^\/+/, '');
  return `blog-post-${new Date().toISOString().slice(0, 10)}.html`;
}

function stripWrapper(content) {
  // Drop YAML-ish frontmatter and ```html fences — keep only the real HTML.
  let body = content;
  body = body.replace(/^---[\s\S]*?---\s*/, '');
  body = body.replace(/```html\s*/i, '');
  body = body.replace(/```\s*$/, '');
  return body.trim();
}

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: REPO, stdio: 'inherit', ...opts });
}

function scheduleNext(now = new Date()) {
  // 1-2 day randomised gap. Math.random() ∈ [0,1) → 1.0-2.0 days.
  const hours = (1 + Math.random()) * 24;
  const next = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return next.toISOString();
}

function cmdStatus() {
  const state = readState();
  const pending = pendingFiles();
  console.log('Blog publisher status:');
  console.log(`  Approved and awaiting publish: ${pending.length}`);
  console.log(`  Last published: ${state.lastPublished || '(never)'}`);
  console.log(`  Last slug: ${state.lastSlug || '—'}`);
  console.log(`  Next publish due: ${state.nextAfter || '(any time)'}`);
  if (pending.length) {
    console.log('\nQueued posts (oldest first):');
    pending.slice(0, 10).forEach((f) => console.log(`  • ${f}`));
  }
  console.log(`\nAlready published (${state.published.length}):`);
  state.published.slice(-5).forEach((p) => console.log(`  • ${p.slug}  @ ${p.at}`));
}

function cmdPublish({ force = false, dryRun = false } = {}) {
  const state = readState();
  const now = new Date();

  if (!force && state.nextAfter && new Date(state.nextAfter) > now) {
    console.log(`Not due yet. Next publish: ${state.nextAfter}`);
    console.log('(Use `force` to publish now anyway.)');
    return;
  }

  const pending = pendingFiles();
  if (pending.length === 0) {
    console.log('No approved blog posts awaiting publication.');
    console.log('Flow: run content-writer → approve in /admin review UI → this script publishes.');
    return;
  }

  const oldestFile = pending[0];
  const sourcePath = path.join(PUBLISHED_BLOG_DIR, oldestFile);
  const content = fs.readFileSync(sourcePath, 'utf8');
  const slug = extractSlug(content);
  const body = stripWrapper(content);
  const destPath = path.join(BLOG_DIR, slug);

  if (dryRun) {
    console.log('--- DRY RUN ---');
    console.log(`Would publish: ${oldestFile}`);
    console.log(`Slug: ${slug}`);
    console.log(`Destination: ${path.relative(REPO, destPath)}`);
    console.log(`Archive to: ${path.relative(REPO, path.join(ARCHIVED_BLOG_DIR, oldestFile))}`);
    console.log(`Next publish scheduled for: ${scheduleNext(now)}`);
    console.log(`Body preview (first 200 chars):\n${body.slice(0, 200)}…`);
    return;
  }

  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  if (fs.existsSync(destPath)) {
    console.log(`Slug collision — ${slug} already exists in /blog/. Skipping this file.`);
    console.log('Rename the slug in the draft (or delete the existing file) and re-run.');
    return;
  }

  fs.writeFileSync(destPath, body);
  fs.mkdirSync(ARCHIVED_BLOG_DIR, { recursive: true });
  fs.renameSync(sourcePath, path.join(ARCHIVED_BLOG_DIR, oldestFile));

  const nextAfter = scheduleNext(now);
  saveState({
    lastPublished: now.toISOString(),
    lastSlug: slug,
    nextAfter,
    published: [
      ...state.published,
      { slug, at: now.toISOString(), source: oldestFile },
    ],
  });

  console.log(`Published ${slug}. Next publish: ${nextAfter}`);

  // Commit + push so Netlify picks it up.
  try {
    run(`git add ${JSON.stringify(path.relative(REPO, destPath))}`);
    run(`git commit -m "blog: auto-publish ${slug}"`);
    run('git push origin main');
  } catch (e) {
    console.error(`Publish wrote the file but git push failed: ${e.message}`);
    console.error('Run git add/commit/push manually from the repo root.');
    process.exit(1);
  }
}

// ----- CLI -----
const [, , cmd] = process.argv;
switch (cmd) {
  case 'status':
    cmdStatus();
    break;
  case 'force':
    cmdPublish({ force: true });
    break;
  case 'dry-run':
    cmdPublish({ dryRun: true });
    break;
  default:
    cmdPublish();
}
