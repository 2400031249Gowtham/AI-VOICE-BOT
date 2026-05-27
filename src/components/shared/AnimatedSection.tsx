"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  fadeInUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";

/* ═══════════════════════════════════════════════════════
   AnimatedSection — Reusable motion wrapper
   Provides consistent entrance animations across
   all dashboard sections and components.
   ═══════════════════════════════════════════════════════ */

const variantMap: Record<string, Variants> = {
  fadeInUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  scaleIn,
  staggerContainer,
  staggerItem,
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: keyof typeof variantMap;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article";
}

export default function AnimatedSection({
  children,
  variant = "fadeInUp",
  delay,
  className,
  as = "div",
}: AnimatedSectionProps) {
  const selected = variantMap[variant] ?? fadeInUp;
  const Tag = motion.create(as);

  // If a custom delay is provided, override the transition
  const transitionOverride = delay !== undefined ? { delay } : undefined;

  return (
    <Tag
      variants={selected}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={transitionOverride}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
