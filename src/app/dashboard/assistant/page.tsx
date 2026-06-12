"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { useCRMStore } from "@/store/crmStore";
import { 
  Bot, Mic, MicOff, Settings2, Play, Square, Settings, Volume2, 
  MessageSquare, User, Sparkles, Languages, AlertTriangle, ShieldCheck, Activity, Award, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { AssistantDialer } from "@/components/dialer/DialerComponents";

export default function AssistantPage() {
  const activeCall = useCRMStore(s => s.activeCall);
  const settings = useCRMStore(s => s.settings);
  const customers = useCRMStore(s => s.customers ?? []);
  const triggerOutboundCall = useCRMStore(s => s.triggerOutboundCall);
  const loading = useCRMStore(s => s.loading);
  const isLoaded = !loading?.global;
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Filter hot opportunities and sort by leadScore descending
  const hotOpportunities = useMemo(() => {
    return [...customers]
      .filter(c => c.status === "Hot")
      .sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0));
  }, [customers]);

  if (!isLoaded) {
    return (
      <PageContainer>
        <div className="p-6 space-y-4 text-left">
          <div className="h-8 w-48 bg-secondary/30 rounded animate-pulse"/>
          <div className="h-4 w-96 bg-secondary/30 rounded animate-pulse"/>
          <div className="h-64 w-full bg-secondary/30 rounded animate-pulse"/>
        </div>
      </PageContainer>
    );
  }

  // Suggestions based on active call or hot leads
  const suggestions = [
    { id: 1, title: "Offer APEDA Bundle Discount", desc: "Arjun Mehta exports fruit and is reviewing pricing. Offer 10% discount bundle via WhatsApp." },
    { id: 2, title: "Request Cardamom Quality Certificate", desc: "Priya Sharma wants Spices Board license setup. Check if cardamom lab report is ready." },
    { id: 3, title: "Follow up FSSAI norms", desc: "Deepa Rajan (ExportHub) audit is concluding. Prepare safety norms check details in Telugu." }
  ];

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl font-bold tracking-tight">AI Voice Engine Operations</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Monitor active speech streams, test prompt logic, and review AI suggestions.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[10px] h-8 bg-secondary/80 text-foreground flex items-center gap-1.5 px-3">
            <Activity size={12} className="text-chart-2 animate-pulse" /> Core Status: Online
          </Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Voice Engine Diagnostics */}
        <motion.div
          className="lg:col-span-1 space-y-4 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 text-primary"><Activity size={14}/> Neural Diagnostics</h3>
            <div className="space-y-2 text-xs">
              {[
                { label: "Engine Model", value: "VoxAI Telugu Hybrid v2.1" },
                { label: "Language Mode", value: settings.tamilMode ? "Tamil & Telugu Dual-Accent" : "Mixed Telugu & English (Teleglish)" },
                { label: "Memory Engine", value: settings.memoryEngine || "Advanced Contextual Memory" },
                { label: "Emotional Intel", value: settings.emotionalResponse || "Empathetic/Helpful" },
                { label: "Neural Accent Weight", value: `${(settings.teluguAccentWeight * 100).toFixed(0)}% Telugu Bias` },
                { label: "EleventLabs Voice profile", value: "Priya (Vijayawada Custom)" },
                { label: "Auto-Invoicing", value: settings.autoInvoicing ? "Active" : "Disabled" },
                { label: "WhatsApp Auto-Send", value: settings.whatsappAutoSend ? "Active" : "Disabled" },
                { label: "Email Auto-Send", value: settings.emailAutoSend ? "Active" : "Disabled" },
                { label: "Callback Scheduler", value: settings.callbackScheduler ? "Enabled" : "Disabled" },
                { label: "Export Industry Mode", value: settings.industryMode || "Export Licensing" }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/40">
                  <span className="text-muted-foreground text-[10px]">{stat.label}</span>
                  <span className="font-semibold text-foreground text-[10px] text-right ml-2">{stat.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Pending Lead Opportunities */}
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-chart-2"><Award size={14}/> High Conversion Targets</h3>
            <div className="space-y-2">
              {hotOpportunities.map(opp => (
                <div key={opp.id} className="p-2.5 rounded-lg bg-secondary/35 border border-border/40 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-foreground block leading-tight">{opp.name}</span>
                    <span className="text-[9px] text-muted-foreground">{opp.company} · Score: <strong className="text-chart-4">{opp.leadScore ?? 85}</strong></span>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-6.5 text-[9px] gap-1 px-2.5"
                    onClick={() => triggerOutboundCall(opp.id)}
                  >
                    <PhoneCall size={10} /> Call
                  </Button>
                </div>
              ))}

              {hotOpportunities.length === 0 && (
                <div className="py-6 text-center text-[10px] text-muted-foreground leading-normal">
                  No priority targets. Fill the Exporter database with Hot leads to coordinate outreach suggestions.
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Middle Column: Active Conversation Feed */}
        <motion.div
          className="lg:col-span-2 h-[450px] flex flex-col justify-between"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GlassCard className="flex-1 flex flex-col overflow-hidden relative p-0">
            {activeCall ? (
              <AssistantDialer />
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8 text-muted-foreground/50">
                <div className="flex flex-col items-center gap-3">
                  <Bot size={32} className="opacity-20" />
                  <p className="text-xs">No active calls in progress.<br/>System standing by.</p>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>

      </div>

      {/* Suggestion Alerts (Bottom row) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-left">
        {suggestions.map((sug) => (
          <GlassCard key={sug.id} className="p-3.5 bg-secondary/20 border border-border/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-md" />
            <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={13} className="text-primary" />
              <h4 className="text-xs font-bold text-foreground">{sug.title}</h4>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">{sug.desc}</p>
          </GlassCard>
        ))}
      </div>
    </PageContainer>
  );
}
