// js/ab-admin.js — A/B testing admin panel
// Provides UI to create, monitor, and conclude split tests.
// Test definitions are stored in localStorage so they persist across admin sessions.
// The ABTest object in analytics.js handles assignment + tracking on the frontend.

(function () {
  'use strict';

  const STORAGE_KEY = 'abTestDefinitions';

  function loadTests() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }

  function saveTests(tests) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  }

  function getAssignment(name) {
    return localStorage.getItem('ab_' + name) || null;
  }

  function render() {
    const panel = document.getElementById('abTestPanel');
    if (!panel) return;
    const tests = loadTests();

    panel.innerHTML = `
      <div class="admin-section">
        <div class="admin-section__header">
          <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
            <h3>A/B Tests</h3>
            <button class="btn btn--primary btn--small" onclick="ABAdmin.showCreate()">+ New Test</button>
          </div>
        </div>
        <div class="admin-section__body">
          <p style="color:var(--color-text-secondary);font-size:0.85rem;margin-bottom:1rem;">
            Tests use the <code>ABTest</code> framework in <code>analytics.js</code>. Visitors are bucketed on first visit and tracked via GA4 events
            (<code>ab_test_assignment</code>, <code>ab_test_conversion</code>).
          </p>

          <div style="background:#fff8e1;border-left:4px solid #f59e0b;padding:1rem;border-radius:4px;margin-bottom:1.5rem;font-size:0.85rem;">
            <strong>To wire a test into a page:</strong><br>
            <code>const variant = ABTest.define('test-name', ['control', 'variant-b']);</code><br>
            <code>if (variant === 'variant-b') { /* apply changes */ }</code><br>
            <code>// On success: ABTest.convert('test-name');</code>
          </div>

          ${tests.length === 0 ? `
            <div style="text-align:center;padding:2rem;color:#9ca3af;font-style:italic;">
              No tests defined yet. Click "+ New Test" to create one.
            </div>
          ` : tests.map((t, i) => `
            <div style="border:1px solid #e5e7eb;border-radius:8px;padding:1rem;margin-bottom:0.75rem;background:${t.status === 'active' ? '#f0fdf4' : t.status === 'concluded' ? '#f8f9fa' : 'white'};">
              <div style="display:flex;justify-content:space-between;align-items:start;">
                <div>
                  <h4 style="margin:0;font-size:1rem;">${escHtml(t.name)}</h4>
                  <div style="font-size:0.8rem;color:#6b7280;margin-top:0.25rem;">
                    ${escHtml(t.hypothesis || '')}
                  </div>
                </div>
                <span style="font-size:0.75rem;padding:3px 8px;border-radius:3px;font-weight:600;
                  ${t.status === 'active' ? 'background:#dcfce7;color:#16a34a;' :
                    t.status === 'concluded' ? 'background:#f3f4f6;color:#6b7280;' :
                    'background:#fef3c7;color:#92400e;'}">${t.status}</span>
              </div>
              <div style="display:flex;gap:1rem;margin-top:0.75rem;font-size:0.85rem;">
                <span><strong>Variants:</strong> ${t.variants.join(', ')}</span>
                <span><strong>Page:</strong> ${escHtml(t.page || 'any')}</span>
                <span><strong>Metric:</strong> ${escHtml(t.successMetric || 'conversion')}</span>
              </div>
              ${t.stopLoss ? `<div style="font-size:0.8rem;color:#dc2626;margin-top:0.5rem;">Stop-loss: ${escHtml(t.stopLoss)}</div>` : ''}
              <div style="margin-top:0.75rem;display:flex;gap:0.5rem;">
                <code style="font-size:0.75rem;background:#f3f4f6;padding:4px 8px;border-radius:4px;">ABTest.define('${escHtml(t.name)}', [${t.variants.map(v => `'${v}'`).join(', ')}])</code>
              </div>
              <div style="margin-top:0.75rem;display:flex;gap:0.5rem;">
                ${t.status === 'draft' ? `<button class="btn btn--small btn--primary" onclick="ABAdmin.activate(${i})">Activate</button>` : ''}
                ${t.status === 'active' ? `<button class="btn btn--small btn--outline" onclick="ABAdmin.conclude(${i})">Conclude</button>` : ''}
                <button class="btn btn--small btn--outline" style="color:#dc2626;" onclick="ABAdmin.remove(${i})">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="abCreateModal" style="display:none;position:fixed;inset:0;background:rgba(27,42,74,0.85);z-index:9999;display:none;align-items:center;justify-content:center;">
        <div style="background:white;border-radius:16px;max-width:500px;width:90%;padding:2rem;position:relative;">
          <button onclick="ABAdmin.hideCreate()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#9CA3AF;">&times;</button>
          <h3 style="margin-bottom:1.5rem;">Create A/B Test</h3>
          <form id="abCreateForm" onsubmit="ABAdmin.create(event)">
            <label style="display:block;font-weight:600;font-size:0.85rem;margin-bottom:0.25rem;">Test name (kebab-case)</label>
            <input type="text" id="ab-name" required placeholder="e.g. pricing-anchor" style="width:100%;padding:10px;border:2px solid var(--color-border);border-radius:8px;margin-bottom:1rem;font-family:inherit;">

            <label style="display:block;font-weight:600;font-size:0.85rem;margin-bottom:0.25rem;">Hypothesis</label>
            <textarea id="ab-hypothesis" rows="2" placeholder="Showing per-day cost will increase checkout conversion by 10%" style="width:100%;padding:10px;border:2px solid var(--color-border);border-radius:8px;margin-bottom:1rem;font-family:inherit;resize:vertical;"></textarea>

            <label style="display:block;font-weight:600;font-size:0.85rem;margin-bottom:0.25rem;">Variants (comma-separated)</label>
            <input type="text" id="ab-variants" required placeholder="control, per-day-price" style="width:100%;padding:10px;border:2px solid var(--color-border);border-radius:8px;margin-bottom:1rem;font-family:inherit;">

            <label style="display:block;font-weight:600;font-size:0.85rem;margin-bottom:0.25rem;">Page (which page runs this test)</label>
            <input type="text" id="ab-page" placeholder="wizard.html" style="width:100%;padding:10px;border:2px solid var(--color-border);border-radius:8px;margin-bottom:1rem;font-family:inherit;">

            <label style="display:block;font-weight:600;font-size:0.85rem;margin-bottom:0.25rem;">Success metric</label>
            <input type="text" id="ab-metric" placeholder="checkout_conversion" style="width:100%;padding:10px;border:2px solid var(--color-border);border-radius:8px;margin-bottom:1rem;font-family:inherit;">

            <label style="display:block;font-weight:600;font-size:0.85rem;margin-bottom:0.25rem;">Stop-loss</label>
            <input type="text" id="ab-stoploss" placeholder="Revert if conversion drops >10% in 48hrs" style="width:100%;padding:10px;border:2px solid var(--color-border);border-radius:8px;margin-bottom:1.5rem;font-family:inherit;">

            <button type="submit" class="btn btn--primary btn--full">Create Test</button>
          </form>
        </div>
      </div>
    `;
  }

  function escHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  window.ABAdmin = {
    render,

    showCreate() {
      const modal = document.getElementById('abCreateModal');
      if (modal) modal.style.display = 'flex';
    },

    hideCreate() {
      const modal = document.getElementById('abCreateModal');
      if (modal) modal.style.display = 'none';
    },

    create(e) {
      e.preventDefault();
      const tests = loadTests();
      tests.push({
        name: document.getElementById('ab-name').value.trim(),
        hypothesis: document.getElementById('ab-hypothesis').value.trim(),
        variants: document.getElementById('ab-variants').value.split(',').map(v => v.trim()).filter(Boolean),
        page: document.getElementById('ab-page').value.trim(),
        successMetric: document.getElementById('ab-metric').value.trim(),
        stopLoss: document.getElementById('ab-stoploss').value.trim(),
        status: 'draft',
        created: new Date().toISOString(),
      });
      saveTests(tests);
      this.hideCreate();
      render();
    },

    activate(idx) {
      const tests = loadTests();
      if (tests[idx]) { tests[idx].status = 'active'; tests[idx].activated = new Date().toISOString(); }
      saveTests(tests);
      render();
    },

    conclude(idx) {
      const tests = loadTests();
      if (tests[idx]) { tests[idx].status = 'concluded'; tests[idx].concluded = new Date().toISOString(); }
      saveTests(tests);
      render();
    },

    remove(idx) {
      const tests = loadTests();
      tests.splice(idx, 1);
      saveTests(tests);
      render();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Render when Sales tab is shown (A/B tests live under Sales & Revenue)
    const tab = document.querySelector('[data-tab="sales"]');
    if (tab) tab.addEventListener('click', () => setTimeout(render, 50));
  });
})();
