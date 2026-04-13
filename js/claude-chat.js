// ============================================================
// CLAUDE-POWERED CHAT
// Upgrades chat assistant to use Claude API via Netlify Function
// Falls back to keyword matching if API unavailable
// ============================================================
const ClaudeChat = {
  ENDPOINT: '/.netlify/functions/claude-chat',
  _conversationHistory: [],

  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('claude-chat')) return;

    // Override the ChatAssistant's response method if it exists
    if (typeof ChatAssistant !== 'undefined' && ChatAssistant._initialized) {
      const originalGetResponse = ChatAssistant.getResponse.bind(ChatAssistant);
      ChatAssistant.getResponse = async (query) => {
        const aiResponse = await ClaudeChat.getResponse(query);
        if (aiResponse) return aiResponse;
        // Fallback to keyword matching
        return originalGetResponse(query);
      };
      console.log('[ClaudeChat] Upgraded chat assistant with Claude API');
    }
  },

  async getResponse(query) {
    try {
      this._conversationHistory.push({ role: 'user', content: query });

      // Keep conversation history manageable
      if (this._conversationHistory.length > 20) {
        this._conversationHistory = this._conversationHistory.slice(-16);
      }

      const response = await fetch(this.ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: this._conversationHistory,
          context: this._buildContext()
        })
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (data.response) {
        this._conversationHistory.push({ role: 'assistant', content: data.response });
        return data.response;
      }
      return null;
    } catch (e) {
      console.warn('[ClaudeChat] API unavailable, falling back to keyword matching:', e.message);
      return null;
    }
  },

  _buildContext() {
    const state = typeof State !== 'undefined' ? State.get() : {};
    return {
      tripDays: state.tripDays,
      interests: state.interests,
      budget: state.budget,
      occasion: state.occasion,
      groupType: state.groupType,
      page: window.location.pathname
    };
  }
};

// Auto-init after ChatAssistant
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof ClaudeChat !== 'undefined') ClaudeChat.init();
  }, 500);
});
