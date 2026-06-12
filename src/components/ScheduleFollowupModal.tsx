import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ScheduleFollowupModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  mode: "global" | "customer";
  customers?: any[];
  defaultCustomerId?: string | null;
}

const ScheduleFollowupModalComponent = ({
  open,
  onClose,
  onSubmit,
  mode,
  customers = [],
  defaultCustomerId
}: ScheduleFollowupModalProps) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [followupType, setFollowupType] = useState<"Call" | "WhatsApp" | "Email">("Call");
  const [followupPriority, setFollowupPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [followupTime, setFollowupTime] = useState("");
  const [followupNotes, setFollowupNotes] = useState("");
  const [followupCategory, setFollowupCategory] = useState<"callback" | "invoice_reminder" | "doc_reminder">("callback");

  useEffect(() => {
    if (open) {
      if (defaultCustomerId) {
        setSelectedCustomerId(defaultCustomerId);
      } else if (customers.length > 0) {
        setSelectedCustomerId(customers[0].id);
      }
    }
  }, [open, defaultCustomerId, customers]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      customerId: selectedCustomerId,
      type: followupType,
      priority: followupPriority,
      time: followupTime,
      notes: followupNotes,
      category: followupCategory
    });
    setFollowupTime("");
    setFollowupNotes("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="relative w-full max-w-md glass rounded-2xl border border-border/50 p-5 glow-border" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full hover:bg-gray-100 z-50"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="flex flex-col items-start mb-4 pr-16">
              <h3 className="text-xs font-bold flex items-center gap-1.5"><CalendarCheck size={14} /> Schedule Follow-up</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
              
              {mode === "global" && (
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Select Exporter</label>
                  <select 
                    value={selectedCustomerId} 
                    onChange={(e: any) => setSelectedCustomerId(e.target.value)}
                    className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className={`grid ${mode === "global" ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Channel</label>
                  <select value={followupType} onChange={(e: any) => setFollowupType(e.target.value)} className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none">
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                
                {mode === "global" && (
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Category</label>
                    <select value={followupCategory} onChange={(e: any) => setFollowupCategory(e.target.value as any)} className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none">
                      <option value="callback">Callback</option>
                      <option value="invoice_reminder">Billing Check</option>
                      <option value="doc_reminder">Document Rem.</option>
                    </select>
                  </div>
                )}

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
                <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Time Target</label>
                <Input required placeholder="Tomorrow, 10:00 AM (or '10 days delay')" value={followupTime} onChange={(e) => setFollowupTime(e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Notes for AI trunk dialer</label>
                <textarea value={followupNotes} onChange={(e) => setFollowupNotes(e.target.value)} placeholder="Discuss license status..." className="w-full bg-secondary/40 border border-border text-xs p-2.5 rounded-xl h-18 resize-none focus:outline-none text-foreground" />
              </div>
              <Button type="submit" className="w-full text-xs h-9 mt-2">Schedule Task</Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ScheduleFollowupModalComponent);
