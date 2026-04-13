// ============================================================
// LOYALTY & GAMIFICATION
// Points, badges, leaderboard. Earn rewards for reviews,
// referrals, bookings, and engagement.
// ============================================================
const Loyalty = {
  STORAGE_KEY: 'loyaltyData',

  badges: [
    { id: 'first-trip', name: 'First Adventure', icon: '🎒', description: 'Planned your first London trip', points: 50, condition: 'plan_trip' },
    { id: 'borough-explorer', name: 'Borough Market Explorer', icon: '🧀', description: 'Visited Borough Market', points: 25, condition: 'visit_borough' },
    { id: 'west-end', name: 'West End Regular', icon: '🎭', description: 'Booked a theatre show', points: 30, condition: 'book_theatre' },
    { id: 'pub-crawler', name: 'Pub Crawler', icon: '🍺', description: 'Visited 5+ historic pubs', points: 40, condition: 'visit_pubs' },
    { id: 'reviewer', name: 'Trusted Reviewer', icon: '⭐', description: 'Left 3+ venue reviews', points: 50, condition: 'write_reviews' },
    { id: 'social-butterfly', name: 'Social Butterfly', icon: '🦋', description: 'Shared your itinerary', points: 20, condition: 'share_itinerary' },
    { id: 'early-bird', name: 'Early Bird', icon: '🐦', description: 'Booked 30+ days in advance', points: 30, condition: 'book_early' },
    { id: 'neighbourhood-pro', name: 'Neighbourhood Pro', icon: '🗺️', description: 'Explored 5+ neighbourhoods', points: 60, condition: 'explore_neighbourhoods' },
    { id: 'referral-hero', name: 'Referral Hero', icon: '🦸', description: 'Referred 3+ friends', points: 75, condition: 'refer_friends' },
    { id: 'london-legend', name: 'London Legend', icon: '👑', description: 'Earned 500+ points', points: 100, condition: 'total_500' },
  ],

  tiers: [
    { name: 'Explorer', minPoints: 0, icon: '🎒', perks: 'Access to free London guide' },
    { name: 'Adventurer', minPoints: 100, icon: '🧭', perks: '5% off your next itinerary' },
    { name: 'Insider', minPoints: 250, icon: '🗝️', perks: '10% off + priority support' },
    { name: 'Legend', minPoints: 500, icon: '👑', perks: '15% off + exclusive content + early access' },
  ],

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('loyalty')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const data = this._getData();
    const tier = this._getCurrentTier(data.points);
    const nextTier = this._getNextTier(data.points);

    container.innerHTML = `
      <div class="ly-widget">
        <div class="ly-profile">
          <div class="ly-profile__tier-icon">${tier.icon}</div>
          <div class="ly-profile__info">
            <h3>${tier.name} Level</h3>
            <p class="ly-profile__points">${data.points} points</p>
          </div>
        </div>

        ${nextTier ? `
          <div class="ly-progress">
            <div class="ly-progress__bar">
              <div class="ly-progress__fill" style="width:${Math.min(100, ((data.points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100)}%"></div>
            </div>
            <small>${nextTier.minPoints - data.points} points to ${nextTier.name} (${nextTier.icon} ${nextTier.perks})</small>
          </div>
        ` : '<p class="ly-maxed">You\'ve reached the highest tier! 🎉</p>'}

        <div class="ly-section">
          <h4>Your Badges (${data.earnedBadges.length}/${this.badges.length})</h4>
          <div class="ly-badges">
            ${this.badges.map(b => {
              const earned = data.earnedBadges.includes(b.id);
              return `
                <div class="ly-badge ${earned ? 'ly-badge--earned' : 'ly-badge--locked'}">
                  <div class="ly-badge__icon">${earned ? b.icon : '🔒'}</div>
                  <div class="ly-badge__name">${b.name}</div>
                  <div class="ly-badge__desc">${b.description}</div>
                  <div class="ly-badge__points">${b.points} pts</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="ly-section">
          <h4>Earn More Points</h4>
          <div class="ly-earn-list">
            <div class="ly-earn"><span>📝 Write a venue review</span><span class="ly-earn__pts">+15 pts</span></div>
            <div class="ly-earn"><span>🔗 Share your referral link</span><span class="ly-earn__pts">+10 pts</span></div>
            <div class="ly-earn"><span>👥 Friend purchases via your link</span><span class="ly-earn__pts">+50 pts</span></div>
            <div class="ly-earn"><span>📸 Upload a trip photo</span><span class="ly-earn__pts">+5 pts</span></div>
            <div class="ly-earn"><span>🗺️ Complete your trip</span><span class="ly-earn__pts">+100 pts</span></div>
            <div class="ly-earn"><span>⭐ Leave a Trustpilot review</span><span class="ly-earn__pts">+25 pts</span></div>
          </div>
        </div>

        <div class="ly-section">
          <h4>Reward Tiers</h4>
          <div class="ly-tiers">
            ${this.tiers.map(t => `
              <div class="ly-tier ${data.points >= t.minPoints ? 'ly-tier--unlocked' : ''}">
                <span class="ly-tier__icon">${t.icon}</span>
                <div>
                  <strong>${t.name}</strong> (${t.minPoints}+ pts)<br>
                  <small>${t.perks}</small>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // Award points for an action
  awardPoints(action, amount) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('loyalty')) return;
    const data = this._getData();
    data.points += amount;
    data.history.push({ action, amount, date: new Date().toISOString() });
    this._save(data);
    this._checkBadges(data);
  },

  // Unlock a specific badge
  unlockBadge(badgeId) {
    const data = this._getData();
    if (!data.earnedBadges.includes(badgeId)) {
      const badge = this.badges.find(b => b.id === badgeId);
      if (badge) {
        data.earnedBadges.push(badgeId);
        data.points += badge.points;
        this._save(data);
      }
    }
  },

  _checkBadges(data) {
    if (data.points >= 500 && !data.earnedBadges.includes('london-legend')) {
      this.unlockBadge('london-legend');
    }
  },

  _getCurrentTier(points) {
    let tier = this.tiers[0];
    for (const t of this.tiers) {
      if (points >= t.minPoints) tier = t;
    }
    return tier;
  },

  _getNextTier(points) {
    for (const t of this.tiers) {
      if (t.minPoints > points) return t;
    }
    return null;
  },

  _getData() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      return {
        points: stored.points || 0,
        earnedBadges: stored.earnedBadges || [],
        history: stored.history || []
      };
    } catch (e) {
      return { points: 0, earnedBadges: [], history: [] };
    }
  },

  _save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
};
