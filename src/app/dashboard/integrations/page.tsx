"use client";

import { Plug, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/ui/Toast";
import ToastProvider from "@/components/ui/Toast";

export default function IntegrationsPage() {
  const router = useRouter();

  const integrations = [
    {
      id: "twilio",
      name: "Twilio Voice",
      description: "Voice calling and telephony infrastructure",
      status: "connected",
      icon: "📞"
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs AI",
      description: "High-quality neural text-to-speech engine",
      status: "connected",
      icon: "🎙️"
    },
    {
      id: "groq",
      name: "Groq (Llama 3)",
      description: "Cloud large language model for conversation processing",
      status: "connected",
      icon: "🦙"
    },
    {
      id: "hubspot",
      name: "HubSpot CRM",
      description: "Two-way sync for customers and call logs",
      status: "disconnected",
      icon: "🤝"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get real-time notifications for important calls",
      status: "disconnected",
      icon: "💬"
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <ToastProvider />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Plug className="w-6 h-6 text-purple-600" />
          Integrations
        </h1>
        <p className="text-gray-500 mt-1">Connect your CRM with third-party tools and services.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
                  {integration.icon}
                </div>
                {integration.status === 'connected' ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                    Disconnected
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-500 mb-6">{integration.description}</p>
            </div>
            
            <button 
              onClick={() => {
                if (integration.status === 'connected') {
                  router.push('/dashboard/settings');
                } else {
                  showToast(`${integration.name} integration is coming soon!`, 'info');
                }
              }}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                integration.status === 'connected' 
                  ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
              }`}
            >
              {integration.status === 'connected' ? 'Manage Settings' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
