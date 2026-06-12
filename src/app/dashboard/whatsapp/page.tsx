"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MessageSquare, Send, CheckCheck, RefreshCw, Smartphone, ListTodo, Bot, Star } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCRMStore } from "@/store/crmStore";

export default function WhatsAppHubPage() {
  const customers = useCRMStore((s) => s.customers ?? []);
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const fetchLogs = () => {
    setLoadingLogs(true);
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        const whatsappLogs: any[] = [];
        data.forEach((convo: any) => {
          if (convo.channel === "whatsapp") {
            const custName = convo.exporterId?.name || "Unknown Exporter";
            (convo.messages || []).forEach((msg: any) => {
              whatsappLogs.push({
                time: new Date(msg.time).toLocaleString(),
                recipient: custName,
                text: msg.text
              });
            });
          }
        });
        setLogs(whatsappLogs);
        setLoadingLogs(false);
      })
      .catch(() => {
        setLogs([]);
        setLoadingLogs(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const templates = [
    { name: "Teleglish Rate Update", text: "నమస్కారం {name}, current setup rate for {license} is ₹{rate}. Direct setup completes in 10 working days. Click to confirm." },
    { name: "Document Request", text: "Dear {name}, details for {license} require: (1) IEC code, (2) Pan Card copy. Please upload to coordinates page." },
    { name: "Payment Link Reminder", text: "నమస్కారం {name}, your invoice for {license} setup is pending. Amount: ₹{amount}. Link: http://voxai.in/pay/link" }
  ];

  // Dynamic campaigns based on database stats
  const hotOrWarmCount = customers.filter((c) => c.status === "Hot" || c.status === "Warm").length;
  const apedaCount = customers.filter((c) => String(c.licenseType).toUpperCase().includes("APEDA")).length;
  const spicesCount = customers.filter((c) => String(c.licenseType).toUpperCase().includes("SPICES")).length;

  const campaigns = [
    { id: "c-1", name: "Weekly Market Rate Dispatch", status: hotOrWarmCount > 0 ? "Active" : "Idle", sent: hotOrWarmCount, readRate: hotOrWarmCount > 0 ? "100%" : "0%", replies: 0, category: "Campaign" },
    { id: "c-2", name: "APEDA Document Checklist Auto-request", status: apedaCount > 0 ? "Active" : "Idle", sent: apedaCount, readRate: apedaCount > 0 ? "100%" : "0%", replies: 0, category: "Auto-trigger" },
    { id: "c-3", name: "Spices Board Payment Invoice Links", status: spicesCount > 0 ? "Active" : "Idle", sent: spicesCount, readRate: spicesCount > 0 ? "100%" : "0%", replies: 0, category: "Campaign" },
  ];

  return (
    <PageContainer>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">WhatsApp Hub Hub</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Configure automated WhatsApp notification campaigns, manage templates and audit outbound messaging logs.
          </p>
        </div>
        <div>
          <Button onClick={fetchLogs} variant="outline" size="sm" className="text-xs gap-1.5">
            <RefreshCw size={12} className={loadingLogs ? "animate-spin" : ""} /> Refresh Logs
          </Button>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
        {[
          { label: "Total Sent Messages", value: `${logs.length} messages`, color: "text-primary" },
          { label: "Read Confirmation Rate", value: logs.length > 0 ? "100% Avg" : "0.0% Avg", color: "text-emerald-400" },
          { label: "Interactive Reply Rate", value: "0.0% Responses", color: "text-chart-4" }
        ].map((m, idx) => (
          <GlassCard key={idx} className="p-4 border-b-2 border-b-primary/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{m.label}</span>
            <p className={`text-lg font-black mt-1 ${m.color}`}>{m.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left Column: Active Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5"><ListTodo size={14}/> Active Dispatch Campaigns</h3>
            <div className="space-y-3">
              {campaigns.map(camp => (
                <div key={camp.id} className="p-3.5 rounded-xl bg-secondary/35 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[8px] bg-secondary text-primary font-bold">{camp.category}</Badge>
                      <h4 className="font-bold text-xs text-foreground">{camp.name}</h4>
                    </div>
                    <div className="flex gap-4 text-[10px] text-muted-foreground mt-1.5 font-medium">
                      <span>Sent: <strong>{camp.sent}</strong></span>
                      <span>Read Rate: <strong>{camp.readRate}</strong></span>
                      <span>Replies: <strong>{camp.replies}</strong></span>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[8px] h-4.5 px-2 font-bold ${
                    camp.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                  }`}>
                    {camp.status}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Dispatch Logs */}
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5"><CheckCheck size={14} className="text-emerald-400"/> Outgoing Messages Dispatch Log</h3>
            <div className="space-y-3.5 text-xs">
              {loadingLogs ? (
                <div className="py-4 text-center text-muted-foreground animate-pulse">Loading logs...</div>
              ) : logs.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground">No outgoing messages dispatched yet.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="p-3 bg-secondary/25 border border-border/30 rounded-xl">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        <Smartphone size={12} className="text-muted-foreground" /> {log.recipient}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{log.time}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed italic">"{log.text}"</p>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Template Bank */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-primary"><Bot size={14}/> Teleglish Templates</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
              Select and preview quick template structures used by AI triggers.
            </p>

            <div className="space-y-2 mb-6">
              {templates.map((tpl, idx) => {
                const isSelected = activeTemplate === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveTemplate(idx)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected ? "border-primary bg-primary/5 text-primary" : "border-border/50 bg-secondary/20 hover:border-border text-foreground"
                    }`}
                  >
                    <span className="text-xs font-bold block">{tpl.name}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-secondary/35 border border-border/50 min-h-28 text-left">
              <span className="text-[8px] uppercase tracking-wider font-bold text-muted-foreground block mb-2">Template Preview</span>
              <p className="text-[11px] text-foreground leading-relaxed italic">
                "{templates[activeTemplate].text}"
              </p>
            </div>
          </GlassCard>
        </div>

      </div>
    </PageContainer>
  );
}
