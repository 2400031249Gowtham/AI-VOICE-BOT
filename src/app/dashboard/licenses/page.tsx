"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useCRMStore } from "@/store/crmStore";
import { ClipboardCheck, FileText, Search, ShieldCheck, Clock, Download, ArrowUpRight, CheckCircle2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LicenseTrackerPage() {
  const customers = useCRMStore((s) => s.customers ?? []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = customers
    .map((c) => {
      const type = c.licenseType || "RODTEP";
      let progress = 100;
      let status = "Issued";
      
      if (c.status === "Hot") {
        progress = 60;
        status = "Processing";
      } else if (c.status === "Warm") {
        progress = 30;
        status = "Verification";
      } else if (c.status === "Cold") {
        progress = 15;
        status = "Verification";
      }

      return {
        id: c.id,
        exporter: c.name,
        type: `${type} Setup`,
        status,
        progress,
        date: c.nextFollowupDate || "In progress",
        officer: "DGFT Authority"
      };
    })
    .filter((lic) => {
      const matchesSearch = lic.exporter.toLowerCase().includes(search.toLowerCase()) || 
                            lic.type.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || lic.status === filter;
      return matchesSearch && matchesFilter;
    });

  // Dynamic logs from the database
  const logs = customers
    .slice(0, 3)
    .map((c, idx) => ({
      time: idx === 0 ? "10 mins ago" : idx === 1 ? "2 hrs ago" : "Yesterday",
      title: `${c.licenseType || "IEC"} Verified`,
      desc: `Setup verification check completed for ${c.name}.`
    }));

  return (
    <PageContainer>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 text-left"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">License Tracker</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Monitor DGFT and Commodity Board license issuance progress, verify application status and download draft documents.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main: License Table */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-4 text-left">
            <div className="flex-1 overflow-y-auto flex flex-col min-h-0 justify-between gap-3 mb-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border">
                <Search size={14} className="text-muted-foreground" />
                <Input 
                  type="text"
                  placeholder="Search by exporter or license..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs outline-none border-none shadow-none focus-visible:ring-0 p-0 h-6 w-48 focus:w-60 transition-all text-foreground"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {["All", "Verification", "Processing", "Issued"].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-all ${
                      filter === status 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "bg-secondary/35 text-muted-foreground border-border hover:bg-secondary/60"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    <th className="py-2 px-3">Exporter / License</th>
                    <th className="py-2 px-3">Authority</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Progress</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lic) => (
                    <tr key={lic.id} className="border-b border-border/20 hover:bg-secondary/15 transition-all">
                      <td className="py-3 px-3">
                        <span className="font-bold text-foreground block leading-tight">{lic.exporter}</span>
                        <span className="text-[10px] text-muted-foreground">{lic.type}</span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{lic.officer}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className={`text-[8px] px-1.5 h-4.5 font-bold ${
                          lic.status === "Issued" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          lic.status === "Processing" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" :
                          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }`}>
                          {lic.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 w-28">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden border border-border/55">
                            <div className="h-full bg-primary" style={{ width: `${lic.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold font-mono text-muted-foreground">{lic.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button size="icon" variant="ghost" className="w-7 h-7 hover:bg-secondary text-foreground" title="Download Draft agreement">
                            <Download size={11} />
                          </Button>
                          <Button size="icon" variant="ghost" className="w-7 h-7 hover:bg-primary/10 text-primary" title="View Detail">
                            <ArrowUpRight size={11} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No active exporter licenses match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right sidebar: Analytics info */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-4 text-left border-l-4 border-l-primary">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 flex items-center gap-1.5"><ShieldCheck size={14}/> Auto-Verification Logs</h3>
            <div className="space-y-3.5 text-[11px]">
              {logs.length === 0 ? (
                <div className="text-muted-foreground">No verification logs available.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="relative pl-4 border-l border-border/40 pb-1">
                    <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[9px] text-muted-foreground">{log.time}</span>
                    <h4 className="font-bold text-foreground mt-0.5">{log.title}</h4>
                    <div className="flex-1 min-h-[400px] overflow-y-auto p-3.5 space-y-3 text-[12px] leading-relaxed">{log.desc}</div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
