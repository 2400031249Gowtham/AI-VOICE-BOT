import { FollowUp } from "@/types";
import { API_BASE } from "@/lib/config";

export const followupService = {
  async getAll(): Promise<FollowUp[]> {
    try {
      const response = await fetch(API_BASE + "/api/followups");
      if (!response.ok) throw new Error("Failed to fetch followups");
      return response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async updateStatus(id: number | string, status: "Pending" | "Scheduled" | "Completed" | "Missed"): Promise<FollowUp> {
    const response = await fetch(`${API_BASE}/api/followups/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Failed to update followup");
    return response.json();
  },

  async create(followup: Partial<FollowUp>): Promise<FollowUp> {
    const response = await fetch(API_BASE + "/api/followups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(followup)
    });
    if (!response.ok) throw new Error("Failed to create followup");
    return response.json();
  }
};
