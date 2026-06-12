"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusIndicator from "@/components/shared/StatusIndicator";
import SidebarLogo from "./SidebarLogo";
import SidebarNav from "./SidebarNav";
import SidebarProfile from "./SidebarProfile";
import { useCRMStore } from "@/store/crmStore";
import { mainNav, modulesNav, bottomNav } from "./nav-items";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const activeCall = useCRMStore((s) => s.activeCall);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden transition-all duration-200 ${collapsed ? 'w-16' : 'w-[250px]'} `}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
  {!collapsed && (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white text-xs font-bold">V</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900">VoxAI</p>
        <p className="text-xs text-gray-400">CRM Platform</p>
      </div>
    </div>
  )}
  <button
    onClick={() => onToggle()}
    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-purple-600 transition-colors ml-auto flex-shrink-0"
    aria-label={collapsed ? "Expand" : "Collapse"}
  >
    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
  </button>
</div>

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

      {/* Active Call Indicator */}
      <AnimatePresence>
        {activeCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mx-3 mt-2 overflow-hidden flex-shrink-0"
          >
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <div className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              {!collapsed ? (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[10px] uppercase tracking-wider text-emerald-500 font-semibold">Active Call</p>
                  <p className="text-xs font-medium text-foreground truncate">{activeCall.customerName}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{formatDuration(activeCall.duration)}</p>
                </div>
              ) : (
                <span className="text-[9px] font-bold tabular-nums">{formatDuration(activeCall.duration)}</span>
              )}
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
        <SidebarNav
          collapsed={collapsed}
          items={modulesNav}
          title="Modules"
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

    </aside>
  );
}
