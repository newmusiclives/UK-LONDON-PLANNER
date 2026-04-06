// ============================================================
// A/B TESTING — Pricing page variant testing
// ============================================================
const ABTesting = {
  STORAGE_KEY: 'abTestVariants',
  RESULTS_KEY: 'abTestResults',

  tests: {
    pricing: {
      name: 'Pricing Tier Test',
      variants: {
        control: {
          label: 'Control ($50/$75/$99)',
          tier1: 50, tier2: 75, tier3: 99
        },
        lower: {
          label: 'Lower ($15/$35/$65)',
          tier1: 15, tier2: 35, tier3: 65
        },
        higher: {
          label: 'Higher ($25/$49/$89)',
          tier1: 25, tier2: 49, tier3: 89
        }
      }
    },
    cta: {
      name: 'CTA Button Text',
      variants: {
        control: { label: 'Plan My Trip', text: 'Plan My Trip' },
        action: { label: 'Start Planning Now', text: 'Start Planning Now' },
        value: { label: 'Get My Itinerary', text: 'Get My Itinerary' }
      }
    },
    hero: {
      name: 'Hero Headline',
      variants: {
        control: { label: 'Expert-focused', text: 'Your Perfect London Trip, Planned by Experts' },
        personal: { label: 'Personal', text: 'Your Dream London Trip Starts Here' },
        social: { label: 'Social proof', text: 'Join 2,000+ Travellers Who Found Their Perfect London' }
      }
    }
  },

  init() {
    this.assignVariants();
    this.applyVariants();
  },

  assignVariants() {
    const stored = this.getAssignments();
    let changed = false;

    Object.keys(this.tests).forEach(testId => {
      if (!stored[testId]) {
        const variants = Object.keys(this.tests[testId].variants);
        stored[testId] = variants[Math.floor(Math.random() * variants.length)];
        changed = true;
      }
    });

    if (changed) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
    }
  },

  getAssignments() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || {};
    } catch { return {}; }
  },

  getVariant(testId) {
    const assignments = this.getAssignments();
    const variantKey = assignments[testId];
    if (!variantKey || !this.tests[testId]) return null;
    return { key: variantKey, ...this.tests[testId].variants[variantKey] };
  },

  applyVariants() {
    // Apply pricing variant
    const pricing = this.getVariant('pricing');
    if (pricing) {
      document.querySelectorAll('.price-card__amount').forEach((el, i) => {
        const prices = [pricing.tier1, pricing.tier2, pricing.tier3];
        if (prices[i] !== undefined) {
          el.innerHTML = `$${prices[i]}`;
        }
      });
      // Update purchase buttons
      document.querySelectorAll('[onclick*="handlePurchase"]').forEach(btn => {
        if (pricing.tier1 && btn.textContent.includes('$50')) {
          btn.textContent = btn.textContent.replace('$50', `$${pricing.tier1}`);
        }
      });
    }

    // Apply CTA variant
    const cta = this.getVariant('cta');
    if (cta) {
      document.querySelectorAll('.header__cta').forEach(el => {
        el.textContent = cta.text;
      });
    }

    // Apply hero variant
    const hero = this.getVariant('hero');
    if (hero) {
      const heroH1 = document.querySelector('.hero h1');
      if (heroH1) {
        heroH1.innerHTML = hero.text.replace('London', '<span>London</span>');
      }
    }
  },

  trackConversion(testId, action = 'click') {
    const assignments = this.getAssignments();
    const variant = assignments[testId];
    if (!variant) return;

    try {
      const results = JSON.parse(localStorage.getItem(this.RESULTS_KEY)) || {};
      if (!results[testId]) results[testId] = {};
      if (!results[testId][variant]) results[testId][variant] = { views: 0, conversions: 0 };

      if (action === 'view') {
        results[testId][variant].views++;
      } else {
        results[testId][variant].conversions++;
      }

      localStorage.setItem(this.RESULTS_KEY, JSON.stringify(results));

      // Track in GA4
      if (typeof Analytics !== 'undefined' && window.gtag) {
        gtag('event', 'ab_test_' + action, {
          test_id: testId,
          variant: variant,
          test_name: this.tests[testId]?.name
        });
      }
    } catch {}
  },

  getResults() {
    try {
      return JSON.parse(localStorage.getItem(this.RESULTS_KEY)) || {};
    } catch { return {}; }
  },

  renderDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const results = this.getResults();
    const assignments = this.getAssignments();

    container.innerHTML = `
      <h3 style="margin-bottom:1rem;">A/B Test Results</h3>
      ${Object.entries(this.tests).map(([testId, test]) => {
        const testResults = results[testId] || {};
        const currentVariant = assignments[testId];
        return `
          <div style="background:var(--color-surface);border-radius:var(--radius-lg);padding:1.5rem;margin-bottom:1rem;border:1px solid var(--color-border);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
              <h4 style="margin:0;">${test.name}</h4>
              <span class="badge badge--accent">Your variant: ${currentVariant}</span>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
              <thead>
                <tr style="border-bottom:2px solid var(--color-border);">
                  <th style="text-align:left;padding:0.5rem;">Variant</th>
                  <th style="text-align:left;padding:0.5rem;">Label</th>
                  <th style="text-align:right;padding:0.5rem;">Views</th>
                  <th style="text-align:right;padding:0.5rem;">Conversions</th>
                  <th style="text-align:right;padding:0.5rem;">Rate</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(test.variants).map(([key, variant]) => {
                  const r = testResults[key] || { views: 0, conversions: 0 };
                  const rate = r.views > 0 ? ((r.conversions / r.views) * 100).toFixed(1) : '0.0';
                  return `
                    <tr style="border-bottom:1px solid var(--color-border);">
                      <td style="padding:0.5rem;font-weight:600;">${key} ${key === currentVariant ? '(you)' : ''}</td>
                      <td style="padding:0.5rem;color:var(--color-text-muted);">${variant.label}</td>
                      <td style="padding:0.5rem;text-align:right;">${r.views}</td>
                      <td style="padding:0.5rem;text-align:right;">${r.conversions}</td>
                      <td style="padding:0.5rem;text-align:right;font-weight:600;color:${parseFloat(rate) > 5 ? 'var(--color-success)' : 'var(--color-text-muted)'};">${rate}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `;
      }).join('')}
      <button class="btn btn--outline btn--small" onclick="localStorage.removeItem('${this.RESULTS_KEY}');ABTesting.renderDashboard('${containerId}');">Reset Results</button>
      <button class="btn btn--outline btn--small" onclick="localStorage.removeItem('${this.STORAGE_KEY}');location.reload();">Reassign Variants</button>
    `;
  }
};

// Track page view for active tests
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ABTesting !== 'undefined') {
    ABTesting.init();
    // Track views on key pages
    const path = window.location.pathname;
    if (path.includes('index') || path === '/') ABTesting.trackConversion('hero', 'view');
    if (path.includes('index') || path === '/') ABTesting.trackConversion('pricing', 'view');
    if (path.includes('index') || path === '/') ABTesting.trackConversion('cta', 'view');
  }
});
