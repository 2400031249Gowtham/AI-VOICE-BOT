"use client";

import { Users, PhoneCall, DollarSign, TrendingUp } from "lucide-react";
import StatsCard from "@/components/cards/StatsCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatsCard
        title="Total Leads"
        value="2,847"
        change="+12.5%"
        trend="up"
        icon={<Users size={17} />}
        chartColor="hsl(234 89% 74%)"
        sparkData={[{ v: 30 }, { v: 45 }, { v: 38 }, { v: 52 }, { v: 48 }, { v: 62 }, { v: 58 }, { v: 70 }, { v: 65 }, { v: 85 }]}
        index={0}
      />
      <StatsCard
        title="AI Calls Today"
        value="184"
        change="+23.1%"
        trend="up"
        icon={<PhoneCall size={17} />}
        chartColor="hsl(173 80% 50%)"
        sparkData={[{ v: 20 }, { v: 35 }, { v: 28 }, { v: 50 }, { v: 42 }, { v: 55 }, { v: 48 }, { v: 65 }, { v: 60 }, { v: 80 }]}
        index={1}
      />
      <StatsCard
        title="Revenue Pipeline"
        value="$539.7k"
        change="+8.3%"
        trend="up"
        icon={<DollarSign size={17} />}
        chartColor="hsl(258 90% 66%)"
        sparkData={[{ v: 50 }, { v: 42 }, { v: 55 }, { v: 48 }, { v: 65 }, { v: 58 }, { v: 72 }, { v: 68 }, { v: 78 }, { v: 90 }]}
        index={2}
      />
      <StatsCard
        title="Conversion Rate"
        value="24.8%"
        change="-2.1%"
        trend="down"
        icon={<TrendingUp size={17} />}
        chartColor="hsl(43 96% 56%)"
        sparkData={[{ v: 60 }, { v: 58 }, { v: 55 }, { v: 62 }, { v: 48 }, { v: 52 }, { v: 45 }, { v: 50 }, { v: 42 }, { v: 40 }]}
        index={3}
      />
    </div>
  );
}
