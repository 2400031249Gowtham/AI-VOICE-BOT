// frontend/src/app/dashboard/ai-executive/page.tsx
"use client";

import { Activity, Cpu, Settings2, ShieldCheck, Zap, Radio, CheckCircle2 } from "lucide-react";

export default function AIExecutivePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">AI Voice Engine Operations</h1>
          <p className="text-sm text-[#6B7280] mt-1">Monitor neural models and inference endpoints</p>
        </div>
        <div className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          AI Engine Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-[#6B7280]">Inference Latency</h3>
            <div className="p-2 rounded-lg bg-[#F5F3FF]">
              <Zap className="w-5 h-5 text-[#7C3AED]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">124<span className="text-lg text-[#9CA3AF] ml-1">ms</span></h2>
          <p className="text-xs text-[#10B981] font-medium mt-2">Optimal range</p>
        </div>
        
        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-[#6B7280]">Model Uptime</h3>
            <div className="p-2 rounded-lg bg-[#ECFDF5]">
              <Activity className="w-5 h-5 text-[#10B981]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">99.9<span className="text-lg text-[#9CA3AF] ml-1">%</span></h2>
          <p className="text-xs text-[#6B7280] font-medium mt-2">Last 30 days</p>
        </div>

        <div className="card">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-semibold text-[#6B7280]">Concurrency Limit</h3>
            <div className="p-2 rounded-lg bg-[#EFF6FF]">
              <Cpu className="w-5 h-5 text-[#3B82F6]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#111827]">45<span className="text-lg text-[#9CA3AF] ml-1">/ 50</span></h2>
          <p className="text-xs text-[#F59E0B] font-medium mt-2">Nearing capacity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="card !p-0 overflow-hidden">
            <div className="p-5 border-b border-[#E4E7EC] flex items-center justify-between bg-[#F5F7FA]">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#7C3AED]" />
                <h3 className="text-lg font-bold text-[#111827]">Model Configuration</h3>
              </div>
            </div>
            
            <div className="p-6">
              <h4 style={{ color: '#7C3AED', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>NEURAL DIAGNOSTICS</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-[#E4E7EC]">
                  <span className="text-sm font-medium text-[#6B7280]">LLM Engine</span>
                  <span className="text-sm font-bold text-[#111827]">Groq (llama-3.3-70b)</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#E4E7EC]">
                  <span className="text-sm font-medium text-[#6B7280]">TTS Engine</span>
                  <span className="text-sm font-bold text-[#111827]">ElevenLabs (Voice: Priya)</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#E4E7EC]">
                  <span className="text-sm font-medium text-[#6B7280]">Telephony</span>
                  <span className="text-sm font-bold text-[#111827]">Twilio Webhooks</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-[#E4E7EC]">
                  <span className="text-sm font-medium text-[#6B7280]">Context Window</span>
                  <span className="text-sm font-bold text-[#111827]">8,192 Tokens</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-medium text-[#6B7280]">System Prompt</span>
                  <span className="text-sm font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-1 rounded">Optimized for Sales</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-[#FFFFFF] border border-[#E4E7EC] flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5F7FA] flex items-center justify-center mb-4">
              <Radio className="w-8 h-8 text-[#9CA3AF]" />
            </div>
            <h3 className="text-[#111827] font-bold text-lg">No Active Streams</h3>
            <p className="text-[#6B7280] text-sm mt-2 max-w-[200px]">The AI engine is idle and waiting for incoming webhooks.</p>
          </div>

          <div className="card p-5">
            <h4 style={{ color: '#7C3AED', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>SYSTEM HEALTH</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm text-[#374151] font-medium">Vector Database</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm text-[#374151] font-medium">MongoDB Cluster</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm text-[#374151] font-medium">Redis Cache</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span className="text-sm text-[#374151] font-medium">Ngrok Tunnel</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
