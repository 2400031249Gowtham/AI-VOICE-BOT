"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useCrm } from "@/hooks/useCrm";
import { Customer } from "@/types";
import { CustomerCard } from "@/crm/CustomerCard";
import { MemoryTimeline } from "@/crm/MemoryTimeline";
import { ChatPanel } from "@/whatsapp/ChatPanel";
import {
  Search, Plus, X, PhoneCall, CalendarCheck, Sparkles, CheckCircle2,
  Mail, Clock, ShieldCheck, FileText, SendHorizontal, Info, Play, Pause, Bot, User,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";

const statusColors: Record<string, string> = {
  Hot: "bg-destructive/10 text-destructive border-destructive/20",
  Warm: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Cold: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Converted: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Future Prospect": "bg-primary/10 text-primary border-primary/20",
};

export default function CustomersPage() {
  const { 
    customers, addCustomer, activeCall, triggerOutboundCall, terminateCall,
    sendWhatsApp, sendEmail, addFollowup
  } = useCrm();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // New Exporter Lead Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustEmail, setNewCustEmail] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newCustCompany, setNewCustCompany] = useState("");
  const [newCustLocation, setNewCustLocation] = useState("");
  const [newCustStatus, setNewCustStatus] = useState<"Hot" | "Warm" | "Cold" | "Future Prospect">("Warm");
  const [newCustInterest, setNewCustInterest] = useState<"High" | "Medium" | "Low">("Medium");

  // Selected customer states
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerTimeline, setCustomerTimeline] = useState<any[]>([]);
  const [customerMessages, setCustomerMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Follow-up Scheduling states
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [followupType, setFollowupType] = useState<"Call" | "Email" | "WhatsApp">("Call");
  const [followupPriority, setFollowupPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [followupNotes, setFollowupNotes] = useState("");
  const [followupTime, setFollowupTime] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync selected customer
  useEffect(() => {
    if (selectedCustomerId !== null) {
      const cust = customers.find(c => c.id === selectedCustomerId);
      if (cust) {
        setSelectedCustomer(cust);
        
        // Fetch timeline and messages from service layer
        import("@/services/customerService").then(({ customerService }) => {
          customerService.getTimeline(cust.id).then(setCustomerTimeline);
          customerService.getMessages(cust.id).then(setCustomerMessages);
        });
      }
    } else {
      setSelectedCustomer(null);
      setCustomerTimeline([]);
      setCustomerMessages([]);
    }
  }, [selectedCustomerId, customers]);

  // Chat scroll ticker
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeCall?.transcript]);

  const handleAddExporterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isHot = newCustStatus === "Hot";
    const val = isHot ? "₹45,000" : newCustStatus === "Warm" ? "₹22,000" : "₹0";
    
    await addCustomer({
      name: newCustName,
      email: newCustEmail,
      phone: newCustPhone,
      company: newCustCompany,
      location: newCustLocation,
      status: newCustStatus,
      interestLevel: newCustInterest,
      preferredLanguage: "Telugu",
      value: val,
      leadScore: isHot ? 90 : 65,
      lastInteractionSummary: "New exporter lead captured manually."
    });

    // Reset Form
    setNewCustName("");
    setNewCustEmail("");
    setNewCustPhone("");
    setNewCustCompany("");
    setNewCustLocation("");
    setShowAddForm(false);
  };

  const handleSendWhatsAppMessage = async (content: string) => {
    if (!selectedCustomer) return;
    await sendWhatsApp(selectedCustomer.id, content);
    
    // Refresh messages timeline
    const { customerService } = await import("@/services/customerService");
    const msgs = await customerService.getMessages(selectedCustomer.id);
    setCustomerMessages(msgs);
  };

  const handleSendEmailMessage = async (subject: string, content: string) => {
    if (!selectedCustomer) return;
    await sendEmail(selectedCustomer.id, subject, content);
    
    // Refresh messages timeline
    const { customerService } = await import("@/services/customerService");
    const msgs = await customerService.getMessages(selectedCustomer.id);
    setCustomerMessages(msgs);
  };

  const handleScheduleFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    await addFollowup({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      company: selectedCustomer.company,
      time: followupTime || "Next Monday, 11:00 AM",
      type: followupType,
      priority: followupPriority,
      aiNotes: followupNotes || "Verify APEDA doc uploads with exporter.",
      status: "Pending"
    });

    setShowFollowupForm(false);
    setFollowupTime("");
    setFollowupNotes("");
  };

  const filtered = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "All" || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="text-xl font-bold tracking-tight">Exporter Relationship Profiles</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            {customers.length} registered exporter contacts · {customers.filter(c => c.status === "Hot").length} active license negotiations in progress.
          </p>
        </div>
        <Button size="sm" className="text-[12px] gap-1.5" onClick={() => setShowAddForm(true)}>
          <Plus size={14} /> Add Exporter
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3 mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/50 border border-border focus-within:border-primary/30 transition-all">
          <Search size={14} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exporters by name, company, or city (e.g. Visakhapatnam)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {["All", "Hot", "Warm", "Cold", "Converted", "Future Prospect"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === status
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-secondary/50 text-muted-foreground border border-border hover:bg-secondary/70"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* EXPORTERS CARDS GRID */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
      >
        {filtered.map((customer) => (
          <CustomerCard 
            key={customer.id}
            customer={customer}
            onCall={triggerOutboundCall}
            onWhatsApp={(id) => { setSelectedCustomerId(id); setActiveTab("whatsapp"); }}
            onSchedule={(id) => { setSelectedCustomerId(id); setShowFollowupForm(true); }}
            onView={(id) => { setSelectedCustomerId(id); setActiveTab("overview"); }}
            onEmail={(id) => { setSelectedCustomerId(id); setActiveTab("whatsapp"); }}
          />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full mt-8">
            <GlassCard className="py-16 px-6 flex flex-col items-center justify-center text-center max-w-xl mx-auto border-dashed border-border/60">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-sm">
                <Users size={24} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1.5">No Exporter Directory Records</h3>
              <p className="text-xs text-muted-foreground leading-normal mb-8 max-w-sm">
                {customers.length === 0 
                  ? "This workspace is empty. Add your first exporter client profile to start initiating automated campaigns and tracking license progress."
                  : "No exporter records match your current search query or status filter presets."}
              </p>
              {customers.length === 0 && (
                <Button size="sm" onClick={() => setShowAddForm(true)} className="gap-1.5 px-6 h-10 text-[13px] shadow-md shadow-primary/10">
                  <Plus size={15} /> Add First Exporter
                </Button>
              )}
            </GlassCard>
          </div>
        )}
      </motion.div>

      {/* EXPORTER HUB TABS DIALOG */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedCustomerId(null)} />
            <motion.div 
              className="relative w-full max-w-2xl h-[520px] glass rounded-2xl border border-border/50 flex flex-col overflow-hidden glow-border shadow-2xl"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-card/60">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {selectedCustomer.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-sm font-bold flex items-center gap-1.5">
                    {selectedCustomer.name}
                    <Badge variant="outline" className={`text-[8px] h-4 ${statusColors[selectedCustomer.status]}`}>
                      {selectedCustomer.status}
                    </Badge>
                  </h2>
                  <p className="text-[10px] text-muted-foreground">{selectedCustomer.company} • {selectedCustomer.phone}</p>
                </div>
                
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="ml-auto w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Tabs list frame */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-secondary/20 border-b border-border/50 px-4 py-1 flex items-center justify-between">
                  <TabsList className="bg-transparent h-auto p-0 gap-1">
                    <TabsTrigger value="overview" className="text-[10px] h-7 px-3 py-1 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Profile Info</TabsTrigger>
                    <TabsTrigger value="memory" className="text-[10px] h-7 px-3 py-1 rounded-md data-[state=state=active]:bg-primary/10 data-[state=active]:text-primary">Relationship Continuity</TabsTrigger>
                    <TabsTrigger value="calls" className="text-[10px] h-7 px-3 py-1 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">AI Phone Dialer</TabsTrigger>
                    <TabsTrigger value="whatsapp" className="text-[10px] h-7 px-3 py-1 rounded-md data-[state=active]:bg-primary/10 data-[state=active]:text-primary">WhatsApp coordination</TabsTrigger>
                  </TabsList>

                  <Badge variant="outline" className="text-[9px] font-semibold bg-chart-2/5 text-chart-2 border-chart-2/20 flex items-center gap-1">
                    <ShieldCheck size={10} /> Lead Score: {selectedCustomer.leadScore}%
                  </Badge>
                </div>

                {/* Tab content panel */}
                <div className="flex-1 overflow-hidden">
                  
                  {/* OVERVIEW PANEL */}
                  <TabsContent value="overview" className="h-full overflow-y-auto p-5 m-0 space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 space-y-3.5">
                        <div>
                          <h4 className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Company background</h4>
                          <p className="text-xs bg-secondary/30 p-2.5 rounded-xl border border-border/50 leading-relaxed text-foreground/80">
                            {selectedCustomer.companyDetails || "No company information captured."}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-secondary/30 border border-border/50 rounded-xl">
                            <span className="text-[8px] text-muted-foreground uppercase block font-semibold">Exporter Email</span>
                            <span className="text-xs font-medium block truncate mt-1">{selectedCustomer.email}</span>
                          </div>
                          <div className="p-3 bg-secondary/30 border border-border/50 rounded-xl">
                            <span className="text-[8px] text-muted-foreground uppercase block font-semibold">Primary Location</span>
                            <span className="text-xs font-medium block truncate mt-1">{selectedCustomer.location}</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-1">General Notes</h4>
                          <textarea 
                            value={selectedCustomer.notes || ""} 
                            disabled
                            className="w-full text-xs bg-secondary/30 border border-border/50 p-2.5 rounded-xl text-muted-foreground h-14 resize-none focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="col-span-1 space-y-3">
                        <div className="p-3 bg-secondary/30 border border-border/50 rounded-xl text-center">
                          <span className="text-[8px] text-muted-foreground uppercase tracking-wider block font-semibold">Lead Value</span>
                          <span className="text-base font-extrabold text-primary block mt-1">{selectedCustomer.value}</span>
                        </div>
                        <div className="p-3 bg-secondary/30 border border-border/50 rounded-xl text-center">
                          <span className="text-[8px] text-muted-foreground uppercase tracking-wider block font-semibold">Total Calls</span>
                          <span className="text-base font-extrabold block mt-1">{selectedCustomer.calls}</span>
                        </div>
                        <div className="space-y-1">
                          <Button className="w-full text-[10px] h-8 gap-1" onClick={() => triggerOutboundCall(selectedCustomer.id)}>
                            <PhoneCall size={11} /> AI Outcall
                          </Button>
                          <Button variant="outline" className="w-full text-[10px] h-8 gap-1" onClick={() => setShowFollowupForm(true)}>
                            <CalendarCheck size={11} /> Callback
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* MEMORY PANEL */}
                  <TabsContent value="memory" className="h-full overflow-y-auto p-5 m-0">
                    <MemoryTimeline customer={selectedCustomer} timelineEvents={customerTimeline} />
                  </TabsContent>

                  {/* CALLS DIALER PANEL */}
                  <TabsContent value="calls" className="h-full overflow-y-auto p-5 m-0 flex flex-col justify-between">
                    {activeCall ? (
                      <div className="flex-1 flex flex-col justify-between h-full bg-secondary/15 rounded-xl border border-primary/20 overflow-hidden relative">
                        <div className="p-2.5 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                            <span className="text-[9px] font-bold uppercase tracking-wider text-primary">Twilio Trunk Active</span>
                          </div>
                          <Badge variant="outline" className="text-[8px] bg-secondary text-foreground">
                            {activeCall.status === "ringing" ? "Ringing..." : "Connected"}
                          </Badge>
                        </div>

                        <div className="flex-1 p-3.5 flex flex-col justify-between overflow-hidden">
                          <div className="text-center mb-1">
                            <h3 className="text-xs font-bold text-foreground">{activeCall.customerName}</h3>
                            <div className="text-sm font-extrabold text-primary font-mono mt-0.5">
                              {Math.floor(activeCall.duration / 60)}:{(activeCall.duration % 60).toString().padStart(2, "0")}
                            </div>
                          </div>

                          <div ref={scrollRef} className="flex-1 bg-background/50 border border-border/50 rounded-xl p-3.5 space-y-3 overflow-y-auto max-h-[140px] text-[11px] leading-normal pr-1">
                            {activeCall.transcript.map((line, idx) => (
                              <div key={idx} className={`flex items-start gap-2 ${line.speaker === "user" ? "flex-row-reverse text-right" : ""}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-semibold ${
                                  line.speaker === "bot" ? "bg-primary/10 text-primary border border-primary/20" : "bg-secondary text-muted-foreground border border-border"
                                }`}>
                                  {line.speaker === "bot" ? "AI" : "EX"}
                                </div>
                                <div className={`max-w-[85%] p-2 rounded-xl ${
                                  line.speaker === "bot" ? "bg-secondary/40 border border-border rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
                                }`}>
                                  {line.text}
                                </div>
                              </div>
                            ))}
                            
                            {activeCall.status === "connected" && activeCall.transcript.length === 0 && (
                              <div className="text-center py-2 text-[9px] text-muted-foreground animate-pulse">
                                Speech synthesis loading...
                              </div>
                            )}
                          </div>

                          {activeCall.status === "connected" && (
                            <div className="h-4 flex items-center justify-center gap-0.5 my-2.5 overflow-hidden">
                              {Array.from({ length: 40 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-0.5 bg-primary rounded-full"
                                  animate={{ height: ["15%", "85%", "15%"] }}
                                  transition={{ duration: 0.7, repeat: Infinity, delay: Math.random() * 0.4 }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="p-2.5 bg-secondary/30 border-t border-border flex justify-center">
                          <Button variant="destructive" size="sm" className="h-7.5 text-xs px-5" onClick={terminateCall}>
                            Hang Up Call
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-secondary/10 rounded-xl border border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                          <PhoneCall size={18} />
                        </div>
                        <h4 className="text-xs font-bold text-foreground">Launch Automated AI Call</h4>
                        <p className="text-[10px] text-muted-foreground max-w-sm mt-1 mb-4 leading-normal">
                          Initiate a neural Telugu-speaking voice representative to discuss custom rates and documentation parameters.
                        </p>
                        <Button size="sm" className="text-[10px] h-8.5 gap-1" onClick={() => triggerOutboundCall(selectedCustomer.id)}>
                          <PhoneCall size={11} /> Dial Exporter
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* WHATSAPP PANEL */}
                  <TabsContent value="whatsapp" className="h-full overflow-y-auto p-5 m-0">
                    <ChatPanel 
                      customer={selectedCustomer}
                      messages={customerMessages}
                      onSendMessage={handleSendWhatsAppMessage}
                    />
                  </TabsContent>

                </div>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW EXPORTER FORM MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
            <motion.div className="relative w-full max-w-md glass rounded-2xl border border-border/50 p-5 glow-border" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold flex items-center gap-1.5"><Plus size={15} /> Add New Exporter Profile</h3>
                <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground"><X size={15} /></button>
              </div>
              <form onSubmit={handleAddExporterSubmit} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Exporter Name</label>
                  <Input required placeholder="Anil Reddy" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Email Address</label>
                    <Input required type="email" placeholder="anil@vijayawada.com" value={newCustEmail} onChange={(e) => setNewCustEmail(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Phone Number</label>
                    <Input required placeholder="+91 94440 12345" value={newCustPhone} onChange={(e) => setNewCustPhone(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Company Name</label>
                    <Input required placeholder="Vijayawada Exports" value={newCustCompany} onChange={(e) => setNewCustCompany(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Origin City</label>
                    <Input required placeholder="Visakhapatnam" value={newCustLocation} onChange={(e) => setNewCustLocation(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">License Inquiry Status</label>
                    <select 
                      value={newCustStatus} 
                      onChange={(e: any) => setNewCustStatus(e.target.value)}
                      className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none"
                    >
                      <option value="Hot">Hot Lead</option>
                      <option value="Warm">Warm Lead</option>
                      <option value="Cold">Cold Lead</option>
                      <option value="Future Prospect">Future Prospect</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Interest Ranking</label>
                    <select 
                      value={newCustInterest} 
                      onChange={(e: any) => setNewCustInterest(e.target.value)}
                      className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <Button type="submit" className="w-full text-xs h-9 mt-2">Create Exporter Record</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCHEDULE FOLLOWUP MODAL */}
      <AnimatePresence>
        {showFollowupForm && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFollowupForm(false)} />
            <motion.div className="relative w-full max-w-md glass rounded-2xl border border-border/50 p-5 glow-border" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold flex items-center gap-1.5"><CalendarCheck size={15} /> Schedule Exporter Callback</h3>
                <button onClick={() => setShowFollowupForm(false)} className="text-muted-foreground hover:text-foreground"><X size={15} /></button>
              </div>
              <form onSubmit={handleScheduleFollowup} className="space-y-3.5 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Channel</label>
                    <select value={followupType} onChange={(e: any) => setFollowupType(e.target.value)} className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none">
                      <option value="Call">Call (AI Trunk)</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Priority</label>
                    <select value={followupPriority} onChange={(e: any) => setFollowupPriority(e.target.value)} className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none">
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Target Date / Interval</label>
                  <Input required placeholder="Tomorrow, 10:00 AM (or '10 days delay')" value={followupTime} onChange={(e) => setFollowupTime(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">AI Helper Notes</label>
                  <textarea value={followupNotes} onChange={(e) => setFollowupNotes(e.target.value)} placeholder="Discuss RODTEP filing errors with auditor." className="w-full bg-secondary/40 border border-border text-xs p-2 rounded-xl h-18 resize-none focus:outline-none" />
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
