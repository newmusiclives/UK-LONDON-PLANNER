# AI Staff — Marketing, Promotion & Outreach Crew

A 9-agent crew that runs the growth engine for UK & London Planner. Each agent
is a Claude prompt + a schedule + an output destination. The orchestrator
(`orchestrator.js`) reads `registry.json`, runs each agent's prompt against the
Anthropic API, and writes drafts into `queue/` for human approval (or
auto-publishes after the agent earns trust).

## The Crew

| # | Agent | Cadence | Output |
|---|---|---|---|
| 1 | Editor-in-Chief | daily 07:00 | Daily plan + brief assignments |
| 2 | Content Writer | daily 08:00 | Blog posts → `queue/blog/` |
| 3 | Newsletter Producer | Tue 09:00 | Email HTML → GHL campaign |
| 4 | Social Media Manager | 09/13/18 daily | Platform posts → `queue/social/` |
| 5 | SEO Strategist | Mon 10:00 | Audits + page suggestions |
| 6 | Outreach & PR | Wed 11:00 | Pitch drafts → `queue/outreach/` |
| 7 | Affiliate Scout | Thu 12:00 | New partner pipeline |
| 8 | Community & Reputation | daily 14:00 | Reply drafts → `queue/community/` |
| 9 | Analytics & Growth | Fri 16:00 | Weekly report + experiments |

## Layout

```
ai-staff/
  README.md              ← this file
  registry.json          ← agent definitions, schedules, output paths
  orchestrator.js        ← Node runner: loads registry, runs agents, writes queue
  config.js              ← env loader (Anthropic, GHL, Manifest keys)
  agents/                ← one .md prompt file per agent
  queue/                 ← drafts pending human approval
  published/             ← drafts the human approved
  logs/                  ← run history per agent
```

## Running

```bash
# one-off run of a single agent
node ai-staff/orchestrator.js run editor-in-chief

# run all agents whose schedule is due
node ai-staff/orchestrator.js tick

# list queued drafts
node ai-staff/orchestrator.js queue
```

The admin panel (`admin.html` → AI Staff tab) shows the same data with
approve/reject buttons and pushes approved content into GHL or onto disk.

## Credentials

Copy `.env.example` to `.env` at the repo root and fill in:

- `ANTHROPIC_API_KEY` — required, drives every agent
- `GHL_API_KEY`, `GHL_LOCATION_ID` — for newsletter + CRM push
- `MANIFEST_*` link IDs — picked up by `js/config.js` automatically

The orchestrator never logs secrets and never commits `.env`.

## Human-in-the-Loop

By default everything writes to `queue/` and waits for approval. Outreach and
community replies should **always** stay human-gated — reputation risk is
asymmetric. Content (blog, social, newsletter) can be promoted to auto-publish
after 30 days of approved drafts with no rejections.
