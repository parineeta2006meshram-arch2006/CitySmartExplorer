/**
 * CitySmart Explorer - Interactive Simulated City Map Component
 */

import { PUNE_DATA } from '../data/puneData.js';
import { calculateSmartScore } from '../utils/smartScore.js';

export function renderInteractiveMap(state) {
  const { selectedMapPlaceId, activeMapCategory, recommendations } = state;
  const places = PUNE_DATA.places;
  const alerts = PUNE_DATA.safetyAlerts;

  const activePlace = places.find(p => p.id === selectedMapPlaceId) || places[0];
  const activePlaceScore = calculateSmartScore(activePlace);

  // Filter places by selected category
  const filteredPlaces = activeMapCategory === 'all' 
    ? places 
    : (activeMapCategory === 'alerts' ? [] : places.filter(p => p.category.toLowerCase() === activeMapCategory.toLowerCase()));

  // Active itinerary route stops (if generated, or default 3 top spots)
  const routeStops = recommendations?.itinerary?.stops?.map(s => s.place) || [
    places.find(p => p.id === 'shaniwar-wada'),
    places.find(p => p.id === 'fc-road-food'),
    places.find(p => p.id === 'fc-road-market')
  ].filter(Boolean);

  // Generate SVG path for route line connecting stops
  const routePoints = routeStops.map(p => `${p.mapX * 8},${p.mapY * 5.5}`).join(' ');

  const categories = [
    { id: 'all', label: 'All Places', icon: '📍' },
    { id: 'history', label: 'Historical', icon: '🏰' },
    { id: 'food', label: 'Food & Cafes', icon: '☕' },
    { id: 'nature', label: 'Nature & Parks', icon: '🌲' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'hotels', label: 'Hotels & Stays', icon: '🏨' },
    { id: 'alerts', label: 'Safety Advisories', icon: '⚠️' }
  ];

  return `
    <section class="section-padding">
      <div class="container">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
          <div>
            <span class="badge badge-blue">Simulated GIS Vector Engine</span>
            <h1 class="section-title" style="margin-top: 6px;">Pune Interactive City Map</h1>
            <p class="section-subtitle">
              Explore spatial clusters, examine safety overlays, click markers for live Smart Scores, and follow the curated recommended route.
            </p>
          </div>

          <span class="badge badge-amber">
            ⚠️ Demo Map Simulation • Coordinates Calibrated to Pune
          </span>
        </div>

        <!-- Filter Categories Bar -->
        <div class="chips-container" style="margin-bottom: 20px;">
          ${categories.map(cat => `
            <button 
              class="chip-btn ${activeMapCategory === cat.id ? 'active' : ''}" 
              onclick="window.setMapFilterCategory('${cat.id}')"
            >
              <span>${cat.icon}</span>
              <span>${cat.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- Map & Sidebar Split Layout -->
        <div class="map-layout-grid">
          <!-- Main Map Viewport (SVG Visualizer) -->
          <div class="map-viewport">
            <svg 
              class="map-svg-container" 
              viewBox="0 0 800 550" 
              preserveAspectRatio="xMidYMid meet"
              style="width: 100%; height: 100%; background: #e2e8f0;"
            >
              <defs>
                <!-- River gradient -->
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.75" />
                  <stop offset="100%" stop-color="#0284c7" stop-opacity="0.85" />
                </linearGradient>

                <!-- Pulse animation filter -->
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <!-- Grid background lines -->
              <g stroke="#cbd5e1" stroke-width="0.8" opacity="0.4">
                <line x1="100" y1="0" x2="100" y2="550" />
                <line x1="200" y1="0" x2="200" y2="550" />
                <line x1="300" y1="0" x2="300" y2="550" />
                <line x1="400" y1="0" x2="400" y2="550" />
                <line x1="500" y1="0" x2="500" y2="550" />
                <line x1="600" y1="0" x2="600" y2="550" />
                <line x1="700" y1="0" x2="700" y2="550" />
                <line x1="0" y1="100" x2="800" y2="100" />
                <line x1="0" y1="200" x2="800" y2="200" />
                <line x1="0" y1="300" x2="800" y2="300" />
                <line x1="0" y1="400" x2="800" y2="400" />
                <line x1="0" y1="500" x2="800" y2="500" />
              </g>

              <!-- Green Hill & Forest Terrain Polygons -->
              <g opacity="0.65">
                <!-- Vetal Hill ridge -->
                <path d="M 120 180 Q 200 160 260 240 Q 180 290 120 180 Z" fill="#bbf7d0" stroke="#86efac" stroke-width="1.5" />
                <text x="160" y="210" font-size="11" font-weight="700" fill="#166534">Vetal Hill Ridge</text>

                <!-- Katraj / Sinhagad Ghat range -->
                <path d="M 80 430 Q 190 410 240 520 Q 90 530 80 430 Z" fill="#bbf7d0" stroke="#86efac" stroke-width="1.5" />
                <text x="110" y="480" font-size="11" font-weight="700" fill="#166534">Sinhagad Range</text>

                <!-- Kalyani Nagar green belt -->
                <path d="M 520 160 Q 640 140 680 220 Q 560 240 520 160 Z" fill="#bbf7d0" opacity="0.5" />
              </g>

              <!-- Mula-Mutha River winding through Pune -->
              <path 
                d="M 50 140 Q 220 220 360 250 T 560 220 T 780 270" 
                fill="none" 
                stroke="url(#riverGrad)" 
                stroke-width="16" 
                stroke-linecap="round"
              />
              <text x="460" y="240" font-size="12" font-weight="700" fill="#0369a1" letter-spacing="1">
                ~ MULA-MUTHA RIVER ~
              </text>

              <!-- Arterial Highway & Main Roads -->
              <g stroke="#94a3b8" stroke-width="3" stroke-linecap="round" opacity="0.7">
                <!-- JM Road & FC Road North-South Axis -->
                <line x1="280" y1="120" x2="310" y2="350" />
                <!-- Karve Road westward -->
                <line x1="290" y1="280" x2="160" y2="380" />
                <!-- Shivaji Road to Swargate -->
                <line x1="330" y1="220" x2="360" y2="420" />
                <!-- Ahmednagar Highway to Viman Nagar / Airport -->
                <line x1="440" y1="220" x2="680" y2="130" stroke="#64748b" stroke-width="4" />
                <!-- Solapur Road South-East -->
                <line x1="360" y1="420" x2="620" y2="480" />
              </g>

              <!-- City Sector Labels -->
              <g font-size="11" font-weight="800" fill="#475569" opacity="0.8">
                <text x="240" y="160">SHIVAJINAGAR</text>
                <text x="315" y="270">OLD CITY (PETH)</text>
                <text x="450" y="300">PUNE CAMP</text>
                <text x="510" y="200">KOREGAON PARK</text>
                <text x="610" y="140">VIMAN NAGAR</text>
                <text x="140" y="340">KOTHRUD</text>
                <text x="320" y="415">SWARGATE</text>
              </g>

              <!-- RECOMMENDED ITINERARY ROUTE PATH (Polyline) -->
              ${routePoints ? `
                <polyline 
                  points="${routePoints}" 
                  fill="none" 
                  stroke="#10b981" 
                  stroke-width="4" 
                  stroke-dasharray="6,6"
                  stroke-linecap="round"
                  opacity="0.9"
                />
              ` : ''}

              <!-- SAFETY ALERT HAZARD ICONS (if all or alerts active) -->
              ${(activeMapCategory === 'all' || activeMapCategory === 'alerts') ? alerts.map(alert => `
                <g 
                  transform="translate(${alert.coords.x * 8}, ${alert.coords.y * 5.5})" 
                  style="cursor: pointer;"
                  onclick="alert('Safety Alert: ${alert.title}\\nAlternative: ${alert.saferAlternative}')"
                >
                  <circle r="14" fill="${alert.severity === 'high' ? '#ef4444' : '#f59e0b'}" opacity="0.25">
                    <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="10" fill="${alert.severity === 'high' ? '#ef4444' : '#f59e0b'}" stroke="#ffffff" stroke-width="2" />
                  <text x="-4" y="4" font-size="10" font-weight="bold" fill="#ffffff">!</text>
                </g>
              `).join('') : ''}

              <!-- PLACE MARKERS -->
              ${filteredPlaces.map(place => {
                const isSelected = place.id === activePlace.id;
                const isRouteStop = routeStops.some(s => s.id === place.id);
                const x = place.mapX * 8;
                const y = place.mapY * 5.5;

                // Color by category
                let pinColor = "#0284c7"; // default blue
                if (place.category === "History") pinColor = "#8b5cf6"; // purple
                if (place.category === "Food") pinColor = "#ea580c"; // orange
                if (place.category === "Nature") pinColor = "#16a34a"; // green
                if (place.category === "Shopping") pinColor = "#2563eb"; // deep blue
                if (place.category === "Hotels") pinColor = "#0891b2"; // cyan

                return `
                  <g 
                    class="map-marker-pin ${isSelected ? 'selected' : ''}" 
                    transform="translate(${x}, ${y})"
                    onclick="window.selectMapLocation('${place.id}')"
                  >
                    ${isSelected ? `
                      <circle r="22" fill="${pinColor}" opacity="0.25">
                        <animate attributeName="r" values="16;24;16" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    ` : ''}

                    ${isRouteStop ? `
                      <circle r="18" fill="#10b981" opacity="0.35" />
                    ` : ''}

                    <!-- Pin Base -->
                    <circle r="12" fill="${pinColor}" stroke="#ffffff" stroke-width="2.5" />
                    <text x="0" y="4" text-anchor="middle" font-size="11" fill="#ffffff">${place.imageEmoji}</text>

                    <!-- Text label -->
                    <text 
                      x="0" 
                      y="-16" 
                      text-anchor="middle" 
                      font-size="10" 
                      font-weight="800" 
                      fill="#0f172a"
                      stroke="#ffffff"
                      stroke-width="3"
                      paint-order="stroke"
                    >
                      ${place.name}
                    </text>
                  </g>
                `;
              }).join('')}
            </svg>

            <!-- Map Legend in Bottom Corner -->
            <div style="position: absolute; bottom: 16px; left: 16px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(6px); padding: 10px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-light); font-size: 0.78rem; display: flex; gap: 12px; flex-wrap: wrap; box-shadow: var(--shadow-sm);">
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #8b5cf6;"></span> History
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ea580c;"></span> Food
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #16a34a;"></span> Nature
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #2563eb;"></span> Shopping
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444;"></span> Caution Zone
              </span>
              <span style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 14px; height: 3px; background: #10b981;"></span> Recommended Route
              </span>
            </div>
          </div>

          <!-- Sidebar: Selected Place Inspector & Route Card -->
          <div class="map-sidebar">
            <!-- Selected Landmark Details -->
            <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 16px; margin-bottom: 16px;">
              <span class="badge badge-slate" style="margin-bottom: 6px;">
                ${activePlace.categoryName}
              </span>
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary);">
                  ${activePlace.imageEmoji} ${activePlace.name}
                </h3>
                <span class="score-pill smart">
                  ⭐ ${activePlaceScore.overall}/10
                </span>
              </div>

              <div style="font-size: 0.84rem; color: var(--text-muted); margin-top: 4px;">
                📍 ${activePlace.address}
              </div>

              <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 10px; line-height: 1.45;">
                ${activePlace.shortDescription}
              </p>

              <!-- Metric Pills -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px;">
                <div style="background: #f8fafc; padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">Est. Cost:</div>
                  <strong style="color: #0284c7; font-size: 0.95rem;">₹${activePlace.estimatedCost}</strong>
                </div>

                <div style="background: #f8fafc; padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">Safety Score:</div>
                  <strong style="color: #059669; font-size: 0.95rem;">${activePlace.safetyScore}/10</strong>
                </div>

                <div style="background: #f8fafc; padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">Duration:</div>
                  <strong style="font-size: 0.95rem;">${activePlace.timeRequired} hrs</strong>
                </div>

                <div style="background: #f8fafc; padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-light);">
                  <div style="font-size: 0.72rem; color: var(--text-muted);">Crowd Level:</div>
                  <strong style="font-size: 0.95rem;">${activePlace.crowdLevel}</strong>
                </div>
              </div>

              <div style="margin-top: 10px; font-size: 0.8rem; color: #166534; background: #ecfdf5; padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid #a7f3d0;">
                🛡️ <strong>Safety Note:</strong> ${activePlace.safetyNotes}
              </div>

              <div style="display: flex; gap: 8px; margin-top: 14px;">
                <button 
                  class="btn btn-outline btn-sm" 
                  style="flex: 1;"
                  onclick="window.quickCompare('${activePlace.id}')"
                >
                  ⚖️ Compare
                </button>
                <button 
                  class="btn btn-primary btn-sm" 
                  style="flex: 1;"
                  onclick="window.appStore.setActiveTab('assistant')"
                >
                  🤖 Ask AI
                </button>
              </div>
            </div>

            <!-- Route Panel (Recommended Route) -->
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h4 style="font-size: 1rem; font-weight: 800;">
                  🧭 Recommended City Route
                </h4>
                <span class="badge badge-green">Recommended</span>
              </div>

              <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 12px; margin-bottom: 12px;">
                <div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span>Route Distance: <strong>8.4 km</strong></span>
                  <span>Travel Time: <strong>~35 mins</strong></span>
                </div>
                <div style="font-size: 0.78rem; color: #15803d; font-weight: 600;">
                  ✓ Optimized to avoid Swargate construction bottleneck
                </div>
              </div>

              <!-- Waypoints list -->
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${routeStops.map((stop, idx) => `
                  <div style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; padding: 6px 8px; border-radius: var(--radius-sm); background: #ffffff; border: 1px solid var(--border-light);">
                    <span style="width: 22px; height: 22px; border-radius: 50%; background: #0284c7; color: #fff; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; font-weight: 800;">
                      ${idx + 1}
                    </span>
                    <span style="font-weight: 700; flex: 1;">${stop.name}</span>
                    <span class="badge badge-slate" style="font-size: 0.7rem;">${stop.category}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
