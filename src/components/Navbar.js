/**
 * CitySmart Explorer - Navigation Component
 */

import { store } from '../state/store.js';

export function renderNavbar(state) {
  const { activeTab, isMobileNavOpen } = state;

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'explore', label: 'Smart Explore', icon: '⚡' },
    { id: 'recommendations', label: 'Recommendations', icon: '✨' },
    { id: 'compare', label: 'Compare', icon: '⚖️' },
    { id: 'safety', label: 'Safety & Alerts', icon: '🛡️' },
    { id: 'map', label: 'Map', icon: '🗺️' },
    { id: 'assistant', label: 'AI Assistant', icon: '🤖' }
  ];

  return `
    <header class="site-header">
      <div class="container navbar">
        <a href="#home" class="brand-logo" onclick="event.preventDefault(); window.appStore.setActiveTab('home');">
          <div class="brand-icon">🏙️</div>
          <div class="brand-text">
            <span class="brand-title">CitySmart Explorer</span>
            <span class="brand-tagline-nav">Explore Smarter. Travel Safer.</span>
          </div>
        </a>

        <div class="nav-badge-city">
          <span class="pulse-indicator"></span>
          <span>Pune, India (Demo Mode)</span>
        </div>

        <ul class="nav-links">
          ${navItems.map(item => `
            <li>
              <button 
                class="nav-link-btn ${activeTab === item.id ? 'active' : ''}" 
                onclick="window.appStore.setActiveTab('${item.id}')"
              >
                <span>${item.icon}</span>
                <span>${item.label}</span>
              </button>
            </li>
          `).join('')}
        </ul>

        <button 
          class="mobile-menu-toggle" 
          aria-label="Toggle navigation menu"
          onclick="window.appStore.toggleMobileNav()"
        >
          ${isMobileNavOpen ? '✕' : '☰'}
        </button>
      </div>

      <!-- Mobile Dropdown Panel -->
      <div class="mobile-nav-panel ${isMobileNavOpen ? 'open' : ''}">
        ${navItems.map(item => `
          <button 
            class="nav-link-btn ${activeTab === item.id ? 'active' : ''}" 
            style="width: 100%; justify-content: flex-start; padding: 12px 16px;"
            onclick="window.appStore.setActiveTab('${item.id}')"
          >
            <span style="font-size: 1.2rem;">${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `).join('')}
      </div>
    </header>
  `;
}
