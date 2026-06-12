"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useCRMStore } from "@/store/crmStore";
import { BarChart3, TrendingUp, Sparkles, Award, ShieldCheck, Flame, Users } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LeadScoreBadge from "@/components/shared/LeadScoreBadge";

export default function LeadIntelligencePage() {
  const customers = useCRMStore(s => s.customers);
  const triggerOutboundCall = useCRMStore(s => s.triggerOutboundCall);

  // Sorting hot customers by leadScore descending
  const hotLeads = customers
    .filter(c => c.status === "Hot")
    .sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0));

  const warmLeads = customers
    .filter(c => c.status === "Warm")
    .sort((a, b) => (b.leadScore ?? 0) - (a.leadScore ?? 0));

  return (
    <PageContainer>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Lead Intelligence Workspace</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Analyze exporter intent, inspect automated lead scores, and target high-conversion opportunities.
          </p>
        </div>
      </motion.div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left main: Hot prospects */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 text-rose-400"><Flame size={14}/> Hot Conversion targets</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Highly interested exporters ready for license registration finalisation. Call auto-trunks to finalize.</p>
            <div className="space-y-3">
              {hotLeads.map(lead => (
                <div key={lead.id} className="p-3.5 rounded-xl bg-secondary/30 border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-primary/20 transition-all">
                  <div>
                    <h4 className="font-bold text-xs text-foreground leading-tight">{lead.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{lead.company} • {lead.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[9px] text-muted-foreground block uppercase font-semibold">Lead Score</span>
                      <strong className="text-xs text-chart-4 font-black">{lead.leadScore ?? 90}/100</strong>
                    </div>
                    <LeadScoreBadge status={lead.status} className="scale-90" />
                    <Button 
                      size="sm"
                      className="h-7 text-[9px] gap-1 px-3"
                      onClick={() => triggerOutboundCall(lead.id)}
                    >
                      Trigger Call
                    </Button>
                  </div>
                </div>
              ))}

              {hotLeads.length === 0 && (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No hot targets. Use AI Dialer calls to warm up cold leads.
                </div>
              )}
            </div>
          </GlassCard>

          {/* Warm prospects */}
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5 text-amber-400"><Users size={14}/> Warm leads nurturing</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Exporters expressing interest during campaigns. Recommended actions: dispatch rate updates.</p>
            <div className="space-y-3">
              {warmLeads.map(lead => (
                <div key={lead.id} className="p-3 rounded-lg bg-secondary/20 border border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-xs text-foreground leading-tight">{lead.name}</h4>
                    <p className="text-[9px] text-muted-foreground">{lead.company} • {lead.location}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <strong className="text-xs text-amber-400 font-bold">{lead.leadScore ?? 75}/100</strong>
                    </div>
                    <LeadScoreBadge status={lead.status} className="scale-90" />
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-7 text-[9px] px-2.5 text-foreground"
                      onClick={() => triggerOutboundCall(lead.id)}
                    >
                      Call Lead
                    </Button>
                  </div>
                </div>
              ))}

              {warmLeads.length === 0 && (
                <div className="py-6 text-center text-[10px] text-muted-foreground">
                  No warm prospects.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right column: Lead Scoring Engine Logic info */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full border-l-4 border-l-primary p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5"><Sparkles size={14}/> Scoring Algorithms</h3>
            <div className="space-y-4 text-xs leading-relaxed text-muted-foreground">
              <div>
                <h4 className="font-bold text-foreground mb-1">Intent Tracking</h4>
                <p className="text-[10px]">
                  System maps client tone, speech speed and positive keyword hits (e.g. <i>"price reasonable", "agreed"</i>) to auto-adjust lead scores.
                </p>
              </div>
              <div className="h-px bg-border/40" />
              <div>
                <h4 className="font-bold text-foreground mb-1">Status Classifications</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-[9px]">
                  <li><strong className="text-rose-400 font-semibold">Hot (85-100)</strong>: Direct intent expressed. Invoice links generated.</li>
                  <li><strong className="text-amber-400 font-semibold">Warm (60-84)</strong>: Inquired details. Follow-ups scheduled.</li>
                  <li><strong className="text-blue-400 font-semibold">Cold (below 60)</strong>: Non-answer or busy. Auto-scheduled for later retry.</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </PageContainer>
  );
}
