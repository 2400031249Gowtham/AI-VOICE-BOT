"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, Send, Eye, FileSpreadsheet, ListCheck, BarChart2, RefreshCw } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EmailDispatchPage() {
  const [activeTemplate, setActiveTemplate] = useState("draft");
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = () => {
    setLoading(true);
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        const emailLogs: any[] = [];
        data.forEach((convo: any) => {
          if (convo.channel === "email") {
            const custName = convo.exporterId?.name || "Unknown Exporter";
            (convo.messages || []).forEach((msg: any) => {
              let subject = "No Subject";
              if (String(msg.text).startsWith("Subject:")) {
                const parts = String(msg.text).split("\n\n");
                subject = String(parts[0] ?? "").replace("Subject:", "").trim();
              } else {
                subject = msg.text.substring(0, 30) + "...";
              }
              emailLogs.push({
                id: msg._id || String(msg.time),
                recipient: custName,
                subject: subject,
                status: "Read",
                date: new Date(msg.time).toLocaleDateString(),
                type: "Proposal Document"
              });
            });
          }
        });
        setEmails(emailLogs);
        setLoading(false);
      })
      .catch(() => {
        setEmails([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <PageContainer>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Email Dispatch Control</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Dispatch draft agreement proposals, manage automatic payment invoicing emails and audit client document mailings.
          </p>
        </div>
        <div>
          <Button onClick={fetchEmails} variant="outline" size="sm" className="text-xs gap-1.5">
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh Emails
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left Column: Email logs */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5"><Mail size={14}/> Sent Mailings Archive</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-3">Recipient</th>
                    <th className="py-2.5 px-3">Subject / Document</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground animate-pulse">
                        Loading email records...
                      </td>
                    </tr>
                  ) : emails.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground">
                        No sent mailings archived yet.
                      </td>
                    </tr>
                  ) : (
                    emails.map((mail) => (
                      <tr key={mail.id} className="border-b border-border/20 hover:bg-secondary/15 transition-all">
                        <td className="py-3 px-3">
                          <span className="font-bold text-foreground block leading-tight">{mail.recipient}</span>
                          <span className="text-[10px] text-muted-foreground">{mail.type || "Proposal"}</span>
                        </td>
                        <td className="py-3 px-3 text-muted-foreground">{mail.subject}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className={`text-[8px] h-4.5 px-2 font-bold ${
                            mail.status === "Read" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                            "bg-secondary text-muted-foreground border-border"
                          }`}>
                            {mail.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-right text-muted-foreground">{mail.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Templates Bank */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-primary"><Eye size={14}/> proposal Draft templates</h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">
              Access draft agreement structures to instantly send to exporters during active call negotiations.
            </p>

            <div className="space-y-2 mb-6">
              {[
                { id: "draft", name: "Licensing Proposal Agreement" },
                { id: "invoice", name: "Automatic Invoice Attachment" },
                { id: "checklist", name: "DGFT Document Checklist guidelines" }
              ].map(tpl => (
                <div 
                  key={tpl.id}
                  onClick={() => setActiveTemplate(tpl.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    activeTemplate === tpl.id ? "border-primary bg-primary/5 text-primary" : "border-border/50 bg-secondary/20 hover:border-border text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold block">{tpl.name}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-secondary/30 rounded-xl border border-border/50 text-[10px] leading-relaxed min-h-32 text-left italic text-muted-foreground">
              {activeTemplate === "draft" && (
                <p>"Herewith enclosed is the licensing contract draft for RODTEP/RoSCTL setup. Please sign and return..."</p>
              )}
              {activeTemplate === "invoice" && (
                <p>"Dear Exporter, please find the setup fee invoice details for APEDA setup. Amount: INR 22,000. Due immediately..."</p>
              )}
              {activeTemplate === "checklist" && (
                <p>"To setup your Importer Exporter Code (IEC) at DGFT portal, please submit: (1) bank passbook copy, (2) identity details..."</p>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </PageContainer>
  );
}
