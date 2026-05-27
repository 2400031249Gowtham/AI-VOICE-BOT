"use client";

import { useState, useEffect } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import MobileOverlay from "@/components/layout/MobileOverlay";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { CRMProvider, useCRMStore } from "@/store/crmStore";
import { GlobalModalRenderer } from "@/components/modals/GlobalModalRenderer";
import { WorkspaceSelector } from "./_components/WorkspaceSelector";
import { OnboardingPrompt } from "./_components/OnboardingPrompt";
import { ProductTour } from "./_components/ProductTour";

function DashboardWorkspaceWrapper({ children }: { children: React.ReactNode }) {
  const { workspaceMode, setWorkspaceMode, onboardingCompleted, setOnboardingCompleted, currentUser } = useCRMStore();
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Route guard: redirect to login if no user
  useEffect(() => {
    if (!mounted) return;
    const stored = localStorage.getItem("voxai_current_user");
    if (!stored) {
      window.location.href = "/login";
    }
  }, [mounted]);

  // After workspace is selected and onboarding not yet done, prompt
  useEffect(() => {
    if (workspaceMode !== null && !onboardingCompleted) {
      const timer = setTimeout(() => setShowOnboardingPrompt(true), 800);
      return () => clearTimeout(timer);
    }
  }, [workspaceMode, onboardingCompleted]);

  const handleWorkspaceSelect = (mode: "demo" | "real") => {
    setWorkspaceMode(mode);
  };

  const handleStartTour = () => {
    setShowOnboardingPrompt(false);
    setTourActive(true);
  };

  const handleSkipOnboarding = () => {
    setShowOnboardingPrompt(false);
    setOnboardingCompleted(true);
  };

  const handleTourComplete = () => {
    setTourActive(false);
    setOnboardingCompleted(true);
  };

  if (workspaceMode === null) {
    return <WorkspaceSelector onSelect={handleWorkspaceSelect} />;
  }

  return (
    <>
      {children}
      <OnboardingPrompt
        visible={showOnboardingPrompt && !tourActive}
        onStartTour={handleStartTour}
        onSkip={handleSkipOnboarding}
      />
      <ProductTour active={tourActive} onComplete={handleTourComplete} />
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { collapsed, toggleCollapsed, mobileOpen, toggleMobile, closeMobile } = useSidebar();

  return (
    <CRMProvider>
      <GlobalModalRenderer />
      <DashboardWorkspaceWrapper>
        <div className="min-h-screen bg-background relative">
          {/* Ambient glow */}
          <div className="bg-ambient" />

          {/* Mobile overlay */}
          <MobileOverlay open={mobileOpen} onClose={closeMobile} />

          {/* Sidebar */}
          <div
            className={`
              fixed top-0 left-0 z-40 h-screen
              transition-transform duration-300 md:translate-x-0
              ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <Sidebar
              collapsed={collapsed}
              onToggle={toggleCollapsed}
            />
          </div>

          {/* Navbar */}
          <Navbar
            sidebarCollapsed={collapsed}
            onMobileMenuToggle={toggleMobile}
          />

          {/* Main content frame */}
          <main
            className={`
              relative z-10 pt-14
              transition-all duration-300
              ${collapsed ? "md:ml-16" : "md:ml-[248px]"}
            `}
          >
            {children}
          </main>
        </div>
      </DashboardWorkspaceWrapper>
    </CRMProvider>
  );
}
