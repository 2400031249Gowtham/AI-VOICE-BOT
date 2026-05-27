import apiClient from "@/lib/apiClient";
import { FollowUp } from "@/types";

const MOCK_FOLLOWUPS: FollowUp[] = [
  {
    id: 1,
    customerId: 3,
    customerName: "Deepa Rajan",
    company: "ExportHub India",
    initials: "DR",
    time: "Scheduled: 8 days remaining",
    type: "Call",
    status: "Scheduled",
    priority: "High",
    aiNotes: "Auto-scheduled based on Telugu call sentiment: '10 days తర్వాత call చేయండి'. Auditor verification details ready."
  },
  {
    id: 2,
    customerId: 1,
    customerName: "Priya Sharma",
    company: "TechVision Inc.",
    initials: "PS",
    time: "Today, 4:00 PM",
    type: "WhatsApp",
    status: "Pending",
    priority: "High",
    aiNotes: "Verify invoice payment status of ₹45,000 for Spices Board License."
  },
  {
    id: 3,
    customerId: 2,
    customerName: "Arjun Mehta",
    company: "CloudSync Labs",
    initials: "AM",
    time: "Tomorrow, 10:30 AM",
    type: "Email",
    status: "Pending",
    priority: "Medium",
    aiNotes: "Follow up with updated multi-site APEDA license quote sheet."
  },
  {
    id: 4,
    customerId: 5,
    customerName: "Ramesh Krishnan",
    company: "Krishnan Agri Exports",
    initials: "RK",
    time: "Scheduled: 2 months remaining",
    type: "Call",
    status: "Scheduled",
    priority: "Low",
    aiNotes: "Quarterly follow-up check. User quote: '3 months తర్వాత follow-up చేద్దాం'."
  }
];

export const followupService = {
  async getAll(): Promise<FollowUp[]> {
    try {
      const response = await apiClient.get("/followups");
      return response.data;
    } catch {
      return MOCK_FOLLOWUPS;
    }
  },

  async updateStatus(id: number, status: "Pending" | "Scheduled" | "Completed"): Promise<FollowUp> {
    try {
      const response = await apiClient.put(`/followups/${id}`, { status });
      return response.data;
    } catch {
      const index = MOCK_FOLLOWUPS.findIndex((f) => f.id === id);
      if (index === -1) throw new Error("Follow-up not found");
      MOCK_FOLLOWUPS[index].status = status;
      return MOCK_FOLLOWUPS[index];
    }
  },

  async create(followup: Partial<FollowUp>): Promise<FollowUp> {
    try {
      const response = await apiClient.post("/followups", followup);
      return response.data;
    } catch {
      const newFollowup: FollowUp = {
        id: Math.max(...MOCK_FOLLOWUPS.map((f) => f.id), 0) + 1,
        customerId: followup.customerId || 1,
        customerName: followup.customerName || "Customer",
        company: followup.company || "Company Ltd",
        initials: followup.initials || "C",
        time: followup.time || "Today, 5:00 PM",
        type: followup.type || "Call",
        status: followup.status || "Pending",
        priority: followup.priority || "Medium",
        aiNotes: followup.aiNotes || "Manual followup scheduled."
      };
      MOCK_FOLLOWUPS.unshift(newFollowup);
      return newFollowup;
    }
  }
};
