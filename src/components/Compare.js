/**
 * CitySmart Explorer - Compare Places Component
 */

import { PUNE_DATA } from '../data/puneData.js';
import { comparePlaces } from '../utils/smartScore.js';

export function renderCompare(state) {
  const { comparison } = state;
  const places = PUNE_DATA.places;

  const placeA = places.find(p => p.id === comparison.placeAId) || places[0];
  const placeB = places.find(p => p.id === comparison.placeBId) || places[1];

  const result = comparePlaces(placeA, placeB);

  const presets = [
    { label: "Shaniwar Wada vs Aga Khan Palace", a: "shaniwar-wada", b: "aga-khan-palace" },
    { label: "FC Road Food vs Camp Food Street", a: "fc-road-food", b: "camp-food-street" },
    { label: "Vetal Hill vs Saras Baug", a: "vetal-hill", b: "saras-baug" },
    { label: "FC Market vs Phoenix Marketcity", a: "fc-road-market", b: "phoenix-marketcity" }
  ];

  return `
    <section class="section-padding">
      <div class="container compare-container">
        <div style="text-align: center; max-width: 650px; margin: 0 auto 36px;">
          <span class="badge badge-purple">Objective Multi-Factor Comparison</span>
          <h1 class="section-title" style="margin-top: 8px;">Compare City Destinations</h1>
          <p class="section-subtitle" style="margin: 0 auto;">
            Evaluate two places side-by-side across Safety, Affordability, Ratings, Cleanliness, and Accessibility to determine the best match for your trip.
          </p>
        </div>

        <!-- Presets Row -->
        <div style="margin-bottom: 20px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
            Quick Comparison Presets:
          </div>
          <div class="presets-strip" style="margin: 0 0 20px 0;">
            ${presets.map(pr => `
              <button 
                class="preset-chip ${comparison.placeAId === pr.a && comparison.placeBId === pr.b ? 'active' : ''}"
                onclick="window.setComparePair('${pr.a}', '${pr.b}')"
              >
                ${pr.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Dropdowns Selection Header -->
        <div class="compare-selectors-bar">
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">
              Place A (First Option)
            </label>
            <select 
              class="compare-dropdown" 
              onchange="window.setComparePair(this.value, '${placeB.id}')"
            >
              ${places.map(p => `
                <option value="${p.id}" ${p.id === placeA.id ? 'selected' : ''}>
                  ${p.imageEmoji} ${p.name} (${p.category})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="compare-vs-badge">VS</div>

          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 6px;">
              Place B (Second Option)
            </label>
            <select 
              class="compare-dropdown" 
              onchange="window.setComparePair('${placeA.id}', this.value)"
            >
              ${places.map(p => `
                <option value="${p.id}" ${p.id === placeB.id ? 'selected' : ''}>
                  ${p.imageEmoji} ${p.name} (${p.category})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <!-- Comparison Table Matrix -->
        <table class="compare-table">
          <thead>
            <tr>
              <th style="width: 32%;">Evaluation Factor</th>
              <th style="width: 34%; font-size: 1rem; color: var(--text-primary);">
                ${placeA.imageEmoji} ${placeA.name}
              </th>
              <th style="width: 34%; font-size: 1rem; color: var(--text-primary);">
                ${placeB.imageEmoji} ${placeB.name}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Overall Smart Score -->
            <tr style="background: #f8fafc;">
              <td>
                <div style="font-weight: 800; font-size: 1.05rem; color: #0284c7;">Overall Smart Score</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Proprietary weighted urban index</div>
              </td>
              <td class="${result.overallWinner === 'A' ? 'compare-winner-cell' : ''}">
                <div style="font-size: 1.3rem; font-weight: 800;">
                  ${result.scoreA.overall} / 10
                  ${result.overallWinner === 'A' ? ' 🏆' : ''}
                </div>
              </td>
              <td class="${result.overallWinner === 'B' ? 'compare-winner-cell' : ''}">
                <div style="font-size: 1.3rem; font-weight: 800;">
                  ${result.scoreB.overall} / 10
                  ${result.overallWinner === 'B' ? ' 🏆' : ''}
                </div>
              </td>
            </tr>

            <!-- Safety Factor -->
            <tr>
              <td>
                <div style="font-weight: 700;">Safety & Security</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Weight: 30% • Verified lighting & patrol index</div>
              </td>
              <td class="${placeA.safetyScore > placeB.safetyScore ? 'compare-winner-cell' : ''}">
                <strong>${placeA.safetyScore} / 10</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${placeA.safetyNotes}</div>
              </td>
              <td class="${placeB.safetyScore > placeA.safetyScore ? 'compare-winner-cell' : ''}">
                <strong>${placeB.safetyScore} / 10</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${placeB.safetyNotes}</div>
              </td>
            </tr>

            <!-- Affordability -->
            <tr>
              <td>
                <div style="font-weight: 700;">Affordability & Cost</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Weight: 25% • Actual estimated expense</div>
              </td>
              <td class="${placeA.estimatedCost < placeB.estimatedCost ? 'compare-winner-cell' : ''}">
                <strong>₹${placeA.estimatedCost}</strong> 
                <span style="font-size: 0.8rem; color: var(--text-muted);">(${result.scoreA.factors.affordability.score}/10)</span>
              </td>
              <td class="${placeB.estimatedCost < placeA.estimatedCost ? 'compare-winner-cell' : ''}">
                <strong>₹${placeB.estimatedCost}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted);">(${result.scoreB.factors.affordability.score}/10)</span>
              </td>
            </tr>

            <!-- Rating -->
            <tr>
              <td>
                <div style="font-weight: 700;">Visitor Ratings</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Weight: 20% • Public review average</div>
              </td>
              <td class="${placeA.rating > placeB.rating ? 'compare-winner-cell' : ''}">
                <strong>⭐ ${placeA.rating} / 5.0</strong>
              </td>
              <td class="${placeB.rating > placeA.rating ? 'compare-winner-cell' : ''}">
                <strong>⭐ ${placeB.rating} / 5.0</strong>
              </td>
            </tr>

            <!-- Cleanliness -->
            <tr>
              <td>
                <div style="font-weight: 700;">Cleanliness & Hygiene</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Weight: 15% • Waste management & sanitation</div>
              </td>
              <td class="${placeA.cleanlinessScore > placeB.cleanlinessScore ? 'compare-winner-cell' : ''}">
                <strong>${placeA.cleanlinessScore} / 10</strong>
              </td>
              <td class="${placeB.cleanlinessScore > placeA.cleanlinessScore ? 'compare-winner-cell' : ''}">
                <strong>${placeB.cleanlinessScore} / 10</strong>
              </td>
            </tr>

            <!-- Accessibility -->
            <tr>
              <td>
                <div style="font-weight: 700;">Accessibility</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Weight: 10% • Ramps, walkways & transit ease</div>
              </td>
              <td class="${placeA.accessibilityScore > placeB.accessibilityScore ? 'compare-winner-cell' : ''}">
                <strong>${placeA.accessibilityScore} / 10</strong>
              </td>
              <td class="${placeB.accessibilityScore > placeA.accessibilityScore ? 'compare-winner-cell' : ''}">
                <strong>${placeB.accessibilityScore} / 10</strong>
              </td>
            </tr>

            <!-- Time & Distance Practicalities -->
            <tr>
              <td>
                <div style="font-weight: 700;">Time Required & Distance</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">Practical itinerary fit</div>
              </td>
              <td>
                ${placeA.timeRequired} hrs • ${placeA.distance} km from center
              </td>
              <td>
                ${placeB.timeRequired} hrs • ${placeB.distance} km from center
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Winner Justification Banner Card -->
        <div class="winner-banner-card">
          <div style="font-size: 2.2rem;">🏆</div>
          <div>
            <div style="font-size: 0.85rem; font-weight: 800; color: #166534; text-transform: uppercase;">
              Best Overall Choice Verdict
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #14532d; margin-top: 2px;">
              Winner: ${result.overallWinner === 'A' ? placeA.name : (result.overallWinner === 'B' ? placeB.name : 'Balanced Tie')}
            </h3>
            <p style="font-size: 0.95rem; color: #15803d; margin-top: 6px; line-height: 1.5;">
              ${result.justification}
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}
