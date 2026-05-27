"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { type NavItem } from "./nav-items";

interface SidebarNavProps {
  collapsed: boolean;
  items: NavItem[];
  title?: string;
}

export default function SidebarNav({
  collapsed,
  items,
  title,
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-0.5">
      <AnimatePresence>
        {!collapsed && title && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-2.5 mb-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-widest"
          >
            {title}
          </motion.p>
        )}
      </AnimatePresence>

      {items.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const IconComponent = item.icon;

        return (
          <Link
            key={item.id}
            id={`nav-${item.id}`}
            href={item.href}
            className={`
              group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl
              text-sm transition-colors duration-200 select-none
              ${isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {isActive && (
              <motion.div
                layoutId="sidebar-active-bg"
                className="absolute inset-0 rounded-xl bg-primary/[0.08] border border-primary/5 -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            <span className="flex-shrink-0 relative z-10">
              <IconComponent size={18} />
            </span>

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="truncate text-[13px] relative z-10"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {!collapsed && item.badge && (
              <Badge variant={item.badgeVariant} className="ml-auto text-[9px] h-[18px] px-1.5 relative z-10">
                {item.badge}
              </Badge>
            )}

            {collapsed && item.badge && (
              <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-primary z-10" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
