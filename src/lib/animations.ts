import type { Variants, Transition } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   VOXAI CRM — Shared Animation System
   Centralized Framer Motion variants for consistent,
   buttery-smooth transitions across the entire app.
   ═══════════════════════════════════════════════════════ */

// ─── Timing presets ─────────────────────────────────────
export const spring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 28,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

export const easeSmooth: Transition = {
  duration: 0.45,
  ease: [0.4, 0, 0.2, 1],
};

// ─── Fade In Up (default entrance) ─────────────────────
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
};

// ─── Fade In (simple opacity) ───────────────────────────
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// ─── Slide In Left (sidebar / panels) ───────────────────
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: -12,
    transition: { duration: 0.15 },
  },
};

// ─── Slide In Right ─────────────────────────────────────
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: 12,
    transition: { duration: 0.15 },
  },
};

// ─── Scale In (badges, avatars) ─────────────────────────
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 22 },
  },
};

// ─── Stagger Container ──────────────────────────────────
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// ─── Stagger Item ───────────────────────────────────────
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
};

// ─── Collapse (height animation) ────────────────────────
export const collapse: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2 },
  },
};

// ─── Helper: create delayed fadeInUp ────────────────────
export function delayedFadeInUp(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] },
    },
  };
}

// ─── Helper: stagger item with custom delay ─────────────
export function indexedDelay(baseDelay: number, index: number, step = 0.08) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.45,
      delay: baseDelay + index * step,
      ease: [0.4, 0, 0.2, 1] as number[],
    },
  };
}
