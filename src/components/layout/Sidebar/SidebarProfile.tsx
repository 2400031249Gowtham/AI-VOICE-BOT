"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCRMStore } from "@/store/crmStore";

interface SidebarProfileProps {
  collapsed: boolean;
}

export default function SidebarProfile({ collapsed }: SidebarProfileProps) {
  const { currentUser, logout } = useCRMStore();

  const displayName = currentUser?.name ?? "Workspace";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const email = currentUser?.email ?? "";

  return (
    <div className="px-2 pb-2.5 pt-1.5 border-t border-sidebar-border flex-shrink-0">
      <div
        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-sidebar-accent transition-colors ${collapsed ? "justify-center" : ""}`}
      >
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-[10px] font-semibold bg-primary/15 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="flex-1 min-w-0"
            >
              <p className="text-[13px] font-medium text-sidebar-foreground truncate leading-none">
                {displayName}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {email || "Admin"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {!collapsed && (
          <button
            onClick={logout}
            title="Sign out"
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
