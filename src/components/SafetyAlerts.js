/**
 * CitySmart Explorer - Safety & City Alerts Component
 */

import { PUNE_DATA } from '../data/puneData.js';
import { store } from '../state/store.js';

export function renderSafetyAlerts(state) {
  const { citizenReports } = state;
  const { safetyAlerts, trafficData, weatherData } = PUNE_DATA;

  // Counts for overview
  const safeCount = safetyAlerts.filter(a => a.type === 'safe-zone').length;
  const cautionCount = safetyAlerts.filter(a => a.severity === 'high' || a.severity === 'moderate').length;
  const heavyTrafficCount = trafficData.filter(t => t.level === 'heavy').length;

  return `
    <section class="section-padding">
      <div class="container">
        <!-- Header with mandatory Demo disclaimer -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 32px;">
          <div>
            <span class="badge badge-amber" style="margin-bottom: 6px;">
              ⚠️ Demo / Sample City Data
            </span>
            <h1 class="section-title">Pune Safety & Urban Alerts</h1>
            <p class="section-subtitle">
              Simulated real-time city conditions, community alerts, traffic monitoring, and pedestrian safety corridors.
            </p>
          </div>

          <div style="background: #fffbeb; border: 1.5px solid #fde68a; padding: 10px 16px; border-radius: var(--radius-md); max-width: 420px;">
            <div style="font-size: 0.78rem; font-weight: 700; color: #b45309; text-transform: uppercase;">
              Competition Notice
            </div>
            <div style="font-size: 0.84rem; color: #92400e; margin-top: 2px;">
              All safety reports, weather, and traffic data shown below are simulated sample data for competition judging and demonstration.
            </div>
          </div>
        </div>

        <!-- 1. SAFETY OVERVIEW SUMMARY CARDS -->
        <div class="safety-overview-grid">
          <div class="safety-card-summary">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Verified Safe Zones</span>
              <span style="font-size: 1.4rem;">🛡️</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: #10b981; margin-top: 6px;">
              ${safeCount + 2} Areas
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
              FC Road Corridor, Model Colony & KP North
            </div>
          </div>

          <div class="safety-card-summary">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Active Caution Zones</span>
              <span style="font-size: 1.4rem;">⚠️</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: #f59e0b; margin-top: 6px;">
              ${cautionCount} Zones
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
              Karve Rd diversion & Swargate dense bazaar
            </div>
          </div>

          <div class="safety-card-summary">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Traffic Congestion</span>
              <span style="font-size: 1.4rem;">🚦</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: #ef4444; margin-top: 6px;">
              ${heavyTrafficCount} Hotspot
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
              Swargate / Shivaji Rd (+18m delay)
            </div>
          </div>

          <div class="safety-card-summary">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Weather & Air</span>
              <span style="font-size: 1.4rem;">🌤️</span>
            </div>
            <div style="font-size: 2rem; font-weight: 800; color: #0284c7; margin-top: 6px;">
              ${weatherData.temperature}
            </div>
            <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
              ${weatherData.condition} • AQI ${weatherData.airQualityIndex}
            </div>
          </div>
        </div>

        <!-- 2. MAIN ALERTS & CITIZEN REPORTS SPLIT -->
        <div class="alerts-feed-grid">
          <!-- Left Column: Safety Alerts & Alternative Routes -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
              <h2 style="font-size: 1.4rem; font-weight: 800;">
                Active Urban Advisories (${safetyAlerts.length})
              </h2>
              <span class="badge badge-slate">Updated every 15 mins (Simulated)</span>
            </div>

            ${safetyAlerts.map(alert => `
              <div class="alert-feed-card" style="border-left: 5px solid ${alert.severity === 'high' ? '#ef4444' : (alert.severity === 'moderate' ? '#f59e0b' : '#10b981')};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 1.4rem;">${alert.icon}</span>
                      <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">
                        ${alert.title}
                      </h3>
                    </div>
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-top: 4px;">
                      📍 ${alert.location} • Reported ${alert.reportedTime}
                    </div>
                  </div>

                  <span class="badge ${alert.severity === 'high' ? 'badge-red' : (alert.severity === 'moderate' ? 'badge-amber' : 'badge-green')}">
                    ${alert.status}
                  </span>
                </div>

                <p style="font-size: 0.92rem; color: var(--text-secondary); margin-top: 12px; line-height: 1.5;">
                  ${alert.description}
                </p>

                <div style="background: #f8fafc; border-radius: var(--radius-sm); padding: 10px 14px; margin-top: 12px; border: 1px dashed var(--border-subtle); display: flex; align-items: flex-start; gap: 8px;">
                  <span style="font-size: 1rem;">🧭</span>
                  <div style="font-size: 0.85rem; color: #0369a1;">
                    <strong>Safer Alternative Route:</strong> ${alert.saferAlternative}
                  </div>
                </div>
              </div>
            `).join('')}

            <!-- Live Traffic Snapshot -->
            <div class="card" style="margin-top: 28px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="font-size: 1.2rem; font-weight: 800;">
                  🚦 Pune Arterial Traffic Corridors
                </h3>
                <span class="badge badge-blue">Transit Live Speed</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${trafficData.map(item => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: #f8fafc; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                    <div>
                      <div style="font-weight: 700; font-size: 0.92rem;">${item.road}</div>
                      <div style="font-size: 0.78rem; color: var(--text-muted);">Avg transit speed: ${item.speed}</div>
                    </div>
                    <div style="text-align: right;">
                      <span class="badge" style="background: ${item.color}20; color: ${item.color}; border: 1px solid ${item.color}40;">
                        ${item.status}
                      </span>
                      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.delay}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Right Column: Weather Card + Community Citizen Reports -->
          <div>
            <!-- Weather Card -->
            <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-color: #bae6fd;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span class="badge badge-blue">Pune Meteorology</span>
                  <div style="font-size: 2.2rem; font-weight: 800; color: #0369a1; margin-top: 6px;">
                    ${weatherData.temperature}
                  </div>
                  <div style="font-weight: 700; color: #0284c7;">${weatherData.condition}</div>
                </div>
                <div style="font-size: 3.5rem;">${weatherData.icon}</div>
              </div>

              <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid #bae6fd; font-size: 0.88rem; color: #0369a1;">
                ℹ️ <strong>Travel Advisory:</strong> ${weatherData.advisory}
              </div>

              <!-- Hourly forecast pills -->
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 14px; text-align: center;">
                ${weatherData.forecast.map(f => `
                  <div style="background: #ffffff; padding: 8px 4px; border-radius: var(--radius-sm); box-shadow: var(--shadow-sm);">
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${f.time}</div>
                    <div style="font-size: 1.1rem; margin: 2px 0;">${f.icon}</div>
                    <div style="font-size: 0.85rem; font-weight: 700;">${f.temp}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Citizen Reports Section with Live Submission Form -->
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="font-size: 1.15rem; font-weight: 800;">
                  📢 Citizen Safety Reports (${citizenReports.length})
                </h3>
                <span class="badge badge-green">Crowdsourced</span>
              </div>

              <p style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 16px;">
                Real observations reported by local Pune citizens & verified by peer runners and travelers.
              </p>

              <div style="display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; padding-right: 4px;">
                ${citizenReports.map(cr => `
                  <div class="citizen-report-item">
                    <div style="display: flex; justify-content: space-between; font-size: 0.78rem;">
                      <strong style="color: var(--brand-primary);">${cr.location}</strong>
                      <span style="color: var(--text-muted);">${cr.timestamp}</span>
                    </div>
                    <div style="font-size: 0.88rem; color: var(--text-primary); margin: 4px 0;">
                      "${cr.comment}"
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
                      <span>By ${cr.author}</span>
                      <span class="badge badge-slate" style="font-size: 0.7rem;">${cr.status}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Interactive Add Report Box -->
              <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border-light);">
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">
                  Post a Demo Citizen Report:
                </div>
                <form onsubmit="window.handleCitizenReportSubmit(event)">
                  <input 
                    type="text" 
                    id="new-report-location" 
                    placeholder="Location (e.g. FC Road, Camp, Kothrud)" 
                    required 
                    style="width: 100%; padding: 8px 12px; margin-bottom: 8px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.85rem;"
                  />
                  <input 
                    type="text" 
                    id="new-report-comment" 
                    placeholder="Observation (e.g. Well-lit street, peaceful walk)" 
                    required 
                    style="width: 100%; padding: 8px 12px; margin-bottom: 8px; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); font-size: 0.85rem;"
                  />
                  <button type="submit" class="btn btn-primary btn-sm" style="width: 100%;">
                    Submit Report (Demo)
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
