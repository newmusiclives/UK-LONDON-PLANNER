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

  // Estimated travel times between neighbourhoods (minutes)
  TRAVEL_TIMES: {
    'adjacent': 10,    // Walking distance
    'same_zone': 20,   // Same tube zone
    'cross_zone': 35,  // Different zones
    'outer': 50        // Zone 3+
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

    const extendedTags = [...interests];
    if (occasion && occasion !== 'none') extendedTags.push(occasion);
    if (groupType === 'girls-group') extendedTags.push('hen-party', 'shopping', 'wellness');
    if (groupType === 'lads-group') extendedTags.push('stag-do', 'sports', 'nightlife');
    if (occasion === 'anniversary' || occasion === 'engagement' || occasion === 'honeymoon') {
      extendedTags.push('romance', 'anniversary');
    }
    if (occasion === 'birthday') extendedTags.push('birthday', 'nightlife');

    const scoredTemplates = this.data.dayTemplates
      .map(t => ({
        ...t,
        score: t.primaryTags.filter(tag => extendedTags.includes(tag)).length
      }))
      .sort((a, b) => b.score - a.score);

    const selectedTemplates = this.selectTemplates(scoredTemplates, tripDays);
    const hotels = this.pickHotels(budget.accommodation, 3);

    const days = selectedTemplates.map((template, i) => {
      const dayNum = i + 1;
      const activities = [];
      let dailyCost = 0;

      for (const slot of template.slots) {
        const item = this.pickItem(
          slot.type, interests, budget, template.preferredNeighbourhoods, used, activities, slot.period
        );

        if (item) {
          used.add(item.id);
          const costValue = item.estimatedCost ? item.estimatedCost.amount : 0;
          dailyCost += costValue;

          // Calculate travel time from previous activity
          const prevActivity = activities[activities.length - 1];
          const travelMins = prevActivity ? this.estimateTravelTime(prevActivity.neighbourhood, item.neighbourhood) : 0;

          activities.push({
            timeSlot: slot.time,
            period: slot.period,
            name: item.name,
            description: item.description,
            estimatedCost: item.estimatedCost ? `£${item.estimatedCost.amount.toFixed(2)}` : 'Free',
            estimatedCostValue: costValue,
            affiliateUrl: item.affiliateUrl || '',
            affiliateLabel: item.affiliateLabel || '',
            tips: item.tips || '',
            address: item.address || '',
            neighbourhood: item.neighbourhood || '',
            type: slot.type,
            travelFromPrev: travelMins,
            duration: item.duration || ''
          });
        }
      }

      const dayNeighbourhoods = [...new Set(activities.map(a => a.neighbourhood).filter(Boolean))];

      // Add travel advisory if activities span far-apart neighbourhoods
      const travelWarning = this.checkDayTravel(activities);

      return {
        dayNumber: dayNum,
        theme: template.name,
        neighbourhoods: dayNeighbourhoods,
        activities,
        dailyCost,
        travelWarning
      };
    });

    const totalCost = days.reduce((sum, d) => sum + d.dailyCost, 0);

    return {
      days,
      hotel: hotels[0],
      hotels,
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

  // Verification gate — never include a listing that's been confirmed closed.
  // Per the listings-verification system (data/*.json verification block):
  //   status === 'closed' is set when a reviewer marks closed in /admin/listings,
  //   businessStatus === 'CLOSED_PERMANENTLY' is what Google Places returns and
  //   what the mark-closed action mirrors. Either one gates the listing out.
  isClosed(item) {
    const v = item && item.verification;
    if (!v) return false;
    return v.status === 'closed' || v.businessStatus === 'CLOSED_PERMANENTLY';
  },

  pickItem(type, interests, budget, preferredNeighbourhoods, used, existingActivities, period) {
    let pool;
    let budgetCategory;

    switch (type) {
      case 'attraction': pool = this.data.attractions; budgetCategory = 'entertainment'; break;
      case 'restaurant': pool = this.data.restaurants; budgetCategory = 'food'; break;
      case 'nightlife': pool = this.data.nightlife; budgetCategory = 'entertainment'; break;
      case 'entertainment': pool = this.data.entertainment; budgetCategory = 'entertainment'; break;
      case 'cafe': pool = this.data.cafes; budgetCategory = 'food'; break;
      default: pool = this.data.attractions; budgetCategory = 'entertainment';
    }

    const budgetTier = budget[budgetCategory] || 'mid-range';

    let candidates = pool.filter(item => {
      if (used.has(item.id)) return false;
      if (this.isClosed(item)) return false;
      if (item.budgetTier && !item.budgetTier.includes(budgetTier)) return false;
      return true;
    });

    if (candidates.length === 0) {
      candidates = pool.filter(item => !used.has(item.id) && !this.isClosed(item));
    }
    if (candidates.length === 0) return null;

    // Map period to bestTimeOfDay for validation
    const periodToTime = {
      'morning': 'morning',
      'lunch': 'afternoon',
      'afternoon': 'afternoon',
      'dinner': 'evening',
      'evening': 'evening'
    };
    const preferredTime = periodToTime[period] || 'afternoon';

    const scored = candidates.map(item => {
      let score = 0;

      // Interest match
      if (item.tags) {
        score += item.tags.filter(t => interests.includes(t)).length * 3;
      }

      // Time-of-day validation for attractions
      if (type === 'attraction' && item.bestTimeOfDay) {
        if (item.bestTimeOfDay.includes(preferredTime)) {
          score += 2; // Bonus for correct time
        } else {
          score -= 1; // Penalty for wrong time (but don't exclude entirely)
        }
      }

      // Neighbourhood preference
      if (preferredNeighbourhoods.includes(item.neighbourhood)) {
        score += 2;
      }

      // Geographic clustering — prefer nearby locations for smoother travel
      if (existingActivities.length > 0 && item.neighbourhood) {
        const lastActivity = existingActivities[existingActivities.length - 1];
        if (this.areNearby(lastActivity.neighbourhood, item.neighbourhood)) {
          score += 3; // Strong bonus for walkable distance
        } else if (this.areSameZone(lastActivity.neighbourhood, item.neighbourhood)) {
          score += 1; // Small bonus for same zone
        } else {
          score -= 1; // Penalty for long travel
        }
      }

      // Bonus for items with affiliate links
      if (item.affiliateUrl) score += 0.5;

      return { ...item, score };
    });

    scored.sort((a, b) => b.score - a.score);

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

  areSameZone(n1, n2) {
    if (!n1 || !n2) return true;
    const d1 = this.data.neighbourhoods[n1];
    const d2 = this.data.neighbourhoods[n2];
    if (!d1 || !d2) return true;
    return d1.zone === d2.zone;
  },

  estimateTravelTime(from, to) {
    if (!from || !to || from === to) return 0;
    if (this.areNearby(from, to)) return this.TRAVEL_TIMES.adjacent;

    const d1 = this.data.neighbourhoods[from];
    const d2 = this.data.neighbourhoods[to];
    if (!d1 || !d2) return this.TRAVEL_TIMES.same_zone;

    if (d1.zone === d2.zone) return this.TRAVEL_TIMES.same_zone;
    if (d1.zone >= 3 || d2.zone >= 3) return this.TRAVEL_TIMES.outer;
    return this.TRAVEL_TIMES.cross_zone;
  },

  checkDayTravel(activities) {
    let totalTravel = 0;
    for (const a of activities) {
      totalTravel += a.travelFromPrev || 0;
    }
    if (totalTravel > 90) {
      return `This day involves ~${totalTravel} mins of travel. Consider using the Tube or a day travelcard.`;
    }
    return null;
  },

  pickHotel(budgetTier) {
    const candidates = this.data.hotels.filter(h => h.budgetTier.includes(budgetTier));
    if (candidates.length === 0) return this.data.hotels[0];
    return candidates[Math.floor(Math.random() * candidates.length)];
  },

  pickHotels(budgetTier, count = 3) {
    const candidates = this.data.hotels.filter(h => h.budgetTier.includes(budgetTier));
    const pool = candidates.length > 0 ? candidates : this.data.hotels;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

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

    items.clothing.push('Layers — London weather changes fast');

    const allTags = new Set(itinerary.interests || []);

    if (allTags.has('theatre')) items.clothing.push('Smart casual outfit for theatre');
    if (allTags.has('nightlife') || allTags.has('cocktails')) items.clothing.push('Going-out outfit for bars/clubs');
    if (allTags.has('sports')) items.clothing.push('Sportswear if attending active experiences');
    if (allTags.has('wellness')) items.clothing.push('Swimwear for spa/swimming');
    if (allTags.has('photography') || allTags.has('instagram')) items.tech.push('Camera / extra phone storage');
    if (allTags.has('adventure')) items.clothing.push('Sturdy shoes for outdoor activities');
    if (allTags.has('food') || allTags.has('street-food')) items.essentials.push('Antacids (you\'ll eat a lot!)');

    if (itinerary.tripDays > 5) {
      items.essentials.push('Laundry bag');
      items.essentials.push('Travel-size toiletries');
    }

    return items;
  }
};
