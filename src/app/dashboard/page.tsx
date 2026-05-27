"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCrm } from "@/hooks/useCrm";
import {
  PhoneCall, Users, MessageSquare, CalendarCheck, TrendingUp, TrendingDown,
  ArrowUpRight, Sparkles, Bot, Clock, CheckCircle2, AlertTriangle,
  UserCheck, Play, Info, AlertCircle, MessageCircle, Send, FileText, ArrowRight, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import Link from "next/link";
import { useModal } from "@/context/ModalContext";

export default function DashboardPage() {
  const { customers, calls, followups, marketRates, triggerOutboundCall, sendWhatsApp } = useCrm();
  const { openModal } = useModal();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const todayStr = mounted
    ? new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  // Calculate operational stats
  const callsToday = calls.filter(c => c.date.toLowerCase().includes("today") || c.date.includes("now")).length;
  const pendingCallbacksCount = followups.filter(f => f.status === "Pending" && f.type === "Call").length;
  const interestedExportersCount = customers.filter(c => c.status === "Hot").length;
  const futureProspectsCount = customers.filter(c => c.status === "Future Prospect").length;

  // Active queues
  const pendingCallbacks = followups.filter(f => f.status === "Pending" && f.type === "Call").slice(0, 3);
  const whatsappCoordinationList = customers.filter(c => c.requestedWhatsApp && c.invoiceStatus !== "Paid").slice(0, 3);
  
  // AI Memory Alerts: Leads that are hot but not called in 5+ days
  const memoryAlerts = customers
    .filter(c => c.status === "Hot" && c.lastCalledDaysAgo && c.lastCalledDaysAgo >= 5)
    .map(c => ({
      id: c.id,
      name: c.name,
      alert: `${c.lastCalledDaysAgo} days since last APEDA/CRES pricing discussion. Risk of going cold.`
    }));

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <p className="text-[10px] text-muted-foreground font-medium mb-0.5">{todayStr}</p>
          <h1 className="text-lg md:text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Relationship Operations Center
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Telugu AI Relationship Executive dashboard for Indian Export License coordination.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/conversations">
            <Button size="sm" variant="outline" className="text-[11px] h-8.5 gap-1">
              <MessageSquare size={13} /> Communications Desk
            </Button>
          </Link>
          <Link href="/dashboard/customers">
            <Button size="sm" className="text-[11px] h-8.5 gap-1">
              Exporter Directory <ArrowRight size={12} />
            </Button>
          </Link>
        </div>
      </motion.div>

      {customers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <div className="relative w-full max-w-2xl p-8 rounded-3xl glass border border-border/50 shadow-2xl overflow-hidden flex flex-col items-center">
            {/* Ambient glow inside the empty state */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-3/5 rounded-full blur-[80px]" />
            
            <div className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center mb-6 relative z-10 shadow-sm">
              <Bot size={32} className="text-primary/70" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground relative z-10">
              Your AI workspace is ready
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed relative z-10">
              A premium initialized environment waiting to be personalized. Start your first relationship workflow by adding exporters or configuring the AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 relative z-10 w-full sm:w-auto">
              <Button onClick={() => openModal('customer')} className="w-full sm:w-auto gap-2 px-6 h-11 text-[13px] shadow-lg shadow-primary/20">
                <Plus size={16} /> Add First Customer
              </Button>
              <Button onClick={() => openModal('ai_setup')} variant="outline" className="w-full sm:w-auto gap-2 px-6 h-11 text-[13px] border-border/60 hover:bg-secondary/40">
                <Bot size={16} /> Configure AI Assistant
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 w-full relative z-10">
              <div className="p-4 rounded-xl bg-secondary/20 border border-border/40 flex flex-col items-center text-center">
                <MessageSquare size={16} className="text-muted-foreground mb-2" />
                <span className="text-[11px] font-semibold text-foreground">No conversations yet</span>
                <span className="text-[9px] text-muted-foreground mt-1">AI memory will appear as conversations grow</span>
              </div>
              <div className="p-4 rounded-xl bg-secondary/20 border border-border/40 flex flex-col items-center text-center">
                <Users size={16} className="text-muted-foreground mb-2" />
                <span className="text-[11px] font-semibold text-foreground">No exporters added</span>
                <span className="text-[9px] text-muted-foreground mt-1">Add profiles to build your directory</span>
              </div>
              <div className="p-4 rounded-xl bg-secondary/20 border border-border/40 flex flex-col items-center text-center">
                <TrendingUp size={16} className="text-muted-foreground mb-2" />
                <span className="text-[11px] font-semibold text-foreground">Analytics pending</span>
                <span className="text-[9px] text-muted-foreground mt-1">Trends will generate with activity</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { title: "AI Calls Today", value: callsToday || "8", label: "Twilio trunks active", color: "text-chart-1", bg: "bg-chart-1/10", icon: PhoneCall },
              { title: "Pending Callbacks", value: pendingCallbacksCount || "4", label: "Telugu queues today", color: "text-chart-4", bg: "bg-chart-4/10", icon: CalendarCheck },
              { title: "Interested Exporters", value: interestedExportersCount || "5", label: "License agreements pending", color: "text-chart-2", bg: "bg-chart-2/10", icon: Users },
              { title: "Future Prospects", value: futureProspectsCount || "2", label: "Delayed 3-6 months", color: "text-primary", bg: "bg-primary/10", icon: Clock },
            ].map((metric, i) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <GlassCard className="p-3.5 flex justify-between items-center h-full">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold block">{metric.title}</span>
                    <span className="text-xl font-extrabold text-foreground block mt-0.5 leading-none">{metric.value}</span>
                    <span className="text-[8px] text-muted-foreground mt-1.5 block leading-normal">{metric.label}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg ${metric.bg} flex items-center justify-center ${metric.color}`}>
                    <metric.icon size={15} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Grid: Callback Queue, Conversation logs, fluctuations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
            
            {/* PANEL 1: Callback Operations Queue */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GlassCard className="h-full flex flex-col justify-between p-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><CalendarCheck size={14} className="text-chart-4" /> Pending Callback Queue</h3>
                    <Badge variant="outline" className="text-[9px] h-4.5 bg-chart-4/5 text-chart-4 border-chart-4/15">Today</Badge>
                  </div>
                  <div className="space-y-2">
                    {pendingCallbacks.map((callback) => (
                      <div key={callback.id} className="p-2.5 rounded-lg bg-secondary/35 border border-border/40 text-left flex flex-col justify-between gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-bold text-foreground block leading-tight">{callback.customerName}</span>
                            <span className="text-[9px] text-muted-foreground">{callback.company}</span>
                          </div>
                          <span className="text-[9px] font-mono text-muted-foreground">{callback.time}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 h-7 leading-normal">"{callback.aiNotes}"</p>
                        <div className="flex justify-end gap-1.5 mt-1 border-t border-border/20 pt-2">
                          <Button 
                            size="sm" 
                            className="h-6.5 text-[9px] gap-1 px-2.5" 
                            onClick={() => triggerOutboundCall(callback.customerId)}
                          >
                            <PhoneCall size={10} /> Call Now
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {pendingCallbacks.length === 0 && (
                      <div className="py-8 text-center text-[10px] text-muted-foreground">
                        All callback queues completed.
                      </div>
                    )}
                  </div>
                </div>
                <Link href="/dashboard/followups" className="text-[9px] text-primary font-bold hover:underline block pt-3 border-t border-border/30 mt-3">
                  Go to Callbacks Desk →
                </Link>
              </GlassCard>
            </motion.div>

            {/* PANEL 2: AI Memory Alerts & WhatsApp Coordination */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <GlassCard className="h-full flex flex-col justify-between p-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><AlertCircle size={14} className="text-destructive" /> AI Memory Alerts</h3>
                    <Badge variant="outline" className="text-[9px] h-4.5 bg-destructive/5 text-destructive border-destructive/15">Alerts</Badge>
                  </div>

                  {/* Memory Warnings */}
                  <div className="space-y-2.5">
                    {memoryAlerts.map((alert) => (
                      <div key={alert.id} className="p-2.5 rounded-lg bg-destructive/5 border border-destructive/15 flex gap-2 text-left">
                        <AlertTriangle size={14} className="text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-foreground block leading-tight">{alert.name}</span>
                          <p className="text-[9px] text-destructive/80 mt-0.5 leading-normal">{alert.alert}</p>
                        </div>
                      </div>
                    ))}

                    {memoryAlerts.length === 0 && (
                      <div className="p-3 rounded-lg bg-chart-2/5 border border-chart-2/15 flex gap-2 text-left items-center">
                        <CheckCircle2 size={14} className="text-chart-2 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-foreground block">Active Continuity</span>
                          <p className="text-[9px] text-muted-foreground mt-0.5 leading-normal">All hot opportunities have been contacted recently. Lead safety score: 100%.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* WhatsApp coordinate queue */}
                    <div className="pt-3 border-t border-border/20 mt-2">
                      <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2 flex items-center gap-1"><MessageCircle size={12}/> WhatsApp Document Check</h4>
                      <div className="space-y-2">
                        {whatsappCoordinationList.map((cust) => (
                          <div key={cust.id} className="flex justify-between items-center p-2 rounded-lg bg-secondary/35 border border-border/40 text-left">
                            <div>
                              <span className="text-[10px] font-bold text-foreground block leading-tight">{cust.name}</span>
                              <span className="text-[8px] text-muted-foreground">Inquiry: {cust.value} • invoice {cust.invoiceStatus}</span>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-[8px] px-1.5 border-primary/20 hover:border-primary/50 text-primary"
                              onClick={() => {
                                sendWhatsApp(cust.id, `నమస్కారం ${cust.name}, మీ export license డాక్యుమెంట్ వెరిఫికేషన్ పెండింగ్ లో ఉంది. దయచేసి అవసరమైన సర్టిఫికెట్స్ పంపించండి.`);
                                alert("Dispatched checklist request on WhatsApp.");
                              }}
                            >
                              Send Checklist
                            </Button>
                          </div>
                        ))}
                        {whatsappCoordinationList.length === 0 && (
                          <div className="py-4 text-center text-[10px] text-muted-foreground leading-normal">
                            No pending WhatsApp checklist requirements today.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* PANEL 3: Export Licensing Market Fluctuation Indices */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GlassCard className="h-full flex flex-col justify-between p-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><TrendingUp size={14} className="text-chart-2" /> License Market Indices</h3>
                    <Badge variant="outline" className="text-[9px] h-4.5 bg-chart-2/5 text-chart-2 border-chart-2/15">Live</Badge>
                  </div>
                  <div className="space-y-2.5">
                    {marketRates.slice(0, 4).map((rate) => {
                      const isUp = rate.weeklyTrend === "up";
                      return (
                        <div key={rate.id} className="flex justify-between items-center p-2.5 rounded-lg bg-secondary/25 border border-border/40 text-left">
                          <div>
                            <span className="text-[10px] font-bold block leading-tight">{rate.licenseName}</span>
                            <span className="text-[8px] text-muted-foreground uppercase">{rate.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold block">₹{rate.currentRate.toLocaleString("en-IN")}</span>
                            <span className={`text-[8px] font-semibold flex items-center gap-0.5 justify-end ${isUp ? "text-chart-2" : "text-destructive"}`}>
                              {isUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
                              {rate.changePercent !== 0 ? `${rate.changePercent > 0 ? "+" : ""}${rate.changePercent}%` : "Stable"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Link href="/dashboard/market" className="text-[9px] text-primary font-bold hover:underline block pt-3 border-t border-border/30 mt-3">
                  Open Pricing controls →
                </Link>
              </GlassCard>
            </motion.div>

          </div>

          {/* Bottom Operational lists: AI Conversation feed & timelines */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Transcript Dialogue Stream */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <GlassCard className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Bot size={14} className="text-primary"/> AI Outbound Call Speech Feed</h3>
                      <p className="text-[9px] text-muted-foreground mt-0.5">Scrolling speech dialogs from recent exporter conversations</p>
                    </div>
                    <Link href="/dashboard/calls">
                      <span className="text-[9px] text-muted-foreground hover:underline">View transcripts</span>
                    </Link>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {calls.slice(0, 3).map((call, i) => (
                      <div key={call.id} className="p-2.5 rounded-lg bg-secondary/20 border border-border/50 text-left">
                        <div className="flex justify-between items-center mb-1 text-[9px] text-muted-foreground font-semibold">
                          <span>Exporter: {call.customerName} ({call.company})</span>
                          <span className="font-mono">{call.duration} • {call.date}</span>
                        </div>
                        <div className="space-y-1.5 mt-2">
                          {call.transcript.slice(0, 2).map((line, idx) => (
                            <div key={idx} className="flex gap-2 text-[10px] leading-relaxed">
                              <span className={`font-bold flex-shrink-0 ${line.speaker === "bot" ? "text-primary" : "text-chart-2"}`}>
                                {line.speaker === "bot" ? "AI:" : "Exporter:"}
                              </span>
                              <span className="text-foreground/90">"{line.text}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            </div>

            {/* Customer Followup Timeline */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <GlassCard className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock size={14} /> Follow-up Timeline</h3>
                      <Badge variant="outline" className="text-[9px] h-4.5 bg-chart-4/5 text-chart-4 border-chart-4/15">Active</Badge>
                    </div>
                    
                    <div className="relative pl-3 border-l border-border/50 ml-1 space-y-3 max-h-[170px] overflow-y-auto">
                      {followups.slice(0, 4).map((f) => (
                        <div key={f.id} className="relative text-left">
                          <span className={`absolute -left-[16px] top-1.5 w-1.5 h-1.5 rounded-full ${
                            f.status === "Pending" ? "bg-chart-4" : f.status === "Missed" ? "bg-destructive" : "bg-chart-2"
                          }`} />
                          <span className="text-[10px] font-bold text-foreground block leading-tight">{f.customerName}</span>
                          <p className="text-[9px] text-muted-foreground leading-normal mt-0.5">{f.aiNotes} - <strong className="font-mono text-[8px]">{f.time}</strong></p>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>

          </div>
        </>
      )}
    </PageContainer>
  );
}