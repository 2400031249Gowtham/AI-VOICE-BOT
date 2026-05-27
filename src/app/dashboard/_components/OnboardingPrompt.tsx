"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingPromptProps {
  visible: boolean;
  onStartTour: () => void;
  onSkip: () => void;
}

export function OnboardingPrompt({ visible, onStartTour, onSkip }: OnboardingPromptProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="onboarding-prompt"
          className="fixed bottom-6 right-6 z-50 w-80"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative p-5 rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />

            <button
              onClick={onSkip}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>

            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-foreground leading-tight">
                  Welcome to VoxAI Workspace
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  Would you like a guided tour of the VoxAI CRM? It only takes 2 minutes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex-1 text-[11px] h-8 gap-1.5"
                onClick={onStartTour}
              >
                <Sparkles size={12} />
                Start Tutorial
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[11px] h-8 text-muted-foreground hover:text-foreground"
                onClick={onSkip}
              >
                Skip
                <ArrowRight size={12} className="ml-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
