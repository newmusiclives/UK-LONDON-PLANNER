document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  let currentStep = 1;
  const totalSteps = 7;

  const state = State.get();
  let tripDays = state.tripDays || CONFIG.trip.defaultDays;
  let budget = state.budget || { accommodation: 'mid-range', food: 'mid-range', entertainment: 'mid-range' };
  let interests = state.interests || [];
  let occasion = state.occasion || 'none';
  let groupType = state.groupType || 'couple';
  let groupDetails = state.groupDetails || {};
  let ukExtension = state.ukExtension || { enabled: false, days: 0, destinations: [] };
  let ukDestinations = [];

  // Load UK destinations
  fetch('data/uk-destinations.json')
    .then(r => r.json())
    .then(data => { ukDestinations = data; })
    .catch(() => {});

  renderWizard();
  updateStep(1);

  function renderWizard() {
    const main = document.querySelector('.main');
    main.innerHTML = `
      <div class="wizard">
        <div class="wizard__header">
          <h1>Plan Your Adventure</h1>
          <p>Answer a few questions and we'll create your perfect personalised itinerary</p>
        </div>

        <div class="wizard__progress progress-bar">
          ${[1,2,3,4,5,6,7].map((step, i) => `
            <div class="progress-step" data-step="${step}">
              <div class="progress-step__circle">${step}</div>
              <span class="progress-step__label">${['London', 'Beyond', 'Who', 'Occasion', 'Budget', 'Interests', 'Review'][i]}</span>
              ${i < 6 ? '<div class="progress-step__line"></div>' : ''}
            </div>
          `).join('')}
        </div>

        <!-- Step 1: London Duration -->
        <div class="wizard__step" data-step="1">
          <h2 class="wizard__step-title">How many days in London?</h2>
          <p class="wizard__step-desc">From a weekend getaway to an extended exploration</p>
          <div class="duration-selector">
            <div class="duration-display">
              <span id="day-count">${tripDays}</span>
              <span id="day-label">${tripDays === 1 ? 'day' : 'days'}</span>
            </div>
            <input type="range" class="duration-slider" id="duration-slider"
              min="${CONFIG.trip.minDays}" max="${CONFIG.trip.maxDays}" value="${tripDays}">
            <div class="duration-labels">
              <span>1 day</span>
              <span>1 week</span>
              <span>2 weeks</span>
              <span>3 weeks</span>
            </div>
            <div class="duration-price-hint" id="price-hint">
              London itinerary: $${State.getPrice(tripDays)}
            </div>
          </div>
        </div>

        <!-- Step 2: UK Extension -->
        <div class="wizard__step" data-step="2">
          <h2 class="wizard__step-title">Explore Beyond London?</h2>
          <p class="wizard__step-desc">Add extra days to discover the best of the UK — historic cities, stunning coastline, and beautiful countryside</p>

          <div style="display:flex;gap:1rem;justify-content:center;margin-bottom:2rem;flex-wrap:wrap;">
            <div class="chip ${!ukExtension.enabled ? 'active' : ''}" data-uk-toggle="no" style="padding:1rem 2rem;">
              <span class="chip__icon">🇬🇧</span>
              London Only
            </div>
            <div class="chip ${ukExtension.enabled ? 'active' : ''}" data-uk-toggle="yes" style="padding:1rem 2rem;">
              <span class="chip__icon">🗺️</span>
              London + UK Exploration
            </div>
          </div>

          <div id="uk-options" style="display:${ukExtension.enabled ? 'block' : 'none'};">
            <div style="text-align:center;margin-bottom:1.5rem;">
              <label style="font-weight:600;margin-bottom:0.5rem;display:block;">How many extra days beyond London?</label>
              <div class="duration-selector" style="padding:1rem;">
                <div class="duration-display" style="font-size:3rem;">
                  <span id="uk-day-count">${ukExtension.days || 5}</span>
                  <span style="font-size:1rem;">days</span>
                </div>
                <input type="range" class="duration-slider" id="uk-duration-slider"
                  min="1" max="14" value="${ukExtension.days || 5}">
                <div class="duration-labels">
                  <span>1 day</span>
                  <span>1 week</span>
                  <span>2 weeks</span>
                </div>
              </div>
            </div>

            <h4 style="text-align:center;margin-bottom:1rem;">Where would you like to go?</h4>
            <p style="text-align:center;font-size:0.85rem;color:var(--color-text-muted);margin-bottom:1.5rem;">
              Select destinations that interest you — we'll build the perfect route
            </p>
            <div id="uk-destinations-grid" class="interests-grid" style="max-width:800px;margin:0 auto;">
            </div>

            <div id="uk-price-hint" style="text-align:center;margin-top:1.5rem;">
            </div>
          </div>
        </div>

        <!-- Step 3: Group Type with Detail Forms -->
        <div class="wizard__step" data-step="3">
          <h2 class="wizard__step-title">Who's travelling?</h2>
          <p class="wizard__step-desc">We'll tailor activities and venues to suit your group perfectly</p>
          <div class="interests-grid" style="max-width:800px;margin:2rem auto 0;">
            ${CONFIG.groupTypes.map(gt => `
              <div class="chip ${groupType === gt.id ? 'active' : ''}" data-group="${gt.id}">
                <span class="chip__icon">${gt.icon}</span>
                ${gt.label}
              </div>
            `).join('')}
          </div>

          <!-- Dynamic Group Details Panel -->
          <div id="group-details-panel" style="max-width:600px;margin:2rem auto 0;display:none;">
            <div class="card">
              <div class="card__body" id="group-details-form">
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Occasion -->
        <div class="wizard__step" data-step="4">
          <h2 class="wizard__step-title">What's the occasion?</h2>
          <p class="wizard__step-desc">Celebrating something special? We'll make it unforgettable</p>
          <div class="interests-grid" style="max-width:900px;margin:2rem auto 0;">
            ${CONFIG.occasions.map(occ => `
              <div class="chip ${occasion === occ.id ? 'active' : ''}" data-occasion="${occ.id}">
                <span class="chip__icon">${occ.icon}</span>
                ${occ.label}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 5: Budget -->
        <div class="wizard__step" data-step="5">
          <h2 class="wizard__step-title">What's your budget style?</h2>
          <p class="wizard__step-desc">We'll tailor recommendations to match your spending preferences</p>
          <div class="budget-grid">
            ${Object.entries(CONFIG.budgetTiers).map(([category, tiers]) => `
              <div class="budget-category">
                <div class="budget-category__title">
                  <span class="icon">${category === 'accommodation' ? '🏨' : category === 'food' ? '🍽️' : '🎭'}</span>
                  ${category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                <div class="budget-options">
                  ${Object.entries(tiers).map(([tier, info]) => `
                    <div class="budget-option">
                      <input type="radio" name="budget-${category}" id="budget-${category}-${tier}"
                        value="${tier}" ${budget[category] === tier ? 'checked' : ''}>
                      <label for="budget-${category}-${tier}">
                        <span class="budget-option__tier">${info.label}</span>
                        <span class="budget-option__range">${info.range}</span>
                      </label>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 6: Interests (select up to 5 minimum) -->
        <div class="wizard__step" data-step="6">
          <h2 class="wizard__step-title">What are you into?</h2>
          <p class="wizard__step-desc">Select at least 5 interests so we can really personalise your trip</p>
          <div class="interest-count">
            <strong id="interest-count">${interests.length}</strong> selected (minimum 5)
          </div>
          <div class="interests-grid" style="max-width:900px;margin:0 auto;">
            ${CONFIG.interests.map(interest => `
              <div class="chip ${interests.includes(interest.id) ? 'active' : ''}"
                data-interest="${interest.id}">
                <span class="chip__icon">${interest.icon}</span>
                ${interest.label}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 7: Review -->
        <div class="wizard__step" data-step="7">
          <h2 class="wizard__step-title">Your Trip Summary</h2>
          <p class="wizard__step-desc">Review your preferences before we generate your itinerary</p>
          <div class="review-card" id="review-card"></div>
        </div>

        <div class="wizard__nav">
          <button class="btn-back" id="btn-back" style="visibility: hidden;">
            ← Back
          </button>
          <button class="btn btn--primary btn--large" id="btn-next">
            Continue →
          </button>
        </div>
      </div>
    `;

    attachEvents();
  }

  // ============================================================
  // GROUP DETAILS FORMS
  // ============================================================
  function renderGroupDetails(type) {
    const panel = document.getElementById('group-details-panel');
    const form = document.getElementById('group-details-form');
    const config = CONFIG.groupTypes.find(g => g.id === type);

    if (!config || !config.needsDetails) {
      panel.style.display = 'none';
      groupDetails = {};
      return;
    }

    panel.style.display = 'block';

    switch (type) {
      case 'family':
        form.innerHTML = `
          <h4 style="margin-bottom:1rem;">Tell us about your family</h4>
          <div style="display:grid;gap:1rem;">
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">How many adults?</label>
              <select id="gd-adults" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[1,2,3,4,5,6].map(n => `<option value="${n}" ${(groupDetails.adults||2)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">How many children?</label>
              <select id="gd-children" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[0,1,2,3,4,5,6].map(n => `<option value="${n}" ${(groupDetails.children||1)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div id="children-ages-container">
              ${renderChildAgeFields(groupDetails.children || 1)}
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Any mobility needs? <small style="font-weight:400;color:var(--color-text-muted);">(pushchairs, wheelchairs, limited walking)</small></label>
              <select id="gd-mobility" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                <option value="none" ${(groupDetails.mobility||'none')==='none'?'selected':''}>No special needs</option>
                <option value="pushchair" ${groupDetails.mobility==='pushchair'?'selected':''}>Pushchair / Stroller</option>
                <option value="limited" ${groupDetails.mobility==='limited'?'selected':''}>Limited walking ability</option>
                <option value="wheelchair" ${groupDetails.mobility==='wheelchair'?'selected':''}>Wheelchair accessible needed</option>
              </select>
            </div>
          </div>
        `;
        // Dynamic children age fields
        document.getElementById('gd-children').addEventListener('change', (e) => {
          const count = parseInt(e.target.value);
          document.getElementById('children-ages-container').innerHTML = renderChildAgeFields(count);
          groupDetails.children = count;
        });
        break;

      case 'parent-child':
        form.innerHTML = `
          <h4 style="margin-bottom:1rem;">Tell us about your trip</h4>
          <div style="display:grid;gap:1rem;">
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">How many children?</label>
              <select id="gd-children" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[1,2,3,4].map(n => `<option value="${n}" ${(groupDetails.children||1)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div id="children-ages-container">
              ${renderChildAgeFields(groupDetails.children || 1)}
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Any mobility needs?</label>
              <select id="gd-mobility" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                <option value="none" ${(groupDetails.mobility||'none')==='none'?'selected':''}>No special needs</option>
                <option value="pushchair" ${groupDetails.mobility==='pushchair'?'selected':''}>Pushchair / Stroller</option>
              </select>
            </div>
          </div>
        `;
        document.getElementById('gd-children').addEventListener('change', (e) => {
          document.getElementById('children-ages-container').innerHTML = renderChildAgeFields(parseInt(e.target.value));
        });
        break;

      case 'multi-family':
        form.innerHTML = `
          <h4 style="margin-bottom:1rem;">Tell us about the group</h4>
          <div style="display:grid;gap:1rem;">
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">How many families?</label>
              <select id="gd-families" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[2,3,4,5].map(n => `<option value="${n}" ${(groupDetails.families||2)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Total adults?</label>
              <select id="gd-adults" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${(groupDetails.adults||4)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Total children?</label>
              <select id="gd-children" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[0,1,2,3,4,5,6,7,8].map(n => `<option value="${n}" ${(groupDetails.children||3)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Age range of children</label>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                ${['Under 2', '2-5', '6-11', '12-17'].map(range => `
                  <label style="display:flex;align-items:center;gap:0.35rem;padding:0.5rem 0.75rem;border:2px solid var(--color-border);border-radius:var(--radius-full);font-size:0.85rem;cursor:pointer;">
                    <input type="checkbox" class="gd-age-range" value="${range}" ${(groupDetails.ageRanges||[]).includes(range)?'checked':''}>
                    ${range}
                  </label>
                `).join('')}
              </div>
            </div>
          </div>
        `;
        break;

      case 'friends-mixed':
      case 'girls-group':
      case 'lads-group':
        const groupLabel = type === 'girls-group' ? 'girls' : type === 'lads-group' ? 'lads' : 'friends';
        form.innerHTML = `
          <h4 style="margin-bottom:1rem;">Tell us about your ${groupLabel} group</h4>
          <div style="display:grid;gap:1rem;">
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">How many people?</label>
              <select id="gd-group-size" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[2,3,4,5,6,7,8,9,10,11,12,13,14,15,'16+'].map(n => `<option value="${n}" ${(groupDetails.groupSize||4)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">General age range of the group</label>
              <select id="gd-age-range" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                <option value="18-25" ${(groupDetails.ageRange||'')==='18-25'?'selected':''}>18-25 (Young adults)</option>
                <option value="25-35" ${(groupDetails.ageRange||'25-35')==='25-35'?'selected':''}>25-35 (Late 20s/early 30s)</option>
                <option value="35-50" ${groupDetails.ageRange==='35-50'?'selected':''}>35-50 (Mid-life)</option>
                <option value="50-65" ${groupDetails.ageRange==='50-65'?'selected':''}>50-65</option>
                <option value="65+" ${groupDetails.ageRange==='65+'?'selected':''}>65+</option>
                <option value="mixed" ${groupDetails.ageRange==='mixed'?'selected':''}>Mixed ages</option>
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Energy level <small style="font-weight:400;color:var(--color-text-muted);">(how active is the group?)</small></label>
              <select id="gd-energy" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                <option value="relaxed" ${(groupDetails.energy||'')==='relaxed'?'selected':''}>Relaxed — we like to take it easy</option>
                <option value="moderate" ${(groupDetails.energy||'moderate')==='moderate'?'selected':''}>Moderate — mix of activity and chill</option>
                <option value="high" ${groupDetails.energy==='high'?'selected':''}>High energy — pack in as much as possible!</option>
                <option value="party" ${groupDetails.energy==='party'?'selected':''}>Party mode — late nights and big experiences</option>
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Anything else we should know? <small style="font-weight:400;color:var(--color-text-muted);">(optional)</small></label>
              <textarea id="gd-notes" rows="2" placeholder="e.g. One person uses a wheelchair, we want a private dining room, someone is vegetarian..."
                style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:0.9rem;resize:vertical;font-family:var(--font-body);">${groupDetails.notes || ''}</textarea>
            </div>
          </div>
        `;
        break;

      case 'work-group':
        form.innerHTML = `
          <h4 style="margin-bottom:1rem;">Tell us about the work trip</h4>
          <div style="display:grid;gap:1rem;">
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">How many colleagues?</label>
              <select id="gd-group-size" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                ${[2,3,4,5,6,7,8,9,10,15,20,'20+'].map(n => `<option value="${n}" ${(groupDetails.groupSize||5)==n?'selected':''}>${n}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Type of trip</label>
              <select id="gd-work-type" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                <option value="team-building" ${(groupDetails.workType||'team-building')==='team-building'?'selected':''}>Team building / Offsite</option>
                <option value="client-entertainment" ${groupDetails.workType==='client-entertainment'?'selected':''}>Client entertainment</option>
                <option value="conference" ${groupDetails.workType==='conference'?'selected':''}>Conference with free time</option>
                <option value="bleisure" ${groupDetails.workType==='bleisure'?'selected':''}>Business + leisure (bleisure)</option>
              </select>
            </div>
            <div>
              <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Budget expensed?</label>
              <select id="gd-expensed" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:1rem;">
                <option value="yes" ${(groupDetails.expensed||'yes')==='yes'?'selected':''}>Yes — company pays</option>
                <option value="partial" ${groupDetails.expensed==='partial'?'selected':''}>Partially — some personal spend</option>
                <option value="no" ${groupDetails.expensed==='no'?'selected':''}>No — personal budget</option>
              </select>
            </div>
          </div>
        `;
        break;
    }
  }

  function renderChildAgeFields(count) {
    if (count === 0) return '<p style="color:var(--color-text-muted);font-size:0.9rem;">No children — got it!</p>';
    const existingAges = groupDetails.childAges || [];
    return `
      <label style="font-weight:600;display:block;margin-bottom:0.5rem;">Age of each child</label>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
        ${Array.from({length: count}, (_, i) => `
          <select class="child-age-select" data-child="${i}"
            style="width:80px;padding:0.5rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:0.9rem;">
            <option value="" disabled ${!existingAges[i]?'selected':''}>Age</option>
            ${['Under 1','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17'].map(age =>
              `<option value="${age}" ${existingAges[i]===age?'selected':''}>${age}</option>`
            ).join('')}
          </select>
        `).join('')}
      </div>
      <p style="font-size:0.75rem;color:var(--color-text-muted);margin-top:0.5rem;">This helps us suggest age-appropriate activities</p>
    `;
  }

  function collectGroupDetails() {
    const type = groupType;
    const details = { type };

    switch (type) {
      case 'family':
      case 'parent-child': {
        details.adults = parseInt(document.getElementById('gd-adults')?.value || 2);
        details.children = parseInt(document.getElementById('gd-children')?.value || 1);
        details.childAges = Array.from(document.querySelectorAll('.child-age-select'))
          .map(s => s.value).filter(Boolean);
        details.mobility = document.getElementById('gd-mobility')?.value || 'none';
        break;
      }
      case 'multi-family': {
        details.families = parseInt(document.getElementById('gd-families')?.value || 2);
        details.adults = parseInt(document.getElementById('gd-adults')?.value || 4);
        details.children = parseInt(document.getElementById('gd-children')?.value || 3);
        details.ageRanges = Array.from(document.querySelectorAll('.gd-age-range:checked')).map(c => c.value);
        break;
      }
      case 'friends-mixed':
      case 'girls-group':
      case 'lads-group': {
        details.groupSize = document.getElementById('gd-group-size')?.value || '4';
        details.ageRange = document.getElementById('gd-age-range')?.value || '25-35';
        details.energy = document.getElementById('gd-energy')?.value || 'moderate';
        details.notes = document.getElementById('gd-notes')?.value || '';
        break;
      }
      case 'work-group': {
        details.groupSize = document.getElementById('gd-group-size')?.value || '5';
        details.workType = document.getElementById('gd-work-type')?.value || 'team-building';
        details.expensed = document.getElementById('gd-expensed')?.value || 'yes';
        break;
      }
    }

    groupDetails = details;
  }

  // ============================================================
  // UK DESTINATIONS
  // ============================================================
  function populateUKDestinations() {
    const grid = document.getElementById('uk-destinations-grid');
    if (!grid || !ukDestinations.length) return;

    grid.innerHTML = ukDestinations.map(dest => {
      const typeIcon = dest.type === 'city' ? '🏰' : dest.type === 'coastal' ? '🏖️' : '🌿';
      const selected = ukExtension.destinations.includes(dest.id);
      return `
        <div class="chip ${selected ? 'active' : ''}" data-uk-dest="${dest.id}" style="flex-direction:column;padding:1rem;min-width:140px;">
          <span style="font-size:1.5rem;">${typeIcon}</span>
          <strong>${dest.name}</strong>
          <span style="font-size:0.7rem;color:var(--color-text-muted);">${dest.region} &middot; ${dest.daysRecommended}${dest.daysRecommended > 1 ? ' days' : ' day'}</span>
        </div>
      `;
    }).join('');

    document.querySelectorAll('[data-uk-dest]').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.ukDest;
        if (ukExtension.destinations.includes(id)) {
          ukExtension.destinations = ukExtension.destinations.filter(d => d !== id);
          chip.classList.remove('active');
        } else {
          ukExtension.destinations.push(id);
          chip.classList.add('active');
        }
        updateUKPriceHint();
      });
    });

    updateUKPriceHint();
  }

  function getUKExtensionPrice(days) {
    const p = CONFIG.ukExtension.pricing;
    if (days <= 5) return p.short.price;
    if (days <= 10) return p.standard.price;
    return p.extended.price;
  }

  function updateUKPriceHint() {
    const hint = document.getElementById('uk-price-hint');
    if (!hint) return;
    const ukDays = parseInt(document.getElementById('uk-duration-slider')?.value || ukExtension.days || 5);
    const ukPrice = getUKExtensionPrice(ukDays);
    const londonPrice = State.getPrice(tripDays);
    const selectedDests = ukExtension.destinations.map(id => {
      const d = ukDestinations.find(dest => dest.id === id);
      return d ? d.name : id;
    }).join(', ');

    hint.innerHTML = `
      <div class="duration-price-hint" style="display:inline-block;">
        London (${tripDays} days): $${londonPrice} + UK (${ukDays} days): $${ukPrice} = <strong>$${londonPrice + ukPrice} total</strong>
      </div>
      ${selectedDests ? `<p style="font-size:0.85rem;color:var(--color-text-muted);margin-top:0.5rem;">Selected: ${selectedDests}</p>` : ''}
    `;
  }

  // ============================================================
  // EVENT HANDLERS
  // ============================================================
  function attachEvents() {
    // Duration slider
    const slider = document.getElementById('duration-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        tripDays = parseInt(e.target.value);
        document.getElementById('day-count').textContent = tripDays;
        document.getElementById('day-label').textContent = tripDays === 1 ? 'day' : 'days';
        document.getElementById('price-hint').textContent =
          `London itinerary: $${State.getPrice(tripDays)}`;
      });
    }

    // UK toggle
    document.querySelectorAll('[data-uk-toggle]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-uk-toggle]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        ukExtension.enabled = chip.dataset.ukToggle === 'yes';
        const opts = document.getElementById('uk-options');
        if (opts) opts.style.display = ukExtension.enabled ? 'block' : 'none';
        if (ukExtension.enabled) {
          ukExtension.days = parseInt(document.getElementById('uk-duration-slider')?.value || 5);
          populateUKDestinations();
        }
      });
    });

    // UK duration slider
    const ukSlider = document.getElementById('uk-duration-slider');
    if (ukSlider) {
      ukSlider.addEventListener('input', (e) => {
        ukExtension.days = parseInt(e.target.value);
        document.getElementById('uk-day-count').textContent = ukExtension.days;
        updateUKPriceHint();
      });
    }

    // Budget radios
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const category = e.target.name.replace('budget-', '');
        budget[category] = e.target.value;
      });
    });

    // Interest chips
    document.querySelectorAll('.chip[data-interest]').forEach(chip => {
      chip.addEventListener('click', () => {
        const id = chip.dataset.interest;
        if (interests.includes(id)) {
          interests = interests.filter(i => i !== id);
          chip.classList.remove('active');
        } else {
          interests.push(id);
          chip.classList.add('active');
        }
        const countEl = document.getElementById('interest-count');
        if (countEl) countEl.textContent = interests.length;
      });
    });

    // Group type chips
    document.querySelectorAll('.chip[data-group]').forEach(chip => {
      chip.addEventListener('click', () => {
        // Save current group details before switching
        if (groupType) collectGroupDetails();

        document.querySelectorAll('.chip[data-group]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        groupType = chip.dataset.group;
        renderGroupDetails(groupType);
      });
    });

    // Occasion chips
    document.querySelectorAll('.chip[data-occasion]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-occasion]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        occasion = chip.dataset.occasion;
      });
    });

    // Navigation
    document.getElementById('btn-next').addEventListener('click', handleNext);
    document.getElementById('btn-back').addEventListener('click', handleBack);

    // Render initial group details if needed
    renderGroupDetails(groupType);
  }

  function handleNext() {
    if (!validateStep(currentStep)) return;

    // Collect group details before leaving step 3
    if (currentStep === 3) collectGroupDetails();

    if (currentStep === totalSteps) {
      generateItinerary();
      return;
    }

    currentStep++;
    updateStep(currentStep);

    if (currentStep === 2) populateUKDestinations();
  }

  function handleBack() {
    // Collect group details before leaving step 3
    if (currentStep === 3) collectGroupDetails();

    if (currentStep > 1) {
      currentStep--;
      updateStep(currentStep);
      if (currentStep === 2) populateUKDestinations();
      if (currentStep === 3) renderGroupDetails(groupType);
    }
  }

  function validateStep(step) {
    switch (step) {
      case 6:
        if (interests.length < 5) {
          UI.showToast('Please select at least 5 interests to help us personalise your trip');
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function updateStep(step) {
    document.querySelectorAll('.wizard__step').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.step) === step);
    });

    document.querySelectorAll('.progress-step').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.toggle('active', s === step);
      el.classList.toggle('completed', s < step);
    });

    const backBtn = document.getElementById('btn-back');
    const nextBtn = document.getElementById('btn-next');

    backBtn.style.visibility = step === 1 ? 'hidden' : 'visible';

    if (step === totalSteps) {
      nextBtn.innerHTML = '✨ Generate My Itinerary';
      nextBtn.classList.add('btn--large');
      renderReview();
    } else {
      nextBtn.innerHTML = 'Continue →';
    }
  }

  function renderReview() {
    const card = document.getElementById('review-card');
    const londonPrice = State.getPrice(tripDays);
    const tierLabel = CONFIG.pricing[State.getPriceTier(tripDays)].label;
    const groupLabel = CONFIG.groupTypes.find(g => g.id === groupType);
    const occasionLabel = CONFIG.occasions.find(o => o.id === occasion);

    let ukSection = '';
    let totalPrice = londonPrice;

    if (ukExtension.enabled && ukExtension.days > 0) {
      const ukPrice = getUKExtensionPrice(ukExtension.days);
      totalPrice += ukPrice;
      const destNames = ukExtension.destinations.map(id => {
        const d = ukDestinations.find(dest => dest.id === id);
        return d ? d.name : id;
      });

      ukSection = `
        <div class="review-item">
          <span class="review-item__label">UK Extension</span>
          <span class="review-item__value">${ukExtension.days} days (+$${ukPrice})</span>
        </div>
        ${destNames.length > 0 ? `
          <div class="review-item">
            <span class="review-item__label">UK Destinations</span>
            <div class="review-interests">
              ${destNames.map(n => `<span class="badge badge--accent">${n}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      `;
    }

    const totalDays = tripDays + (ukExtension.enabled ? ukExtension.days : 0);

    // Group details summary
    let groupDetailsSummary = '';
    if (groupDetails && Object.keys(groupDetails).length > 1) {
      const parts = [];
      if (groupDetails.adults) parts.push(`${groupDetails.adults} adults`);
      if (groupDetails.children) {
        const agesStr = groupDetails.childAges?.length ? ` (ages: ${groupDetails.childAges.join(', ')})` : '';
        parts.push(`${groupDetails.children} children${agesStr}`);
      }
      if (groupDetails.groupSize) parts.push(`${groupDetails.groupSize} people`);
      if (groupDetails.ageRange && groupDetails.ageRange !== 'mixed') parts.push(`ages ${groupDetails.ageRange}`);
      if (groupDetails.energy) parts.push(`${groupDetails.energy} energy`);
      if (groupDetails.mobility && groupDetails.mobility !== 'none') parts.push(groupDetails.mobility);
      if (groupDetails.workType) parts.push(groupDetails.workType.replace(/-/g, ' '));
      if (groupDetails.notes) parts.push(`Note: ${groupDetails.notes}`);
      if (groupDetails.ageRanges?.length) parts.push(`child ages: ${groupDetails.ageRanges.join(', ')}`);

      if (parts.length > 0) {
        groupDetailsSummary = `
          <div class="review-item">
            <span class="review-item__label">Group Details</span>
            <span class="review-item__value" style="font-size:0.9rem;">${parts.join(' · ')}</span>
          </div>
        `;
      }
    }

    card.innerHTML = `
      <div class="review-item">
        <span class="review-item__label">London</span>
        <span class="review-item__value">${tripDays} ${tripDays === 1 ? 'day' : 'days'}</span>
      </div>
      ${ukSection}
      <div class="review-item">
        <span class="review-item__label">Total Trip</span>
        <span class="review-item__value" style="color:var(--color-accent);font-size:1.1rem;">${totalDays} days</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Travellers</span>
        <span class="review-item__value">${groupLabel ? groupLabel.icon + ' ' + groupLabel.label : groupType}</span>
      </div>
      ${groupDetailsSummary}
      <div class="review-item">
        <span class="review-item__label">Occasion</span>
        <span class="review-item__value">${occasionLabel ? occasionLabel.icon + ' ' + occasionLabel.label : occasion}</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Accommodation</span>
        <span class="review-item__value">${CONFIG.budgetTiers.accommodation[budget.accommodation].label}</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Food</span>
        <span class="review-item__value">${CONFIG.budgetTiers.food[budget.food].label}</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Entertainment</span>
        <span class="review-item__value">${CONFIG.budgetTiers.entertainment[budget.entertainment].label}</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Interests (${interests.length})</span>
        <div class="review-interests">
          ${interests.map(id => {
            const interest = CONFIG.interests.find(i => i.id === id);
            return `<span class="badge badge--accent">${interest ? interest.icon + ' ' + interest.label : id}</span>`;
          }).join('')}
        </div>
      </div>
      <div class="review-price">
        <div class="review-price__desc">${totalDays}-Day ${ukExtension.enabled ? 'London + UK' : 'London'} Itinerary</div>
        <div class="review-price__amount">$${totalPrice}</div>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: var(--space-sm);">
          Preview first 2 days free, then purchase to unlock all ${totalDays} days + PDF export
        </p>
        <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.5rem;">
          Optional add-ons: Booking Concierge ($150) &middot; Personal Consultation ($75)
        </p>
      </div>
    `;
  }

  async function generateItinerary() {
    const nextBtn = document.getElementById('btn-next');
    nextBtn.disabled = true;
    nextBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;"></div> Generating...';

    State.save({
      tripDays, budget, interests, occasion, groupType, groupDetails, ukExtension,
      generatedAt: new Date().toISOString()
    });

    await Engine.loadData();
    const itinerary = Engine.generate({ tripDays, budget, interests, occasion, groupType });

    // If UK extension, add UK days
    if (ukExtension.enabled && ukExtension.days > 0) {
      const ukDests = ukDestinations.filter(d => ukExtension.destinations.includes(d.id));
      const ukDays = buildUKDays(ukDests, itinerary.days.length, ukExtension.days, budget, interests);
      itinerary.days.push(...ukDays);
      itinerary.ukExtension = ukExtension;
      itinerary.ukDestinations = ukDests;
      itinerary.tripDays = tripDays + ukExtension.days;
    }

    // Attach group details to itinerary
    itinerary.groupDetails = groupDetails;

    State.saveItinerary(itinerary);
    window.location.href = 'itinerary.html';
  }

  function buildUKDays(destinations, startDay, totalUKDays, budget, interests) {
    const days = [];
    let dayNum = startDay + 1;
    let daysRemaining = totalUKDays;

    if (destinations.length === 0) {
      destinations = ukDestinations
        .map(d => ({ ...d, score: d.tags.filter(t => interests.includes(t)).length }))
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(4, Math.ceil(totalUKDays / 2)));
    }

    for (const dest of destinations) {
      if (daysRemaining <= 0) break;

      const daysHere = Math.min(dest.daysRecommended, daysRemaining);
      const budgetKey = budget.accommodation;
      const hotel = dest.hotels[budgetKey] || dest.hotels['mid-range'];
      const highlights = [...dest.highlights];
      let highlightIdx = 0;

      const firstDayActivities = [
        {
          timeSlot: "Morning", period: "morning",
          name: `Travel to ${dest.name}`,
          description: `${dest.gettingThere.mode === 'train' ? 'Take the train' : 'Travel'} from ${dest.gettingThere.from} (${dest.gettingThere.duration}). ${dest.description}`,
          estimatedCost: `£${dest.gettingThere.cost}`, estimatedCostValue: dest.gettingThere.cost,
          affiliateUrl: dest.gettingThere.affiliateUrl || '', affiliateLabel: dest.gettingThere.affiliateUrl ? 'Book Train Tickets' : '',
          tips: `Book trains in advance for the best prices.`,
          address: dest.gettingThere.from, neighbourhood: dest.name, type: 'transport'
        }
      ];

      for (let d = 0; d < daysHere; d++) {
        const activities = d === 0 ? [...firstDayActivities] : [];
        const slotsNeeded = d === 0 ? 3 : 4;

        for (let s = 0; s < slotsNeeded && highlightIdx < highlights.length; s++) {
          const h = highlights[highlightIdx++];
          const periods = ['morning', 'lunch', 'afternoon', 'evening'];
          activities.push({
            timeSlot: d === 0 && s === 0 ? 'Afternoon' : ['Morning', 'Lunch', 'Afternoon', 'Evening'][s % 4],
            period: periods[(d === 0 ? s + 1 : s) % 4],
            name: h.name, description: h.description,
            estimatedCost: h.cost > 0 ? `£${h.cost.toFixed(2)}` : 'Free', estimatedCostValue: h.cost,
            affiliateUrl: h.affiliateUrl || '', affiliateLabel: h.affiliateUrl ? 'Book Tickets' : '',
            tips: '', address: dest.name, neighbourhood: dest.name, type: 'attraction'
          });
        }

        if (dest.bestRestaurants.length > 0) {
          const rest = dest.bestRestaurants[d % dest.bestRestaurants.length];
          activities.push({
            timeSlot: '18:30 - 20:00', period: 'dinner', name: rest,
            description: `Recommended restaurant in ${dest.name}.`,
            estimatedCost: '£25-45', estimatedCostValue: 35,
            affiliateUrl: '', affiliateLabel: '',
            tips: 'Book in advance during peak season.',
            address: dest.name, neighbourhood: dest.name, type: 'restaurant'
          });
        }

        if (dest.bestPubs.length > 0) {
          const pub = dest.bestPubs[d % dest.bestPubs.length];
          activities.push({
            timeSlot: '20:30 - 22:30', period: 'evening', name: pub,
            description: `A local favourite in ${dest.name}.`,
            estimatedCost: '£5-10', estimatedCostValue: 7,
            affiliateUrl: '', affiliateLabel: '',
            tips: '', address: dest.name, neighbourhood: dest.name, type: 'nightlife'
          });
        }

        days.push({
          dayNumber: dayNum++,
          theme: `${dest.name}${daysHere > 1 ? ` — Day ${d + 1}` : ''}`,
          neighbourhoods: [dest.name, dest.region],
          activities, isUKExtension: true, destination: dest
        });

        daysRemaining--;
      }
    }

    return days;
  }
});
