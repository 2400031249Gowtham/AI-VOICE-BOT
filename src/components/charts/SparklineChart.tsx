"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface SparklineChartProps {
  data: { v: number }[];
  color: string;
  index: number;
}

export default function SparklineChart({ data, color, index }: SparklineChartProps) {
  return (
    <div className="h-12 w-full mt-2 -mx-4 -mb-0 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#spark-${index})`}
            dot={false}
            isAnimationActive={true}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
