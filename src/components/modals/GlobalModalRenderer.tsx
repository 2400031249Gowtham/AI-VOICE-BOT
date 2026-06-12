"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useModal } from "@/context/ModalContext";
import { LogOut, X, Settings, Palette, Plus, HelpCircle, Bot, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/cards/GlassCard";
import { useCRMStore } from "@/store/crmStore";

export function GlobalModalRenderer() {
  const { activeModal, closeModal } = useModal();
  const logout = useCRMStore(s => s.logout);

  const handleLogoutConfirm = () => {
    logout();
    closeModal();
  };

  return (
    <AnimatePresence>
      {activeModal !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />

          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {activeModal === "logout" && (
              <GlassCard className="p-6 border-border/50 shadow-2xl glow-border text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive/50 via-destructive to-destructive/50" />
                
                <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-4 flex items-center justify-center">
                  <LogOut size={28} className="text-destructive ml-1" />
                </div>
                
                <h3 className="text-lg font-bold text-foreground mb-2">End Session?</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  You are about to log out of your VoxAI operational workspace. You will need to re-authenticate to access your data.
                </p>
                
                <div className="flex gap-3 w-full">
                  <Button variant="outline" className="flex-1 border-border/50 bg-secondary/30" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button variant="destructive" className="flex-1 shadow-lg shadow-destructive/20" onClick={handleLogoutConfirm}>
                    Logout
                  </Button>
                </div>
              </GlassCard>
            )}

            {activeModal === "theme" && (
              <GlassCard className="p-6 border-border/50 shadow-2xl text-center">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-bold flex items-center gap-2"><Palette size={18} /> Theme Preferences</h3>
                  <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Dark mode is currently enforced for the VoxAI premium experience.</p>
                  <Button variant="outline" className="w-full" onClick={closeModal}>Got it</Button>
                </div>
              </GlassCard>
            )}

            {activeModal === "support" && (
              <GlassCard className="p-6 border-border/50 shadow-2xl text-center">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-bold flex items-center gap-2"><HelpCircle size={18} /> Help & Support</h3>
                  <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-xs text-muted-foreground">Contact your VoxAI technical account manager for operational support.</p>
                  <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                    <p className="text-xs font-semibold">Email: support@voxai.com</p>
                    <p className="text-xs font-semibold">Phone: +1 (800) 555-0199</p>
                  </div>
                  <Button className="w-full" onClick={closeModal}>Close</Button>
                </div>
              </GlassCard>
            )}

            {activeModal === "customer" && (
              <GlassCard className="p-6 border-border/50 shadow-2xl text-center">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-bold flex items-center gap-2"><Plus size={18} /> New Exporter</h3>
                  <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">To add a new customer, please navigate to the Exporter Directory.</p>
                  <Button className="w-full" onClick={() => {
                    closeModal();
                    if (typeof window !== "undefined") window.location.href = "/dashboard/customers";
                  }}>Go to Directory</Button>
                </div>
              </GlassCard>
            )}

            {activeModal === "ai_setup" && (
              <GlassCard className="p-6 border-border/50 shadow-2xl text-center">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-bold flex items-center gap-2 text-primary"><Bot size={18} /> Configure AI Assistant</h3>
                  <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Adjust VoxAI voice and operational parameters in the settings panel.</p>
                  <Button className="w-full" onClick={() => {
                    closeModal();
                    if (typeof window !== "undefined") window.location.href = "/dashboard/settings";
                  }}>Open Settings</Button>
                </div>
              </GlassCard>
            )}

            {activeModal === "profile" && (
              <GlassCard className="p-6 border-border/50 shadow-2xl text-center">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-bold flex items-center gap-2"><User size={18} /> My Profile</h3>
                  <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-xs text-muted-foreground">Your account settings and workspace access are managed securely.</p>
                  <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                    <p className="text-xs font-semibold">Role: Administrator</p>
                    <p className="text-xs font-semibold">Access: Full Control</p>
                  </div>
                  <Button className="w-full" onClick={closeModal}>Close</Button>
                </div>
              </GlassCard>
            )}

            {activeModal === "notifications" && (
              <GlassCard className="p-6 border-border/50 shadow-2xl text-center">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-md font-bold flex items-center gap-2"><Bell size={18} /> Notifications</h3>
                  <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-xs text-muted-foreground">You have no unread critical alerts.</p>
                  <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                    <p className="text-xs font-semibold">All systems operational.</p>
                  </div>
                  <Button className="w-full" onClick={closeModal}>Dismiss All</Button>
                </div>
              </GlassCard>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
