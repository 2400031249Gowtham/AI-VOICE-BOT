"use client";

import { useEffect, useState } from "react";
import { Settings, Phone, Bot, X, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceBotPage() {
  const [inboundCalls, setInboundCalls] = useState<any[]>([]);
  const [inboundEnabled, setInboundEnabled] = useState<boolean>(true);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isTestCallOpen, setIsTestCallOpen] = useState<boolean>(false);
  
  // Default values to avoid undefined state issues
  const [configData, setConfigData] = useState({
    systemPrompt: "You are Priya, a helpful AI assistant...",
    voiceSpeed: "1.0",
    language: "en-IN"
  });

  const [testCallData, setTestCallData] = useState({
    phone: "",
    customerId: "TEST_CUSTOMER"
  });

  const [isCalling, setIsCalling] = useState<boolean>(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/calls')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          const inbounds = data.filter((c: any) => c.direction === 'inbound').reverse().slice(0, 5);
          setInboundCalls(inbounds);
        }
      }).catch(e => console.error(e));
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/bot/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData)
      });
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        await response.json();
      } else {
        await response.text();
      }
      alert("Configuration saved!");
      setIsConfigOpen(false);
    } catch (error) {
      console.error("Config save error:", error);
      alert("Failed to save configuration.");
    }
  };

  const handleTestCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalling(true);
    try {
      const response = await fetch("http://localhost:8080/api/call/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testCallData)
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text, success: response.ok };
      }

      if (response.ok) {
        alert("Test call initiated to " + testCallData.phone);
        setIsTestCallOpen(false);
      } else {
        alert("Call failed.\nReason: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Test call error:", error);
      alert("Error initiating test call.");
    } finally {
      setIsCalling(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsConfigOpen(false);
        setIsTestCallOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Voice Agents</h1>
        <p className="text-[#6B7280] text-sm mt-1">Manage and configure your AI voice assistants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Priya AI Card */}
        <div className="card p-6 border border-[#E4E7EC] rounded-2xl bg-white shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#ECFDF5] text-[#10B981]">
              ONLINE
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-[#F5F3FF] border-2 border-[#E0D4FC] flex items-center justify-center">
              <Bot className="w-7 h-7 text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">Priya AI</h2>
              <p className="text-sm font-medium text-[#6B7280]">Primary Sales Agent</p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Model:</span>
              <span className="font-semibold text-[#111827]">Llama 3.2 1B</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Voice:</span>
              <span className="font-semibold text-[#111827]">ElevenLabs (Indian Female)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Latency:</span>
              <span className="font-semibold text-[#10B981]">&lt; 800ms</span>
            </div>
          </div>

          <div className="mt-auto flex gap-3 pt-4 border-t border-[#E4E7EC]">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" /> Configure
            </button>
            <button
              onClick={() => setIsTestCallOpen(true)}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Test Call
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Inbound Calls Config */}
        <div className="card p-6 border border-[#E4E7EC] rounded-2xl bg-white shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-[#111827] mb-4">Inbound Call Settings</h2>
          
          <div className="flex items-center justify-between mb-6 p-4 bg-[#F8F9FC] rounded-xl border border-[#E4E7EC]">
            <div>
              <p className="font-semibold text-[#374151]">Accept Inbound Calls</p>
              <p className="text-xs text-[#6B7280]">Allow Priya to answer incoming calls</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={inboundEnabled} onChange={() => setInboundEnabled(!inboundEnabled)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#374151]">Twilio Webhook URL</label>
            <div className="flex">
              <input type="text" readOnly value="https://moody-skier-mowing.ngrok-free.dev/api/voice/webhook" className="w-full text-sm p-2.5 bg-[#F9FAFB] border border-[#E4E7EC] rounded-l-lg text-[#6B7280] font-mono" />
              <button onClick={() => navigator.clipboard.writeText("https://moody-skier-mowing.ngrok-free.dev/api/voice/webhook")} className="px-4 bg-[#F3F4F6] border border-l-0 border-[#E4E7EC] rounded-r-lg hover:bg-[#E5E7EB] transition-colors">
                <Copy className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
            <p className="text-xs text-[#6B7280]">Configure this URL in your Twilio phone number's "A CALL COMES IN" webhook setting.</p>
          </div>
        </div>

        {/* Recent Inbound Calls */}
        <div className="card p-6 border border-[#E4E7EC] rounded-2xl bg-white shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-[#111827] mb-4">Recent Inbound Calls</h2>
          <div className="space-y-3 flex-1 overflow-auto">
            {inboundCalls.map((call, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-[#E4E7EC] hover:bg-[#F9FAFB] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#111827] font-mono">{call.customerPhone || "Unknown"}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{new Date(call.startTime).toLocaleString()}</p>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase ${call.status?.includes('completed') ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                  {call.status?.split(' |')[0] || 'UNKNOWN'}
                </span>
              </div>
            ))}
            {inboundCalls.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-[#9CA3AF] font-medium">No recent inbound calls.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsConfigOpen(false)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-xl relative"
            onClick={e => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full hover:bg-gray-100 z-50"
              onClick={() => setIsConfigOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="px-6 py-5 border-b border-[#E4E7EC] flex justify-between items-center bg-[#F8F9FC] pr-16">
              <h3 className="text-lg font-bold text-[#111827]">Configure Priya AI</h3>
            </div>
            <form onSubmit={handleSaveConfig} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">System Prompt</label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-lg p-3 text-sm border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                  value={configData.systemPrompt}
                  onChange={(e) => setConfigData({ ...configData, systemPrompt: e.target.value })}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Voice Speed</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="2.0"
                    required
                    className="w-full rounded-lg p-2.5 text-sm border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                    value={configData.voiceSpeed}
                    onChange={(e) => setConfigData({ ...configData, voiceSpeed: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">Language</label>
                  <select
                    className="w-full rounded-lg p-2.5 text-sm border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                    value={configData.language}
                    onChange={(e) => setConfigData({ ...configData, language: e.target.value })}
                  >
                    <option value="en-IN">English (India)</option>
                    <option value="en-US">English (US)</option>
                    <option value="hi-IN">Hindi</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#E4E7EC]">
                <button type="button" onClick={() => setIsConfigOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save Configuration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Call Modal */}
      {isTestCallOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsTestCallOpen(false)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-xl relative"
            onClick={e => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full hover:bg-gray-100 z-50"
              onClick={() => setIsTestCallOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="px-6 py-5 border-b border-[#E4E7EC] flex justify-between items-center bg-[#F8F9FC] pr-16">
              <h3 className="text-lg font-bold text-[#111827]">Initiate Test Call</h3>
            </div>
            <form onSubmit={handleTestCall} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+919876543210"
                  className="w-full rounded-lg p-2.5 text-sm border border-[#E4E7EC] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20"
                  value={testCallData.phone}
                  onChange={(e) => setTestCallData({ ...testCallData, phone: e.target.value })}
                />
                <p className="text-xs text-[#6B7280] mt-2">Enter the phone number with country code.</p>
              </div>
              <div className="flex gap-3 pt-4 border-t border-[#E4E7EC]">
                <button type="button" onClick={() => setIsTestCallOpen(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={isCalling} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {isCalling ? "Calling..." : "Call Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
