/**
 * CitySmart Explorer - Smart Explore Form Component
 */

import { store } from '../state/store.js';

export function renderSmartExplore(state) {
  const { filters } = state;
  const { budget, availableTime, interests, safetyPreference, accessibilityPreference } = filters;

  const allInterests = [
    { id: 'Food', label: 'Food & Cafes', icon: '🍲' },
    { id: 'History', label: 'History & Heritage', icon: '🏰' },
    { id: 'Nature', label: 'Nature & Parks', icon: '🌲' },
    { id: 'Shopping', label: 'Shopping & Bazaars', icon: '🛍️' },
    { id: 'Culture', label: 'Culture & Temples', icon: '🪷' }
  ];

  return `
    <section class="section-padding">
      <div class="container">
        <div style="text-align: center; max-width: 650px; margin: 0 auto 36px;">
          <span class="badge badge-blue">Personalized Situation Planner</span>
          <h2 class="section-title" style="margin-top: 8px;">Find Your Custom City Plan</h2>
          <p class="section-subtitle" style="margin: 0 auto;">
            Input your budget, available hours, and priorities. Our intelligent engine matches you with places optimized for your exact situation in Pune.
          </p>
        </div>

        <div class="explore-form-container">
          <!-- Presets Bar -->
          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
              ⚡ Quick Presets (Click to Auto-fill)
            </div>
            <div class="presets-strip">
              <button 
                class="preset-chip" 
                onclick="window.setFormPreset({ budget: 500, availableTime: 3, interests: ['Food', 'History'], safetyPreference: 'safer', accessibilityPreference: 'any' })"
              >
                🎒 Student Budget (₹500 • 3 hrs)
              </button>
              <button 
                class="preset-chip" 
                onclick="window.setFormPreset({ budget: 2000, availableTime: 6, interests: ['History', 'Nature', 'Food'], safetyPreference: 'safer', accessibilityPreference: 'easy' })"
              >
                👨‍👩‍👧 Family Explorer (₹2000 • 6 hrs • Easy Access)
              </button>
              <button 
                class="preset-chip" 
                onclick="window.setFormPreset({ budget: 1000, availableTime: 4, interests: ['Nature', 'Food'], safetyPreference: 'highest', accessibilityPreference: 'any' })"
              >
                🛡️ Safe Solo (₹1000 • 4 hrs • Highest Safety)
              </button>
              <button 
                class="preset-chip" 
                onclick="window.setFormPreset({ budget: 1500, availableTime: 5, interests: ['Food', 'History'], safetyPreference: 'safer', accessibilityPreference: 'any' })"
              >
                ✨ Default Benchmark (₹1500 • 5 hrs)
              </button>
            </div>
          </div>

          <form id="smart-explore-form" onsubmit="window.handleExploreSubmit(event)">
            <!-- City Selection (Fixed Demo) -->
            <div class="form-group">
              <label class="form-label">
                <span>Selected Destination City</span>
                <span class="badge badge-green">Demo City Active</span>
              </label>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; background: #f8fafc; border: 1.5px solid var(--border-light); border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 10px; font-weight: 700;">
                  <span style="font-size: 1.3rem;">🏙️</span>
                  <span>Pune, Maharashtra, India</span>
                </div>
                <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Fixed Demo Dataset</span>
              </div>
            </div>

            <!-- Budget Slider -->
            <div class="form-group">
              <div class="form-label">
                <span>Estimated Budget</span>
                <span class="form-label-val" id="budget-display">₹${budget}</span>
              </div>
              <input 
                type="range" 
                id="input-budget" 
                class="range-slider" 
                min="0" 
                max="4000" 
                step="50" 
                value="${budget}"
                oninput="document.getElementById('budget-display').textContent = '₹' + this.value; window.appStore.state.filters.budget = parseInt(this.value, 10);"
              />
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
                <span>₹0 (Free Only)</span>
                <span>₹1,000</span>
                <span>₹2,000</span>
                <span>₹3,000</span>
                <span>₹4,000+</span>
              </div>
            </div>

            <!-- Available Time Slider -->
            <div class="form-group">
              <div class="form-label">
                <span>Available Time</span>
                <span class="form-label-val" id="time-display">${availableTime} Hours</span>
              </div>
              <input 
                type="range" 
                id="input-time" 
                class="range-slider" 
                min="1" 
                max="10" 
                step="0.5" 
                value="${availableTime}"
                oninput="document.getElementById('time-display').textContent = this.value + ' Hours'; window.appStore.state.filters.availableTime = parseFloat(this.value);"
              />
              <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted); margin-top: 6px;">
                <span>1 Hour (Quick Stop)</span>
                <span>3 Hours</span>
                <span>5 Hours (Half Day)</span>
                <span>8 Hours</span>
                <span>10 Hours (Full Day)</span>
              </div>
            </div>

            <!-- Interests Multi-Select Chips -->
            <div class="form-group">
              <label class="form-label">
                <span>Your Interests (Select One or More)</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Multi-select enabled</span>
              </label>
              <div class="chips-container" id="interests-container">
                ${allInterests.map(item => {
                  const isSelected = interests.includes(item.id);
                  return `
                    <button 
                      type="button" 
                      class="chip-btn ${isSelected ? 'active' : ''}" 
                      data-interest="${item.id}"
                      onclick="window.toggleInterest('${item.id}')"
                    >
                      <span>${item.icon}</span>
                      <span>${item.label}</span>
                      <span>${isSelected ? '✓' : '+'}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Safety Preference -->
            <div class="form-group">
              <label class="form-label">
                <span>Safety Preference</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 500;">Filters based on verified safety index</span>
              </label>
              <div class="radio-options-grid">
                <div 
                  class="radio-card ${safetyPreference === 'standard' ? 'active' : ''}" 
                  onclick="window.setSafetyPref('standard')"
                >
                  <div class="radio-card-title">
                    <span>🟢 Standard</span>
                  </div>
                  <div class="radio-card-desc">Standard city precautions; all places included.</div>
                </div>

                <div 
                  class="radio-card ${safetyPreference === 'safer' ? 'active' : ''}" 
                  onclick="window.setSafetyPref('safer')"
                >
                  <div class="radio-card-title">
                    <span>🛡️ Prefer Safer Places</span>
                  </div>
                  <div class="radio-card-desc">Filters places with safety score ≥ 8.5/10. Recommended for solo travelers.</div>
                </div>

                <div 
                  class="radio-card ${safetyPreference === 'highest' ? 'active' : ''}" 
                  onclick="window.setSafetyPref('highest')"
                >
                  <div class="radio-card-title">
                    <span>🌟 Highest Safety</span>
                  </div>
                  <div class="radio-card-desc">Strict filtering: safety score ≥ 9.0/10, gated premises and high patrolling.</div>
                </div>
              </div>
            </div>

            <!-- Accessibility Preference -->
            <div class="form-group">
              <label class="form-label">
                <span>Accessibility Preference</span>
              </label>
              <div class="radio-options-grid" style="grid-template-columns: repeat(2, 1fr);">
                <div 
                  class="radio-card ${accessibilityPreference === 'any' ? 'active' : ''}" 
                  onclick="window.setAccessPref('any')"
                >
                  <div class="radio-card-title">
                    <span>🚶 Any Accessibility</span>
                  </div>
                  <div class="radio-card-desc">Includes hill treks, heritage stairs, and traditional cobblestone bazaars.</div>
                </div>

                <div 
                  class="radio-card ${accessibilityPreference === 'easy' ? 'active' : ''}" 
                  onclick="window.setAccessPref('easy')"
                >
                  <div class="radio-card-title">
                    <span>♿ Easy Access</span>
                  </div>
                  <div class="radio-card-desc">Paved paths, wheelchair ramps, and comfortable walking corridors (≥ 8.0 score).</div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div style="margin-top: 36px;">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg" 
                style="width: 100%; justify-content: center; font-size: 1.15rem; padding: 16px;"
              >
                <span>🔍 Find My Best Plan</span>
                <span>→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `;
}
