"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AXIS_PROPS } from "@/lib/theme";
import ChartTooltip from "./ChartTooltip";

interface BarChartWrapperProps {
  data: any[];
  xAxisKey: string;
  dataKey: string;
  name: string;
  fill: string;
}

export default function BarChartWrapper({
  data,
  xAxisKey,
  dataKey,
  name,
  fill,
}: BarChartWrapperProps) {
  return (
    <div className="h-[120px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey={xAxisKey} {...AXIS_PROPS} />
          <YAxis {...AXIS_PROPS} />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey={dataKey}
            name={name}
            fill={fill}
            radius={[4, 4, 0, 0]}
            animationDuration={1200}
            fillOpacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
