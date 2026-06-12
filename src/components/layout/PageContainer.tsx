"use client";

import AnimatedSection from "@/components/shared/AnimatedSection";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({ children, className }: PageContainerProps) {
  return (
    <AnimatedSection
      variant="fadeInUp"
      className={cn("w-full px-6 py-4 md:py-6 lg:py-8 max-w-[1440px] mx-auto space-y-6 relative z-10", className)}
    >
      {children}
    </AnimatedSection>
  );
}
