// ============================================================
// WEATHER SERVICE — Weather data for itineraries
// ============================================================
const WeatherService = {
  monthlyAverages: {
    0: { temp: 7, rain: 55, daylight: 8, desc: 'Cold & grey' },
    1: { temp: 7, rain: 40, daylight: 9, desc: 'Cold, less rain' },
    2: { temp: 10, rain: 41, daylight: 11, desc: 'Spring emerging' },
    3: { temp: 13, rain: 43, daylight: 14, desc: 'Mild & pleasant' },
    4: { temp: 17, rain: 49, daylight: 16, desc: 'Warm & sunny' },
    5: { temp: 20, rain: 45, daylight: 17, desc: 'Long warm days' },
    6: { temp: 22, rain: 45, daylight: 16, desc: 'Peak summer' },
    7: { temp: 22, rain: 50, daylight: 15, desc: 'Warm, some rain' },
    8: { temp: 19, rain: 49, daylight: 13, desc: 'Late summer' },
    9: { temp: 14, rain: 69, daylight: 11, desc: 'Autumn colours' },
    10: { temp: 10, rain: 59, daylight: 9, desc: 'Cool & wet' },
    11: { temp: 7, rain: 55, daylight: 8, desc: 'Cold, festive' }
  },

  icons: {
    sunny: '☀️', partly_cloudy: '⛅', cloudy: '☁️', rainy: '🌧️',
    stormy: '⛈️', snowy: '🌨️', foggy: '🌫️', clear: '🌤️'
  },

  async init() {
    // Render weather on itinerary page
    this.renderItineraryWeather();
  },

  getMonthWeather(month) {
    return this.monthlyAverages[month] || this.monthlyAverages[0];
  },

  getWeatherIcon(temp, rain) {
    if (rain > 60) return this.icons.rainy;
    if (rain > 40) return this.icons.partly_cloudy;
    if (temp > 20) return this.icons.sunny;
    if (temp > 12) return this.icons.clear;
    if (temp < 3) return this.icons.snowy;
    return this.icons.cloudy;
  },

  async fetchForecast(startDate, days) {
    const apiKey = CONFIG?.weather?.apiKey;
    if (!apiKey || apiKey.includes('YOUR_')) return null;

    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London,GB&appid=${apiKey}&units=metric&cnt=${Math.min(days * 8, 40)}`);
      if (!response.ok) return null;
      const data = await response.json();
      return this.parseForecast(data, startDate, days);
    } catch (e) {
      return null;
    }
  },

  parseForecast(data, startDate, days) {
    const daily = {};
    (data.list || []).forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!daily[date]) daily[date] = { temps: [], rain: 0, descs: [] };
      daily[date].temps.push(item.main.temp);
      daily[date].rain += (item.rain?.['3h'] || 0);
      daily[date].descs.push(item.weather[0]?.main);
    });

    return Object.entries(daily).slice(0, days).map(([date, d]) => ({
      date,
      temp: Math.round(d.temps.reduce((a, b) => a + b, 0) / d.temps.length),
      rain: Math.round(d.rain),
      condition: d.descs.sort((a, b) => d.descs.filter(v => v === a).length - d.descs.filter(v => v === b).length).pop()
    }));
  },

  renderItineraryWeather() {
    const state = typeof State !== 'undefined' ? State.get() : {};
    const itinerary = typeof State !== 'undefined' ? State.getItinerary() : null;
    if (!itinerary) return;

    const dates = itinerary.travelDates || state.travelDates;
    let weatherData = null;

    if (dates?.start) {
      const start = new Date(dates.start);
      const now = new Date();
      const diffDays = Math.floor((start - now) / 86400000);

      // If within 5-day forecast range, try live data
      if (diffDays >= 0 && diffDays <= 5) {
        this.fetchForecast(dates.start, itinerary.tripDays).then(forecast => {
          if (forecast) this.injectWeatherBadges(forecast, itinerary);
        });
      }

      // Always show monthly averages
      const month = start.getMonth();
      weatherData = this.getMonthWeather(month);
    } else {
      // No dates set — use current month
      weatherData = this.getMonthWeather(new Date().getMonth());
    }

    if (!weatherData) return;
    this.renderWeatherBar(weatherData, itinerary);
  },

  renderWeatherBar(weather, itinerary) {
    const container = document.getElementById('itinerary-map');
    if (!container) return;

    const icon = this.getWeatherIcon(weather.temp, weather.rain);
    const bar = document.createElement('div');
    bar.style.cssText = 'background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:1rem 1.5rem;margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;';
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;">
        <span style="font-size:2rem;">${icon}</span>
        <div>
          <strong style="font-size:0.95rem;">London Weather: ${weather.desc}</strong>
          <div style="font-size:0.8rem;color:var(--color-text-muted);">Avg ${weather.temp}°C · ${weather.rain}mm rainfall · ${weather.daylight}h daylight</div>
        </div>
      </div>
      <div style="font-size:0.75rem;color:var(--color-text-muted);">
        ${CONFIG?.weather?.apiKey?.includes('YOUR_') ? 'Based on monthly averages' : 'Weather forecast'}
      </div>
    `;
    container.parentNode.insertBefore(bar, container);
  },

  injectWeatherBadges(forecast, itinerary) {
    forecast.forEach((day, i) => {
      const dayCard = document.getElementById(`day-${i + 1}`);
      if (!dayCard) return;
      const header = dayCard.querySelector('.day-card__header');
      if (!header) return;

      const icon = day.condition === 'Rain' ? '🌧️' : day.condition === 'Clouds' ? '☁️' : '☀️';
      const badge = document.createElement('span');
      badge.style.cssText = 'font-size:0.8rem;padding:4px 10px;background:' + (day.condition === 'Rain' ? '#FEF3C7' : '#ECFDF5') + ';border-radius:20px;white-space:nowrap;';
      badge.textContent = `${icon} ${day.temp}°C`;
      header.querySelector('div:last-child')?.appendChild(badge);
    });
  }
};

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  if (typeof WeatherService !== 'undefined') WeatherService.init();
});
