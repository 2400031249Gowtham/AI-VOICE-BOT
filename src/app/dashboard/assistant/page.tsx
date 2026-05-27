"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useCrm } from "@/hooks/useCrm";
import { 
  Bot, Mic, MicOff, Settings2, Play, Square, Settings, Volume2, 
  MessageSquare, User, Sparkles, Languages, AlertTriangle, ShieldCheck, Activity, Award, PhoneCall
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";

export default function AssistantPage() {
  const { activeCall, settings, customers, triggerOutboundCall } = useCrm();
  const [messages, setMessages] = useState<{ speaker: string; text: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync with active call transcript if it is running
  useEffect(() => {
    if (activeCall) {
      setMessages(activeCall.transcript);
    } else {
      setMessages([
        { speaker: "bot", text: "Namaskaram! I am VoxAI Telugu Representative. Twilio trunks are active and idle." }
      ]);
    }
  }, [activeCall?.transcript, activeCall]);

  // Keep chat transcript scrolled to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Filter hot opportunities
  const hotOpportunities = customers.filter(c => c.status === "Hot" && c.leadScore >= 85);

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
                { label: "Audio Latency", value: "142ms" },
                { label: "Neural Accent Weight", value: `${(settings.teluguAccentWeight * 100).toFixed(0)}% Telugu Bias` },
                { label: "EleventLabs Voice profile", value: "Priya (Vijayawada Custom)" },
                { label: "Auto-Invoicing", value: settings.autoInvoicing ? "Active" : "Disabled" }
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/40">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">{stat.value}</span>
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
                    <span className="text-[9px] text-muted-foreground">{opp.company}</span>
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
            {/* Header */}
            <div className="p-3.5 border-b border-border/50 flex items-center justify-between bg-card/45">
              <div className="flex items-center gap-2 text-left">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Bot size={14} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xs font-bold">Active speech monitoring</h3>
                  <p className="text-[9px] text-muted-foreground">Monitor Twilio speech synthesis stream in real-time</p>
                </div>
              </div>
              
              <Badge variant="outline" className={`text-[9px] px-2 h-5 gap-1 ${
                activeCall ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse" : "bg-secondary text-muted-foreground"
              }`}>
                {activeCall ? "Trunk Busy" : "Trunk Idle"}
              </Badge>
            </div>

            {/* Scrolling transcript bubbles */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-normal">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-2.5 ${msg.speaker === "user" ? "flex-row-reverse text-right" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.speaker === "bot" 
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_12px_rgba(120,119,255,0.1)]" 
                      : "bg-secondary border border-border"
                  }`}>
                    {msg.speaker === "bot" ? <Bot size={12} /> : <User size={12} />}
                  </div>
                  <div className={`max-w-[80%] p-2.5 rounded-2xl ${
                    msg.speaker === "bot"
                      ? "bg-secondary/40 border border-border rounded-tl-sm text-foreground"
                      : "bg-primary text-primary-foreground rounded-tr-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {activeCall && activeCall.status === "connected" && activeCall.transcript.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-[10px] animate-pulse">
                  Establishing secure audio stream to exporter...
                </div>
              )}
            </div>

            {/* Footer indicators */}
            <div className="p-3 bg-secondary/15 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Volume2 size={12}/> Audio stream output: Priya Neural Voice</span>
              <span className="font-mono">{activeCall ? `Duration: ${activeCall.duration}s` : "Trunk: Channel 1 Idle"}</span>
            </div>
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
