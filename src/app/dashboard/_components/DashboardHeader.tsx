"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCRMStore } from "@/store/crmStore";

export default function DashboardHeader() {
  const { currentUser, stats } = useCRMStore();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const firstName = currentUser?.name?.split(" ")[0] ?? "there";
  const totalCalls = stats?.totalCalls ?? 0;
  const followupsToday = stats?.followupsToday ?? 0;

  return (
    <motion.div
      id="dashboard-header"
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <p className="text-[11px] text-muted-foreground font-medium mb-1">{today}</p>
        <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1 max-w-md leading-relaxed">
          {totalCalls > 0 ? (
            <>
              Your AI agents handled{" "}
              <span className="text-chart-1 font-semibold">{totalCalls} calls</span> total.{" "}
              {followupsToday > 0 && (
                <>
                  You have{" "}
                  <span className="text-foreground font-medium">{followupsToday} follow-ups</span> pending today.
                </>
              )}
            </>
          ) : (
            <>
              Start by importing exporters or exploring the{" "}
              <span className="text-primary font-medium">Demo Workspace</span> to see AI workflows in action.
            </>
          )}
        </p>
      </div>

      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Button variant="outline" size="sm" className="text-[12px]">
          Export
        </Button>
        <Button size="sm" className="text-[12px] gap-1.5">
          View Pipeline
          <ArrowUpRight size={12} />
        </Button>
      </motion.div>
    </motion.div>
  );
}
