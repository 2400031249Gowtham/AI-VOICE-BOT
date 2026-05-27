import apiClient from "@/lib/apiClient";

const MOCK_STATS = {
  totalCalls: 2847,
  activeLeads: 684,
  aiConversations: 1249,
  followupsToday: 12,
  callsChange: "+12.5%",
  leadsChange: "+23.1%",
  conversationsChange: "+18.4%",
  followupsChange: "-2 pending",
  callSuccessRate: "72.7%",
  aiVoiceStatus: "Online",
  voiceQueue: "0 calls",
  marketTrendSummary: "Export licensing demands for APEDA and Spice Board registration are up 14% this week. Cardamom and Mango exporters in Andhra Pradesh and Telangana are the primary drivers."
};

const MOCK_CHARTS = {
  performanceOverview: [
    { name: "Jan", ai: 120, manual: 80 },
    { name: "Feb", ai: 180, manual: 75 },
    { name: "Mar", ai: 160, manual: 70 },
    { name: "Apr", ai: 240, manual: 65 },
    { name: "May", ai: 280, manual: 60 },
    { name: "Jun", ai: 320, manual: 55 },
    { name: "Jul", ai: 390, manual: 50 },
  ],
  weeklyCalls: [
    { day: "Mon", calls: 65 },
    { day: "Tue", calls: 82 },
    { day: "Wed", calls: 73 },
    { day: "Thu", calls: 95 },
    { day: "Fri", calls: 88 },
    { day: "Sat", calls: 42 },
    { day: "Sun", calls: 35 },
  ],
  sentimentData: [
    { name: "Positive", value: 65, fill: "hsl(173 80% 50%)" },
    { name: "Neutral", value: 25, fill: "hsl(43 96% 64%)" },
    { name: "Negative", value: 10, fill: "hsl(0 84% 60%)" }
  ],
  leadConversion: [
    { month: "Jan", rate: 12 },
    { month: "Feb", rate: 15 },
    { month: "Mar", rate: 14 },
    { month: "Apr", rate: 18 },
    { month: "May", rate: 21 },
    { month: "Jun", rate: 24 },
    { month: "Jul", rate: 28 }
  ]
};

export const analyticsService = {
  async getStats(): Promise<typeof MOCK_STATS> {
    try {
      const response = await apiClient.get("/analytics/stats");
      return response.data;
    } catch {
      return MOCK_STATS;
    }
  },

  async getCharts(): Promise<typeof MOCK_CHARTS> {
    try {
      const response = await apiClient.get("/analytics/charts");
      return response.data;
    } catch {
      return MOCK_CHARTS;
    }
  }
};
