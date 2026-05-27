"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Bell,
  Plus,
  Command,
  Sparkles,
  ChevronDown,
  Menu,
  User,
  Settings,
  Moon,
  HelpCircle,
  LogOut,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCRMStore } from "@/store/crmStore";
import { useModal } from "@/context/ModalContext";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

export default function Navbar({ sidebarCollapsed, onMobileMenuToggle }: NavbarProps) {
  const { currentUser } = useCRMStore();
  const { openModal } = useModal();

  const displayName = currentUser?.name ?? "Admin";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <header
        className={`
          fixed top-0 right-0 z-30 h-14
          flex items-center justify-between
          px-4 md:px-6
          bg-background/70 backdrop-blur-xl
          border-b border-border
          transition-all duration-300
          ${sidebarCollapsed ? "left-0 md:left-16" : "left-0 md:left-[248px]"}
        `}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" onClick={onMobileMenuToggle} className="md:hidden">
            <Menu size={18} />
          </Button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border w-56 lg:w-72 group focus-within:border-primary/30 focus-within:bg-secondary/70 transition-all duration-200">
            <Search size={14} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search contacts, deals..."
              className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="hidden lg:flex items-center gap-0.5">
              <kbd className="px-1 py-px text-[9px] font-medium bg-background/80 border border-border rounded text-muted-foreground">
                <Command size={8} className="inline" />
              </kbd>
              <kbd className="px-1 py-px text-[9px] font-medium bg-background/80 border border-border rounded text-muted-foreground">
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="hidden md:flex gap-1.5 text-[11px] border-primary/20 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => openModal('ai_setup')}>
            <Sparkles size={13} />
            AI Assist
          </Button>

          <Button variant="outline" size="sm" className="hidden md:flex gap-1.5 text-[11px]" onClick={() => openModal('customer')}>
            <Plus size={13} />
            New
          </Button>

          <Button variant="ghost" size="icon-sm" className="relative" onClick={() => openModal('support')}>
            <Bell size={16} />
            <Badge className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 p-0 flex items-center justify-center text-[8px]">
              3
            </Badge>
          </Button>

          <div className="hidden md:block w-px h-6 bg-border mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="hidden md:flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-[10px] font-semibold bg-primary/15 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-[12px] font-medium text-foreground leading-none">{displayName}</p>
                  <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Admin</p>
                </div>
                <ChevronDown size={12} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 bg-background/90 backdrop-blur-xl border border-border shadow-2xl p-1 rounded-xl">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg py-2" onClick={() => openModal('theme')}>
                <User size={14} className="mr-2 text-muted-foreground" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg py-2" onClick={() => openModal('ai_setup')}>
                <Settings size={14} className="mr-2 text-muted-foreground" /> Workspace Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg py-2" onClick={() => openModal('support')}>
                <Bell size={14} className="mr-2 text-muted-foreground" /> Notifications
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg py-2" onClick={() => openModal('theme')}>
                <Moon size={14} className="mr-2 text-muted-foreground" /> Theme Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer focus:bg-primary/10 focus:text-primary rounded-lg py-2" onClick={() => openModal('support')}>
                <HelpCircle size={14} className="mr-2 text-muted-foreground" /> Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-xs cursor-pointer focus:bg-destructive/10 text-destructive focus:text-destructive rounded-lg py-2"
                onClick={() => openModal('logout')}
              >
                <LogOut size={14} className="mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
