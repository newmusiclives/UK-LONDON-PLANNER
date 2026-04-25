// ai-staff/social-publisher.js
// Called by review-server.js when a Poppy draft (__social-media-manager.json)
// is approved. Reads the platform-keyed JSON, computes the next available
// cadence slot per platform, and fires GHL `create-post` calls with
// status=scheduled. GHL Social Planner publishes on the slot date.
//
// IG + Pinterest stay disabled until carousel/pin creative is wired in
// (GHL rejects scheduled posts without media on those platforms).

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname);
const SCHEDULE_PATH = path.join(ROOT, 'social-schedule.json');

const GHL_HOST = 'services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

const DAY_TO_NUM = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function loadSchedule() {
  return JSON.parse(fs.readFileSync(SCHEDULE_PATH, 'utf8'));
}

function ghlPost(reqPath, body) {
  return new Promise((resolve, reject) => {
    const token = process.env.GHL_PRIVATE_TOKEN;
    if (!token) return reject(new Error('GHL_PRIVATE_TOKEN not set'));
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: GHL_HOST,
        path: reqPath,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Version: GHL_VERSION,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () => {
          let json;
          try { json = JSON.parse(chunks); } catch { json = { raw: chunks }; }
          if (res.statusCode >= 400) {
            return reject(new Error(`GHL ${res.statusCode}: ${json.message || chunks}`));
          }
          resolve(json);
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Walk forward from `fromUtcMs` until we hit a day in `days` at slot_time_utc.
// Cap at 14 days so a misconfigured schedule fails fast instead of looping.
function nextSlot({ slot_time_utc, days }, fromUtcMs) {
  const [hh, mm] = slot_time_utc.split(':').map(Number);
  const allowed = new Set(days.map((d) => DAY_TO_NUM[d]));
  for (let offset = 1; offset <= 14; offset++) {
    const d = new Date(fromUtcMs);
    d.setUTCDate(d.getUTCDate() + offset);
    d.setUTCHours(hh, mm, 0, 0);
    if (allowed.has(d.getUTCDay())) return d;
  }
  throw new Error(`No slot in 14d for days ${JSON.stringify(days)}`);
}

// Each platform's draft body has a different shape. Flatten to a single
// `summary` string + optional first-comment hashtags.
function flattenPlatformBody(platform, body) {
  if (platform === 'instagram') {
    return {
      summary: body.caption || '',
      followUpComment: Array.isArray(body.hashtags_first_comment)
        ? body.hashtags_first_comment.join(' ')
        : '',
    };
  }
  if (platform === 'facebook') {
    const intro = body.intro || '';
    const link = body.link ? `\n\n${body.link}` : '';
    return { summary: intro + link };
  }
  if (platform === 'pinterest') {
    return {
      summary: [body.title, body.description].filter(Boolean).join('\n\n'),
    };
  }
  if (platform === 'threads' || platform === 'bluesky') {
    // Multi-post threads collapse to the lead post — GHL doesn't expose
    // a thread/reply parameter. Native threading still possible by posting
    // from the platform apps using the JSON file as a script.
    if (Array.isArray(body.posts) && body.posts.length) {
      return { summary: body.posts[0] };
    }
    return { summary: body.summary || '' };
  }
  return { summary: body.summary || JSON.stringify(body) };
}

function extractJson(content) {
  const fence = content.match(/```json\s*\n([\s\S]*?)\n```/);
  if (!fence) throw new Error('No ```json fence in social draft');
  return JSON.parse(fence[1]);
}

// Public API. Returns null if filePath isn't a social-media-manager file
// (caller can ignore). Otherwise returns an array of per-platform results:
//   [{ platform, posted, id, scheduleDate }, { platform, skipped, reason }, ...]
async function publishSocial(filePath) {
  if (!/__social-media-manager\.json$/.test(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf8');
  const data = extractJson(content);
  const sched = loadSchedule();

  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) throw new Error('GHL_LOCATION_ID not set');
  const userId = sched.userId;
  if (!userId) throw new Error('schedule.userId missing in social-schedule.json');

  const posts = data.posts || {};
  const results = [];
  let cursor = Date.now();

  for (const [platform, body] of Object.entries(posts)) {
    const cfg = sched.platforms?.[platform];
    if (!cfg) {
      results.push({ platform, skipped: true, reason: 'no schedule config' });
      continue;
    }
    if (!cfg.enabled) {
      results.push({ platform, skipped: true, reason: cfg._disabled_reason || 'disabled' });
      continue;
    }

    let slot;
    try {
      slot = nextSlot({ slot_time_utc: sched.slot_time_utc, days: cfg.days }, cursor);
    } catch (e) {
      results.push({ platform, error: e.message });
      continue;
    }
    // Stagger across platforms so two channels don't fire on the exact same minute.
    cursor = slot.getTime() + 60_000;

    const { summary, followUpComment } = flattenPlatformBody(platform, body);
    if (!summary) {
      results.push({ platform, skipped: true, reason: 'empty summary' });
      continue;
    }

    const payload = {
      accountIds: [cfg.accountId],
      type: 'post',
      userId,
      status: 'scheduled',
      scheduleDate: slot.toISOString(),
      summary,
    };
    if (followUpComment) payload.followUpComment = followUpComment;

    try {
      const res = await ghlPost(`/social-media-posting/${locationId}/posts`, payload);
      const id = res?.results?.post?._id;
      results.push({
        platform,
        posted: true,
        id: id || null,
        scheduleDate: slot.toISOString(),
      });
    } catch (e) {
      results.push({ platform, error: e.message });
    }
  }
  return results;
}

module.exports = { publishSocial };
