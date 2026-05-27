"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCrm } from "@/hooks/useCrm";
import { 
  Calendar, Clock, CheckCircle2, Circle, AlertCircle, CalendarCheck,
  PhoneCall, Mail, User, Search, X, CheckSquare, Plus, Info, MessageSquare, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";

const priorityColors: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Low: "bg-secondary text-muted-foreground border-border",
};

export default function FollowUpsPage() {
  const { followups, updateFollowupStatus, addFollowup, triggerOutboundCall, customers } = useCrm();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Manual scheduling modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(1);
  const [followupType, setFollowupType] = useState<"Call" | "WhatsApp" | "Email">("Call");
  const [followupPriority, setFollowupPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [followupTime, setFollowupTime] = useState("");
  const [followupNotes, setFollowupNotes] = useState("");
  const [followupCategory, setFollowupCategory] = useState<"callback" | "invoice_reminder" | "doc_reminder">("callback");

  // Filtering follow-ups
  const filteredTasks = followups
    .filter((task) => {
      if (activeTab === "all") return true;
      if (activeTab === "today") return task.status === "Pending" && task.time.toLowerCase().includes("today");
      if (activeTab === "missed") return task.status === "Missed" || task.time.toLowerCase().includes("overdue");
      if (activeTab === "invoices") return task.category === "invoice_reminder" && task.status !== "Completed";
      if (activeTab === "documents") return task.category === "doc_reminder" && task.status !== "Completed";
      if (activeTab === "scheduled") return task.status === "Scheduled";
      return task.status === "Completed";
    })
    .filter((task) => {
      const matchText = search.toLowerCase();
      return task.customerName.toLowerCase().includes(matchText) ||
        task.company.toLowerCase().includes(matchText) ||
        task.aiNotes.toLowerCase().includes(matchText);
    });

  const handleToggle = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    await updateFollowupStatus(id, nextStatus);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === selectedCustomerId);
    if (!cust) return;

    await addFollowup({
      customerId: selectedCustomerId,
      customerName: cust.name,
      company: cust.company,
      time: followupTime || "Today, 5:30 PM",
      type: followupType,
      priority: followupPriority,
      aiNotes: followupNotes || `Filing checklist coordination details.`,
      status: "Pending",
      category: followupCategory
    });

    setShowAddModal(false);
    setFollowupTime("");
    setFollowupNotes("");
  };

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
          <h1 className="text-xl font-bold tracking-tight">Follow-up Operations System</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Manage callback schedules, document checklist requests, and invoice notifications.
          </p>
        </div>
        <Button size="sm" className="text-[12px] gap-1.5" onClick={() => setShowAddModal(true)}>
          <CalendarCheck size={14} /> Schedule Follow-up
        </Button>
      </motion.div>

      {/* Statistics board / Tabs list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation / Filter Sidebar */}
        <motion.div 
          className="lg:col-span-1 space-y-4 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard className="p-3">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-2 flex items-center gap-1.5"><Calendar size={13}/> Task Categories</h3>
            <nav className="space-y-1">
              {[
                { id: "all", label: "All Active Tasks", count: followups.filter(f => f.status !== "Completed").length },
                { id: "today", label: "Today Callbacks", count: followups.filter(f => f.status === "Pending" && f.time.toLowerCase().includes("today")).length },
                { id: "missed", label: "Missed Callbacks", count: followups.filter(f => f.status === "Missed" || f.time.toLowerCase().includes("overdue")).length },
                { id: "invoices", label: "Invoice Reminders", count: followups.filter(f => f.category === "invoice_reminder" && f.status !== "Completed").length },
                { id: "documents", label: "WhatsApp Checklists", count: followups.filter(f => f.category === "doc_reminder" && f.status !== "Completed").length },
                { id: "scheduled", label: "Future Callbacks", count: followups.filter(f => f.status === "Scheduled").length },
                { id: "completed", label: "Completed Archive", count: followups.filter(f => f.status === "Completed").length }
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    <Badge variant="outline" className={`text-[9px] px-1.5 h-4.5 ${isActive ? "border-primary/20 bg-primary/5 text-primary" : "border-border bg-secondary"}`}>
                      {item.count}
                    </Badge>
                  </button>
                );
              })}
            </nav>
          </GlassCard>

          {/* AI Helper context */}
          <GlassCard className="p-4 bg-primary/5 border-primary/10">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1"><Info size={12}/> Callback Intelligence</h3>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Outbound AI trunks automatically call exporters on callback dates. If speech keywords indicate delay preferences (e.g. <i>"6 months later follow-up"</i>), AI logs a Future Callback.
            </p>
          </GlassCard>
        </motion.div>

        {/* Task lists container */}
        <div className="lg:col-span-3">
          <GlassCard className="h-full flex flex-col justify-between">
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/10">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] h-5 bg-secondary text-foreground uppercase tracking-wider font-bold">
                    {activeTab} Queue
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">({filteredTasks.length} items found)</span>
                </div>
                
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-secondary/50 border border-border">
                  <Search size={12} className="text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search callbacks, notes..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-[11px] outline-none w-36 focus:w-48 transition-all"
                  />
                </div>
              </div>

              {/* Checklist loops */}
              <div className="p-2 space-y-1">
                {filteredTasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border/40"
                  >
                    {/* Toggle button */}
                    <button 
                      onClick={() => handleToggle(task.id, task.status)}
                      className="mt-1 flex-shrink-0 text-muted-foreground hover:text-chart-2 transition-colors"
                    >
                      {task.status === "Completed" ? (
                        <CheckSquare size={17} className="text-chart-2" />
                      ) : (
                        <Circle size={17} />
                      )}
                    </button>

                    {/* Task Info */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-7.5 w-7.5 flex-shrink-0">
                            <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                              {task.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">{task.customerName}</span>
                            <span className="text-[9px] text-muted-foreground truncate block">{task.company}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className={`text-[8px] h-4.5 px-1.5 ${priorityColors[task.priority]}`}>
                            {task.priority} Priority
                          </Badge>
                          <Badge variant="outline" className={`text-[8px] h-4.5 px-1.5 flex items-center gap-0.5 ${
                            task.status === "Missed" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-secondary text-muted-foreground"
                          }`}>
                            <Clock size={9} />
                            {task.time}
                          </Badge>
                        </div>
                      </div>

                      <div className="pl-9">
                        <p className="text-xs text-foreground/80 mb-2 leading-relaxed">"{task.aiNotes}"</p>
                        
                        {/* Direct operational actions */}
                        {task.status !== "Completed" && (
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              size="sm" 
                              className="h-6.5 text-[9px] gap-1 px-3"
                              onClick={() => triggerOutboundCall(task.customerId)}
                            >
                              <PhoneCall size={10} /> Call Exporter
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6.5 text-[9px] px-2 text-muted-foreground"
                              onClick={() => handleToggle(task.id, task.status)}
                            >
                              Mark Done
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="py-16 text-center text-xs text-muted-foreground flex flex-col items-center justify-center">
                    <Calendar size={32} className="text-primary mb-3 opacity-50" />
                    <span className="font-bold text-foreground mb-1">No Follow-ups Scheduled</span>
                    <span className="max-w-xs text-muted-foreground leading-normal mt-0.5">
                      {followups.length === 0 
                        ? "You have no scheduled follow-ups. Register exporters and initiate AI outbound dials to auto-schedule callbacks."
                        : "No active follow-ups match this status selection filter."}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* SCHEDULE MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
            <motion.div className="relative w-full max-w-md glass rounded-2xl border border-border/50 p-5 glow-border" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold flex items-center gap-1.5"><CalendarCheck size={14} /> Schedule Follow-up</h3>
                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Select Exporter</label>
                  <select 
                    value={selectedCustomerId} 
                    onChange={(e: any) => setSelectedCustomerId(parseInt(e.target.value) || 1)}
                    className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Channel</label>
                    <select value={followupType} onChange={(e: any) => setFollowupType(e.target.value)} className="w-full bg-secondary/50 border border-border/80 text-xs p-1 rounded-md">
                      <option value="Call">Call</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Category</label>
                    <select value={followupCategory} onChange={(e: any) => setFollowupCategory(e.target.value as any)} className="w-full bg-secondary/50 border border-border/80 text-xs p-1 rounded-md">
                      <option value="callback">Callback</option>
                      <option value="invoice_reminder">Billing Check</option>
                      <option value="doc_reminder">Document Rem.</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Priority</label>
                    <select value={followupPriority} onChange={(e: any) => setFollowupPriority(e.target.value)} className="w-full bg-secondary/50 border border-border/80 text-xs p-1 rounded-md">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Time Target</label>
                  <Input required placeholder="Today, 5:30 PM (or '10 days delay')" value={followupTime} onChange={(e) => setFollowupTime(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Notes for AI trunk dialer</label>
                  <textarea value={followupNotes} onChange={(e) => setFollowupNotes(e.target.value)} placeholder="Discuss Spices Board cardamom license status..." className="w-full bg-secondary/40 border border-border text-xs p-2.5 rounded-xl h-18 resize-none focus:outline-none" />
                </div>
                <Button type="submit" className="w-full text-xs h-9 mt-2">Schedule Task</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
