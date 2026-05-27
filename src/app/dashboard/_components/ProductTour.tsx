"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  MessageSquare,
  CalendarCheck,
  TrendingUp,
  Bot,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourStep {
  id: string;
  targetId: string;
  icon: React.ElementType;
  title: string;
  description: string;
  placement: "right" | "bottom" | "left";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    targetId: "nav-dashboard",
    icon: LayoutDashboard,
    title: "AI Operations Dashboard",
    description:
      "Your command center. See live call stats, follow-up alerts, market trends, and conversational AI activity — all in one view.",
    placement: "right",
  },
  {
    id: "customers",
    targetId: "nav-customers",
    icon: Users,
    title: "Exporter CRM",
    description:
      "Manage your export license clients. Track lead scores, invoice statuses, interaction histories, and AI-scheduled callbacks.",
    placement: "right",
  },
  {
    id: "calls",
    targetId: "nav-calls",
    icon: PhoneCall,
    title: "AI Voice Dialer",
    description:
      "Initiate outbound Telugu AI calls. Watch the live conversation stream, hear Priya voice agent manage objections and schedule follow-ups.",
    placement: "right",
  },
  {
    id: "conversations",
    targetId: "nav-conversations",
    icon: MessageSquare,
    title: "WhatsApp & Messaging Desk",
    description:
      "Send templated WhatsApp invoices, follow-up reminders, and document request messages — in natural Teleglish business language.",
    placement: "right",
  },
  {
    id: "followups",
    targetId: "nav-followups",
    icon: CalendarCheck,
    title: "AI Follow-up Scheduler",
    description:
      "AI automatically detects callback triggers from conversations. Schedules are auto-created when customers say '10 days తర్వాత call చేయండి'.",
    placement: "right",
  },
  {
    id: "market",
    targetId: "nav-market",
    icon: TrendingUp,
    title: "Live Market Rates",
    description:
      "Monitor real-time export license fees — RODTEP, APEDA, Spices Board CRES, FSSAI, and more. Update rates to reflect daily fluctuations.",
    placement: "right",
  },
  {
    id: "assistant",
    targetId: "nav-assistant",
    icon: Bot,
    title: "AI Voice Assistant",
    description:
      "Configure your neural Telugu voice personality. Set prompt instructions, ElevenLabs voice ID, empathy levels, and export license knowledge base.",
    placement: "right",
  },
];

interface ProductTourProps {
  active: boolean;
  onComplete: () => void;
}

export function ProductTour({ active, onComplete }: ProductTourProps) {
  const [step, setStep] = useState(0);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [spotlightRect, setSpotlightRect] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[step];

  useEffect(() => {
    if (!active) return;
    const el = document.getElementById(currentStep.targetId);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const padding = 8;

    setSpotlightRect({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });

    // Position tooltip to the right of the sidebar element
    const tooltipTop = rect.top + rect.height / 2;
    const tooltipLeft = rect.right + 20;

    setTooltipPos({ top: tooltipTop, left: tooltipLeft });

    // Scroll element into view
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [step, active, currentStep.targetId]);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const StepIcon = currentStep.icon;

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Dimmed overlay with spotlight cutout using box-shadow trick */}
          <motion.div
            key="tour-overlay"
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "rgba(0,0,0,0.55)",
              WebkitMaskImage: `
                radial-gradient(ellipse ${spotlightRect.width + 16}px ${spotlightRect.height + 16}px at ${spotlightRect.left + spotlightRect.width / 2}px ${spotlightRect.top + spotlightRect.height / 2}px, transparent 60%, black 80%)
              `,
              maskImage: `
                radial-gradient(ellipse ${spotlightRect.width + 16}px ${spotlightRect.height + 16}px at ${spotlightRect.left + spotlightRect.width / 2}px ${spotlightRect.top + spotlightRect.height / 2}px, transparent 60%, black 80%)
              `,
            }}
          />

          {/* Spotlight ring border */}
          <motion.div
            key="tour-ring"
            className="fixed z-[61] rounded-xl border-2 border-primary/60 shadow-lg shadow-primary/20 pointer-events-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              top: spotlightRect.top,
              left: spotlightRect.left,
              width: spotlightRect.width,
              height: spotlightRect.height,
            }}
          />

          {/* Tooltip card */}
          <motion.div
            key={`tour-tooltip-${step}`}
            ref={tooltipRef}
            className="fixed z-[62] w-72 pointer-events-auto"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              top: Math.max(16, Math.min(tooltipPos.top - 100, window.innerHeight - 280)),
              left: Math.min(tooltipPos.left, window.innerWidth - 320),
            }}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-5 relative overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-[30px] pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <StepIcon size={15} className="text-primary" />
                  </div>
                  <p className="text-[13px] font-bold text-foreground leading-tight">
                    {currentStep.title}
                  </p>
                </div>
                <button
                  onClick={onComplete}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Exit tour"
                >
                  <X size={13} />
                </button>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                {currentStep.description}
              </p>

              {/* Step indicators */}
              <div className="flex items-center gap-1 mb-4">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === step
                        ? "w-5 bg-primary"
                        : i < step
                        ? "w-2 bg-primary/40"
                        : "w-2 bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  disabled={step === 0}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={13} />
                  Back
                </button>
                <span className="text-[10px] text-muted-foreground">
                  {step + 1} / {TOUR_STEPS.length}
                </span>
                <Button
                  size="sm"
                  className="h-7 text-[11px] gap-1"
                  onClick={handleNext}
                >
                  {step === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                  {step < TOUR_STEPS.length - 1 && <ChevronRight size={12} />}
                </Button>
              </div>
            </div>

            {/* Arrow pointer */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -left-2 w-0 h-0"
              style={{
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "8px solid hsl(var(--border))",
              }}
            />
          </motion.div>

          {/* Click-blocker on the rest of the screen */}
          <div
            className="fixed inset-0 z-[59]"
            onClick={() => {}} // absorbs clicks
          />
        </>
      )}
    </AnimatePresence>
  );
}
