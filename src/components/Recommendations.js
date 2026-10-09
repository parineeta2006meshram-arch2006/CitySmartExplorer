/**
 * CitySmart Explorer - Personalized Recommendations Component
 */

import { store } from '../state/store.js';

export function renderRecommendations(state) {
  const { recommendations, filters } = state;

  if (!recommendations) {
    return `
      <section class="section-padding">
        <div class="container" style="text-align: center; padding: 60px 0;">
          <h2>No recommendations calculated yet.</h2>
          <button class="btn btn-primary" style="margin-top: 16px;" onclick="window.appStore.setActiveTab('explore')">
            Go to Smart Explore Form
          </button>
        </div>
      </section>
    `;
  }

  const { rankedPlaces, itinerary, filtersApplied } = recommendations;

  return `
    <section class="section-padding">
      <div class="container">
        <!-- Header & Applied Constraints Pill Strip -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 28px;">
          <div>
            <span class="badge badge-green">Personalized Result Engine</span>
            <h1 class="section-title" style="margin-top: 6px;">Your Tailored Pune Recommendations</h1>
            <p class="section-subtitle">
              Calculated specifically for: 
              <strong>₹${filtersApplied.budget} budget</strong> • 
              <strong>${filtersApplied.availableTime} hours</strong> • 
              <strong>Interests: ${filtersApplied.interests.join(', ') || 'All'}</strong> • 
              <strong>Safety: ${filtersApplied.safetyPreference}</strong>
            </p>
          </div>

          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="window.appStore.setActiveTab('explore')">
              ✏️ Adjust Constraints
            </button>
            <button class="btn btn-outline btn-sm" onclick="window.appStore.setActiveTab('map')">
              🗺️ Open in Map
            </button>
          </div>
        </div>

        <!-- 1. PERSONALIZED ITINERARY SCHEDULE CARD -->
        <div class="itinerary-hero-card">
          <div class="itinerary-header-meta">
            <div>
              <span class="badge badge-blue" style="background: rgba(56, 189, 248, 0.2); color: #7dd3fc;">
                Recommended Multi-Stop Itinerary
              </span>
              <h2 style="font-size: 1.8rem; font-weight: 800; margin-top: 6px;">
                ${itinerary.theme}
              </h2>
            </div>

            <div style="text-align: right;">
              <span style="font-size: 0.85rem; color: #94a3b8;">Itinerary Smart Index</span>
              <div style="font-size: 1.8rem; font-weight: 800; color: #38bdf8;">
                ${itinerary.avgSmartScore} <span style="font-size: 1rem; color: #94a3b8;">/10</span>
              </div>
            </div>
          </div>

          <!-- Summary Metrics 4-Grid -->
          <div class="itinerary-summary-grid">
            <div class="itinerary-summary-item">
              <span class="itinerary-summary-lbl">Estimated Total Cost</span>
              <span class="itinerary-summary-val">₹${itinerary.totalCost}</span>
              <span style="font-size: 0.75rem; color: #94a3b8;">(₹${itinerary.budgetRemaining} remaining buffer)</span>
            </div>

            <div class="itinerary-summary-item">
              <span class="itinerary-summary-lbl">Total Time Required</span>
              <span class="itinerary-summary-val">${itinerary.totalTime} hrs</span>
              <span style="font-size: 0.75rem; color: #94a3b8;">(Fits within ${filtersApplied.availableTime}h window)</span>
            </div>

            <div class="itinerary-summary-item">
              <span class="itinerary-summary-lbl">Overall Safety Score</span>
              <span class="itinerary-summary-val" style="color: #34d399;">${itinerary.avgSafety}/10</span>
              <span style="font-size: 0.75rem; color: #94a3b8;">(High Security Standard)</span>
            </div>

            <div class="itinerary-summary-item">
              <span class="itinerary-summary-lbl">Itinerary Stops</span>
              <span class="itinerary-summary-val">${itinerary.stops.length} Stops</span>
              <span style="font-size: 0.75rem; color: #94a3b8;">Optimized geographical route</span>
            </div>
          </div>

          <!-- Stops Timeline -->
          <div class="timeline-track">
            ${itinerary.stops.map((stop, index) => `
              <div class="timeline-step">
                <div class="timeline-index-badge">${stop.stopNumber}</div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="font-size: 1.15rem; font-weight: 800;">${stop.place.imageEmoji} ${stop.place.name}</span>
                    <span class="badge badge-purple" style="font-size: 0.75rem;">${stop.place.category}</span>
                    <span class="badge badge-green" style="font-size: 0.75rem;">Safety: ${stop.place.safetyScore}/10</span>
                  </div>
                  <div style="font-size: 0.88rem; color: #cbd5e1; margin-top: 4px;">
                    ${stop.place.shortDescription}
                  </div>
                </div>
                <div style="text-align: right; min-width: 110px;">
                  <div style="font-size: 1.1rem; font-weight: 800; color: #38bdf8;">${stop.cost}</div>
                  <div style="font-size: 0.8rem; color: #94a3b8;">${stop.estimatedTimeSpent}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. CITY SMART SCORE INNOVATION EXPLAINER -->
        <div class="card" style="margin-bottom: 36px; border-left: 5px solid var(--brand-primary); background: #f0f9ff;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <span class="badge badge-blue">Key Innovation Feature</span>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #0c4a6e; margin-top: 4px;">
                How the "City Smart Score" Evaluates Every Place
              </h3>
            </div>
            <span class="score-pill smart" style="font-size: 1rem; padding: 6px 14px;">
              Multi-Factor Urban Index
            </span>
          </div>

          <p style="font-size: 0.95rem; color: #0369a1; margin-top: 10px; line-height: 1.6;">
            <strong>"The Smart Score combines multiple factors to help users make a better decision instead of relying only on popularity."</strong>
            Popularity often leads tourists into overcrowded bottlenecks. Our proprietary algorithm weights:
            <strong>Safety (30%)</strong>, 
            <strong>Affordability (25%)</strong>, 
            <strong>User Ratings (20%)</strong>, 
            <strong>Cleanliness (15%)</strong>, and 
            <strong>Accessibility (10%)</strong>.
          </p>
        </div>

        <!-- 3. INDIVIDUAL RANKED PLACES CARDS -->
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 1.6rem; font-weight: 800;">
            All Matched Places (${rankedPlaces.length})
          </h2>
          <p style="font-size: 0.92rem; color: var(--text-muted);">
            Ranked by match compatibility with your situation, including full explainable justification.
          </p>
        </div>

        <div class="places-grid">
          ${rankedPlaces.map(place => {
            const factors = place.smartScoreData.factors;
            return `
              <div class="place-card">
                <div class="place-card-header">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.6rem;">${place.imageEmoji}</span>
                      <div>
                        <h3 class="place-title">${place.name}</h3>
                        <span class="badge badge-slate" style="margin-top: 2px;">${place.categoryName}</span>
                      </div>
                    </div>
                  </div>

                  <div style="text-align: right;">
                    <div class="score-pill smart" title="City Smart Score (Weighted Composite)">
                      ⭐ ${place.smartScore} / 10
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; font-weight: 700;">Smart Score</div>
                  </div>
                </div>

                <div class="place-card-body">
                  <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5;">
                    ${place.shortDescription}
                  </p>

                  <div class="place-meta-pills">
                    <span class="badge badge-blue">💰 Est. Cost: ₹${place.estimatedCost}</span>
                    <span class="badge badge-slate">⏱️ Time: ${place.timeRequired} hrs</span>
                    <span class="badge badge-amber">⭐ Rating: ${place.rating} / 5</span>
                    <span class="badge badge-green">🛡️ Safety: ${place.safetyScore} / 10</span>
                    <span class="badge badge-purple">📍 Distance: ${place.distance} km</span>
                  </div>

                  <!-- Explainability Block ("Why It Was Recommended") -->
                  <div class="reasons-box">
                    <div class="reasons-title">
                      <span>✓</span> Why It Was Recommended for You:
                    </div>
                    ${place.reasons.map(reason => `
                      <div class="reason-item">
                        <span>•</span>
                        <span>${reason}</span>
                      </div>
                    `).join('')}
                  </div>

                  <!-- 5-Factor Smart Score Breakdown Meter -->
                  <div class="smart-score-box">
                    <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
                      City Smart Score Factor Breakdown:
                    </div>

                    <div class="score-row">
                      <span>Safety & Security (30%)</span>
                      <strong style="color: #059669;">${factors.safety.score}/10</strong>
                    </div>
                    <div class="meter-track">
                      <div class="meter-fill" style="width: ${factors.safety.score * 10}%; background: #10b981;"></div>
                    </div>

                    <div class="score-row">
                      <span>Affordability Index (25%)</span>
                      <strong style="color: #0284c7;">${factors.affordability.score}/10</strong>
                    </div>
                    <div class="meter-track">
                      <div class="meter-fill" style="width: ${factors.affordability.score * 10}%; background: #0284c7;"></div>
                    </div>

                    <div class="score-row">
                      <span>Visitor Ratings (20%)</span>
                      <strong style="color: #d97706;">${factors.rating.score}/10</strong>
                    </div>
                    <div class="meter-track">
                      <div class="meter-fill" style="width: ${factors.rating.score * 10}%; background: #f59e0b;"></div>
                    </div>

                    <div class="score-row">
                      <span>Cleanliness & Hygiene (15%)</span>
                      <strong style="color: #6366f1;">${factors.cleanliness.score}/10</strong>
                    </div>
                    <div class="meter-track">
                      <div class="meter-fill" style="width: ${factors.cleanliness.score * 10}%; background: #8b5cf6;"></div>
                    </div>

                    <div class="score-row">
                      <span>Accessibility (10%)</span>
                      <strong style="color: #475569;">${factors.accessibility.score}/10</strong>
                    </div>
                    <div class="meter-track">
                      <div class="meter-fill" style="width: ${factors.accessibility.score * 10}%; background: #64748b;"></div>
                    </div>
                  </div>

                  <!-- Card Action Buttons -->
                  <div style="display: flex; gap: 10px; margin-top: 18px;">
                    <button 
                      class="btn btn-outline btn-sm" 
                      style="flex: 1;"
                      onclick="window.quickCompare('${place.id}')"
                    >
                      ⚖️ Compare This
                    </button>
                    <button 
                      class="btn btn-primary btn-sm" 
                      style="flex: 1;"
                      onclick="window.viewPlaceOnMap('${place.id}')"
                    >
                      🗺️ Locate on Map
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}
