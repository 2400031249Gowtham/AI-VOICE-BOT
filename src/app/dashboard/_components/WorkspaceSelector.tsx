"use client";

import { motion } from "framer-motion";
import { Sparkles, Briefcase, ChevronRight, Phone, Send, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceSelectorProps {
  onSelect: (mode: "demo" | "real") => void;
}

export function WorkspaceSelector({ onSelect }: WorkspaceSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/30 backdrop-blur-md">
      <motion.div
        className="w-full max-w-3xl glass rounded-2xl border border-border/60 shadow-2xl p-6 md:p-8 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Glow ambient background checks */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-chart-3/15 rounded-full blur-[60px]" />

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-3">
            <Sparkles size={11} className="animate-pulse" /> Workspace Onboarding
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            Welcome to Vox<span className="gradient-text">AI</span> CRM
          </h2>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-md mx-auto leading-relaxed">
            Select your workspace environment to begin. You can switch, clear, or reset your workspace mode at any time from your system settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
          {/* Card 1: Explore Demo Workspace */}
          <motion.div
            className="p-5 rounded-2xl bg-white/45 hover:bg-white/70 border border-border/50 hover:border-primary/25 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer text-left"
            whileHover={{ y: -2 }}
            onClick={() => onSelect("demo")}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles size={18} />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                Explore Demo Workspace
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                Enter a fully operational export-license relationship center preloaded with connected customer journeys:
              </p>
              
              {/* Feature mini list */}
              <div className="space-y-2 mb-6">
                {[
                  { icon: Phone, text: "Simulated Twilio call feeds in Telugu" },
                  { icon: Send, text: "Pending WhatsApp invoices & coordinate checklist" },
                  { icon: Calendar, text: "Memory-linked timeline follow-ups" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <item.icon size={12} className="text-primary/70" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full text-xs gap-1 h-9 bg-primary text-primary-foreground">
              Explore Demo <ChevronRight size={13} />
            </Button>
          </motion.div>

          {/* Card 2: Create Your Own Workspace */}
          <motion.div
            className="p-5 rounded-2xl bg-white/45 hover:bg-white/70 border border-border/50 hover:border-primary/25 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer text-left"
            whileHover={{ y: -2 }}
            onClick={() => onSelect("real")}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-secondary text-foreground flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Briefcase size={18} />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                Create Your Own Workspace
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                Start with a clean, empty CRM. Perfect for onboarding your own business leads and integrating credentials:
              </p>
              
              {/* Feature mini list */}
              <div className="space-y-2 mb-6">
                {[
                  { icon: Briefcase, text: "Empty directory for manual lead entry" },
                  { icon: ShieldCheck, text: "Save settings securely in browser localStorage" },
                  { icon: Sparkles, text: "Zeroed out live performance analytics charts" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <item.icon size={12} className="text-muted-foreground/75" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" className="w-full text-xs gap-1 h-9 border-border/60 hover:bg-secondary/40">
              Start Fresh <ArrowRight size={13} />
            </Button>
          </motion.div>
        </div>

        {/* Footer note */}
        <p className="text-[9px] text-muted-foreground text-center mt-6 relative z-10">
          * Choosing "Explore Demo Workspace" populates simulated data. You can switch to a clean "Real Workspace" at any time.
        </p>
      </motion.div>
    </div>
  );
}
