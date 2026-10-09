/**
 * CitySmart Explorer - Main Application Entrypoint
 * Orchestrates components, global action bindings, and reactive re-rendering.
 */

import { store } from './state/store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderHome } from './components/Home.js';
import { renderSmartExplore } from './components/SmartExplore.js';
import { renderRecommendations } from './components/Recommendations.js';
import { renderCompare } from './components/Compare.js';
import { renderSafetyAlerts } from './components/SafetyAlerts.js';
import { renderInteractiveMap } from './components/InteractiveMap.js';
import { renderAiAssistant } from './components/AiAssistant.js';
import { renderFooter } from './components/Footer.js';

// Expose store globally for inline event handlers
window.appStore = store;

// Global UI interaction helpers
window.setFormPreset = function(preset) {
  store.setFilters(preset);
  // Re-render
  renderApp();
};

window.toggleInterest = function(interestId) {
  const current = store.getState().filters.interests;
  let updated;
  if (current.includes(interestId)) {
    updated = current.filter(i => i !== interestId);
  } else {
    updated = [...current, interestId];
  }
  // Keep at least one or allow empty
  store.setFilters({ interests: updated });
  renderApp();
};

window.setSafetyPref = function(pref) {
  store.setFilters({ safetyPreference: pref });
  renderApp();
};

window.setAccessPref = function(pref) {
  store.setFilters({ accessibilityPreference: pref });
  renderApp();
};

window.handleExploreSubmit = function(event) {
  event.preventDefault();
  const budgetInput = document.getElementById('input-budget');
  const timeInput = document.getElementById('input-time');

  const budget = budgetInput ? parseInt(budgetInput.value, 10) : store.getState().filters.budget;
  const availableTime = timeInput ? parseFloat(timeInput.value) : store.getState().filters.availableTime;

  store.applyPlan({ budget, availableTime });
};

window.quickCompare = function(placeId) {
  const currentComp = store.getState().comparison;
  if (currentComp.placeAId !== placeId) {
    store.setComparison(placeId, currentComp.placeAId);
  }
  store.setActiveTab('compare');
};

window.viewPlaceOnMap = function(placeId) {
  store.selectMapPlace(placeId);
  store.setActiveTab('map');
};

window.setComparePair = function(idA, idB) {
  // If user picked identical, fallback to next
  if (idA === idB) {
    const all = store.getState().recommendations?.rankedPlaces || [];
    const alt = all.find(p => p.id !== idA);
    idB = alt ? alt.id : idB;
  }
  store.setComparison(idA, idB);
  renderApp();
};

window.selectMapLocation = function(placeId) {
  store.selectMapPlace(placeId);
  renderApp();
};

window.setMapFilterCategory = function(cat) {
  store.setMapCategory(cat);
  renderApp();
};

window.handleCitizenReportSubmit = function(event) {
  event.preventDefault();
  const locInput = document.getElementById('new-report-location');
  const commentInput = document.getElementById('new-report-comment');

  if (locInput && commentInput && locInput.value.trim() && commentInput.value.trim()) {
    store.addCitizenReport({
      location: locInput.value.trim(),
      comment: commentInput.value.trim(),
      reportType: "Community Report"
    });
    locInput.value = '';
    commentInput.value = '';
    alert('Thank you! Your demo report has been added to the community alerts feed.');
  }
};

window.submitChatPrompt = function(promptText) {
  store.sendChatMessage(promptText);
};

window.handleChatSubmit = function(event) {
  event.preventDefault();
  const input = document.getElementById('ai-chat-input');
  if (input && input.value.trim()) {
    const text = input.value.trim();
    input.value = '';
    store.sendChatMessage(text);
  }
};

window.handleAiAction = function(action) {
  if (!action) return;
  if (action.type === 'explore') {
    store.setActiveTab('explore');
  } else if (action.type === 'plan') {
    store.applyPlan({
      budget: action.budget || store.getState().filters.budget,
      availableTime: action.time || store.getState().filters.availableTime
    });
  } else if (action.type === 'compare') {
    store.setActiveTab('compare');
  } else if (action.type === 'safety') {
    store.setActiveTab('safety');
  }
};

window.handleAiActionIndex = function(msgId) {
  const msg = store.getState().chatMessages.find(m => m.id === msgId);
  if (msg && msg.action) {
    window.handleAiAction(msg.action);
  }
};

window.clearChatHistory = function() {
  store.state.chatMessages = [
    {
      id: 'msg-welcome-reset',
      sender: 'assistant',
      text: `👋 Chat reset! I am ready to help you plan your smart, safe exploration in Pune. Ask any question or tap a suggestion above.`,
      timestamp: 'Just now'
    }
  ];
  store.notify();
};

// Render Main App
function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const state = store.getState();
  const { activeTab } = state;

  let pageContent = '';
  switch (activeTab) {
    case 'home':
      pageContent = renderHome(state);
      break;
    case 'explore':
      pageContent = renderSmartExplore(state);
      break;
    case 'recommendations':
      pageContent = renderRecommendations(state);
      break;
    case 'compare':
      pageContent = renderCompare(state);
      break;
    case 'safety':
      pageContent = renderSafetyAlerts(state);
      break;
    case 'map':
      pageContent = renderInteractiveMap(state);
      break;
    case 'assistant':
      pageContent = renderAiAssistant(state);
      break;
    default:
      pageContent = renderHome(state);
  }

  root.innerHTML = `
    ${renderNavbar(state)}
    <div id="page-container">${pageContent}</div>
    ${renderFooter()}
  `;

  // Auto-scroll chat history to bottom if on assistant tab
  if (activeTab === 'assistant') {
    const chatPane = document.getElementById('chat-messages-container');
    if (chatPane) {
      chatPane.scrollTop = chatPane.scrollHeight;
    }
  }
}

// Initial bootstrap
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  store.subscribe(() => {
    renderApp();
  });
});
