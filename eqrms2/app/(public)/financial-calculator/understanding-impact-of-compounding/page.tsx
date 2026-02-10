"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const YEAR_HORIZONS = [5, 10, 15, 20] as const;

const CHART_CONFIG = {
  debt: { label: "Debt", color: "hsl(var(--chart-1))" },
  equitySavings: { label: "Equity Savings", color: "hsl(var(--chart-2))" },
  aggHybrid: { label: "Agg Hybrid", color: "hsl(var(--chart-3))" },
  equity: { label: "Equity", color: "hsl(var(--chart-4))" },
};

function endingValue(principal: number, ratePct: number, years: number): number {
  const r = ratePct / 100;
  return principal * Math.pow(1 + r, years);
}

export default function PowerOfCompoundingPage() {
  const [amountLakhs, setAmountLakhs] = useState(50);
  const [debtPct, setDebtPct] = useState(5);
  const [equityPct, setEquityPct] = useState(15);

  const equitySavingsPct = useMemo(
    () => 0.33 * equityPct + 0.67 * debtPct,
    [equityPct, debtPct]
  );
  const aggHybridPct = useMemo(
    () => 0.66 * equityPct + 0.34 * debtPct,
    [equityPct, debtPct]
  );

  const tableData = useMemo(() => {
    return YEAR_HORIZONS.map((years) => ({
      years,
      debt: Math.round(endingValue(amountLakhs, debtPct, years)),
      equitySavings: Math.round(
        endingValue(amountLakhs, equitySavingsPct, years)
      ),
      aggHybrid: Math.round(endingValue(amountLakhs, aggHybridPct, years)),
      equity: Math.round(endingValue(amountLakhs, equityPct, years)),
    }));
  }, [amountLakhs, debtPct, equityPct, equitySavingsPct, aggHybridPct]);

  const chartData = useMemo(
    () =>
      tableData.map((row) => ({
        ...row,
        yearsLabel: `${row.years} years`,
      })),
    [tableData]
  );

  return (
    <div>
      <PageTitle
        title="Power of Compounding Calculator"
        caption="See how your investment grows over time across debt, equity savings, aggressive hybrid, and equity."
      />
      <div className="p-5 max-w-5xl mx-auto">
        <div className="ime-grid-2col gap-12 mb-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount Invested (Rs. Lakhs)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1}
                  step={1}
                  value={amountLakhs}
                  onChange={(e) =>
                    setAmountLakhs(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3">
                  RETURNS ASSUMPTIONS
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Debt</Label>
                    <SliderWithValue
                      min={0}
                      max={20}
                      step={0.5}
                      value={debtPct}
                      onValueChange={setDebtPct}
                      formatValue={(v) => `${v}%`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Equity</Label>
                    <SliderWithValue
                      min={0}
                      max={25}
                      step={0.5}
                      value={equityPct}
                      onValueChange={setEquityPct}
                      formatValue={(v) => `${v}%`}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1 pt-2">
                    <p>Equity Savings {equitySavingsPct.toFixed(1)}%</p>
                    <p>Agg Hybrid {aggHybridPct.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-base mb-4">
                Ending Value of Investment (Rs. lakhs)
              </h3>
              <ChartContainer config={CHART_CONFIG} className="h-[280px] w-full">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="yearsLabel"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => String(v)}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) =>
                          [value?.toLocaleString(), undefined]
                        }
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="debt"
                    fill="var(--color-debt)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="equitySavings"
                    fill="var(--color-equitySavings)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="aggHybrid"
                    fill="var(--color-aggHybrid)"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="equity"
                    fill="var(--color-equity)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Ending Amount of Investment (Rs. lakhs)
          </h3>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-semibold p-3"># years</th>
                  <th className="text-right font-semibold p-3">Debt</th>
                  <th className="text-right font-semibold p-3">
                    Equity Savings
                  </th>
                  <th className="text-right font-semibold p-3">Agg Hybrid</th>
                  <th className="text-right font-semibold p-3">Equity</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.years} className="border-b">
                    <td className="font-medium p-3">{row.years}</td>
                    <td className="text-right p-3">{row.debt}</td>
                    <td className="text-right p-3">{row.equitySavings}</td>
                    <td className="text-right p-3">{row.aggHybrid}</td>
                    <td className="text-right p-3">{row.equity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
