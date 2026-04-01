const Engine = {
  data: {
    attractions: [],
    restaurants: [],
    nightlife: [],
    hotels: [],
    entertainment: [],
    cafes: [],
    neighbourhoods: {},
    dayTemplates: []
  },

  async loadData() {
    const files = ['attractions', 'restaurants', 'nightlife', 'hotels', 'entertainment', 'neighbourhoods', 'day-templates', 'cafes'];
    const results = await Promise.all(
      files.map(f => fetch(`data/${f}.json`).then(r => r.json()).catch(() => []))
    );
    this.data.attractions = results[0];
    this.data.restaurants = results[1];
    this.data.nightlife = results[2];
    this.data.hotels = results[3];
    this.data.entertainment = results[4];
    this.data.neighbourhoods = results[5];
    this.data.dayTemplates = results[6];
    this.data.cafes = results[7] || [];
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
      let dailyCost = 0;

      for (const slot of template.slots) {
        const item = this.pickItem(
          slot.type, interests, budget, template.preferredNeighbourhoods, used, activities
        );

        if (item) {
          used.add(item.id);
          const costValue = item.estimatedCost ? item.estimatedCost.amount : 0;
          dailyCost += costValue;
          activities.push({
            timeSlot: slot.time,
            period: slot.period,
            name: item.name,
            description: item.description,
            estimatedCost: item.estimatedCost ?
              `£${item.estimatedCost.amount.toFixed(2)}` :
              'Free',
            estimatedCostValue: costValue,
            affiliateUrl: item.affiliateUrl || '',
            affiliateLabel: item.affiliateLabel || '',
            tips: item.tips || '',
            address: item.address || '',
            neighbourhood: item.neighbourhood || '',
            type: slot.type,
            lat: item.lat || null,
            lng: item.lng || null
          });
        }
      }

      // Determine theme neighbourhoods
      const dayNeighbourhoods = [...new Set(activities.map(a => a.neighbourhood).filter(Boolean))];

      return {
        dayNumber: dayNum,
        theme: template.name,
        neighbourhoods: dayNeighbourhoods,
        activities,
        dailyCost
      };
    });

    // Calculate total trip cost estimate
    const totalCost = days.reduce((sum, d) => sum + d.dailyCost, 0);

    return {
      days,
      hotel,
      tripDays,
      interests,
      budget,
      occasion: occasion || 'none',
      groupType: groupType || 'couple',
      generatedAt: new Date().toISOString(),
      totalEstimatedCost: totalCost
    };
  },

  selectTemplates(scored, numDays) {
    const selected = [];
    const usedTemplateIds = new Set();

    for (let i = 0; i < numDays; i++) {
      let pick = scored.find(t => !usedTemplateIds.has(t.id));

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
      case 'cafe':
        pool = this.data.cafes;
        budgetCategory = 'food';
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
  },

  // Generate packing list based on trip details
  generatePackingList(itinerary) {
    const items = {
      essentials: [
        'Passport / ID', 'Travel insurance documents', 'Phone charger (UK uses Type G plug)',
        'UK power adapter', 'Debit/credit card (contactless works everywhere)', 'Oyster card or contactless for transport'
      ],
      clothing: ['Comfortable walking shoes (you\'ll walk 10-15km/day)', 'Rain jacket or umbrella (essential!)'],
      tech: ['Phone with Google Maps / Citymapper downloaded', 'Portable battery pack'],
      documents: ['Hotel booking confirmation', 'Itinerary (this PDF!)']
    };

    // Weather-based additions
    items.clothing.push('Layers — London weather changes fast');

    // Activity-based additions
    const allActivities = itinerary.days.flatMap(d => d.activities);
    const allTypes = new Set(allActivities.map(a => a.type));
    const allTags = new Set(itinerary.interests);

    if (allTags.has('theatre')) items.clothing.push('Smart casual outfit for theatre');
    if (allTags.has('nightlife')) items.clothing.push('Going-out outfit for bars/clubs');
    if (allTags.has('sports')) items.clothing.push('Sportswear if attending active experiences');
    if (allTags.has('wellness')) items.clothing.push('Swimwear for spa/swimming');
    if (allTags.has('photography')) items.tech.push('Camera / extra phone storage');
    if (allTags.has('adventure')) items.clothing.push('Sturdy shoes for outdoor activities');
    if (allTags.has('food')) items.essentials.push('Antacids (you\'ll eat a lot!)');

    if (itinerary.tripDays > 5) {
      items.essentials.push('Laundry bag');
      items.essentials.push('Travel-size toiletries');
    }

    return items;
  }
};
