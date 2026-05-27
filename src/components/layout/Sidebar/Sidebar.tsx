"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusIndicator from "@/components/shared/StatusIndicator";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";
import { mainNav, bottomNav } from "./nav-items";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="fixed top-0 left-0 z-40 h-screen flex flex-col bg-sidebar border-r border-sidebar-border sidebar-transition overflow-hidden"
      style={{ width: collapsed ? 64 : 248 }}
    >
      <SidebarLogo collapsed={collapsed} />

      {/* AI Status */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-3 mt-3 overflow-hidden flex-shrink-0"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/8 border border-primary/10">
              <Sparkles size={12} className="text-primary animate-pulse" />
              <span className="text-[11px] font-medium text-primary">AI Engine Active</span>
              <StatusIndicator label="ONLINE" color="teal" className="ml-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 mt-3 space-y-4">
        <SidebarNav
          collapsed={collapsed}
          items={mainNav}
          title="Menu"
        />
      </nav>

      {/* Bottom Nav */}
      <div className="px-2 pb-1 space-y-0.5 flex-shrink-0">
        <SidebarNav
          collapsed={collapsed}
          items={bottomNav}
        />
      </div>

      <SidebarProfile collapsed={collapsed} />

      {/* Collapse button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="absolute -right-3 top-[60px] z-50 rounded-full shadow-md bg-card border-border w-6 h-6"
        aria-label={collapsed ? "Expand" : "Collapse"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>
    </aside>
  );
}
