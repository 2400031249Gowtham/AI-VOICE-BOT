"use client";

import { useState, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════════════
   Sidebar State Hook
   Manages collapsed / mobile-open state with optional
   localStorage persistence.
   ═══════════════════════════════════════════════════════ */

const STORAGE_KEY = "vox-sidebar-collapsed";

function getStoredCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);



  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // silent fail
      }
      return next;
    });
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return {
    collapsed,
    toggleCollapsed,
    mobileOpen,
    toggleMobile,
    closeMobile,
  } as const;
}
