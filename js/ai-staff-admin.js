// js/ai-staff-admin.js — admin.html "AI Staff" tab
// The orchestrator runs in Node from your terminal (or via Netlify Functions
// once wired). This panel reads ai-staff/registry.json so you can see the crew
// at a glance, copy run commands, and review the queue index when one exists.

(function () {
  'use strict';

  const REGISTRY_URL = 'ai-staff/registry.json';
  const QUEUE_INDEX_URL = 'ai-staff/queue/index.json'; // optional file the orchestrator can write
  const STATUS_FN_URL = '/.netlify/functions/ai-staff-status'; // optional Netlify fn

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  async function loadRegistry() {
    try {
      const res = await fetch(REGISTRY_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function loadStatus() {
    try {
      const res = await fetch(STATUS_FN_URL);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  async function loadQueueIndex() {
    try {
      const res = await fetch(QUEUE_INDEX_URL, { cache: 'no-store' });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  }

  function renderStatus(reg, statusData) {
    const el = document.getElementById('aiStaffStatus');
    const scheduleEl = document.getElementById('aiStaffScheduleStatus');
    if (!el) return;

    const lines = [];
    if (!reg) {
      el.innerHTML = '⚠ Could not load <code>ai-staff/registry.json</code>. Run from a server (e.g. <code>npx serve</code>) so fetch works.';
      return;
    }
    lines.push(`<strong>Site:</strong> ${escapeHtml(reg.site.name)} — ${escapeHtml(reg.site.url)}`);
    lines.push(`<strong>Agents:</strong> ${reg.agents.length}`);
    lines.push(`<strong>Schedules enabled:</strong> ${reg.schedulesEnabled ? '<span style="color:#16a34a;">✓ yes</span>' : '<span style="color:#dc2626;">✗ no (manual run only)</span>'}`);
    if (statusData) {
      lines.push(`<strong>Anthropic key:</strong> ${statusData.anthropic ? '✓' : '✗'}`);
      lines.push(`<strong>GHL:</strong> ${statusData.ghl ? '✓' : '✗'}  <strong>Manifest:</strong> ${statusData.manifest ? '✓' : '✗'}`);
    } else {
      lines.push('<span style="color:#9ca3af;">(Server status unavailable — run <code>npm run ai:status</code> in terminal)</span>');
    }
    el.innerHTML = lines.join('<br>');
    if (scheduleEl) scheduleEl.textContent = reg.schedulesEnabled ? 'enabled' : 'disabled';
  }

  function renderAgents(reg) {
    const grid = document.getElementById('aiStaffAgentGrid');
    if (!grid || !reg) return;
    grid.innerHTML = reg.agents.map((a) => `
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:1rem;background:white;">
        <div style="display:flex;justify-content:space-between;align-items:start;gap:0.5rem;">
          <h4 style="margin:0 0 0.25rem;font-size:1rem;">${escapeHtml(a.name)}${a.title ? ` <span style="font-weight:400;color:#6b7280;font-size:0.85rem;">— ${escapeHtml(a.title)}</span>` : ''}</h4>
          ${a.humanGated ? '<span style="font-size:0.7rem;background:#fef3c7;color:#92400e;padding:2px 6px;border-radius:3px;white-space:nowrap;">HUMAN-GATED</span>' : ''}
        </div>
        <div style="font-size:0.75rem;color:#6b7280;font-family:monospace;margin-bottom:0.5rem;">${escapeHtml(a.schedule)}</div>
        <p style="font-size:0.85rem;color:#374151;margin:0 0 0.75rem;">${escapeHtml(a.description)}</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <code style="font-size:0.75rem;background:#f3f4f6;padding:4px 8px;border-radius:4px;cursor:pointer;" onclick="navigator.clipboard.writeText('npm run ai:run ${a.id}');this.textContent='copied!';setTimeout(()=>this.textContent='npm run ai:run ${a.id}',1000)">npm run ai:run ${escapeHtml(a.id)}</code>
        </div>
      </div>
    `).join('');
  }

  function renderQueue(idx) {
    const el = document.getElementById('aiStaffQueue');
    if (!el) return;
    if (!idx || !idx.items || !idx.items.length) {
      el.innerHTML = '<div style="color:#9ca3af;font-style:italic;">Queue is empty. Run an agent to generate drafts.</div>';
      return;
    }
    el.innerHTML = idx.items.map((it) => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem;border-bottom:1px solid #e5e7eb;">
        <div>
          <div style="font-family:monospace;font-size:0.85rem;">${escapeHtml(it.rel)}</div>
          <div style="font-size:0.75rem;color:#6b7280;">${escapeHtml(it.mtime || '')}</div>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <code style="font-size:0.7rem;background:#f3f4f6;padding:3px 6px;border-radius:3px;">npm run ai:approve ${escapeHtml(it.rel)}</code>
        </div>
      </div>
    `).join('');
  }

  async function init() {
    const reg = await loadRegistry();
    const [statusData, queueIdx] = await Promise.all([loadStatus(), loadQueueIndex()]);
    renderStatus(reg, statusData);
    renderAgents(reg);
    renderQueue(queueIdx);
  }

  // Re-init when the AI Staff tab is shown (admin uses click-driven tabs)
  document.addEventListener('DOMContentLoaded', () => {
    const tab = document.querySelector('[data-tab="ai-staff"]');
    if (tab) tab.addEventListener('click', init);
    // If the tab is the active one on first load, init immediately
    if (document.querySelector('[data-panel="ai-staff"].active')) init();
  });

  window.AIStaffAdmin = { init };
})();
