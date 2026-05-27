"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/animations";

interface MobileOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileOverlay({ open, onClose }: MobileOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
}
