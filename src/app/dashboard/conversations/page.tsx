"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCrm } from "@/hooks/useCrm";
import { Customer, MessageLog } from "@/types";
import { 
  MessageSquare, Send, Mail, FileText, CheckCircle2, ChevronRight, 
  Clock, Search, AlertCircle, RefreshCw, SendHorizontal, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";

const statusColors: Record<string, string> = {
  Hot: "bg-destructive/10 text-destructive border-destructive/20",
  Warm: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Cold: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Converted: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Future Prospect": "bg-primary/10 text-primary border-primary/20",
};

const invoiceColors: Record<string, string> = {
  Paid: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Unpaid: "bg-destructive/10 text-destructive border-destructive/20",
  Pending: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  None: "bg-secondary text-muted-foreground border-border"
};

export default function ConversationsPage() {
  const { customers, sendWhatsApp, sendEmail, updateCustomer } = useCrm();
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Email form states
  const [emailSubject, setEmailSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  // Select first customer on load
  useEffect(() => {
    if (customers.length > 0 && selectedCustomerId === null) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers]);

  // Sync messages
  useEffect(() => {
    if (selectedCustomerId !== null) {
      const { customerService } = require("@/services/customerService");
      customerService.getMessages(selectedCustomerId).then(setMessages);
    }
  }, [selectedCustomerId]);

  const activeCustomer = customers.find(c => c.id === selectedCustomerId) || null;

  const handleSendWhatsApp = async () => {
    if (!activeCustomer || !inputText.trim()) return;
    await sendWhatsApp(activeCustomer.id, inputText);
    setInputText("");
    
    // Refresh messages
    const { customerService } = require("@/services/customerService");
    const msgs = await customerService.getMessages(activeCustomer.id);
    setMessages(msgs);
  };

  const handleSendEmail = async () => {
    if (!activeCustomer || !emailSubject.trim() || !emailContent.trim()) return;
    await sendEmail(activeCustomer.id, emailSubject, emailContent);
    setEmailSubject("");
    setEmailContent("");
    
    // Refresh messages
    const { customerService } = require("@/services/customerService");
    const msgs = await customerService.getMessages(activeCustomer.id);
    setMessages(msgs);
    alert("Proposal email dispatched to exporter.");
  };

  const triggerBillingInvoice = async () => {
    if (!activeCustomer) return;
    const invoiceMsg = `నమస్కారం ${activeCustomer.name}, మీ export license ఫీజు వివరాలు: APEDA/CRES setup fee - ₹45,000. దయచేసి క్రింది లింక్ ద్వారా పేమెంట్ చేయండి: vxa.in/pay/7812`;
    await sendWhatsApp(activeCustomer.id, invoiceMsg);
    await updateCustomer(activeCustomer.id, { invoiceStatus: "Pending" });
    
    // Refresh messages
    const { customerService } = require("@/services/customerService");
    const msgs = await customerService.getMessages(activeCustomer.id);
    setMessages(msgs);
    alert("Invoice details dispatched on WhatsApp. Invoice status updated to Pending.");
  };

  const triggerReminder = async () => {
    if (!activeCustomer) return;
    const reminderMsg = `నమస్కారం, మీ export license డాక్యుమెంట్ వెరిఫికేషన్ మరియు పేమెంట్ పెండింగ్ లో ఉంది. దయచేసి పేమెంట్ వెంటనే పూర్తి చేయండి. ధన్యవాదాలు!`;
    await sendWhatsApp(activeCustomer.id, reminderMsg);
    alert("Reminded payment invoice status via WhatsApp channel.");
  };

  if (customers.length === 0) {
    return (
      <PageContainer>
        <div className="mb-6 text-left">
          <h1 className="text-xl font-bold tracking-tight">Communications Desk</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Dispatch WhatsApp coordination flows, trigger invoice links, and coordinate proposal emails.
          </p>
        </div>
        <GlassCard className="p-16 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <MessageSquare size={22} />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1.5">No Exporters Registered</h3>
          <p className="text-xs text-muted-foreground leading-normal mb-6">
            The communications workspace is empty because there are no exporters in your database. Register your first exporter to access direct WhatsApp chats, email templates, and automated payment links.
          </p>
          <Link href="/dashboard/customers">
            <Button size="sm" className="gap-1.5 text-xs">
              Go to Exporter Directory
            </Button>
          </Link>
        </GlassCard>
      </PageContainer>
    );
  }

  const filteredCustomers = customers.filter(c => {
    return c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase());
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
          <h1 className="text-xl font-bold tracking-tight">Omnichannel Communications Desk</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Coordinate WhatsApp documentation checklists and email invoices with exporters.
          </p>
        </div>
      </motion.div>

      {/* Main Inbox layout grids */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[560px] items-stretch">
        
        {/* SIDEBAR: Active Chats List */}
        <div className="lg:col-span-1 glass rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs">
          <div className="p-3.5 border-b border-border/30 bg-white/40 flex items-center gap-2 backdrop-blur-xs">
            <Search size={12} className="text-muted-foreground flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[11px] outline-none w-full text-foreground placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 max-h-[500px]">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === selectedCustomerId;
              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all border text-left ${
                    isSelected 
                      ? "bg-primary/[0.06] border-primary/10 shadow-xs" 
                      : "bg-transparent border-transparent hover:bg-white/40 hover:border-border/30"
                  }`}
                >
                  <Avatar className="h-7.5 w-7.5 flex-shrink-0">
                    <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                      {cust.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[11px] font-bold truncate block text-foreground">{cust.name}</span>
                      <span className="text-[7.5px] text-muted-foreground uppercase flex-shrink-0 font-bold">{cust.status}</span>
                    </div>
                    <p className="text-[9.5px] text-muted-foreground truncate leading-normal mt-0.5">{cust.company}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MIDDLE COLUMN: WhatsApp Chat Window */}
        <div className="lg:col-span-2 glass rounded-2xl flex flex-col justify-between overflow-hidden relative shadow-xs">
          {activeCustomer ? (
            <>
              {/* Active exporter info bar */}
              <div className="p-3.5 bg-white/60 border-b border-border/30 flex justify-between items-center text-left backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] bg-chart-2/[0.08] text-chart-2 border-chart-2/20 flex items-center gap-1.5 px-2 py-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" /> Live Chat
                  </Badge>
                  <span className="text-xs font-bold text-foreground">{activeCustomer.name}</span>
                  <span className="text-[10px] text-muted-foreground">{activeCustomer.phone}</span>
                </div>
                <Badge variant="outline" className={`text-[9px] px-2 h-5 font-semibold ${statusColors[activeCustomer.status]}`}>
                  {activeCustomer.status}
                </Badge>
              </div>

              {/* Chat timeline bubbles */}
              <div className="flex-1 p-5 space-y-4.5 overflow-y-auto max-h-[380px] bg-transparent">
                {messages.map((msg) => {
                  const isSent = msg.status === "Sent" || msg.status === "Delivered" || msg.status === "Read";
                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col gap-1 text-[11px] p-3 rounded-2xl max-w-[75%] text-left ${
                        isSent 
                          ? "ml-auto bg-gradient-to-tr from-primary to-primary/85 text-white rounded-tr-xs shadow-sm" 
                          : "bg-white border border-border/40 text-foreground rounded-tl-xs shadow-xs"
                      }`}
                    >
                      <div className={`flex justify-between items-center text-[7px] font-bold gap-3 mb-0.5 ${
                        isSent ? "text-white/80" : "text-muted-foreground"
                      }`}>
                        <span className="uppercase tracking-wider">{msg.type} Channel</span>
                        <div className="flex items-center gap-1 font-normal">
                          <span>{msg.timestamp}</span>
                          <span>•</span>
                          <span className={isSent ? "text-white" : msg.status === "Read" ? "text-chart-2" : "text-chart-4"}>{msg.status}</span>
                        </div>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed text-[11px] font-medium">{msg.content}</p>
                    </div>
                  );
                })}

                {messages.length === 0 && (
                  <div className="h-full flex flex-col justify-center items-center text-center text-muted-foreground text-[11px] py-16 space-y-2">
                    <MessageSquare size={20} className="text-primary/45" />
                    <span>No conversation records with this exporter.</span>
                  </div>
                )}
              </div>

              {/* Input section */}
              <div className="p-3.5 bg-white/40 border-t border-border/30 backdrop-blur-xs">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type WhatsApp message in Telugu / English..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 h-9.5 text-[11px] bg-white/80 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl"
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendWhatsApp(); }}
                  />
                  <Button size="sm" className="h-9.5 text-xs px-4 rounded-xl shadow-xs bg-primary hover:opacity-95 text-white font-medium gap-1" onClick={handleSendWhatsApp}>
                    <Send size={11} /> Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
              Select an exporter to launch chat threads.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Invoicing and Proposals Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4 text-left">
          {activeCustomer ? (
            <>
              {/* Billing Info Card */}
              <div className="glass p-4 rounded-2xl flex flex-col gap-3.5 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                  <FileText size={13} className="text-primary" /> Invoice Status
                </h3>
                <div className="space-y-2.5 text-[11px]">
                  <div className="flex justify-between items-center bg-secondary/40 p-2 rounded-xl border border-border/30">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="outline" className={`text-[8.5px] px-1.5 h-4.5 font-bold ${invoiceColors[activeCustomer.invoiceStatus || "None"]}`}>
                      {activeCustomer.invoiceStatus || "None"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center bg-secondary/40 p-2 rounded-xl border border-border/30 font-semibold">
                    <span className="text-muted-foreground">Licensing Value:</span>
                    <span className="text-foreground text-[11px]">{activeCustomer.value}</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-1.5">
                    <Button size="sm" className="w-full h-8 text-[10px] rounded-xl gap-1 bg-primary text-white shadow-xs font-medium hover:opacity-95" onClick={triggerBillingInvoice}>
                      <Send size={10} /> Send WhatsApp Invoice
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-8 text-[10px] rounded-xl gap-1 border-border/60 hover:bg-secondary text-muted-foreground" onClick={triggerReminder} disabled={activeCustomer.invoiceStatus === "Paid"}>
                      <AlertCircle size={10} /> Send Payment Reminder
                    </Button>
                  </div>
                </div>
              </div>

              {/* Email Proposal Form Card */}
              <div className="glass p-4 rounded-2xl flex flex-col gap-3.5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-foreground">
                  <Mail size={13} className="text-primary" /> Send Email Proposal
                </h4>
                <div className="space-y-2">
                  <Input 
                    placeholder="Proposal Subject (e.g. APEDA setup)"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="h-8.5 text-[11px] bg-secondary/40 border-border/40 focus-visible:ring-1 focus-visible:ring-primary/20 rounded-xl"
                  />
                  <textarea 
                    placeholder="Type email body details..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    className="w-full text-[11px] bg-secondary/40 border border-border/40 rounded-xl p-2.5 h-20 resize-none focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                  <Button variant="secondary" size="sm" className="w-full h-8 text-[10px] rounded-xl gap-1 bg-secondary text-foreground hover:bg-secondary/75" onClick={handleSendEmail}>
                    <SendHorizontal size={10} /> Dispatch Proposal
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="glass h-full flex items-center justify-center text-xs text-muted-foreground rounded-2xl p-4">
              Select an exporter.
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
}
