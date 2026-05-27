"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AXIS_PROPS, GRID_COLOR } from "@/lib/theme";
import ChartTooltip from "./ChartTooltip";

interface AreaChartWrapperProps {
  data: any[];
  xAxisKey: string;
  series: {
    key: string;
    name: string;
    stroke: string;
    fillGradient: string;
  }[];
}

export default function AreaChartWrapper({ data, xAxisKey, series }: AreaChartWrapperProps) {
  return (
    <div className="h-[300px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="areaAi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(234 89% 74%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(234 89% 74%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="areaManual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(173 80% 50%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(173 80% 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
          <XAxis dataKey={xAxisKey} {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip content={<ChartTooltip />} />
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.stroke}
              strokeWidth={2}
              fill={`url(#${s.fillGradient})`}
              dot={false}
              activeDot={{ r: 4, fill: s.stroke, stroke: "hsl(228 50% 6%)", strokeWidth: 2 }}
              animationDuration={1400 + i * 200}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
