/**
 * CitySmart Explorer - Home Landing Page Component
 */

import { PUNE_DATA } from '../data/puneData.js';
import { calculateSmartScore } from '../utils/smartScore.js';

export function renderHome(state) {
  const places = PUNE_DATA.places;
  
  // Calculate dynamic dashboard stats from dataset
  const totalPlaces = places.length;
  const saferOptions = places.filter(p => p.safetyScore >= 8.5).length;
  const budgetFriendly = places.filter(p => p.estimatedCost <= 150).length;
  const topRated = places.filter(p => p.rating >= 4.5).length;

  return `
    <main>
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div>
            <div class="hero-badge-tag">
              <span>🚀</span>
              <span>Intelligent Urban Decision Engine • Pune Edition</span>
            </div>

            <h1 class="hero-title">
              Explore Smarter.<br>
              <span style="background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Travel Safer.</span>
            </h1>

            <p class="hero-subtitle" style="margin-top: 18px;">
              Turn scattered city information into personalized places, safer routes, and smarter travel decisions tailored to your exact budget, available time, and safety preferences.
            </p>

            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" onclick="window.appStore.setActiveTab('explore')">
                <span>⚡</span>
                <span>Start Exploring</span>
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.appStore.setActiveTab('assistant')">
                <span>🤖</span>
                <span>Ask AI Assistant</span>
              </button>
              <button class="btn btn-outline btn-lg" onclick="window.appStore.setActiveTab('map')">
                <span>🗺️</span>
                <span>Interactive Map</span>
              </button>
            </div>
          </div>

          <!-- Interactive Innovation Showcase Card -->
          <div class="hero-preview-card">
            <div class="hero-preview-header">
              <div>
                <span class="badge badge-blue">Main Innovation</span>
                <h3 style="font-size: 1.15rem; font-weight: 800; margin-top: 6px;">Situation-Based Travel</h3>
              </div>
              <span class="badge badge-green">✓ Active Demo</span>
            </div>

            <div class="hero-scenario-box">
              <div class="hero-scenario-title">Example Situation</div>
              <div class="hero-scenario-text">
                "I have ₹1,500, 5 hours, and I want food + historical places with safer options."
              </div>
            </div>

            <div style="background: #f1f5f9; border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Generated Pune Itinerary</div>
              <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; margin-top: 6px; font-size: 0.95rem; color: #0284c7;">
                <span>🏰 Shaniwar Wada</span>
                <span>→</span>
                <span>☕ FC Road Food Zone</span>
                <span>→</span>
                <span>🛍️ FC Market</span>
              </div>
              <div style="display: flex; gap: 16px; margin-top: 8px; font-size: 0.82rem; color: var(--text-secondary);">
                <span>Est. Cost: <strong>₹600</strong></span>
                <span>•</span>
                <span>Est. Time: <strong>4.5h</strong></span>
                <span>•</span>
                <span>Safety: <strong style="color: #059669;">8.9/10</strong></span>
              </div>
            </div>

            <button 
              class="btn btn-primary" 
              style="width: 100%; justify-content: center;"
              onclick="window.appStore.applyPlan({ budget: 1500, availableTime: 5, interests: ['Food', 'History'], safetyPreference: 'safer' })"
            >
              <span>Try This Exact Recommendation</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Quick Insights Dashboard Counters -->
        <div class="container">
          <div class="stats-strip">
            <div class="stat-card">
              <div class="stat-icon" style="background: #e0f2fe; color: #0284c7;">📍</div>
              <div>
                <div class="stat-val">${totalPlaces}+</div>
                <div class="stat-label">Curated Pune Places</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon" style="background: #ecfdf5; color: #10b981;">🛡️</div>
              <div>
                <div class="stat-val">${saferOptions}</div>
                <div class="stat-label">High Safety Options (≥8.5)</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon" style="background: #fef3c7; color: #f59e0b;">💰</div>
              <div>
                <div class="stat-val">${budgetFriendly}</div>
                <div class="stat-label">Ultra Budget Friendly (≤₹150)</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon" style="background: #ede9fe; color: #8b5cf6;">⭐</div>
              <div>
                <div class="stat-val">${topRated}</div>
                <div class="stat-label">Top Rated Spots (≥4.5★)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 Core Pillars Grid -->
      <section class="section-padding">
        <div class="container">
          <div style="text-align: center; max-width: 680px; margin: 0 auto 36px;">
            <span class="badge badge-blue">Unified City Intelligence</span>
            <h2 class="section-title" style="margin-top: 8px;">Everything You Need In One Cohesive Platform</h2>
            <p class="section-subtitle" style="margin: 0 auto;">No more juggling 6 different apps for maps, food reviews, safety advisories, and weather reports.</p>
          </div>

          <div class="features-grid">
            <div class="feature-box">
              <div>
                <div class="feature-box-icon">⚡</div>
                <h3 class="feature-box-title">Smart Explore</h3>
                <p class="feature-box-desc">
                  Input your personal constraints: budget, free hours, interests, and safety comfort to generate tailored plans instantly.
                </p>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.appStore.setActiveTab('explore')">Open Form →</button>
            </div>

            <div class="feature-box">
              <div>
                <div class="feature-box-icon">🛡️</div>
                <h3 class="feature-box-title">Safety & City Alerts</h3>
                <p class="feature-box-desc">
                  Community-verified crowd reports, road resurfacing hazard warnings, live weather alerts, and pedestrian safe corridors.
                </p>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.appStore.setActiveTab('safety')">View Alerts →</button>
            </div>

            <div class="feature-box">
              <div>
                <div class="feature-box-icon">⚖️</div>
                <h3 class="feature-box-title">Compare Places</h3>
                <p class="feature-box-desc">
                  Pit two destinations head-to-head across Safety, Affordability, Cleanliness, Rating, and Accessibility with explainable verdicts.
                </p>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.appStore.setActiveTab('compare')">Compare Now →</button>
            </div>

            <div class="feature-box">
              <div>
                <div class="feature-box-icon">✨</div>
                <h3 class="feature-box-title">City Smart Score</h3>
                <p class="feature-box-desc">
                  Our proprietary 5-factor index that balances safety, affordability, hygiene, ratings, and accessibility instead of raw popularity.
                </p>
              </div>
              <button class="btn btn-outline btn-sm" onclick="window.appStore.setActiveTab('recommendations')">See Scores →</button>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works 4-Step Section -->
      <section class="section-padding" style="background: #f1f5f9;">
        <div class="container">
          <div style="text-align: center; max-width: 600px; margin: 0 auto 12px;">
            <span class="badge badge-green">Simple 4-Step Flow</span>
            <h2 class="section-title" style="margin-top: 8px;">How CitySmart Explorer Works</h2>
            <p class="section-subtitle" style="margin: 0 auto;">From personal constraints to confident, safe travel decisions in seconds.</p>
          </div>

          <div class="steps-grid">
            <div class="step-card">
              <div class="step-num">1</div>
              <h3 class="step-title">Tell Us What You Need</h3>
              <p class="step-desc">Enter your budget (e.g. ₹1500), available hours (5 hrs), preferences (Food, History), and safety priority.</p>
            </div>

            <div class="step-card">
              <div class="step-num">2</div>
              <h3 class="step-title">Get AI Recommendations</h3>
              <p class="step-desc">Our multi-factor constraint engine computes personalized stops with explainable "Why Recommended" justifications.</p>
            </div>

            <div class="step-card">
              <div class="step-num">3</div>
              <h3 class="step-title">Compare Your Options</h3>
              <p class="step-desc">Contrast alternate destinations side-by-side using the City Smart Score to resolve trade-offs quickly.</p>
            </div>

            <div class="step-card">
              <div class="step-num">4</div>
              <h3 class="step-title">Explore Safely</h3>
              <p class="step-desc">Check active pedestrian alerts, caution zones, traffic hotspots, and follow verified safe corridors.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Competition Presentation Section -->
      <section class="section-padding">
        <div class="container">
          <div class="pitch-card">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <span class="badge badge-purple" style="background: rgba(139, 92, 246, 0.25); color: #c4b5fd;">Judge Briefing & Pitch</span>
                <h2 style="font-size: 2rem; font-weight: 800; margin-top: 6px;">How CitySmart Explorer Works (Architecture)</h2>
              </div>
              <span class="badge badge-slate" style="background: rgba(255, 255, 255, 0.1); color: #94a3b8;">College MVP Project</span>
            </div>

            <div class="pitch-grid">
              <div class="pitch-item">
                <div class="pitch-item-title">🚩 The Problem</div>
                <div class="pitch-item-text">
                  Urban travel information is fragmented across Google Maps, Zomato, TripAdvisor, weather apps, traffic monitors, and news feeds. Users waste hours trying to assemble an itinerary that matches their specific budget, time window, and safety comfort level.
                </div>
              </div>

              <div class="pitch-item">
                <div class="pitch-item-title">💡 The Solution</div>
                <div class="pitch-item-text">
                  CitySmart Explorer consolidates all critical urban signals into a unified decision dashboard. It replaces scattered research with personalized multi-factor planning and full explainability for each recommendation.
                </div>
              </div>

              <div class="pitch-item">
                <div class="pitch-item-title">🚀 Core Innovation</div>
                <div class="pitch-item-text">
                  <strong>"Explore by YOUR situation, not popularity."</strong> Popularity feeds herd mentality into congested spots. CitySmart prioritizes safety thresholds, budget boundaries, and accessibility parameters to find the ideal match for your exact moment.
                </div>
              </div>
            </div>

            <div style="margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between;">
              <div style="font-size: 0.88rem; color: #94a3b8;">
                <strong>Technology Stack Concept:</strong> Modular ES6+ Components • Reactive State Store • Multi-Factor Decision Modeling • Local Heuristic NLP • Simulated GIS Vector Map
              </div>
              <button class="btn btn-primary" onclick="window.appStore.setActiveTab('explore')">
                Launch Smart Explore Now →
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}
