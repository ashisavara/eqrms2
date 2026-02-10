"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatAmount(value: number): string {
  return "₹" + Math.round(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

const MONTHLY_KEYS = [
  "homeRunning",
  "emis",
  "mealsEntertainment",
  "otherMonthly",
] as const;

const LUMPY_KEYS = [
  "childrenEducation",
  "childrenOthers",
  "medical",
  "travel",
  "otherLumpy",
] as const;

const MONTHLY_LABELS: Record<(typeof MONTHLY_KEYS)[number], string> = {
  homeRunning: "Home Running Expenses",
  emis: "EMIs",
  mealsEntertainment: "Meals & Entertainment",
  otherMonthly: "Other Monthly",
};

const LUMPY_LABELS: Record<(typeof LUMPY_KEYS)[number], string> = {
  childrenEducation: "Children Education (p.a.)",
  childrenOthers: "Children Others (p.a.)",
  medical: "Medical",
  travel: "Travel",
  otherLumpy: "Other Lumpy annual exp",
};

type MonthlyState = Record<(typeof MONTHLY_KEYS)[number], { current: number; retirement: number }>;
type LumpyState = Record<(typeof LUMPY_KEYS)[number], { current: number; retirement: number }>;

const defaultMonthly: MonthlyState = {
  homeRunning: { current: 50000, retirement: 50000 },
  emis: { current: 140000, retirement: 0 },
  mealsEntertainment: { current: 20000, retirement: 20000 },
  otherMonthly: { current: 15000, retirement: 15000 },
};

const defaultLumpy: LumpyState = {
  childrenEducation: { current: 500000, retirement: 0 },
  childrenOthers: { current: 500000, retirement: 0 },
  medical: { current: 0, retirement: 1000000 },
  travel: { current: 1000000, retirement: 1500000 },
  otherLumpy: { current: 0, retirement: 1000000 },
};

export default function AnnualExpensePage() {
  const [monthly, setMonthly] = useState<MonthlyState>(defaultMonthly);
  const [lumpy, setLumpy] = useState<LumpyState>(defaultLumpy);

  const totals = useMemo(() => {
    const totalMonthlyCurrent = MONTHLY_KEYS.reduce(
      (sum, k) => sum + monthly[k].current,
      0
    );
    const totalMonthlyRetirement = MONTHLY_KEYS.reduce(
      (sum, k) => sum + monthly[k].retirement,
      0
    );
    const totalLumpyCurrent = LUMPY_KEYS.reduce(
      (sum, k) => sum + lumpy[k].current,
      0
    );
    const totalLumpyRetirement = LUMPY_KEYS.reduce(
      (sum, k) => sum + lumpy[k].retirement,
      0
    );
    return {
      totalMonthlyCurrent,
      totalMonthlyRetirement,
      annualisedCurrent: totalMonthlyCurrent * 12,
      annualisedRetirement: totalMonthlyRetirement * 12,
      totalLumpyCurrent,
      totalLumpyRetirement,
      totalAnnualCurrent: totalMonthlyCurrent * 12 + totalLumpyCurrent,
      totalAnnualRetirement: totalMonthlyRetirement * 12 + totalLumpyRetirement,
    };
  }, [monthly, lumpy]);

  const setMonthlyCell = (
    key: (typeof MONTHLY_KEYS)[number],
    col: "current" | "retirement",
    value: number
  ) => {
    setMonthly((prev) => ({
      ...prev,
      [key]: { ...prev[key], [col]: value },
    }));
  };

  const setLumpyCell = (
    key: (typeof LUMPY_KEYS)[number],
    col: "current" | "retirement",
    value: number
  ) => {
    setLumpy((prev) => ({
      ...prev,
      [key]: { ...prev[key], [col]: value },
    }));
  };

  return (
    <div>
      <PageTitle
        title="Annual Expense Calculator"
        caption="Current vs retirement expenses in current cost terms (no inflation). Total cost estimate."
      />
      <div className="p-5 max-w-5xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">
              Monthly Expenses Inputs
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              All figures in current cost terms (₹).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left font-semibold p-3"></th>
                    <th className="text-right font-semibold p-3 w-36">
                      Current Costs
                    </th>
                    <th className="text-right font-semibold p-3 w-36">
                      Retirement (Current Costs)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_KEYS.map((key) => (
                    <tr key={key} className="border-b">
                      <td className="p-3 font-medium">
                        <Label className="sr-only">{MONTHLY_LABELS[key]}</Label>
                        {MONTHLY_LABELS[key]}
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min={0}
                          step={1000}
                          value={monthly[key].current}
                          onChange={(e) =>
                            setMonthlyCell(
                              key,
                              "current",
                              Number(e.target.value) || 0
                            )
                          }
                          className="text-right h-8 pr-0 pl-3"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min={0}
                          step={1000}
                          value={monthly[key].retirement}
                          onChange={(e) =>
                            setMonthlyCell(
                              key,
                              "retirement",
                              Number(e.target.value) || 0
                            )
                          }
                          className="text-right h-8 pr-0 pl-3"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b bg-muted/30 font-medium">
                    <td className="p-3">Total Monthly</td>
                    <td className="p-3 text-right">
                      {totals.totalMonthlyCurrent.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right">
                      {totals.totalMonthlyRetirement.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="border-b bg-muted/30 font-medium">
                    <td className="p-3">Monthly expenses annualised</td>
                    <td className="p-3 text-right">
                      {totals.annualisedCurrent.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right">
                      {totals.annualisedRetirement.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">
              Lumpy Expenses Inputs
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Annual lumpy expenses in current cost terms (₹).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left font-semibold p-3"></th>
                    <th className="text-right font-semibold p-3 w-36">
                      Current Costs
                    </th>
                    <th className="text-right font-semibold p-3 w-36">
                      Retirement (Current Costs)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LUMPY_KEYS.map((key) => (
                    <tr key={key} className="border-b">
                      <td className="p-3 font-medium">
                        <Label className="sr-only">{LUMPY_LABELS[key]}</Label>
                        {LUMPY_LABELS[key]}
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min={0}
                          step={10000}
                          value={lumpy[key].current}
                          onChange={(e) =>
                            setLumpyCell(
                              key,
                              "current",
                              Number(e.target.value) || 0
                            )
                          }
                          className="text-right h-8 pr-0 pl-3"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min={0}
                          step={10000}
                          value={lumpy[key].retirement}
                          onChange={(e) =>
                            setLumpyCell(
                              key,
                              "retirement",
                              Number(e.target.value) || 0
                            )
                          }
                          className="text-right h-8 pr-0 pl-3"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b bg-muted/30 font-medium">
                    <td className="p-3">Total Lumpy Expenses</td>
                    <td className="p-3 text-right">
                      {totals.totalLumpyCurrent.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 text-right">
                      {totals.totalLumpyRetirement.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">
              Total Annual Cost Estimate
            </h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm max-w-md">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Current (annualised)</td>
                    <td className="p-3 text-right">
                      {formatAmount(totals.totalAnnualCurrent)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">
                      Retirement (annualised, current cost terms)
                    </td>
                    <td className="p-3 text-right font-semibold text-blue-800">
                      {formatAmount(totals.totalAnnualRetirement)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No inflation assumed. Retirement total = annualised monthly
              (retirement) + total lumpy (retirement).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
