import { CallLog } from "@/types";
import { API_BASE } from "@/lib/config";

export const callService = {
  async getAll(): Promise<CallLog[]> {
    try {
      const response = await fetch(API_BASE + "/api/calls");
      if (!response.ok) throw new Error("Failed to fetch calls");
      return response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async getByCustomerId(customerId: number | string): Promise<CallLog[]> {
    try {
      const response = await fetch(`${API_BASE}/api/calls?exporterId=${customerId}`);
      if (!response.ok) return [];
      return response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async makeCall(customerId: number | string, phone: string, voiceSettings: any): Promise<any> {
    const API_URL = API_BASE;
    const response = await fetch(`${API_URL}/api/call-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerId,
        phone,
        voiceSettings,
        transcript: "AI outbound call initiated. Transcript pending...",
        callStatus: "initiated"
      })
    });
    if (!response.ok) throw new Error("Failed to trigger outbound call");
    return response.json();
  }
};
