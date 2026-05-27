"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function GlassCard({
  children,
  className,
  noPadding = false,
}: GlassCardProps) {
  return (
    <Card className={cn(
      "bg-card/60 backdrop-blur-sm border-border card-hover overflow-hidden transition-all duration-300",
      className
    )}>
      <CardContent className={cn("p-4 md:p-6", noPadding && "p-0")}>
        {children}
      </CardContent>
    </Card>
  );
}
