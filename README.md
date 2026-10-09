# 🏙️ CITYSMART EXPLORER
> **Tagline:** *“Explore Smarter. Travel Safer.”*

[![Status](https://img.shields.io/badge/Status-Complete%20MVP-success)](#)
[![Demo City](https://img.shields.io/badge/Demo%20City-Pune%2C%20India-blue)](#)
[![Dependencies](https://img.shields.io/badge/External%20APIs-Zero%20(100%25%20Offline)-brightgreen)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20ES6%2B%20SPA-orange)](#)

---

## 📌 1. Project Overview & Problem Statement

### The Problem
Urban travel information is fragmented across disconnected silos:
- Tourism sites promote crowded landmarks without pricing context.
- Food review apps focus on cuisine without travel safety context.
- Navigation tools lack real-time pedestrian safety ratings and crime/crowd advisories.
- Weather and municipal alerts exist on separate civic portals.

Travelers and students struggle to answer simple questions like:
> *"I have ₹1,500, 5 hours, and want food + history with safer options."*

### The Solution
**CitySmart Explorer** consolidates these critical urban signals into a unified, intelligent decision platform. It factors in:
1. **User Budget (₹ INR)**
2. **Available Time (Hours)**
3. **Multi-Category Interests** (History, Food, Nature, Shopping, Culture)
4. **Safety Comfort Level** (Standard, Prefer Safer, Highest Safety)
5. **Accessibility Needs** (Easy Wheelchair/Paved Access)

### Core Innovation
> **“Explore the city based on YOUR situation, not just based on popular places.”**
Unlike traditional travel portals that create tourism bottlenecks by ranking solely by popularity, CitySmart Explorer evaluates candidate destinations through a proprietary **City Smart Score** tailored to the traveler's immediate constraints.

---

## 🌟 2. Core Website Flow & Key Features

```
       [ HOME ]
          ↓
   [ SMART EXPLORE ]  ── (User enters Budget, Time, Interests, Safety)
          ↓
[ AI RECOMMENDATIONS ] ── (Tailored Itinerary + Explainable Checkmarks)
          ↓
   [ COMPARE PLACES ] ── (Head-to-head factor breakdown & winner)
          ↓
  [ SAFETY & ALERTS ] ── (Crowd zones, traffic delays, citizen reports)
          ↓
  [ INTERACTIVE MAP ] ── (Simulated GIS vector map & waypoint route)
          ↓
 [ AI CITY ASSISTANT ] ── (Local NLP query parser & conversational help)
```

### 1. Home Dashboard
- Hero banner with quick situation preset preview.
- Dynamic city insights calculated directly from dataset:
  - **15+** Curated Places
  - **10** High Safety Options ($\ge 8.5/10$)
  - **8** Budget-Friendly Spots ($\le ₹150$)
  - **6** Top-Rated Experiences ($\ge 4.5/5★$)
- "How It Works" 4-step user guide.
- Competition Judge Briefing card explaining Problem, Solution, and Architecture.

### 2. Smart Explore Engine
- Interactive controls for:
  - **Budget:** ₹0 to ₹4,000+ slider.
  - **Time:** 1 to 10 hours slider.
  - **Interests:** Multi-select chips (*Food*, *History*, *Nature*, *Shopping*, *Culture*).
  - **Safety Preference:** *Standard*, *Prefer Safer Places* ($\ge 8.5$), *Highest Safety* ($\ge 9.0$).
  - **Accessibility:** *Any* or *Easy Access* ($\ge 8.0$).
- 1-Click quick presets:
  - *Student Budget* (₹500, 3h)
  - *Family Explorer* (₹2000, 6h, Easy Access)
  - *Safe Solo* (₹1000, 4h, Highest Safety)

### 3. Personalized AI Recommendations & Itinerary
- **Multi-Stop Itinerary Timeline:**
  - Auto-balances travel role (Primary landmark $\rightarrow$ Culinary hub $\rightarrow$ Secondary leisure/shopping).
  - Calculates Total Estimated Cost, Time required, Average Itinerary Safety, and Smart Score.
- **Explainability Justifications ("Why It Was Recommended"):**
  - $\checkmark$ *Matches your interest in History*
  - $\checkmark$ *Fits within your ₹1,500 budget (only ₹100)*
  - $\checkmark$ *Meets High Safety criteria (rated 8.8/10)*
  - $\checkmark$ *Takes 1.5 hrs (well within your 5 hrs window)*
- **5-Factor Score Meters** for every card.

### 4. City Smart Score Formulation
The Smart Score evaluates every location on an objective $0 - 10$ scale:
$$\text{Smart Score} = 0.30 \cdot S + 0.25 \cdot A + 0.20 \cdot R + 0.15 \cdot C + 0.10 \cdot Ac$$
Where:
- $S$ = Safety & Security (Lighting, patrolling, crowd control)
- $A$ = Affordability Index (Normalized curve from estimated cost)
- $R$ = Normalized Visitor Rating (0 - 10 scale from 5-star reviews)
- $C$ = Cleanliness & Upkeep
- $Ac$ = Accessibility (Ramps, walkways, transit proximity)

### 5. Side-by-Side Place Comparison
- Interactive dropdowns to pit any two locations against each other.
- Factor-by-factor matrix highlighting the winner for each metric.
- **"Best Overall Choice" Verdict:** Generates human-readable reasoning explaining why one option won based on score balances.

### 6. Safety & City Alerts
- Prominently labeled **"Demo / Sample City Data"** for transparency.
- Active advisories:
  - Pedestrian density alerts (Swargate Junction)
  - Road resurfacing & metro work diversions (Karve Road)
  - Safe pedestrian corridors (FC Road)
  - Monsoon ghat hazard advisories (Sinhagad)
  - Safer alternative route suggestions.
- Real-time traffic delay monitoring across 5 key arterial roads.
- Weather forecast and air quality index (AQI).
- Crowdsourced Citizen Reports feed with active report submission form.

### 7. Interactive Vector GIS Map
- High-fidelity simulated SVG vector map calibrated to Pune's geography:
  - Curved Mula-Mutha river.
  - Green forest contours for Vetal Hill and Sinhagad.
  - Arterial highway corridors.
  - Distinct colored pins for History, Food, Nature, Shopping, Hotels, and Safety Alerts.
- Interactive click-to-inspect sidebar with detailed metrics.
- Recommended multi-stop route overlay (dotted transit polyline) avoiding hazardous zones.

### 8. AI City Assistant (Local NLP Engine)
- Conversational chat assistant answering natural language questions:
  - *"I have ₹1000 and 4 hours. What can I do?"*
  - *"Suggest a safe historical place with cheap food nearby."*
  - *"Which place is better for a family?"*
  - *"Is Vetal Hill safe for morning hikes?"*
- Recognizes budgets (₹), time limits, keywords, and safety constraints.
- Emits action triggers (e.g. "Load this plan in Smart Explore", "Compare Places").

---

## 🚀 3. How to Run the Website

### Option A: 1-Click Windows Launcher (Fastest)
Double-click `start.bat` in the project root:
```cmd
start.bat
```
This automatically launches the local server and opens `http://localhost:3000` in your default browser.

### Option B: Using Node.js Command Line
Run the included zero-dependency server:
```powershell
node server.js
```
*Or using the local Antigravity runtime:*
```powershell
& "$env:APPDATA\Antigravity\bin\agy-node.cmd" server.js
```
Then visit: **`http://localhost:3000`**

### Option C: VS Code Live Server
Right-click `index.html` $\rightarrow$ **Open with Live Server**.

### Option D: Run Automated Test Suite
To verify all algorithms, scoring, recommendations, and datasets:
```powershell
node test.js
```

---

## 📁 4. Project File Structure

```
CitySmartExplorer/
├── index.html                   # Clean, responsive single-page entrypoint
├── server.js                    # Zero-dependency Node.js HTTP server (ESM)
├── start.bat                    # 1-click Windows launcher
├── package.json                 # Standard project manifest
├── test.js                      # Automated verification test suite
├── README.md                    # Detailed documentation and judge pitch
└── src/
    ├── main.js                  # Application entrypoint & reactive DOM binder
    ├── data/
    │   └── puneData.js          # 15 Pune locations, alerts, traffic, weather
    ├── state/
    │   └── store.js             # Centralized reactive pub-sub state store
    ├── utils/
    │   ├── smartScore.js        # 5-factor City Smart Score & comparison engine
    │   ├── recommender.js       # Dynamic multi-constraint itinerary engine
    │   └── aiEngine.js          # Local NLP heuristic assistant engine
    ├── components/
    │   ├── Navbar.js            # Responsive navigation & mobile drawer
    │   ├── Home.js              # Landing page, insights, pitch briefing
    │   ├── SmartExplore.js      # Budget/time/interest/safety interactive form
    │   ├── Recommendations.js   # Itinerary timeline & place cards with reasons
    │   ├── Compare.js           # Head-to-head comparison table & winner verdict
    │   ├── SafetyAlerts.js      # Community alerts, traffic, weather & reports
    │   ├── InteractiveMap.js    # Simulated Pune GIS vector map & route engine
    │   ├── AiAssistant.js       # Conversational AI assistant interface
    │   └── Footer.js            # Competition credits and notice
    └── styles/
        ├── main.css             # Design system, layout, colors & typography
        └── components.css       # Cards, sliders, meters, map pins & chat bubbles
```

---

## 🎯 5. Demo Limitations & Transparency

1. **Simulated City Data:**
   - Pune is used as the representative demonstration city.
   - All 15 destinations represent real Pune locations with realistic pricing and time estimates.
   - Live traffic, weather, and safety incident feeds are simulated for competition reliability without requiring API keys or payment cards.
2. **Zero External API Dependency:**
   - Designed to run **100% offline** without network latency or external rate limits.
   - The AI Assistant uses a rule-based NLP parser. In production, this can be seamlessly connected to the Google Gemini API or OpenAI API by replacing `aiEngine.js`.
3. **No Real Geolocation Tracking:**
   - Preserves user privacy by avoiding GPS browser permission prompts.

---

## 🏆 6. Presentation Talking Points for Judges

1. **Explainable AI:** Rather than a black-box suggestion, every recommendation provides transparent checkmarks (*"Why it was recommended"*), building traveler trust.
2. **Multi-Constraint Optimization:** Balances cost, time, and safety simultaneously, preventing impossible schedules.
3. **Offline Resilience:** Loads in under 100ms, uses 0 npm dependencies, and does not break if venue Wi-Fi fails.
4. **Clean Code Craftsmanship:** Pure component-based architecture with clean separation between data, math utilities, reactive state, and presentation.
