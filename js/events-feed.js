// ============================================================
// WHAT'S ON — London Events Feed
// Curated recurring events database by month
// Data loaded from /data/events.json at initialisation.
// ============================================================
const EventsFeed = {
  events: [],

  async load() {
    if (this.events.length) return this.events;
    try {
      const res = await fetch('/data/events.json');
      if (res.ok) this.events = await res.json();
    } catch (err) {
      console.warn('EventsFeed load failed', err);
    }
    return this.events;
  },

  getEventsForMonth(month) {
    return this.events.filter(e => e.month === month);
  },

  getEventsForDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = new Set();
    for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
      months.add(d.getMonth());
    }
    months.add(end.getMonth());
    return this.events.filter(e => months.has(e.month));
  },

  getCategoryIcon(category) {
    const icons = { Music: '🎵', Art: '🎨', Food: '🍽️', Sport: '⚽', Theatre: '🎭', Festival: '🎪', Markets: '🏪', Family: '👨‍👩‍👧‍👦' };
    return icons[category] || '📅';
  },

  async renderEventsWidget(containerId, startDate, endDate) {
    await this.load();
    const container = document.getElementById(containerId);
    if (!container) return;

    const events = this.getEventsForDates(startDate, endDate);
    if (!events.length) return;

    container.innerHTML = `
      <div style="background:var(--color-surface);border-radius:var(--radius-lg);padding:1.5rem;margin-bottom:2rem;box-shadow:var(--shadow-sm);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
          <h4 style="margin:0;">What's On During Your Trip</h4>
          <a href="whats-on.html" style="font-size:0.85rem;color:var(--color-accent);font-weight:600;">See All →</a>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          ${events.slice(0, 5).map(e => `
            <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;border:1px solid var(--color-border);border-radius:var(--radius-md);">
              <span style="font-size:1.5rem;">${this.getCategoryIcon(e.category)}</span>
              <div style="flex:1;">
                <strong style="font-size:0.9rem;">${e.name}</strong>
                <div style="font-size:0.8rem;color:var(--color-text-muted);">${e.dateRange} · ${e.venue}</div>
              </div>
              ${e.free ? '<span class="badge badge--success" style="font-size:0.7rem;">FREE</span>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};
