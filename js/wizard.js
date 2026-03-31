document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  let currentStep = 1;
  const totalSteps = 6;

  const state = State.get();
  let tripDays = state.tripDays || CONFIG.trip.defaultDays;
  let budget = state.budget || { accommodation: 'mid-range', food: 'mid-range', entertainment: 'mid-range' };
  let interests = state.interests || [];
  let occasion = state.occasion || 'none';
  let groupType = state.groupType || 'couple';

  // Render wizard
  renderWizard();
  updateStep(1);

  function renderWizard() {
    const main = document.querySelector('.main');
    main.innerHTML = `
      <div class="wizard">
        <div class="wizard__header">
          <h1>Plan Your London Adventure</h1>
          <p>Answer a few questions and we'll create your perfect personalised itinerary</p>
        </div>

        <div class="wizard__progress progress-bar">
          ${[1,2,3,4,5,6].map((step, i) => `
            <div class="progress-step" data-step="${step}">
              <div class="progress-step__circle">${step}</div>
              <span class="progress-step__label">${['Duration', 'Who', 'Occasion', 'Budget', 'Interests', 'Review'][i]}</span>
              ${i < 5 ? '<div class="progress-step__line"></div>' : ''}
            </div>
          `).join('')}
        </div>

        <!-- Step 1: Duration -->
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
              Itinerary price: $${State.getPrice(tripDays)}
            </div>
          </div>
        </div>

        <!-- Step 2: Group Type -->
        <div class="wizard__step" data-step="2">
          <h2 class="wizard__step-title">Who's travelling?</h2>
          <p class="wizard__step-desc">We'll tailor activities and venues to suit your group</p>
          <div class="interests-grid" style="max-width: 600px; margin: 2rem auto 0;">
            ${CONFIG.groupTypes.map(gt => `
              <div class="chip ${groupType === gt.id ? 'active' : ''}" data-group="${gt.id}">
                <span class="chip__icon">${gt.icon}</span>
                ${gt.label}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 3: Occasion -->
        <div class="wizard__step" data-step="3">
          <h2 class="wizard__step-title">What's the occasion?</h2>
          <p class="wizard__step-desc">Celebrating something special? We'll make it unforgettable</p>
          <div class="interests-grid" style="max-width: 700px; margin: 2rem auto 0;">
            ${CONFIG.occasions.map(occ => `
              <div class="chip ${occasion === occ.id ? 'active' : ''}" data-occasion="${occ.id}">
                <span class="chip__icon">${occ.icon}</span>
                ${occ.label}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 4: Budget -->
        <div class="wizard__step" data-step="4">
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

        <!-- Step 5: Interests -->
        <div class="wizard__step" data-step="5">
          <h2 class="wizard__step-title">What are you into?</h2>
          <p class="wizard__step-desc">Select at least 3 interests so we can personalise your trip</p>
          <div class="interest-count">
            <strong id="interest-count">${interests.length}</strong> selected (minimum 3)
          </div>
          <div class="interests-grid">
            ${CONFIG.interests.map(interest => `
              <div class="chip ${interests.includes(interest.id) ? 'active' : ''}"
                data-interest="${interest.id}">
                <span class="chip__icon">${interest.icon}</span>
                ${interest.label}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Step 6: Review -->
        <div class="wizard__step" data-step="6">
          <h2 class="wizard__step-title">Your Trip Summary</h2>
          <p class="wizard__step-desc">Review your preferences before we generate your itinerary</p>
          <div class="review-card" id="review-card">
            <!-- Populated dynamically -->
          </div>
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

  function attachEvents() {
    // Duration slider
    const slider = document.getElementById('duration-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        tripDays = parseInt(e.target.value);
        document.getElementById('day-count').textContent = tripDays;
        document.getElementById('day-label').textContent = tripDays === 1 ? 'day' : 'days';
        document.getElementById('price-hint').textContent =
          `Itinerary price: $${State.getPrice(tripDays)}`;
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
        document.getElementById('interest-count').textContent = interests.length;
      });
    });

    // Group type chips (single select)
    document.querySelectorAll('.chip[data-group]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-group]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        groupType = chip.dataset.group;
      });
    });

    // Occasion chips (single select)
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
  }

  function handleNext() {
    if (!validateStep(currentStep)) return;

    if (currentStep === totalSteps) {
      generateItinerary();
      return;
    }

    currentStep++;
    updateStep(currentStep);
  }

  function handleBack() {
    if (currentStep > 1) {
      currentStep--;
      updateStep(currentStep);
    }
  }

  function validateStep(step) {
    switch (step) {
      case 5:
        if (interests.length < 3) {
          UI.showToast('Please select at least 3 interests');
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function updateStep(step) {
    // Update panels
    document.querySelectorAll('.wizard__step').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.step) === step);
    });

    // Update progress
    document.querySelectorAll('.progress-step').forEach(el => {
      const s = parseInt(el.dataset.step);
      el.classList.toggle('active', s === step);
      el.classList.toggle('completed', s < step);
    });

    // Update nav
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
    const price = State.getPrice(tripDays);
    const tierLabel = CONFIG.pricing[State.getPriceTier(tripDays)].label;

    const groupLabel = CONFIG.groupTypes.find(g => g.id === groupType);
    const occasionLabel = CONFIG.occasions.find(o => o.id === occasion);

    card.innerHTML = `
      <div class="review-item">
        <span class="review-item__label">Duration</span>
        <span class="review-item__value">${tripDays} ${tripDays === 1 ? 'day' : 'days'}</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Travellers</span>
        <span class="review-item__value">${groupLabel ? groupLabel.icon + ' ' + groupLabel.label : groupType}</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Occasion</span>
        <span class="review-item__value">${occasionLabel ? occasionLabel.icon + ' ' + occasionLabel.label : occasion}</span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Accommodation</span>
        <span class="review-item__value">${CONFIG.budgetTiers.accommodation[budget.accommodation].label}
          <br><small style="color: var(--color-text-muted); font-weight: 400">${CONFIG.budgetTiers.accommodation[budget.accommodation].range}</small>
        </span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Food</span>
        <span class="review-item__value">${CONFIG.budgetTiers.food[budget.food].label}
          <br><small style="color: var(--color-text-muted); font-weight: 400">${CONFIG.budgetTiers.food[budget.food].range}</small>
        </span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Entertainment</span>
        <span class="review-item__value">${CONFIG.budgetTiers.entertainment[budget.entertainment].label}
          <br><small style="color: var(--color-text-muted); font-weight: 400">${CONFIG.budgetTiers.entertainment[budget.entertainment].range}</small>
        </span>
      </div>
      <div class="review-item">
        <span class="review-item__label">Interests</span>
        <div class="review-interests">
          ${interests.map(id => {
            const interest = CONFIG.interests.find(i => i.id === id);
            return `<span class="badge badge--accent">${interest ? interest.icon + ' ' + interest.label : id}</span>`;
          }).join('')}
        </div>
      </div>
      <div class="review-price">
        <div class="review-price__desc">${tierLabel} Itinerary</div>
        <div class="review-price__amount">$${price}</div>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-top: var(--space-sm);">
          Preview first 2 days free, then purchase to unlock all ${tripDays} days + PDF export
        </p>
      </div>
    `;
  }

  async function generateItinerary() {
    const nextBtn = document.getElementById('btn-next');
    nextBtn.disabled = true;
    nextBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;display:inline-block;vertical-align:middle;"></div> Generating...';

    // Save preferences
    State.save({
      tripDays, budget, interests, occasion, groupType,
      generatedAt: new Date().toISOString()
    });

    // Load data and generate
    await Engine.loadData();
    const itinerary = Engine.generate({ tripDays, budget, interests, occasion, groupType });
    State.saveItinerary(itinerary);

    // Redirect to itinerary page
    window.location.href = 'itinerary.html';
  }
});
