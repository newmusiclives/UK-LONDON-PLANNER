const Engine = {
  data: {
    attractions: [],
    restaurants: [],
    nightlife: [],
    hotels: [],
    entertainment: [],
    neighbourhoods: {},
    dayTemplates: []
  },

  async loadData() {
    const files = ['attractions', 'restaurants', 'nightlife', 'hotels', 'entertainment', 'neighbourhoods', 'day-templates'];
    const results = await Promise.all(
      files.map(f => fetch(`data/${f}.json`).then(r => r.json()))
    );
    this.data.attractions = results[0];
    this.data.restaurants = results[1];
    this.data.nightlife = results[2];
    this.data.hotels = results[3];
    this.data.entertainment = results[4];
    this.data.neighbourhoods = results[5];
    this.data.dayTemplates = results[6];
  },

  generate(preferences) {
    const { tripDays, budget, interests, occasion, groupType } = preferences;
    const used = new Set();

    // Build extended interest set including occasion/group tags
    const extendedTags = [...interests];
    if (occasion && occasion !== 'none') extendedTags.push(occasion);
    if (groupType === 'girls-group') extendedTags.push('hen-party', 'shopping', 'wellness');
    if (groupType === 'lads-group') extendedTags.push('stag-do', 'sports', 'nightlife');
    if (occasion === 'anniversary' || occasion === 'engagement' || occasion === 'honeymoon') {
      extendedTags.push('romance', 'anniversary');
    }
    if (occasion === 'birthday') extendedTags.push('birthday', 'nightlife');

    // Score and sort templates by interest match
    const scoredTemplates = this.data.dayTemplates
      .map(t => ({
        ...t,
        score: t.primaryTags.filter(tag => extendedTags.includes(tag)).length
      }))
      .sort((a, b) => b.score - a.score);

    // Select templates for each day, ensuring variety
    const selectedTemplates = this.selectTemplates(scoredTemplates, tripDays);

    // Get hotel recommendation
    const hotel = this.pickHotel(budget.accommodation);

    // Build each day
    const days = selectedTemplates.map((template, i) => {
      const dayNum = i + 1;
      const activities = [];

      for (const slot of template.slots) {
        const item = this.pickItem(
          slot.type, interests, budget, template.preferredNeighbourhoods, used, activities
        );

        if (item) {
          used.add(item.id);
          activities.push({
            timeSlot: slot.time,
            period: slot.period,
            name: item.name,
            description: item.description,
            estimatedCost: item.estimatedCost ?
              `£${item.estimatedCost.amount.toFixed(2)}` :
              'Free',
            estimatedCostValue: item.estimatedCost ? item.estimatedCost.amount : 0,
            affiliateUrl: item.affiliateUrl || '',
            affiliateLabel: item.affiliateLabel || '',
            tips: item.tips || '',
            address: item.address || '',
            neighbourhood: item.neighbourhood || '',
            type: slot.type
          });
        }
      }

      // Determine theme neighbourhoods
      const dayNeighbourhoods = [...new Set(activities.map(a => a.neighbourhood).filter(Boolean))];

      return {
        dayNumber: dayNum,
        theme: template.name,
        neighbourhoods: dayNeighbourhoods,
        activities
      };
    });

    return {
      days,
      hotel,
      tripDays,
      interests,
      budget,
      occasion: occasion || 'none',
      groupType: groupType || 'couple',
      generatedAt: new Date().toISOString()
    };
  },

  selectTemplates(scored, numDays) {
    const selected = [];
    const usedTemplateIds = new Set();

    for (let i = 0; i < numDays; i++) {
      // First pass: pick unused templates
      let pick = scored.find(t => !usedTemplateIds.has(t.id));

      // If all used, cycle through again
      if (!pick) {
        usedTemplateIds.clear();
        pick = scored.find(t => !usedTemplateIds.has(t.id)) || scored[0];
      }

      if (pick) {
        selected.push(pick);
        usedTemplateIds.add(pick.id);
      }
    }
    return selected;
  },

  pickItem(type, interests, budget, preferredNeighbourhoods, used, existingActivities) {
    let pool;
    let budgetCategory;

    switch (type) {
      case 'attraction':
        pool = this.data.attractions;
        budgetCategory = 'entertainment';
        break;
      case 'restaurant':
        pool = this.data.restaurants;
        budgetCategory = 'food';
        break;
      case 'nightlife':
        pool = this.data.nightlife;
        budgetCategory = 'entertainment';
        break;
      case 'entertainment':
        pool = this.data.entertainment;
        budgetCategory = 'entertainment';
        break;
      default:
        pool = this.data.attractions;
        budgetCategory = 'entertainment';
    }

    const budgetTier = budget[budgetCategory] || 'mid-range';

    // Filter available items
    let candidates = pool.filter(item => {
      if (used.has(item.id)) return false;
      if (item.budgetTier && !item.budgetTier.includes(budgetTier)) return false;
      return true;
    });

    if (candidates.length === 0) {
      // Relax budget constraint
      candidates = pool.filter(item => !used.has(item.id));
    }

    if (candidates.length === 0) return null;

    // Score candidates
    const scored = candidates.map(item => {
      let score = 0;

      // Interest match
      if (item.tags) {
        score += item.tags.filter(t => interests.includes(t)).length * 3;
      }

      // Neighbourhood preference
      if (preferredNeighbourhoods.includes(item.neighbourhood)) {
        score += 2;
      }

      // Geographic clustering with existing activities
      if (existingActivities.length > 0 && item.neighbourhood) {
        const nearby = existingActivities.some(a =>
          this.areNearby(a.neighbourhood, item.neighbourhood)
        );
        if (nearby) score += 1;
      }

      // Bonus for items with affiliate links (revenue opportunity)
      if (item.affiliateUrl) score += 0.5;

      return { ...item, score };
    });

    scored.sort((a, b) => b.score - a.score);

    // Pick from top candidates with slight randomness
    const topN = Math.min(3, scored.length);
    const idx = Math.floor(Math.random() * topN);
    return scored[idx];
  },

  areNearby(n1, n2) {
    if (!n1 || !n2 || n1 === n2) return true;
    const data = this.data.neighbourhoods[n1];
    if (!data) return false;
    return data.adjacent && data.adjacent.includes(n2);
  },

  pickHotel(budgetTier) {
    const candidates = this.data.hotels.filter(h =>
      h.budgetTier.includes(budgetTier)
    );
    if (candidates.length === 0) return this.data.hotels[0];
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
};
