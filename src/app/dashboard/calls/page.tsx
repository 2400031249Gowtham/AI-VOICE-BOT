"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCrm } from "@/hooks/useCrm";
import { CallLog } from "@/types";
import { CallTranscripts } from "@/calls/CallTranscripts";
import { 
  Play, Pause, Clock, User, Bot, Tag, 
  MessageSquare, Calendar, ChevronDown, CheckCircle2, Search, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageContainer from "@/components/layout/PageContainer";
import GlassCard from "@/components/cards/GlassCard";

const sentimentColors: Record<string, string> = {
  Positive: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Neutral: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  Negative: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function CallsPage() {
  const { calls } = useCrm();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("All");

  // Auto-expand first call log on load
  useEffect(() => {
    if (calls.length > 0 && expandedId === null) {
      setExpandedId(calls[0].id);
    }
  }, [calls]);

  if (calls.length === 0) {
    return (
      <PageContainer>
        <div className="mb-6 text-left">
          <h1 className="text-xl font-bold tracking-tight">AI Outbound Call Center</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Review automated Twilio outgoing speech feeds, customer sentiments, and recordings playback.
          </p>
        </div>
        <GlassCard className="p-16 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
            <Play size={20} className="ml-0.5 text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground mb-1.5">No Voice Call Records</h3>
          <p className="text-xs text-muted-foreground leading-normal mb-6">
            The call logs database is currently empty. Head over to the Exporter Directory and select any client profile to launch a simulated live voice call session.
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

  const filteredCalls = calls.filter((call) => {
    const matchesSearch = call.customerName.toLowerCase().includes(search.toLowerCase()) ||
      call.company.toLowerCase().includes(search.toLowerCase()) ||
      call.summary.toLowerCase().includes(search.toLowerCase());
    const matchesSentiment = selectedSentiment === "All" || call.sentiment === selectedSentiment;
    return matchesSearch && matchesSentiment;
  });

  const selectedCall = calls.find((c) => c.id === expandedId) || null;

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
          <h1 className="text-xl font-bold tracking-tight">AI Outbound Call Center</h1>
          <p className="text-[13px] text-muted-foreground mt-1">
            Review automated Twilio outgoing speech feeds, customer sentiments, and recordings playback.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-[12px] h-8.5">
            Export Voice Analytics
          </Button>
        </div>
      </motion.div>

      {/* Filter and Search Bar */}
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
            placeholder="Search exporter call logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          {["All", "Positive", "Neutral", "Negative"].map((sent) => (
            <button
              key={sent}
              onClick={() => setSelectedSentiment(sent)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSentiment === sent
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-secondary/50 text-muted-foreground border border-border hover:bg-secondary/70"
              }`}
            >
              {sent}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Call list */}
        <div className="lg:col-span-1 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredCalls.map((call, i) => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setExpandedId(call.id)}
              className={`p-3.5 rounded-xl cursor-pointer transition-all border text-left ${
                expandedId === call.id
                  ? "bg-primary/5 border-primary/30 shadow-[0_0_20px_hsl(234_89%_74%/0.1)]"
                  : "bg-card/50 border-border hover:bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                      {call.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-bold leading-none mb-1">{call.customerName}</p>
                    <p className="text-[9px] text-muted-foreground truncate max-w-[120px]">{call.company}</p>
                  </div>
                </div>
                <Badge variant="outline" className={`text-[8px] px-1.5 h-4.5 ${sentimentColors[call.sentiment]}`}>
                  {call.sentiment}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[8px] text-muted-foreground pt-1.5 border-t border-border/20 mt-2 font-mono">
                <span className="flex items-center gap-1"><Calendar size={9} /> {call.date}</span>
                <span className="flex items-center gap-1"><Clock size={9} /> {call.duration}</span>
              </div>
            </motion.div>
          ))}
          
          {filteredCalls.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No active call records found.
            </div>
          )}
        </div>

        {/* Right Side: Call transcript details */}
        <div className="lg:col-span-2">
          {selectedCall ? (
            <motion.div
              key={selectedCall.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-5">
                <CallTranscripts call={selectedCall} />
              </GlassCard>
            </motion.div>
          ) : (
            <div className="py-20 text-center text-muted-foreground text-xs glass border border-border rounded-xl">
              Select an exporter call log to review transcripts.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
