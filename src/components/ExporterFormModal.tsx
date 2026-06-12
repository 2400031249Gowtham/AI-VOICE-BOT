"use client";
import React from "react";

import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCRMStore } from "@/store/crmStore";

type ExporterFormFields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  status: "Hot" | "Warm" | "Cold" | "Future Prospect";
  interest: "High" | "Medium" | "Low";
};

const initialFields: ExporterFormFields = {
  name: "",
  email: "",
  phone: "",
  company: "",
  location: "",
  status: "Warm",
  interest: "Medium",
};

interface ExporterFormModalProps {
  open: boolean;
  onClose: () => void;
}

const ExporterFormModalComponent = ({ open, onClose }: ExporterFormModalProps) => {
  console.log("[ExporterFormModal] render");

  const addCustomer = useCRMStore(s => s.addCustomer);
  const loading = useCRMStore(s => s.loading);
  const [fields, setFields] = useState<ExporterFormFields>(initialFields);

  const updateField = <K extends keyof ExporterFormFields>(field: K, value: ExporterFormFields[K]) => {
    setFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addCustomer(fields as any);
      toast.success("Exporter successfully added.");
      setFields(initialFields);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add exporter.");
    }
  };

  if (!open) {
    return null;
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-md glass rounded-2xl border border-border/50 p-5 glow-border" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold flex items-center gap-1.5"><Plus size={15} /> Add New Exporter Profile</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" type="button"><X size={15} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          <div className="space-y-1">
            <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Exporter Name</label>
            <Input required placeholder="Anil Reddy" value={fields.name} onChange={(e) => updateField("name", e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Email Address</label>
              <Input required type="email" placeholder="anil@vijayawada.com" value={fields.email} onChange={(e) => updateField("email", e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Phone Number</label>
              <Input required placeholder="+91 94440 12345" value={fields.phone} onChange={(e) => updateField("phone", e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Company Name</label>
              <Input required placeholder="Vijayawada Exports" value={fields.company} onChange={(e) => updateField("company", e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">Origin City</label>
              <Input required placeholder="Visakhapatnam" value={fields.location} onChange={(e) => updateField("location", e.target.value)} className="bg-secondary/40 text-xs h-8.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] uppercase tracking-wider text-muted-foreground font-bold">License Inquiry Status</label>
              <select
                value={fields.status}
                onChange={(e) => updateField("status", e.target.value as ExporterFormFields["status"])}
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
                value={fields.interest}
                onChange={(e) => updateField("interest", e.target.value as ExporterFormFields["interest"])}
                className="w-full bg-secondary/50 border border-border/80 text-xs text-foreground p-1.5 rounded-lg focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <Button type="submit" disabled={loading?.customers} className={`w-full text-xs h-9 mt-2 ${loading?.customers ? "opacity-50" : ""}`}>
            {loading?.customers ? "Creating..." : "Create Exporter Record"}
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export const ExporterFormModal = React.memo(ExporterFormModalComponent);
