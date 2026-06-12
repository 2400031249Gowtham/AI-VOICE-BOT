"use client";

import { motion } from "framer-motion";
import { PhoneCall, Mail, MessageSquare, UserPlus, CheckCircle2, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { CardContent, CardHeader, CardTitle, CardDescription, CardAction } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/cards/GlassCard";
import ActivityItem from "@/components/cards/ActivityItem";
import { useCRMStore } from "@/store/crmStore";

export default function DealsActivitySection() {
  const customers = useCRMStore((s) => s.customers ?? []);
  const calls = useCRMStore((s) => s.calls ?? []);

  // Map real customers to deals list
  const activeDeals = customers
    .filter((c) => c.status === "Hot" || c.status === "Warm")
    .map((c) => ({
      id: c.id,
      company: c.company || "Exporter Profile",
      contact: c.name,
      initials: c.initials,
      value: `₹${(c.lastRateDiscussed || 15500).toLocaleString()}`,
      stage: c.status === "Hot" ? "Negotiation" : "Qualified",
      stageVariant: (c.status === "Hot" ? "outline" : "secondary") as "outline" | "secondary",
      probability: c.status === "Hot" ? 75 : 45,
      lastActivity: c.lastContact || "Never"
    }))
    .slice(0, 5);

  // Map real calls to activity log
  const recentActivities = calls
    .map((c, idx) => ({
      id: c.id || String(idx),
      icon: <PhoneCall size={13} />,
      title: `AI Outbound Call completed — ${c.customerName}`,
      desc: c.summary || "Conversation completed by relationship assistant.",
      time: "Just now"
    }))
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Deals Table */}
      <div className="xl:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
        >
          <GlassCard noPadding>
            <div className="p-6 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">Active Deals</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {activeDeals.length} active leads · ₹
                  {(activeDeals.reduce((sum, d) => sum + parseInt(String(d?.value ?? "").replace(/[^0-9]/g, "") || "0", 10), 0) / 1000).toFixed(1)}k pipeline
                </p>
              </div>
              <Button variant="ghost" size="xs" className="text-muted-foreground gap-1">
                View all <ArrowUpRight size={11} />
              </Button>
            </div>

            {activeDeals.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No active deals. Mark an exporter as Hot or Warm to track pipeline value.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pl-6">Company</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Value</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Stage</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Probability</TableHead>
                    <TableHead className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Activity</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeDeals.map((deal, i) => (
                    <motion.tr
                      key={deal.id}
                      className="border-border/50 hover:bg-accent/30 transition-colors group"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                    >
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[9px] font-semibold bg-primary/10 text-primary">
                              {deal.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-[12px] font-medium text-foreground truncate">{deal.company}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{deal.contact}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[12px] font-semibold text-foreground">{deal.value}</span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant={deal.stageVariant} className="text-[10px] h-5">{deal.stage}</Badge>
                      </TableCell>
                      <TableCell className="py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden max-w-[80px]">
                            <motion.div
                              className="h-full rounded-full bg-primary/70"
                              initial={{ width: 0 }}
                              animate={{ width: `${deal.probability}%` }}
                              transition={{ delay: 0.5 + i * 0.06, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium">{deal.probability}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 hidden lg:table-cell">
                        <span className="text-[11px] text-muted-foreground">{deal.lastActivity}</span>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <Button variant="ghost" size="icon-xs" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal size={13} />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-semibold text-foreground">Activity</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Recent updates</p>
              </div>
              <Badge variant="outline" className="text-[9px] h-[18px] gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" />
                Live
              </Badge>
            </div>

            <div className="space-y-0.5">
              {recentActivities.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  No recent activities recorded. Start an AI call to begin.
                </div>
              ) : (
                recentActivities.map((a, i) => (
                  <ActivityItem
                    key={a.id}
                    icon={a.icon}
                    title={a.title}
                    desc={a.desc}
                    time={a.time}
                    index={i}
                  />
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
