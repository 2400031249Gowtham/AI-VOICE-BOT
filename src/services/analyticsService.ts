export const analyticsService = {
  async getStats(): Promise<any> {
    return {
      totalCalls: 0,
      activeLeads: 0,
      aiConversations: 0,
      followupsToday: 0,
      callsChange: "0%",
      leadsChange: "0%",
      conversationsChange: "0%",
      followupsChange: "0 pending",
      callSuccessRate: "0%",
      aiVoiceStatus: "Online",
      voiceQueue: "0 calls",
      marketTrendSummary: "Live tracking active. Go to Market rates to update pricing parameters for Spices, Textile and Agri commodities."
    };
  },

  async getCharts(): Promise<any> {
    return {
      performanceOverview: [],
      weeklyCalls: [],
      sentimentData: [],
      leadConversion: []
    };
  }
};
