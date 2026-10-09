/**
 * CitySmart Explorer - Footer Component
 */

export function renderFooter() {
  return `
    <footer style="background: #0f172a; color: #94a3b8; border-top: 1px solid #1e293b; padding: 48px 0 32px; margin-top: auto;">
      <div class="container">
        <div style="display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 36px; margin-bottom: 36px;">
          <!-- Brand Column -->
          <div>
            <div style="display: flex; align-items: center; gap: 10px; color: #ffffff; font-size: 1.25rem; font-weight: 800; margin-bottom: 12px;">
              <span style="width: 34px; height: 34px; background: #0284c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🏙️</span>
              <span>CitySmart Explorer</span>
            </div>
            <p style="font-size: 0.9rem; line-height: 1.6; max-width: 360px; color: #cbd5e1;">
              “Explore Smarter. Travel Safer.” An intelligent urban exploration engine combining budget, time, multi-factor safety scores, and explainable recommendations.
            </p>
            <div style="margin-top: 14px;">
              <span class="badge badge-blue" style="font-size: 0.78rem;">
                College Competition MVP Edition
              </span>
            </div>
          </div>

          <!-- Navigation Links -->
          <div>
            <h4 style="color: #ffffff; font-size: 0.95rem; font-weight: 700; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
              Quick Exploration
            </h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 0.88rem;">
              <li><a href="#home" onclick="event.preventDefault(); window.appStore.setActiveTab('home');" style="hover: color #fff;">Home Overview</a></li>
              <li><a href="#explore" onclick="event.preventDefault(); window.appStore.setActiveTab('explore');">Smart Explore Planner</a></li>
              <li><a href="#recommendations" onclick="event.preventDefault(); window.appStore.setActiveTab('recommendations');">Personalized Itineraries</a></li>
              <li><a href="#compare" onclick="event.preventDefault(); window.appStore.setActiveTab('compare');">Side-by-Side Compare</a></li>
              <li><a href="#safety" onclick="event.preventDefault(); window.appStore.setActiveTab('safety');">Safety & City Alerts</a></li>
              <li><a href="#map" onclick="event.preventDefault(); window.appStore.setActiveTab('map');">Interactive Vector Map</a></li>
              <li><a href="#assistant" onclick="event.preventDefault(); window.appStore.setActiveTab('assistant');">Ask CitySmart AI</a></li>
            </ul>
          </div>

          <!-- Demo Disclaimer & Tech Pitch -->
          <div>
            <h4 style="color: #ffffff; font-size: 0.95rem; font-weight: 700; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
              Transparency & Notice
            </h4>
            <div style="font-size: 0.84rem; line-height: 1.55; color: #cbd5e1; background: rgba(255, 255, 255, 0.04); padding: 14px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.08);">
              <strong>Notice:</strong> This web application uses curated sample data for Pune, Maharashtra. Geolocation coordinates, weather reports, and safety alerts are simulated for competition judging and demonstration.
            </div>
            <div style="font-size: 0.8rem; margin-top: 12px; color: #94a3b8;">
              Designed with 0 external API dependencies for 100% offline reliability.
            </div>
          </div>
        </div>

        <div style="border-top: 1px solid #1e293b; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; font-size: 0.82rem;">
          <div>
            © 2026 CitySmart Explorer • College Website Competition
          </div>
          <div style="color: #cbd5e1;">
            Built by Parineeta Meshram
          </div>
          <div>
            Built with modular ES6+ • Zero-dependency Local Engine • High Performance
          </div>
        </div>
      </div>
    </footer>
  `;
}
