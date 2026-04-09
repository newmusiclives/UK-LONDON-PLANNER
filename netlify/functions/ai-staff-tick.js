// netlify/functions/ai-staff-tick.js
// Scheduled function that runs every hour and triggers any agents whose cron is due.
// DISABLED in netlify.toml until owner enables. Even when scheduled, this still
// refuses to run unless ai-staff/registry.json has schedulesEnabled=true.

const fs = require('fs');
const path = require('path');

exports.handler = async () => {
  try {
    const registryPath = path.resolve(__dirname, '..', '..', 'ai-staff', 'registry.json');
    if (!fs.existsSync(registryPath)) {
      return { statusCode: 200, body: 'no registry' };
    }
    const reg = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    if (!reg.schedulesEnabled) {
      return { statusCode: 200, body: 'schedules disabled in registry' };
    }

    // Lazy-require so cold start stays cheap when disabled
    const { tick } = require('../../ai-staff/orchestrator');
    await tick();
    return { statusCode: 200, body: 'tick ok' };
  } catch (e) {
    console.error('ai-staff-tick error:', e);
    return { statusCode: 500, body: e.message };
  }
};
