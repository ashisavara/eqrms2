"use client";

import { Bar, CartesianGrid, ComposedChart, Legend, Line, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  type CombinedFinPlanChartPoint,
} from "./finplan-util";

/** HSL aligned with `tailwind.config.ts`: green-800 (#6d8a34), red-800 (#BE3434). */
const CHART_CONFIG = {
  aum: { label: "Projected AUM (Rs. lakh)", color: "hsl(86 45% 37%)" },
  fvGoals: { label: "FV Goal (Rs. lakh)", color: "hsl(0 59% 47%)" },
};

type FinPlanAumProjectionChartProps = { data: CombinedFinPlanChartPoint[] };

export default function FinPlanAumProjectionChart({
  data,
}: FinPlanAumProjectionChartProps) {
  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No investment, SIP, or goal data to plot.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-base font-semibold">Projected AUM and FV goals (year-end)</h4>
      <p className="text-sm text-muted-foreground">
        Line: total projected AUM. Bars: sum of `fv_goals` for goals maturing in that calendar year. Values in Rs. lakh.
      </p>
      <ChartContainer config={CHART_CONFIG} className="aspect-[16/9] max-h-[360px] w-full">
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 12, left: 4, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="yearLabel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) =>
              typeof v === "number" ? v.toLocaleString(undefined, { maximumFractionDigits: 1 }) : String(v)
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(label) =>
                  label != null && label !== "" ? `Year ${label}` : ""
                }
              />
            }
          />
          <Legend
            verticalAlign="top"
            height={28}
            formatter={(value) => (
              value === "fvGoals" ? CHART_CONFIG.fvGoals.label : CHART_CONFIG.aum.label
            )}
          />
          <Bar
            dataKey="fvGoals"
            name="fvGoals"
            fill="var(--color-fvGoals)"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
          <Line
            type="monotone"
            dataKey="aum"
            name="aum"
            stroke="var(--color-aum)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}
