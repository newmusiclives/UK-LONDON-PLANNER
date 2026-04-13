/* ============================================================
   PROMOTIONS MODULE — London & UK Planner Admin Panel
   Newsletter generation, blog generation, social media,
   sponsor management, and featured venue tracking.
   ============================================================ */

// ============================================================
// 1. PromotionsData — Content & venue data management
// ============================================================
const PromotionsData = {
  _content: null,
  _venues: null,
  _STORAGE_KEY: 'promotions_content',

  async loadContent() {
    try {
      const res = await fetch('data/promotions-content.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const base = await res.json();
      const overrides = this._getLocalOverrides();
      this._content = {
        trivia: [...(base.trivia || []), ...(overrides.trivia || [])],
        polls: [...(base.polls || []), ...(overrides.polls || [])],
        adviceArticles: [...(base.adviceArticles || []), ...(overrides.adviceArticles || [])]
      };
      return this._content;
    } catch (e) {
      console.warn('PromotionsData.loadContent failed:', e);
      const overrides = this._getLocalOverrides();
      this._content = {
        trivia: overrides.trivia || [],
        polls: overrides.polls || [],
        adviceArticles: overrides.adviceArticles || []
      };
      return this._content;
    }
  },

  async loadVenues() {
    const sources = [
      { key: 'attractions', url: 'data/attractions.json' },
      { key: 'restaurants', url: 'data/restaurants.json' },
      { key: 'pubs', url: 'data/nightlife.json' },
      { key: 'cafes', url: 'data/cafes.json' }
    ];
    const results = await Promise.allSettled(
      sources.map(s => fetch(s.url).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }))
    );
    this._venues = {};
    sources.forEach((s, i) => {
      this._venues[s.key] = results[i].status === 'fulfilled' ? results[i].value : [];
    });
    return this._venues;
  },

  getVenues() {
    return this._venues;
  },

  getTrivia(excludeIds) {
    return this._pickRandom(this._content?.trivia, excludeIds);
  },

  getPoll(excludeIds) {
    return this._pickRandom(this._content?.polls, excludeIds);
  },

  getAdvice(excludeIds) {
    return this._pickRandom(this._content?.adviceArticles, excludeIds);
  },

  addTrivia(item) {
    const overrides = this._getLocalOverrides();
    overrides.trivia = overrides.trivia || [];
    overrides.trivia.push(item);
    this._saveLocalOverrides(overrides);
    if (this._content) this._content.trivia.push(item);
  },

  addPoll(item) {
    const overrides = this._getLocalOverrides();
    overrides.polls = overrides.polls || [];
    overrides.polls.push(item);
    this._saveLocalOverrides(overrides);
    if (this._content) this._content.polls.push(item);
  },

  addAdvice(item) {
    const overrides = this._getLocalOverrides();
    overrides.adviceArticles = overrides.adviceArticles || [];
    overrides.adviceArticles.push(item);
    this._saveLocalOverrides(overrides);
    if (this._content) this._content.adviceArticles.push(item);
  },

  saveContent() {
    if (!this._content) return;
    localStorage.setItem(this._STORAGE_KEY, JSON.stringify(this._content));
  },

  _getLocalOverrides() {
    try {
      return JSON.parse(localStorage.getItem(this._STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  },

  _saveLocalOverrides(data) {
    localStorage.setItem(this._STORAGE_KEY, JSON.stringify(data));
  },

  _pickRandom(arr, excludeIds) {
    if (!arr || arr.length === 0) return null;
    const excluded = new Set(excludeIds || []);
    const candidates = arr.filter(item => !excluded.has(item.id));
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
};


// ============================================================
// 2. PromotionsHistory — Featured venue tracking
// ============================================================
const PromotionsHistory = {
  _STORAGE_KEY: 'promotions_featured_history',

  record(venueId, type, medium, date) {
    const history = this._load();
    history.push({
      venueId,
      type,
      medium,
      date: date || new Date().toISOString().slice(0, 10)
    });
    localStorage.setItem(this._STORAGE_KEY, JSON.stringify(history));
  },

  getRecent(days) {
    if (days === undefined) days = 90;
    const history = this._load();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return [...new Set(
      history
        .filter(entry => entry.date >= cutoffStr)
        .map(entry => entry.venueId)
    )];
  },

  autoPick(venues, excludeRecent) {
    if (excludeRecent === undefined) excludeRecent = true;
    if (!venues || venues.length === 0) return null;

    const recentIds = excludeRecent ? new Set(this.getRecent(90)) : new Set();
    const eligible = venues.filter(v => !recentIds.has(v.id));
    const pool = eligible.length > 0 ? eligible : venues;

    // Prefer venues with affiliate URLs — weight them 3x
    const weighted = [];
    pool.forEach(v => {
      const weight = v.affiliateUrl ? 3 : 1;
      for (let i = 0; i < weight; i++) weighted.push(v);
    });

    return weighted[Math.floor(Math.random() * weighted.length)];
  },

  getAll() {
    return this._load();
  },

  clear() {
    localStorage.removeItem(this._STORAGE_KEY);
  },

  _load() {
    try {
      return JSON.parse(localStorage.getItem(this._STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }
};


// ============================================================
// 3. SponsorManager — 3-slot sponsor management
// ============================================================
const SponsorManager = {
  _STORAGE_KEY: 'promotions_sponsors',
  _MAX_SLOTS: 3,

  get() {
    try {
      const stored = JSON.parse(localStorage.getItem(this._STORAGE_KEY));
      if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch { /* fall through */ }
    return this._emptySlots();
  },

  save(slots) {
    const data = slots.slice(0, this._MAX_SLOTS);
    while (data.length < this._MAX_SLOTS) {
      data.push(this._emptySlot(data.length));
    }
    localStorage.setItem(this._STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  getActiveSponsors() {
    const today = new Date().toISOString().slice(0, 10);
    return this.get().filter(s =>
      s.active &&
      s.name &&
      (!s.startDate || s.startDate <= today) &&
      (!s.endDate || s.endDate >= today)
    );
  },

  update(index, fields) {
    const slots = this.get();
    if (index < 0 || index >= this._MAX_SLOTS) return slots;
    slots[index] = { ...slots[index], ...fields };
    return this.save(slots);
  },

  clear(index) {
    const slots = this.get();
    if (index < 0 || index >= this._MAX_SLOTS) return slots;
    slots[index] = this._emptySlot(index);
    return this.save(slots);
  },

  _emptySlots() {
    return Array.from({ length: this._MAX_SLOTS }, (_, i) => this._emptySlot(i));
  },

  _emptySlot(index) {
    return {
      id: `sponsor-${index}`,
      name: '',
      imageUrl: '',
      linkUrl: '',
      altText: '',
      startDate: '',
      endDate: '',
      active: false,
      type: 'affiliate'
    };
  }
};


// ============================================================
// 4. NewsletterBuilder — Complete inline-CSS HTML email
// ============================================================
const NewsletterBuilder = {

  /**
   * @param {Object} config
   * @param {Object} config.attraction - Venue object
   * @param {Object} config.restaurant - Venue object
   * @param {Object} config.pub - Venue object
   * @param {Object} config.advice - Advice article object
   * @param {Object} config.trivia - Trivia object
   * @param {Object} config.poll - Poll object
   * @param {Array}  config.sponsors - Array of sponsor objects
   * @param {number} config.issueNumber
   * @param {string} config.sendDate - e.g. "6 April 2026"
   * @returns {string} Complete HTML email
   */
  build(config) {
    const c = config;
    const issueLabel = `Issue #${c.issueNumber} &mdash; ${c.sendDate}`;

    const attractionHtml = this._venueArticle(c.attraction, 'Featured Attraction', 'Book Now &rarr;', '#C9A84C');
    const restaurantHtml = this._venueArticle(c.restaurant, 'Featured Restaurant', 'Reserve a Table &rarr;', '#C9A84C');
    const pubHtml = this._venueArticle(c.pub, 'Featured Pub', 'Find It &rarr;', '#C9A84C');
    const adviceHtml = this._adviceSection(c.advice);
    const pollHtml = this._pollSection(c.poll);
    const triviaHtml = this._triviaSection(c.trivia);
    const triviaAnswer = c.trivia ? this._escHtml(c.trivia.answer) : '';
    const triviaFunFact = c.trivia && c.trivia.funFact ? this._escHtml(c.trivia.funFact) : '';

    // 3 sponsor positions: top, middle, bottom
    const sponsors = c.sponsors && c.sponsors.length > 0 ? c.sponsors : this._defaultSponsors();
    const sponsorTop = this._singleSponsorBanner(sponsors[0], 'Sponsored');
    const sponsorMid = this._singleSponsorBanner(sponsors[1] || sponsors[0], 'From Our Partners');
    const sponsorBottom = this._singleSponsorBanner(sponsors[2] || sponsors[0], 'Recommended');

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<title>The London Edit &mdash; ${issueLabel}</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f8f7f4;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<!-- Wrapper -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f8f7f4;">
<tr><td align="center" style="padding:20px 10px;">

<!-- Email container -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;">

<!-- Header -->
<tr>
<td style="background-color:#1B2A4A;padding:32px 30px;text-align:center;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#C9A84C;text-align:center;padding-bottom:4px;letter-spacing:1.5px;text-transform:uppercase;">
    &#127468;&#127463; London &amp; UK Planner presents
  </td></tr>
  <tr><td style="font-family:Georgia,serif;font-size:32px;font-weight:bold;color:#ffffff;text-align:center;line-height:1.2;">
    The London Edit
  </td></tr>
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#C9A84C;text-align:center;padding-top:8px;letter-spacing:0.5px;">
    ${issueLabel}
  </td></tr>
  </table>
</td>
</tr>

<!-- Divider line -->
<tr><td style="height:4px;background-color:#C9A84C;font-size:0;line-height:0;">&nbsp;</td></tr>

${sponsorTop}

${attractionHtml}

${pollHtml}

${restaurantHtml}

${sponsorMid}

${pubHtml}

${triviaHtml}

${adviceHtml}

${sponsorBottom}

<!-- Footer -->
<tr>
<td style="background-color:#1B2A4A;padding:24px 30px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  ${triviaAnswer ? `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;padding-bottom:12px;line-height:1.5;">
    <strong>Trivia answer:</strong> ${triviaAnswer}${triviaFunFact ? ` &mdash; ${triviaFunFact}` : ''}
  </td></tr>` : ''}
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;text-align:center;line-height:1.6;">
    You are receiving this because you subscribed to The London Edit by London &amp; UK Planner.<br>
    <a href="{{unsubscribe_url}}" style="color:#C9A84C;text-decoration:underline;">Unsubscribe</a> &nbsp;|&nbsp;
    <a href="{{preferences_url}}" style="color:#C9A84C;text-decoration:underline;">Manage Preferences</a>
  </td></tr>
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#666666;text-align:center;padding-top:12px;">
    &copy; ${new Date().getFullYear()} London &amp; UK Planner. All rights reserved.
  </td></tr>
  </table>
</td>
</tr>

</table>
<!-- /Email container -->

</td></tr>
</table>
<!-- /Wrapper -->

</body>
</html>`;
  },

  getSubjectLine(config) {
    const parts = [];
    if (config.attraction) parts.push(config.attraction.name);
    if (config.restaurant) parts.push(config.restaurant.name);
    const highlights = parts.join(' + ');
    return `London This Week: ${highlights} | Issue #${config.issueNumber}`;
  },

  // -- Private helpers --

  _defaultSponsors() {
    return [
      { name: 'GetYourGuide', linkUrl: 'https://www.getyourguide.com/london-l57/', imageUrl: '', altText: 'Book London attractions on GetYourGuide', active: true, type: 'affiliate' },
      { name: 'Booking.com', linkUrl: 'https://www.booking.com/city/gb/london.html', imageUrl: '', altText: 'Find London hotels on Booking.com', active: true, type: 'affiliate' },
      { name: 'Airalo eSIM', linkUrl: 'https://www.airalo.com/united-kingdom', imageUrl: '', altText: 'Get a UK eSIM from Airalo', active: true, type: 'affiliate' }
    ];
  },

  _singleSponsorBanner(sponsor, label) {
    if (!sponsor || !sponsor.name) return '';
    const link = sponsor.linkUrl || '#';
    return `
<!-- ${label} -->
<tr>
<td style="padding:16px 30px;background-color:#f8f7f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#999999;padding-bottom:8px;">
    ${this._escHtml(label)}
  </td></tr>
  <tr><td style="text-align:center;">
    <a href="${this._escAttr(link)}" target="_blank" style="text-decoration:none;">
      ${sponsor.imageUrl
        ? `<img src="${this._escAttr(sponsor.imageUrl)}" alt="${this._escAttr(sponsor.altText || sponsor.name)}" width="540" style="display:block;margin:0 auto;max-width:540px;border-radius:6px;" />`
        : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td style="background-color:#1B2A4A;border-radius:6px;padding:18px 24px;text-align:center;">
            <span style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#C9A84C;">${this._escHtml(sponsor.name)}</span>
            <br><span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#ffffff;">${this._escHtml(sponsor.altText || 'Visit our partner')}</span>
          </td></tr></table>`
      }
    </a>
  </td></tr>
  </table>
</td>
</tr>`;
  },

  _venueArticle(venue, label, ctaText, ctaColor) {
    if (!venue) return '';
    // Build a longer-form article (up to 400 words) from venue data
    const parts = [];
    if (venue.description) parts.push(venue.description);
    if (venue.tips) parts.push(venue.tips);

    // Generate additional editorial content based on venue data
    const neighbourhood = venue.neighbourhood || '';
    if (neighbourhood) {
      parts.push('Located in ' + neighbourhood + ', this is one of the area\'s standout destinations that our team regularly recommends to visitors.');
    }
    if (venue.tags && venue.tags.length > 0) {
      const tagLabels = venue.tags.slice(0, 4).join(', ');
      parts.push('Perfect for anyone interested in ' + tagLabels + '. Whether you\'re visiting London for the first time or returning for another trip, this is well worth adding to your itinerary.');
    }
    if (venue.address) {
      parts.push('You\'ll find it at ' + venue.address + '. We recommend checking opening times before you visit as they can vary by season.');
    }
    const cost = venue.estimatedCost
      ? (venue.estimatedCost.amount === 0 ? 'free' : (venue.estimatedCost.currency === 'GBP' ? '\u00A3' : '$') + venue.estimatedCost.amount)
      : '';
    if (cost) {
      var costPhrases = [
        'A worthwhile addition to any London itinerary at this price point.',
        'Well-priced for what you get — a highlight of any trip to the city.',
        'Budget-friendly and highly rated by our team of London experts.',
        'Great value and consistently recommended by returning visitors.',
        'Worth every penny — one of the best experiences in this price range.'
      ];
      var freePhrase = [
        'One of the great things about London is how much you can experience without spending a penny.',
        'Completely free to enjoy — proof that the best things in London don\'t always cost a fortune.',
        'No entry fee required. London is full of incredible free experiences like this one.'
      ];
      if (cost === 'free') {
        parts.push('Entry is completely free. ' + freePhrase[Math.floor(Math.random() * freePhrase.length)]);
      } else {
        parts.push('Expect to spend around ' + cost + ' per person. ' + costPhrases[Math.floor(Math.random() * costPhrases.length)]);
      }
    }

    // Build paragraphs — each part becomes a separate <p>
    const paragraphs = parts.map(p => {
      const words = p.split(/\s+/);
      return words.length > 100 ? words.slice(0, 100).join(' ') + '...' : p;
    });

    const link = venue.affiliateUrl || '#';
    const paraStyle = 'font-family:Georgia,serif;font-size:15px;color:#333333;line-height:1.8;margin:0;padding-bottom:14px;';
    const paragraphsHtml = paragraphs.map(p =>
      `<tr><td style="${paraStyle}">${this._escHtml(p)}</td></tr>`
    ).join('');

    return `
<!-- ${label} -->
<tr>
<td style="padding:28px 30px 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#C9A84C;padding-bottom:8px;">
    ${this._escHtml(label)}
  </td></tr>
  <tr><td style="font-family:Georgia,serif;font-size:24px;font-weight:bold;color:#1B2A4A;line-height:1.3;padding-bottom:10px;">
    ${this._escHtml(venue.name)}
  </td></tr>
  ${neighbourhood ? `<tr><td style="padding-bottom:12px;">
    <span style="display:inline-block;background-color:#f0ede6;color:#666666;font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:4px 12px;border-radius:12px;">&#128205; ${this._escHtml(neighbourhood)}</span>
    ${cost ? `<span style="display:inline-block;background-color:#f0ede6;color:#666666;font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:4px 12px;border-radius:12px;margin-left:6px;">&#128176; ${cost}</span>` : ''}
  </td></tr>` : ''}
  ${paragraphsHtml}
  <tr><td>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background-color:${ctaColor};border-radius:6px;">
      <a href="${this._escAttr(link)}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#1B2A4A;text-decoration:none;">${ctaText}</a>
    </td></tr>
    </table>
  </td></tr>
  </table>
</td>
</tr>
<!-- Divider -->
<tr><td style="padding:0 30px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #eeeeee;font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table></td></tr>`;
  },

  _venueCard(venue, label, ctaText, ctaColor) {
    if (!venue) return '';
    const desc = this._truncate(venue.description, 160);
    const neighbourhood = venue.neighbourhood ? venue.neighbourhood : '';
    const link = venue.affiliateUrl || '#';
    const cost = venue.estimatedCost
      ? (venue.estimatedCost.amount === 0 ? 'Free' : `${venue.estimatedCost.currency === 'GBP' ? '\u00A3' : '$'}${venue.estimatedCost.amount}`)
      : '';

    return `
<!-- ${label} -->
<tr>
<td style="padding:28px 30px 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#C9A84C;padding-bottom:8px;">
    ${this._escHtml(label)}
  </td></tr>
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#1B2A4A;line-height:1.3;padding-bottom:8px;">
    ${this._escHtml(venue.name)}
  </td></tr>
  ${neighbourhood ? `<tr><td style="padding-bottom:10px;">
    <span style="display:inline-block;background-color:#f0ede6;color:#666666;font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:4px 10px;border-radius:12px;">${this._escHtml(neighbourhood)}${cost ? ` &middot; ${cost}` : ''}</span>
  </td></tr>` : ''}
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#333333;line-height:1.6;padding-bottom:16px;">
    ${this._escHtml(desc)}
  </td></tr>
  ${venue.tips ? `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#666666;line-height:1.5;padding-bottom:16px;font-style:italic;">
    &#128161; ${this._escHtml(this._truncate(venue.tips, 120))}
  </td></tr>` : ''}
  <tr><td>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background-color:${ctaColor};border-radius:6px;">
      <a href="${this._escAttr(link)}" target="_blank" style="display:inline-block;padding:12px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#1B2A4A;text-decoration:none;">${ctaText}</a>
    </td></tr>
    </table>
  </td></tr>
  </table>
</td>
</tr>
<!-- Divider -->
<tr><td style="padding:0 30px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #eeeeee;font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table></td></tr>`;
  },

  _adviceSection(advice) {
    if (!advice) return '';
    const body = advice.body || '';
    // Split into paragraphs by double newline or sentences
    const rawParas = body.split(/\n\n+/).filter(p => p.trim());
    const paras = rawParas.length > 1 ? rawParas : this._splitIntoParas(body, 2);
    const paraStyle = 'font-family:Georgia,serif;font-size:15px;color:#333333;line-height:1.8;margin:0;padding-bottom:12px;';
    const parasHtml = paras.map(p => `<tr><td style="${paraStyle}">${this._escHtml(p.trim())}</td></tr>`).join('');

    return `
<!-- Advice Article -->
<tr>
<td style="padding:28px 30px 24px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#C9A84C;padding-bottom:8px;">
    Expert Advice
  </td></tr>
  <tr><td style="font-family:Georgia,serif;font-size:20px;font-weight:bold;color:#1B2A4A;line-height:1.3;padding-bottom:10px;">
    ${this._escHtml(advice.title)}
  </td></tr>
  ${advice.category ? `<tr><td style="padding-bottom:10px;">
    <span style="display:inline-block;background-color:#f0ede6;color:#666666;font-family:Arial,Helvetica,sans-serif;font-size:12px;padding:4px 10px;border-radius:12px;">${this._escHtml(advice.category)}</span>
  </td></tr>` : ''}
  ${parasHtml}
  <tr><td>
    <a href="{{advice_url}}" target="_blank" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#C9A84C;text-decoration:none;">Read More &rarr;</a>
  </td></tr>
  </table>
</td>
</tr>
<tr><td style="padding:0 30px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #eeeeee;font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table></td></tr>`;
  },

  _sponsorRow(sponsors) {
    const active = sponsors.filter(s => s && s.name && s.active);
    if (active.length === 0) return '';

    const cellWidth = Math.floor(540 / Math.min(active.length, 3));
    const cells = active.slice(0, 3).map(s => `
    <td width="${cellWidth}" style="padding:8px;text-align:center;vertical-align:top;">
      <a href="${this._escAttr(s.linkUrl || '#')}" target="_blank" style="text-decoration:none;">
        ${s.imageUrl
          ? `<img src="${this._escAttr(s.imageUrl)}" alt="${this._escAttr(s.altText || s.name)}" width="${cellWidth - 20}" style="display:block;margin:0 auto 8px;max-width:${cellWidth - 20}px;border-radius:4px;" />`
          : `<div style="background-color:#f0ede6;border-radius:4px;padding:20px 10px;margin-bottom:8px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#666666;">${this._escHtml(s.name)}</div>`
        }
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#666666;">${this._escHtml(s.name)}</span>
      </a>
    </td>`).join('');

    return `
<!-- Sponsors -->
<tr>
<td style="padding:20px 30px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#999999;text-align:center;padding-bottom:12px;">
    Our Partners
  </td></tr>
  <tr>${cells}</tr>
  </table>
</td>
</tr>
<tr><td style="padding:0 30px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #eeeeee;font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table></td></tr>`;
  },

  _pollSection(poll) {
    if (!poll) return '';
    return `
<!-- Poll -->
<tr>
<td style="padding:24px 30px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#C9A84C;padding-bottom:8px;">
    Weekly Poll
  </td></tr>
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#1B2A4A;line-height:1.3;padding-bottom:14px;">
    ${this._escHtml(poll.question)}
  </td></tr>
  <tr><td>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr><td style="background-color:#C9A84C;border-radius:6px;">
      <a href="{{poll_url}}" target="_blank" style="display:inline-block;padding:12px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#1B2A4A;text-decoration:none;">Vote Now &rarr;</a>
    </td></tr>
    </table>
  </td></tr>
  </table>
</td>
</tr>
<tr><td style="padding:0 30px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="border-top:1px solid #eeeeee;font-size:0;line-height:0;height:1px;">&nbsp;</td></tr></table></td></tr>`;
  },

  _triviaSection(trivia) {
    if (!trivia) return '';
    const optionsHtml = (trivia.options || []).map((opt, i) => {
      const letter = String.fromCharCode(65 + i); // A, B, C, D
      return `<tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#333333;line-height:1.6;padding:4px 0;">
        <strong style="color:#1B2A4A;">${letter}.</strong> ${this._escHtml(opt)}
      </td></tr>`;
    }).join('');

    return `
<!-- Trivia -->
<tr>
<td style="padding:24px 30px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px;color:#C9A84C;padding-bottom:8px;">
    London Trivia
  </td></tr>
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#1B2A4A;line-height:1.3;padding-bottom:12px;">
    ${this._escHtml(trivia.question)}
  </td></tr>
  <tr><td>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    ${optionsHtml}
    </table>
  </td></tr>
  <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;padding-top:10px;font-style:italic;">
    Answer revealed in the footer &#8595;
  </td></tr>
  </table>
</td>
</tr>`;
  },

  _splitIntoParas(text, count) {
    var sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    if (sentences.length <= count) return [text];
    var perPara = Math.ceil(sentences.length / count);
    var paras = [];
    for (var i = 0; i < sentences.length; i += perPara) {
      paras.push(sentences.slice(i, i + perPara).join('').trim());
    }
    return paras;
  },

  _escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  _escAttr(str) {
    return this._escHtml(str);
  },

  _truncate(str, maxLen) {
    if (!str) return '';
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
  },

  _truncateWords(str, maxWords) {
    if (!str) return '';
    const words = str.split(/\s+/);
    if (words.length <= maxWords) return str;
    return words.slice(0, maxWords).join(' ');
  }
};


// ============================================================
// 5. BlogGenerator — Full HTML blog post generation
// ============================================================
const BlogGenerator = {

  /**
   * @param {Object} config
   * @param {string} config.title
   * @param {string} config.slug
   * @param {string} config.metaDescription
   * @param {string} config.bodyHtml - Inner article HTML
   * @param {string} config.datePublished - ISO date string
   * @param {string} config.category - e.g. "Travel Guide"
   * @returns {string} Complete HTML document
   */
  generate(config) {
    const c = config;
    const dateModified = new Date().toISOString().slice(0, 10);
    const schemaJson = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: c.title,
      description: c.metaDescription,
      author: { '@type': 'Organization', name: 'London & UK Planner' },
      publisher: { '@type': 'Organization', name: 'London & UK Planner' },
      datePublished: c.datePublished,
      dateModified: dateModified,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://londonplanner.com/${c.slug}.html`
      }
    }, null, 4);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this._escHtml(c.title)} &mdash; London &amp; UK Planner</title>
  <meta name="description" content="${this._escAttr(c.metaDescription)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/responsive.css">
  <script type="application/ld+json">
  ${schemaJson}
  </script>
</head>
<body>
  <header class="header" id="site-header"></header>
  <main class="main">
    <section class="section section--dark" style="text-align:center;padding:4rem 0;">
      <div class="container">
        <span class="badge badge--accent" style="margin-bottom:1rem;display:inline-block;">${this._escHtml(c.category || 'Travel Guide')}</span>
        <h1 style="color:white;">${this._escHtml(c.title)}</h1>
        <div class="divider"></div>
        <p style="color:rgba(255,255,255,0.8);max-width:600px;margin:0 auto;">${this._escHtml(c.metaDescription)}</p>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow">
        ${c.bodyHtml}

        <div style="background:var(--color-primary);border-radius:var(--radius-xl);padding:3rem;text-align:center;margin-top:2rem;">
          <h3 style="color:white;margin-bottom:0.5rem;">Ready to Plan Your London Trip?</h3>
          <p style="color:rgba(255,255,255,0.7);margin-bottom:1.5rem;">Use our free trip planner to build a personalised itinerary based on your interests, budget, and travel dates.</p>
          <a href="wizard.html" class="btn btn--primary btn--large">Build My Itinerary</a>
        </div>
      </div>
    </section>
  </main>
  <footer class="footer" id="site-footer"></footer>
  <script src="js/config.js"></script>
  <script src="js/state.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/analytics.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      UI.init();
    });
  </script>
</body>
</html>`;
  },

  /**
   * Creates a "This Week in London" blog post from newsletter content.
   */
  generateFromNewsletter(newsletterConfig) {
    const c = newsletterConfig;
    const parts = [];

    if (c.attraction) {
      parts.push(`
        <h2 style="margin-bottom:1rem;">Featured Attraction: ${this._escHtml(c.attraction.name)}</h2>
        <div class="card" style="margin-bottom:1.5rem;border-left:4px solid var(--color-accent);">
          <div class="card__body">
            <p style="margin-top:0.75rem;">${this._escHtml(c.attraction.description)}</p>
            ${c.attraction.neighbourhood ? `<p style="margin-top:0.5rem;color:var(--color-muted);font-size:0.9rem;"><strong>Neighbourhood:</strong> ${this._escHtml(c.attraction.neighbourhood)}</p>` : ''}
            ${c.attraction.tips ? `<p style="margin-top:0.5rem;font-style:italic;color:var(--color-muted);">Tip: ${this._escHtml(c.attraction.tips)}</p>` : ''}
            ${c.attraction.affiliateUrl ? `<p style="margin-top:1rem;"><a href="${this._escAttr(c.attraction.affiliateUrl)}" class="btn btn--primary" target="_blank" rel="noopener">Book Now</a></p>` : ''}
          </div>
        </div>`);
    }

    if (c.restaurant) {
      parts.push(`
        <h2 style="margin-bottom:1rem;">Featured Restaurant: ${this._escHtml(c.restaurant.name)}</h2>
        <div class="card" style="margin-bottom:1.5rem;border-left:4px solid var(--color-accent);">
          <div class="card__body">
            <p style="margin-top:0.75rem;">${this._escHtml(c.restaurant.description)}</p>
            ${c.restaurant.neighbourhood ? `<p style="margin-top:0.5rem;color:var(--color-muted);font-size:0.9rem;"><strong>Neighbourhood:</strong> ${this._escHtml(c.restaurant.neighbourhood)}</p>` : ''}
            ${c.restaurant.affiliateUrl ? `<p style="margin-top:1rem;"><a href="${this._escAttr(c.restaurant.affiliateUrl)}" class="btn btn--primary" target="_blank" rel="noopener">Reserve a Table</a></p>` : ''}
          </div>
        </div>`);
    }

    if (c.pub) {
      parts.push(`
        <h2 style="margin-bottom:1rem;">Featured Pub: ${this._escHtml(c.pub.name)}</h2>
        <div class="card" style="margin-bottom:1.5rem;border-left:4px solid var(--color-accent);">
          <div class="card__body">
            <p style="margin-top:0.75rem;">${this._escHtml(c.pub.description)}</p>
            ${c.pub.neighbourhood ? `<p style="margin-top:0.5rem;color:var(--color-muted);font-size:0.9rem;"><strong>Neighbourhood:</strong> ${this._escHtml(c.pub.neighbourhood)}</p>` : ''}
            ${c.pub.affiliateUrl ? `<p style="margin-top:1rem;"><a href="${this._escAttr(c.pub.affiliateUrl)}" class="btn btn--primary" target="_blank" rel="noopener">Find It</a></p>` : ''}
          </div>
        </div>`);
    }

    if (c.advice) {
      parts.push(`
        <h2 style="margin-bottom:1rem;">Expert Advice: ${this._escHtml(c.advice.title)}</h2>
        <div class="card" style="margin-bottom:1.5rem;">
          <div class="card__body">
            <p style="margin-top:0.75rem;">${this._escHtml(c.advice.body)}</p>
          </div>
        </div>`);
    }

    if (c.trivia) {
      parts.push(`
        <h2 style="margin-bottom:1rem;">London Trivia</h2>
        <div class="card" style="margin-bottom:1.5rem;background:var(--color-bg-alt, #f8f7f4);">
          <div class="card__body">
            <p style="font-weight:bold;margin-bottom:0.75rem;">${this._escHtml(c.trivia.question)}</p>
            <ul style="margin:0;padding-left:1.2rem;">
              ${(c.trivia.options || []).map(o => `<li>${this._escHtml(o)}</li>`).join('\n              ')}
            </ul>
            <p style="margin-top:1rem;font-size:0.9rem;color:var(--color-muted);"><strong>Answer:</strong> ${this._escHtml(c.trivia.answer)}${c.trivia.funFact ? ` &mdash; ${this._escHtml(c.trivia.funFact)}` : ''}</p>
          </div>
        </div>`);
    }

    const datePublished = new Date().toISOString().slice(0, 10);
    const title = `This Week in London: ${c.attraction ? c.attraction.name : 'Top Picks'} | Issue #${c.issueNumber}`;

    return this.generate({
      title,
      slug: `blog-this-week-${c.issueNumber}`,
      metaDescription: `Issue #${c.issueNumber} of the London & UK Planner weekly: featured attraction, restaurant, pub, expert advice, and London trivia.`,
      bodyHtml: parts.join('\n'),
      datePublished,
      category: 'This Week in London'
    });
  },

  /**
   * Triggers a file download in the browser.
   */
  download(html, filename) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'blog-post.html';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  /**
   * Returns an HTML card snippet for pasting into blog.html index.
   */
  getBlogIndexSnippet(config) {
    const c = config;
    return `<a href="${this._escAttr(c.slug)}.html" class="card card--blog" style="text-decoration:none;display:block;margin-bottom:1.5rem;">
  <div class="card__body">
    <span class="badge badge--accent" style="margin-bottom:0.5rem;display:inline-block;">${this._escHtml(c.category || 'Travel Guide')}</span>
    <h3 style="margin-bottom:0.5rem;">${this._escHtml(c.title)}</h3>
    <p style="color:var(--color-muted);font-size:0.95rem;">${this._escHtml(c.metaDescription)}</p>
    <span style="color:var(--color-accent);font-weight:600;font-size:0.9rem;margin-top:0.75rem;display:inline-block;">Read More &rarr;</span>
  </div>
</a>`;
  },

  _escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  _escAttr(str) {
    return this._escHtml(str);
  }
};


// ============================================================
// 6. SocialGenerator — Social media content generation
// ============================================================
const SocialGenerator = {
  _BASE_HASHTAGS: '#LondonTravel #UKTravel #London',
  _TWITTER_MAX: 280,

  /**
   * Generates social post text for a venue.
   * @param {Object} venue - Venue object
   * @param {'twitter'|'facebook'|'instagram'} type - Platform
   * @returns {string}
   */
  generateFromVenue(venue, type) {
    if (!venue) return '';
    const tags = this._venueHashtags(venue);

    switch (type) {
      case 'twitter':
        return this._twitterVenue(venue, tags);
      case 'facebook':
        return this._facebookVenue(venue, tags);
      case 'instagram':
        return this._instagramVenue(venue, tags);
      default:
        return this._facebookVenue(venue, tags);
    }
  },

  /**
   * Generates a newsletter promo post.
   */
  generateNewsletterPromo(config, type) {
    const c = config;
    const issueNum = c.issueNumber;
    const attraction = c.attraction ? c.attraction.name : 'top London picks';

    switch (type) {
      case 'twitter': {
        const text = `New newsletter just dropped! Issue #${issueNum} features ${attraction} and more. Subscribe for free weekly London tips and hidden gems.\n\n${this._BASE_HASHTAGS} #Newsletter`;
        return this._fitTwitter(text);
      }
      case 'instagram':
        return `NEW ISSUE ALERT! Our Issue #${issueNum} newsletter is out now, featuring ${attraction} plus a top restaurant pick, a hidden pub gem, expert travel advice, and London trivia.\n\nSign up (link in bio) to get it delivered to your inbox every week — completely free.\n\nWhat would you like us to feature next? Drop your suggestions in the comments!\n\n${this._BASE_HASHTAGS} #LondonNewsletter #TravelNewsletter #VisitLondon #LondonGuide #TravelUK #LondonLife #ExploreLondon`;
      case 'facebook':
      default:
        return `Our Issue #${issueNum} newsletter is out now!\n\nThis week we are featuring ${attraction}, plus a top restaurant recommendation, a hidden pub gem, expert travel advice, and London trivia.\n\nSubscribe for free to get weekly London tips and hidden gems straight to your inbox.\n\n${this._BASE_HASHTAGS}`;
    }
  },

  /**
   * Sends social post data to GoHighLevel for scheduling.
   */
  async pushToGHL(postText, scheduledDate, platforms) {
    const apiKey = CONFIG.goHighLevel.apiKey;
    const baseUrl = CONFIG.goHighLevel.apiBaseUrl;

    if (!apiKey || apiKey.includes('YOUR_')) {
      console.log('SocialGenerator.pushToGHL — Demo mode:', { postText, scheduledDate, platforms });
      return { success: true, demo: true };
    }

    try {
      const response = await fetch(`${baseUrl}/social-media/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          content: postText,
          scheduledAt: scheduledDate,
          platforms: platforms || ['facebook', 'instagram'],
          source: 'London & UK Planner Promotions',
          timestamp: new Date().toISOString()
        })
      });
      return { success: response.ok, status: response.status };
    } catch (e) {
      console.warn('SocialGenerator.pushToGHL failed:', e);
      return { success: false, error: e.message };
    }
  },

  // -- Private helpers --

  _twitterVenue(venue, tags) {
    const desc = this._truncate(venue.description, 120);
    const link = venue.affiliateUrl ? `\n${venue.affiliateUrl}` : '';
    const text = `${venue.name}: ${desc}${link}\n\n${this._BASE_HASHTAGS} ${tags}`;
    return this._fitTwitter(text);
  },

  _facebookVenue(venue, tags) {
    return `${venue.name} — ${venue.neighbourhood || 'London'}\n\n${venue.description}\n\n${venue.tips ? `Tip: ${venue.tips}\n\n` : ''}${venue.affiliateUrl ? `Book / learn more: ${venue.affiliateUrl}\n\n` : ''}${this._BASE_HASHTAGS} ${tags}`;
  },

  _instagramVenue(venue, tags) {
    const cost = venue.estimatedCost
      ? (venue.estimatedCost.amount === 0 ? 'Free entry' : `From ${venue.estimatedCost.currency === 'GBP' ? '\u00A3' : '$'}${venue.estimatedCost.amount}`)
      : '';
    return `${venue.name} ${venue.neighbourhood ? '| ' + venue.neighbourhood : ''}\n\n${venue.description}\n\n${cost ? cost + '\n\n' : ''}${venue.tips ? 'Pro tip: ' + venue.tips + '\n\n' : ''}Save this for your next London trip!\n\n${this._BASE_HASHTAGS} ${tags} #VisitLondon #LondonGuide #TravelUK #LondonLife #ExploreLondon #LondonBucketList`;
  },

  _venueHashtags(venue) {
    const parts = [];
    if (venue.neighbourhood) {
      parts.push('#' + venue.neighbourhood.replace(/[^a-zA-Z0-9]/g, ''));
    }
    if (venue.tags && Array.isArray(venue.tags)) {
      venue.tags.slice(0, 3).forEach(tag => {
        parts.push('#' + tag.charAt(0).toUpperCase() + tag.slice(1));
      });
    }
    return parts.join(' ');
  },

  _fitTwitter(text) {
    if (text.length <= this._TWITTER_MAX) return text;
    // Progressively trim: remove extra hashtags, then truncate description
    const lines = text.split('\n');
    let result = text;
    // Try removing trailing hashtag lines until it fits
    while (result.length > this._TWITTER_MAX && lines.length > 1) {
      lines.pop();
      result = lines.join('\n');
    }
    if (result.length > this._TWITTER_MAX) {
      result = result.slice(0, this._TWITTER_MAX - 3) + '...';
    }
    return result;
  },

  _truncate(str, maxLen) {
    if (!str) return '';
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen).replace(/\s+\S*$/, '') + '...';
  }
};


// ============================================================
// 7. AutoIssueGenerator — "The London Edit" auto-generation
// ============================================================
const AutoIssueGenerator = {
  NEWSLETTER_NAME: 'The London Edit',
  _ISSUES_KEY: 'london_edit_issues',
  _ISSUE_NUM_KEY: 'london_edit_issue_number',

  // Seasonal tag mappings — which venue tags fit each season/month
  _seasonalTags: {
    0:  ['history', 'architecture', 'coffee', 'hidden-gems', 'markets'],        // Jan
    1:  ['romance', 'food', 'cocktails', 'theatre', 'wellness'],                // Feb
    2:  ['gardens', 'coffee', 'markets', 'photography', 'art'],                 // Mar
    3:  ['gardens', 'family', 'photography', 'history', 'brunch'],              // Apr
    4:  ['gardens', 'markets', 'street-food', 'craft-beer', 'instagram'],       // May
    5:  ['nightlife', 'music', 'food', 'romance', 'instagram'],                 // Jun
    6:  ['nightlife', 'sports', 'street-food', 'craft-beer', 'adventure'],      // Jul
    7:  ['music', 'family', 'street-food', 'markets', 'adventure'],             // Aug
    8:  ['art', 'architecture', 'food', 'photography', 'hidden-gems'],          // Sep
    9:  ['dark-history', 'hidden-gems', 'coffee', 'cocktails', 'literary'],     // Oct
    10: ['shopping', 'theatre', 'markets', 'food', 'royals'],                   // Nov
    11: ['shopping', 'markets', 'theatre', 'royals', 'family']                  // Dec
  },

  _seasonNames: {
    0: 'Winter', 1: 'Winter', 2: 'Spring', 3: 'Spring',
    4: 'Spring', 5: 'Summer', 6: 'Summer', 7: 'Summer',
    8: 'Autumn', 9: 'Autumn', 10: 'Autumn', 11: 'Winter'
  },

  _monthNames: ['January','February','March','April','May','June','July','August','September','October','November','December'],

  /**
   * Get the next Tuesday and Friday dates from today
   */
  getNextIssueDates() {
    const dates = [];
    const now = new Date();
    for (let d = 1; d <= 14; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() + d);
      const dow = date.getDay();
      if (dow === 2 || dow === 5) { // Tue=2, Fri=5
        dates.push(date);
        if (dates.length >= 2) break;
      }
    }
    return dates;
  },

  /**
   * Get the current issue number (auto-increments)
   */
  getIssueNumber() {
    return parseInt(localStorage.getItem(this._ISSUE_NUM_KEY) || '0') + 1;
  },

  incrementIssueNumber() {
    const num = this.getIssueNumber();
    localStorage.setItem(this._ISSUE_NUM_KEY, num.toString());
    return num;
  },

  /**
   * Pick a venue weighted by seasonal relevance
   */
  _seasonalPick(venues, month) {
    if (!venues || venues.length === 0) return null;
    const seasonTags = this._seasonalTags[month] || [];
    const recentIds = new Set(PromotionsHistory.getRecent(90));

    const eligible = venues.filter(v => !recentIds.has(v.id));
    const pool = eligible.length > 0 ? eligible : venues;

    // Score by seasonal tag matches + affiliate bonus
    const scored = pool.map(v => {
      let score = 1;
      if (v.tags) {
        score += v.tags.filter(t => seasonTags.includes(t)).length * 3;
      }
      if (v.affiliateUrl) score += 2;
      return { venue: v, score };
    });

    // Weighted random selection
    const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
    let rand = Math.random() * totalScore;
    for (const s of scored) {
      rand -= s.score;
      if (rand <= 0) return s.venue;
    }
    return scored[scored.length - 1].venue;
  },

  /**
   * Generate a seasonal trivia question if existing ones have been used
   */
  _pickSeasonalTrivia(month, excludeIds) {
    const seasonTags = this._seasonalTags[month] || [];
    const all = PromotionsData._content?.trivia || [];
    const excluded = new Set(excludeIds || []);

    // Try seasonal match first
    const seasonal = all.filter(t =>
      !excluded.has(t.id) && seasonTags.includes(t.category)
    );
    if (seasonal.length > 0) return seasonal[Math.floor(Math.random() * seasonal.length)];

    // Fall back to any unused
    const unused = all.filter(t => !excluded.has(t.id));
    if (unused.length > 0) return unused[Math.floor(Math.random() * unused.length)];

    return all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null;
  },

  _pickSeasonalPoll(month, excludeIds) {
    const all = PromotionsData._content?.polls || [];
    const excluded = new Set(excludeIds || []);
    const unused = all.filter(p => !excluded.has(p.id));
    if (unused.length > 0) return unused[Math.floor(Math.random() * unused.length)];
    return all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null;
  },

  _pickSeasonalAdvice(month, excludeIds) {
    const seasonTags = this._seasonalTags[month] || [];
    const all = PromotionsData._content?.adviceArticles || [];
    const excluded = new Set(excludeIds || []);

    const seasonal = all.filter(a =>
      !excluded.has(a.id) && a.tags && a.tags.some(t => seasonTags.includes(t))
    );
    if (seasonal.length > 0) return seasonal[Math.floor(Math.random() * seasonal.length)];

    const unused = all.filter(a => !excluded.has(a.id));
    if (unused.length > 0) return unused[Math.floor(Math.random() * unused.length)];
    return all.length > 0 ? all[Math.floor(Math.random() * all.length)] : null;
  },

  /**
   * Auto-generate a complete newsletter issue config
   */
  generateIssue(targetDate, batchExclusions) {
    if (!targetDate) targetDate = this.getNextIssueDates()[0] || new Date();
    const month = targetDate.getMonth();
    const venues = PromotionsData.getVenues();
    if (!venues) return null;

    const batch = batchExclusions || { trivia: [], polls: [], advice: [], venues: [] };
    const issueNum = this.getIssueNumber() + batch.venues.length; // offset for 2nd issue
    const season = this._seasonNames[month];
    const monthName = this._monthNames[month];

    // Featured history for exclusion + batch exclusions
    const usedTrivia = PromotionsHistory.getAll()
      .filter(h => h.type === 'trivia').map(h => h.venueId).concat(batch.trivia);
    const usedPolls = PromotionsHistory.getAll()
      .filter(h => h.type === 'poll').map(h => h.venueId).concat(batch.polls);
    const usedAdvice = PromotionsHistory.getAll()
      .filter(h => h.type === 'advice').map(h => h.venueId).concat(batch.advice);

    // Exclude venues used in this batch
    const batchVenueIds = new Set(batch.venues);
    const filterBatch = (arr) => arr ? arr.filter(v => !batchVenueIds.has(v.id)) : [];

    const attraction = this._seasonalPick(filterBatch(venues.attractions), month);
    const restaurant = this._seasonalPick(filterBatch(venues.restaurants), month);
    const pub = this._seasonalPick(filterBatch(venues.pubs), month);
    const trivia = this._pickSeasonalTrivia(month, usedTrivia);
    const poll = this._pickSeasonalPoll(month, usedPolls);
    const advice = this._pickSeasonalAdvice(month, usedAdvice);
    const sponsors = SponsorManager.getActiveSponsors();

    const dateStr = targetDate.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const dayOfWeek = targetDate.toLocaleDateString('en-GB', { weekday: 'long' });

    // Get any seasonal events happening this month
    const seasonalEvents = (typeof EventsFeed !== 'undefined' && EventsFeed.events)
      ? EventsFeed.events.filter(e => e.month === month).slice(0, 2)
      : [];

    return {
      issueNumber: issueNum,
      sendDate: dateStr,
      dayOfWeek,
      season,
      monthName,
      attraction,
      restaurant,
      pub,
      trivia,
      poll,
      advice,
      sponsors,
      seasonalEvents,
      newsletterName: this.NEWSLETTER_NAME,
      autoGenerated: true,
      generatedAt: new Date().toISOString()
    };
  },

  /**
   * Auto-generate both issues for the current week (Tue + Fri)
   */
  generateWeeklyPair() {
    const dates = this.getNextIssueDates();
    const issues = [];
    const usedInThisBatch = { trivia: [], polls: [], advice: [], venues: [] };

    for (const date of dates) {
      const issue = this.generateIssue(date, usedInThisBatch);
      if (issue) {
        // Track what was used so edition 2 gets different content
        if (issue.trivia) usedInThisBatch.trivia.push(issue.trivia.id);
        if (issue.poll) usedInThisBatch.polls.push(issue.poll.id);
        if (issue.advice) usedInThisBatch.advice.push(issue.advice.id);
        if (issue.attraction) usedInThisBatch.venues.push(issue.attraction.id);
        if (issue.restaurant) usedInThisBatch.venues.push(issue.restaurant.id);
        if (issue.pub) usedInThisBatch.venues.push(issue.pub.id);
        issues.push(issue);
      }
    }
    return issues;
  },

  /**
   * Get saved/auto-generated issues
   */
  getSavedIssues() {
    try {
      return JSON.parse(localStorage.getItem(this._ISSUES_KEY)) || [];
    } catch { return []; }
  },

  /**
   * Save an issue (after review or auto-generation)
   */
  saveIssue(issue) {
    const issues = this.getSavedIssues();
    // Replace if same issue number exists
    const idx = issues.findIndex(i => i.issueNumber === issue.issueNumber);
    if (idx >= 0) issues[idx] = issue;
    else issues.unshift(issue);
    // Keep last 52 issues (1 year)
    localStorage.setItem(this._ISSUES_KEY, JSON.stringify(issues.slice(0, 52)));
  },

  /**
   * Publish an issue: record history, increment issue number, build HTML
   */
  publishIssue(issue) {
    // Record featured venues in history
    if (issue.attraction) PromotionsHistory.record(issue.attraction.id, 'attraction', 'newsletter', issue.sendDate);
    if (issue.restaurant) PromotionsHistory.record(issue.restaurant.id, 'restaurant', 'newsletter', issue.sendDate);
    if (issue.pub) PromotionsHistory.record(issue.pub.id, 'pub', 'newsletter', issue.sendDate);
    if (issue.trivia) PromotionsHistory.record(issue.trivia.id, 'trivia', 'newsletter', issue.sendDate);
    if (issue.poll) PromotionsHistory.record(issue.poll.id, 'poll', 'newsletter', issue.sendDate);
    if (issue.advice) PromotionsHistory.record(issue.advice.id, 'advice', 'newsletter', issue.sendDate);

    this.incrementIssueNumber();
    this.saveIssue({ ...issue, published: true, publishedAt: new Date().toISOString() });

    return NewsletterBuilder.build(issue);
  },

  /**
   * Format a nice subject line
   */
  getSubjectLine(issue) {
    const parts = [this.NEWSLETTER_NAME];
    if (issue.attraction) parts.push(issue.attraction.name);
    if (issue.restaurant) parts.push(issue.restaurant.name);
    parts.push(`Issue #${issue.issueNumber}`);
    return parts.join(' | ');
  }
};
