// ============================================================
// WHAT'S ON — London Events Feed
// Curated recurring events database by month
// ============================================================
const EventsFeed = {
  events: [
    // January
    { name: 'London International Mime Festival', month: 0, dateRange: 'Mid-January', venue: 'Various venues', neighbourhood: 'West End', description: 'World-class visual theatre, mime, and puppetry performances across London.', category: 'Theatre', free: false },
    { name: 'Lumiere London', month: 0, dateRange: 'Late January', venue: 'Various locations', neighbourhood: 'West End', description: 'A spectacular free light festival transforming London landmarks with immersive installations.', category: 'Festival', free: true },
    { name: 'January Sales', month: 0, dateRange: 'All January', venue: 'Oxford Street, Regent Street, Westfield', neighbourhood: 'West End', description: 'Major sales across all London shops with up to 70% off at top retailers.', category: 'Markets', free: true },
    { name: 'London Short Film Festival', month: 0, dateRange: 'Mid-January', venue: 'ICA & various cinemas', neighbourhood: 'St James\'s', description: 'Showcasing the best new short films from around the world.', category: 'Art', free: false },
    { name: 'Chinese New Year Preparations', month: 0, dateRange: 'Late January', venue: 'Chinatown', neighbourhood: 'Soho', description: 'Chinatown begins decorating for the upcoming Chinese New Year celebrations.', category: 'Festival', free: true },
    // February
    { name: 'Chinese New Year Celebrations', month: 1, dateRange: 'Late Jan/Early Feb', venue: 'Trafalgar Square & Chinatown', neighbourhood: 'Soho', description: 'The largest Chinese New Year celebrations outside Asia. Dragon dances, performances, and incredible food.', category: 'Festival', free: true },
    { name: 'Six Nations Rugby', month: 1, dateRange: 'Feb-March weekends', venue: 'Twickenham Stadium', neighbourhood: 'Richmond', description: 'England home matches in the Six Nations Championship. Electric atmosphere.', category: 'Sport', free: false },
    { name: 'London Fashion Week', month: 1, dateRange: 'Mid-February', venue: 'Various venues', neighbourhood: 'Various', description: 'One of the Big Four fashion weeks. Some shows and exhibitions open to public.', category: 'Art', free: false },
    { name: "Valentine's Day Events", month: 1, dateRange: '14 February', venue: 'Various', neighbourhood: 'Various', description: 'Special dinners, shows, and romantic experiences across London. Book well ahead.', category: 'Festival', free: false },
    { name: 'Pancake Day Races', month: 1, dateRange: 'Shrove Tuesday', venue: 'Various locations', neighbourhood: 'Various', description: 'Traditional pancake races across London including the famous Great Spitalfields Pancake Race.', category: 'Festival', free: true },
    // March
    { name: "St Patrick's Day Parade", month: 2, dateRange: '17 March weekend', venue: 'Trafalgar Square', neighbourhood: 'Westminster', description: 'Parade, live music, dancing, and Irish food stalls celebrating St Patrick\'s Day.', category: 'Festival', free: true },
    { name: 'Head of the River Race', month: 2, dateRange: 'Mid-March', venue: 'Thames, Mortlake to Putney', neighbourhood: 'Various', description: 'Over 400 crews race along the Thames. Great to watch from the riverbank.', category: 'Sport', free: true },
    { name: 'Kew Orchid Festival', month: 2, dateRange: 'Feb-March', venue: 'Kew Gardens', neighbourhood: 'Kew', description: 'Spectacular orchid displays in the Princess of Wales Conservatory.', category: 'Art', free: false },
    { name: 'Oxford & Cambridge Boat Race', month: 2, dateRange: 'Late March/Early April', venue: 'Thames, Putney to Mortlake', neighbourhood: 'Various', description: 'The historic university boat race. Free to watch from the riverbanks and bridges.', category: 'Sport', free: true },
    { name: 'London Coffee Festival', month: 2, dateRange: 'Late March', venue: 'Old Truman Brewery', neighbourhood: 'Shoreditch', description: 'Hundreds of coffee brands, tastings, latte art, and barista workshops.', category: 'Food', free: false },
    // April
    { name: 'London Marathon', month: 3, dateRange: 'Late April', venue: 'Greenwich to The Mall', neighbourhood: 'Various', description: 'One of the world\'s greatest marathons. Amazing atmosphere for spectators along the route.', category: 'Sport', free: true },
    { name: 'Easter Events', month: 3, dateRange: 'Easter weekend', venue: 'Various parks and venues', neighbourhood: 'Various', description: 'Egg hunts, spring festivals, and special family events at major attractions.', category: 'Family', free: false },
    { name: "Shakespeare's Globe Season Opens", month: 3, dateRange: 'Mid-April', venue: "Shakespeare's Globe", neighbourhood: 'Bankside', description: 'The outdoor theatre season begins. Standing tickets from £5 — one of London\'s best cultural bargains.', category: 'Theatre', free: false },
    { name: 'London Games Festival', month: 3, dateRange: 'Early April', venue: 'Various venues', neighbourhood: 'Various', description: 'Gaming events, tournaments, and exhibitions across London.', category: 'Festival', free: false },
    { name: 'Vaisakhi Festival', month: 3, dateRange: 'Mid-April', venue: 'Trafalgar Square', neighbourhood: 'Westminster', description: 'Celebrating Sikh new year with music, dance, and free food.', category: 'Festival', free: true },
    // May
    { name: 'Chelsea Flower Show', month: 4, dateRange: 'Late May', venue: 'Royal Hospital Chelsea', neighbourhood: 'Chelsea', description: 'The world\'s most prestigious flower show. RHS members get priority, public days sell out fast.', category: 'Art', free: false },
    { name: 'Underbelly Festival', month: 4, dateRange: 'May-September', venue: 'Cavernmouth, South Bank', neighbourhood: 'South Bank', description: 'Free entry venue with circus, comedy, cabaret, and street food all summer.', category: 'Festival', free: true },
    { name: 'Night Tales', month: 4, dateRange: 'May-September', venue: 'Various locations', neighbourhood: 'Shoreditch', description: 'Open-air street food, cocktails, DJs, and mini golf in East London.', category: 'Food', free: true },
    { name: 'Museums at Night', month: 4, dateRange: 'Mid-May', venue: 'Various museums', neighbourhood: 'Various', description: 'Special late-night openings at museums and galleries across London.', category: 'Art', free: false },
    { name: 'London Craft Beer Festival', month: 4, dateRange: 'Late May', venue: 'Tobacco Dock', neighbourhood: 'Wapping', description: 'Over 100 independent breweries pouring their best. Live music and street food.', category: 'Food', free: false },
    // June
    { name: 'Trooping the Colour', month: 5, dateRange: 'Mid-June', venue: 'Horse Guards Parade', neighbourhood: 'Westminster', description: "The King's official birthday celebration. Spectacular military ceremony and RAF flypast.", category: 'Festival', free: true },
    { name: 'Taste of London', month: 5, dateRange: 'Mid-June', venue: 'Regent\'s Park', neighbourhood: 'Marylebone', description: 'London\'s top restaurants serve taster dishes. Celebrity chef demos and foodie masterclasses.', category: 'Food', free: false },
    { name: 'Pride in London', month: 5, dateRange: 'Late June', venue: 'Central London parade', neighbourhood: 'Various', description: 'One of the biggest Pride events in Europe. Parade, live stages, and celebrations across the city.', category: 'Festival', free: true },
    { name: 'Royal Ascot', month: 5, dateRange: 'Mid-June', venue: 'Ascot Racecourse', neighbourhood: 'Berkshire (day trip)', description: 'The most glamorous event in the racing calendar. Amazing hats and exciting racing.', category: 'Sport', free: false },
    { name: 'Open Air Theatre Season', month: 5, dateRange: 'June-September', venue: "Regent's Park Open Air Theatre", neighbourhood: 'Marylebone', description: 'World-class productions under the stars. Bring a picnic and a blanket.', category: 'Theatre', free: false },
    // July
    { name: 'Wimbledon Championships', month: 6, dateRange: 'Early-Mid July', venue: 'All England Club', neighbourhood: 'Wimbledon', description: 'The most prestigious tennis tournament in the world. Queue for day tickets or watch on the big screen.', category: 'Sport', free: false },
    { name: 'BBC Proms', month: 6, dateRange: 'July-September', venue: 'Royal Albert Hall', neighbourhood: 'Kensington', description: '8 weeks of world-class classical music. Promenading (standing) tickets from £8 on the day.', category: 'Music', free: false },
    { name: 'British Summer Time Hyde Park', month: 6, dateRange: 'Early July', venue: 'Hyde Park', neighbourhood: 'Hyde Park', description: 'Major outdoor concerts in Hyde Park featuring world-famous headliners.', category: 'Music', free: false },
    { name: 'Lovebox Festival', month: 6, dateRange: 'Mid-July', venue: 'Gunnersbury Park', neighbourhood: 'Chiswick', description: 'Popular music festival with electronic, hip-hop, and pop acts.', category: 'Music', free: false },
    { name: 'Somerset House Summer Series', month: 6, dateRange: 'July', venue: 'Somerset House', neighbourhood: 'Covent Garden', description: 'Live music in the stunning courtyard of Somerset House.', category: 'Music', free: false },
    // August
    { name: 'Notting Hill Carnival', month: 7, dateRange: 'Late August bank holiday', venue: 'Notting Hill streets', neighbourhood: 'Notting Hill', description: "Europe's biggest street festival. Caribbean music, spectacular costumes, and incredible food. 2 million attendees.", category: 'Festival', free: true },
    { name: 'All Points East', month: 7, dateRange: 'Mid-August', venue: 'Victoria Park', neighbourhood: 'Hackney', description: 'Major music festival in East London with big-name headliners and emerging artists.', category: 'Music', free: false },
    { name: 'Film4 Summer Screen', month: 7, dateRange: 'August', venue: 'Somerset House', neighbourhood: 'Covent Garden', description: 'Open-air cinema in the courtyard of Somerset House. Classic and new films.', category: 'Art', free: false },
    { name: 'South West Four Festival', month: 7, dateRange: 'Late August', venue: 'Clapham Common', neighbourhood: 'Clapham', description: 'Electronic dance music festival on the August bank holiday weekend.', category: 'Music', free: false },
    { name: 'Kids Week', month: 7, dateRange: 'All August', venue: 'West End theatres', neighbourhood: 'West End', description: 'Free theatre tickets for children when accompanied by a paying adult. Book early!', category: 'Family', free: true },
    // September
    { name: 'London Design Festival', month: 8, dateRange: 'Mid-September', venue: 'V&A Museum & various', neighbourhood: 'Kensington', description: 'Installations, exhibitions, and events celebrating design across the city.', category: 'Art', free: true },
    { name: 'Open House London', month: 8, dateRange: 'Mid-September weekend', venue: 'Across London', neighbourhood: 'Various', description: 'Over 800 buildings open their doors for free — see inside landmarks, private homes, and hidden spaces.', category: 'Art', free: true },
    { name: 'Totally Thames', month: 8, dateRange: 'All September', venue: 'Along the Thames', neighbourhood: 'Various', description: 'A month of arts, cultural, and river events along the Thames. Many free.', category: 'Festival', free: true },
    { name: 'London Fashion Week', month: 8, dateRange: 'Mid-September', venue: 'Various venues', neighbourhood: 'Various', description: 'September edition of London Fashion Week with public-facing events and exhibitions.', category: 'Art', free: false },
    { name: 'Great River Race', month: 8, dateRange: 'Mid-September', venue: 'Thames', neighbourhood: 'Various', description: 'Over 300 boats race along the Thames in traditional craft. Free to watch from bridges.', category: 'Sport', free: true },
    // October
    { name: 'Frieze London', month: 9, dateRange: 'Mid-October', venue: 'Regent\'s Park', neighbourhood: 'Marylebone', description: "One of the world's leading contemporary art fairs. Major galleries, installations, and talks.", category: 'Art', free: false },
    { name: 'BFI London Film Festival', month: 9, dateRange: 'October', venue: 'BFI Southbank & various', neighbourhood: 'South Bank', description: 'World premieres, Q&As with directors, and the best new films from around the globe.', category: 'Art', free: false },
    { name: 'Halloween Events', month: 9, dateRange: 'Late October', venue: 'London Dungeons, Hampton Court, various', neighbourhood: 'Various', description: 'Scare attractions, ghost tours, pumpkin carving, and themed events across London.', category: 'Festival', free: false },
    { name: 'London Restaurant Festival', month: 9, dateRange: 'October', venue: 'Restaurants citywide', neighbourhood: 'Various', description: 'Special menus, food tours, and culinary events at London\'s best restaurants.', category: 'Food', free: false },
    { name: 'Diwali on Trafalgar Square', month: 9, dateRange: 'Late October', venue: 'Trafalgar Square', neighbourhood: 'Westminster', description: 'The biggest Diwali celebrations outside India. Dance, music, food, and fireworks.', category: 'Festival', free: true },
    // November
    { name: 'Bonfire Night', month: 10, dateRange: '5 November (and surrounding days)', venue: 'Various parks', neighbourhood: 'Various', description: 'Fireworks displays across London. Alexandra Palace and Battersea Park have the biggest shows.', category: 'Festival', free: false },
    { name: "Lord Mayor's Show", month: 10, dateRange: 'Mid-November Saturday', venue: 'City of London to Westminster', neighbourhood: 'City of London', description: '800-year-old procession through the City. Floats, marching bands, and evening fireworks.', category: 'Festival', free: true },
    { name: 'Christmas Lights Switch-On', month: 10, dateRange: 'Mid-November', venue: 'Oxford Street, Regent Street, Carnaby', neighbourhood: 'West End', description: 'The famous Christmas lights get switched on with celebrity appearances and performances.', category: 'Festival', free: true },
    { name: 'London Jazz Festival', month: 10, dateRange: 'Mid-November', venue: 'Various venues', neighbourhood: 'Various', description: '10 days of world-class jazz across London. From free gigs to headline shows.', category: 'Music', free: false },
    { name: 'Remembrance Sunday', month: 10, dateRange: '2nd Sunday November', venue: 'Cenotaph, Whitehall', neighbourhood: 'Westminster', description: 'Moving ceremony honoring fallen soldiers. The nation falls silent at 11am.', category: 'Festival', free: true },
    // December
    { name: 'Winter Wonderland', month: 11, dateRange: 'Late Nov - Early Jan', venue: 'Hyde Park', neighbourhood: 'Hyde Park', description: 'London\'s biggest Christmas event. Ice skating, rides, markets, circus, and festive food. Free entry.', category: 'Festival', free: true },
    { name: 'Christmas Markets', month: 11, dateRange: 'All December', venue: 'Southbank, Leicester Square, Greenwich, Borough', neighbourhood: 'Various', description: 'Festive markets across London selling gifts, mulled wine, and seasonal food.', category: 'Markets', free: true },
    { name: 'Ice Skating Rinks', month: 11, dateRange: 'Nov-January', venue: 'Natural History Museum, Somerset House, Tower of London', neighbourhood: 'Various', description: 'Iconic outdoor ice rinks at stunning London landmarks. Book in advance.', category: 'Family', free: false },
    { name: 'Pantomime Season', month: 11, dateRange: 'December', venue: 'Theatres across London', neighbourhood: 'Various', description: "Oh yes it is! Traditional British panto at theatres everywhere. Great family fun.", category: 'Theatre', free: false },
    { name: 'NYE Fireworks', month: 11, dateRange: '31 December', venue: 'London Eye, South Bank', neighbourhood: 'South Bank', description: "London's spectacular New Year's Eve fireworks. Ticketed viewing areas sell out months ahead.", category: 'Festival', free: false }
  ],

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
    // Also add the end month
    months.add(end.getMonth());
    return this.events.filter(e => months.has(e.month));
  },

  getCategoryIcon(category) {
    const icons = { Music: '🎵', Art: '🎨', Food: '🍽️', Sport: '⚽', Theatre: '🎭', Festival: '🎪', Markets: '🏪', Family: '👨‍👩‍👧‍👦' };
    return icons[category] || '📅';
  },

  renderEventsWidget(containerId, startDate, endDate) {
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
