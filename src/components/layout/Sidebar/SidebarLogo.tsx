"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

interface SidebarLogoProps {
  collapsed: boolean;
}

export default function SidebarLogo({ collapsed }: SidebarLogoProps) {
  return (
    <div className="flex items-center h-14 px-3.5 border-b border-sidebar-border flex-shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <motion.div
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Bot size={16} className="text-primary-foreground" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <h1 className="text-sm font-semibold text-sidebar-foreground tracking-tight leading-none">
                VoxAI
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">CRM Platform</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
