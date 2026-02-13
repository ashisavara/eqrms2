"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  { id: "debtMf", label: "Debt MF", equityPct: 0 },
  { id: "conservativeHybrid", label: "Conservative Hybrid", equityPct: 20 },
  { id: "equitySavings", label: "Equity Savings", equityPct: 33 },
  { id: "aggressiveHybrid", label: "Aggressive Hybrid", equityPct: 66 },
  { id: "equityMf", label: "Equity MF", equityPct: 100 },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

function blendedReturn(
  equityPct: number,
  debtReturn: number,
  equityReturn: number
): number {
  return (equityPct / 100) * equityReturn + (1 - equityPct / 100) * debtReturn;
}

export default function FundCategoriesComparisonPage() {
  const [debtLow, setDebtLow] = useState(5);
  const [debtAvg, setDebtAvg] = useState(6.5);
  const [debtHigh, setDebtHigh] = useState(8);
  const [equityLow, setEquityLow] = useState(-15);
  const [equityAvg, setEquityAvg] = useState(12);
  const [equityHigh, setEquityHigh] = useState(25);
  const [allocation, setAllocation] = useState<Record<CategoryId, number>>({
    debtMf: 20,
    conservativeHybrid: 30,
    equitySavings: 10,
    aggressiveHybrid: 30,
    equityMf: 10,
  });

  const { totalAllocation, categoryReturns, portfolioEquityPct, portfolioReturns } =
    useMemo(() => {
      const total = CATEGORIES.reduce((sum, c) => sum + allocation[c.id], 0);

      const catReturns = CATEGORIES.map((c) => ({
        ...c,
        low: blendedReturn(c.equityPct, debtLow, equityLow),
        avg: blendedReturn(c.equityPct, debtAvg, equityAvg),
        high: blendedReturn(c.equityPct, debtHigh, equityHigh),
      }));

      const portfolioEquityPct =
        total > 0
          ? CATEGORIES.reduce(
              (sum, c) => sum + allocation[c.id] * c.equityPct,
              0
            ) / total
          : 0;

      const portfolioReturns = {
        low:
          total > 0
            ? CATEGORIES.reduce(
                (sum, c) =>
                  sum + allocation[c.id] * blendedReturn(c.equityPct, debtLow, equityLow),
                0
              ) / total
            : 0,
        avg:
          total > 0
            ? CATEGORIES.reduce(
                (sum, c) =>
                  sum + allocation[c.id] * blendedReturn(c.equityPct, debtAvg, equityAvg),
                0
              ) / total
            : 0,
        high:
          total > 0
            ? CATEGORIES.reduce(
                (sum, c) =>
                  sum + allocation[c.id] * blendedReturn(c.equityPct, debtHigh, equityHigh),
                0
              ) / total
            : 0,
      };

      return {
        totalAllocation: total,
        categoryReturns: catReturns,
        portfolioEquityPct,
        portfolioReturns,
      };
    }, [
      debtLow,
      debtAvg,
      debtHigh,
      equityLow,
      equityAvg,
      equityHigh,
      allocation,
    ]);

  const setAlloc = (id: CategoryId, value: number) => {
    setAllocation((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <PageTitle
        title="Comparing Returns of Different Fund Categories"
        caption="Debt and equity return scenarios, portfolio allocation in INR Lakhs, and expected returns by asset class"
      />
      <div className="p-5 max-w-5xl mx-auto space-y-6">
        <div className="ime-grid-3col gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-base mb-4">Debt Returns</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Low (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={debtLow}
                    onChange={(e) =>
                      setDebtLow(Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Average (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={debtAvg}
                    onChange={(e) =>
                      setDebtAvg(Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>High (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={debtHigh}
                    onChange={(e) =>
                      setDebtHigh(Number(e.target.value) ?? 0)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-base mb-4">Equity Returns</h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Low (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={equityLow}
                    onChange={(e) =>
                      setEquityLow(Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Average (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={equityAvg}
                    onChange={(e) =>
                      setEquityAvg(Number(e.target.value) ?? 0)
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>High (%)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    value={equityHigh}
                    onChange={(e) =>
                      setEquityHigh(Number(e.target.value) ?? 0)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-base mb-4">
                Portfolio Allocation (in INR Lakhs)
              </h3>
              <div className="space-y-3">
                {CATEGORIES.map((c) => (
                  <div key={c.id} className="space-y-1">
                    <Label>{c.label}</Label>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      value={allocation[c.id]}
                      onChange={(e) =>
                        setAlloc(c.id, Number(e.target.value) ?? 0)
                      }
                    />
                  </div>
                ))}
                <div className="pt-2 border-t font-medium flex justify-between">
                  <span>Total</span>
                  <span>{totalAllocation}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">
              Asset Class vs Returns
            </h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left font-semibold p-3">Asset Class</th>
                    <th className="text-right font-semibold p-3">% Equity</th>
                    <th className="text-right font-semibold p-3 text-red-800">Low</th>
                    <th className="text-right font-semibold p-3 text-blue-800">Average</th>
                    <th className="text-right font-semibold p-3 text-green-800">High</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Debt Returns</td>
                    <td className="p-3 text-right">0%</td>
                    <td className="p-3 text-right text-red-800">{debtLow}%</td>
                    <td className="p-3 text-right text-blue-800">{debtAvg}%</td>
                    <td className="p-3 text-right text-green-800">{debtHigh}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Equity Returns</td>
                    <td className="p-3 text-right">100%</td>
                    <td className="p-3 text-right text-red-800">{equityLow}%</td>
                    <td className="p-3 text-right text-blue-800">{equityAvg}%</td>
                    <td className="p-3 text-right text-green-800">{equityHigh}%</td>
                  </tr>
                  {categoryReturns.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="p-3 font-medium">{r.label}</td>
                      <td className="p-3 text-right">{r.equityPct}%</td>
                      <td className="p-3 text-right text-red-800">
                        {r.low.toFixed(1)}%
                      </td>
                      <td className="p-3 text-right text-blue-800">
                        {r.avg.toFixed(1)}%
                      </td>
                      <td className="p-3 text-right text-green-800">
                        {r.high.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b-2 bg-muted/30 font-semibold">
                    <td className="p-3">Portfolio Allocation</td>
                    <td className="p-3 text-right">
                      {portfolioEquityPct.toFixed(0)}%
                    </td>
                    <td className="p-3 text-right text-red-800">
                      {portfolioReturns.low.toFixed(1)}%
                    </td>
                    <td className="p-3 text-right text-blue-800">
                      {portfolioReturns.avg.toFixed(1)}%
                    </td>
                    <td className="p-3 text-right text-green-800">
                      {portfolioReturns.high.toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
