// frontend/src/app/dashboard/campaigns/page.tsx
"use client";

import { Megaphone, Plus, Users, PhoneCall, CheckCircle2 } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Outbound Campaigns</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage automated bulk voice calling campaigns</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-[#6B7280]">Active Campaigns</h3>
            <div className="p-2 rounded-lg bg-[#F5F3FF]">
              <Megaphone className="w-5 h-5 text-[#7C3AED]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">0</h2>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-[#6B7280]">Leads Queued</h3>
            <div className="p-2 rounded-lg bg-[#EFF6FF]">
              <Users className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">0</h2>
        </div>
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-[#6B7280]">Calls Today</h3>
            <div className="p-2 rounded-lg bg-[#ECFDF5]">
              <PhoneCall className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">0</h2>
        </div>
      </div>

      <div className="card flex flex-col items-center justify-center py-16 text-center border-dashed border-2">
        <div className="w-20 h-20 rounded-full bg-[#F5F7FA] flex items-center justify-center mb-6 border border-[#E4E7EC]">
          <Megaphone className="w-10 h-10 text-[#9CA3AF]" />
        </div>
        <h3 className="text-xl font-bold text-[#111827] mb-2">No active campaigns</h3>
        <p className="text-[#6B7280] max-w-md mx-auto mb-8">Create your first automated voice campaign to start dialing your leads automatically using the Priya AI voice agent.</p>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

    </div>
  );
}
