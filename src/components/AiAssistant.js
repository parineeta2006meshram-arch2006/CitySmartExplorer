/**
 * CitySmart Explorer - AI City Assistant Component
 */

import { SUGGESTED_QUESTIONS } from '../utils/aiEngine.js';
import { store } from '../state/store.js';

export function renderAiAssistant(state) {
  const { chatMessages } = state;

  return `
    <section class="section-padding">
      <div class="container">
        <!-- Section Header -->
        <div style="text-align: center; max-width: 650px; margin: 0 auto 28px;">
          <span class="badge badge-blue">Natural Language Urban Intelligence</span>
          <h1 class="section-title" style="margin-top: 8px;">Ask the CitySmart AI</h1>
          <p class="section-subtitle" style="margin: 0 auto;">
            AI-powered recommendation assistant • Ask questions in plain language regarding budget, free hours, safety scores, and custom Pune itineraries.
          </p>
        </div>

        <!-- Chat Container -->
        <div class="assistant-layout">
          <!-- Chat Header -->
          <div class="assistant-header">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
                🤖
              </div>
              <div>
                <h3 style="font-size: 1.1rem; font-weight: 800; line-height: 1.2;">CitySmart AI Concierge</h3>
                <span style="font-size: 0.78rem; color: #94a3b8; display: flex; align-items: center; gap: 6px;">
                  <span class="pulse-indicator" style="width: 6px; height: 6px;"></span>
                  Local NLP Heuristic Engine Active • Pune Dataset
                </span>
              </div>
            </div>

            <button 
              class="btn btn-secondary btn-sm" 
              style="font-size: 0.8rem; padding: 6px 12px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);"
              onclick="window.clearChatHistory()"
            >
              🔄 Reset Chat
            </button>
          </div>

          <!-- Suggested Prompt Chips -->
          <div style="padding: 12px 20px; background: #ffffff; border-bottom: 1px solid var(--border-light);">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px;">
              💡 Tap a sample question to try:
            </div>
            <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
              ${SUGGESTED_QUESTIONS.map(q => `
                <button 
                  class="preset-chip" 
                  style="white-space: nowrap; font-size: 0.8rem; padding: 6px 12px;"
                  onclick="window.submitChatPrompt('${q.replace(/'/g, "\\'")}')"
                >
                  ${q}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Chat Conversation Scroll Pane -->
          <div class="chat-history-pane" id="chat-messages-container">
            ${chatMessages.map(msg => `
              <div class="chat-bubble ${msg.sender}">
                <div style="font-size: 0.75rem; font-weight: 700; color: ${msg.sender === 'user' ? '#bae6fd' : 'var(--text-muted)'}; margin-bottom: 4px; display: flex; justify-content: space-between;">
                  <span>${msg.sender === 'user' ? 'You' : 'CitySmart AI'}</span>
                  <span>${msg.timestamp}</span>
                </div>

                <div style="white-space: pre-line;">${formatMarkdownLite(msg.text)}</div>

                <!-- Attached place cards if any -->
                ${msg.recommendedPlaces && msg.recommendedPlaces.length > 0 ? `
                  <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 8px;">
                    ${msg.recommendedPlaces.map(p => `
                      <div style="background: #f8fafc; border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                          <strong style="color: var(--text-primary); font-size: 0.9rem;">${p.imageEmoji} ${p.name}</strong>
                          <div style="font-size: 0.78rem; color: var(--text-muted);">Est. ₹${p.estimatedCost} • Safety ${p.safetyScore}/10 • ${p.category}</div>
                        </div>
                        <button class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 4px 8px;" onclick="window.viewPlaceOnMap('${p.id}')">
                          View
                        </button>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Dynamic Action Button if attached -->
                ${msg.action ? `
                  <div style="margin-top: 12px;">
                    <button 
                      class="btn btn-primary btn-sm" 
                      style="font-size: 0.85rem;"
                      onclick="window.handleAiActionIndex('${msg.id}')"
                    >
                      ⚡ ${msg.action.label} →
                    </button>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <!-- Chat Input Field -->
          <div class="chat-input-area">
            <form class="chat-form" onsubmit="window.handleChatSubmit(event)">
              <input 
                type="text" 
                id="ai-chat-input" 
                class="chat-input" 
                placeholder="Ask about Pune budget, time, safe heritage spots, food..." 
                autocomplete="off"
              />
              <button type="submit" class="btn btn-primary" style="padding: 12px 24px;">
                <span>Send</span>
                <span>➤</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `;
}

// Light markdown bold formatter helper
function formatMarkdownLite(str) {
  if (!str) return '';
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/• /g, '• ');
}
