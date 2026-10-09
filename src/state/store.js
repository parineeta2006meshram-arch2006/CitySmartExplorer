/**
 * CitySmart Explorer - Central State Management
 * Lightweight, reactive pub-sub store without external dependencies.
 */

import { PUNE_DATA } from '../data/puneData.js';
import { getRecommendations } from '../utils/recommender.js';
import { processAiQuery } from '../utils/aiEngine.js';

class AppStore {
  constructor() {
    this.state = {
      activeTab: 'home', // 'home' | 'explore' | 'recommendations' | 'compare' | 'safety' | 'map' | 'assistant'
      filters: {
        city: 'Pune',
        budget: 1500,
        availableTime: 5,
        interests: ['Food', 'History'],
        safetyPreference: 'safer', // 'standard' | 'safer' | 'highest'
        accessibilityPreference: 'any' // 'any' | 'easy'
      },
      recommendations: null,
      comparison: {
        placeAId: 'shaniwar-wada',
        placeBId: 'aga-khan-palace'
      },
      citizenReports: [...PUNE_DATA.citizenReports],
      chatMessages: [
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: `👋 Namaste! I'm your **CitySmart AI Assistant** for Pune.\n\nTell me your budget, available hours, or what you'd like to experience. For example: _"I have ₹1500 and 5 hours for food and history"_ or choose a quick prompt below!`,
          timestamp: 'Just now',
          recommendedPlaces: null,
          action: null
        }
      ],
      selectedMapPlaceId: 'shaniwar-wada',
      activeMapCategory: 'all',
      isMobileNavOpen: false
    };

    this.listeners = new Set();

    // Initialize initial recommendations calculation
    this.calculateInitialRecommendations();
  }

  calculateInitialRecommendations() {
    this.state.recommendations = getRecommendations(this.state.filters);
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Store listener error:", err);
      }
    }
  }

  // Actions
  setActiveTab(tab) {
    this.state.activeTab = tab;
    this.state.isMobileNavOpen = false;
    // Scroll window smoothly to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  toggleMobileNav(open) {
    this.state.isMobileNavOpen = open !== undefined ? open : !this.state.isMobileNavOpen;
    this.notify();
  }

  setFilters(newFilters) {
    this.state.filters = { ...this.state.filters, ...newFilters };
    this.notify();
  }

  applyPlan(newFilters = {}) {
    this.state.filters = { ...this.state.filters, ...newFilters };
    this.state.recommendations = getRecommendations(this.state.filters);
    this.state.activeTab = 'recommendations';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  setComparison(placeAId, placeBId) {
    this.state.comparison = { placeAId, placeBId };
    this.notify();
  }

  selectMapPlace(placeId) {
    this.state.selectedMapPlaceId = placeId;
    this.notify();
  }

  setMapCategory(cat) {
    this.state.activeMapCategory = cat;
    this.notify();
  }

  addCitizenReport(report) {
    const newReport = {
      id: `cr-${Date.now()}`,
      location: report.location || "Central Pune",
      reportType: report.reportType || "General Observation",
      timestamp: "Just now",
      status: "Citizen Submitted (Pending Verification)",
      author: report.author || "Community Member",
      comment: report.comment
    };
    this.state.citizenReports = [newReport, ...this.state.citizenReports];
    this.notify();
  }

  sendChatMessage(userText) {
    if (!userText || !userText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.chatMessages.push(userMsg);
    this.notify();

    // Generate response from AI engine
    setTimeout(() => {
      const response = processAiQuery(userText);
      const assistantMsg = {
        id: `msg-${Date.now()}-ai`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedPlaces: response.recommendedPlaces,
        action: response.action
      };
      this.state.chatMessages.push(assistantMsg);
      this.notify();
    }, 400);
  }
}

export const store = new AppStore();
