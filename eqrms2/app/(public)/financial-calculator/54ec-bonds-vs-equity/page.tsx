"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts";

const INVESTOR_TAX_OPTIONS = [
  { value: 5.2, label: "5.2%" },
  { value: 20.8, label: "20.8%" },
  { value: 31.2, label: "31.2%" },
  { value: 33, label: "33%" },
  { value: 34.3, label: "34.3%" },
  { value: 35.9, label: "35.9%" },
  { value: 39, label: "39%" },
];

const CHART_CONFIG = {
  value: { label: "Value", color: "hsl(var(--chart-2))" },
};

function formatAmount(n: number): string {
  return Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function FiftyFourEcVsEquityPage() {
  const [investmentAmount, setInvestmentAmount] = useState(5_000_000);
  const [interest54Ec, setInterest54Ec] = useState(5.25);
  const [investorTaxRate, setInvestorTaxRate] = useState(33);
  const [equityReturn, setEquityReturn] = useState(12);
  const [periodYears, setPeriodYears] = useState(5);

  const calc = useMemo(() => {
    const postTaxRate54Ec = interest54Ec * (1 - investorTaxRate / 100);
    const ending54Ec =
      investmentAmount * Math.pow(1 + postTaxRate54Ec / 100, periodYears);

    const equityPreTax =
      investmentAmount * Math.pow(1 + equityReturn / 100, periodYears);
    const equityGains = equityPreTax - investmentAmount;
    const equityPostTax =
      investmentAmount + equityGains * (1 - investorTaxRate / 100);

    const additionalInEquity = equityPostTax - ending54Ec;

    const effectiveIrr54Ec =
      periodYears > 0
        ? (Math.pow(ending54Ec / investmentAmount, 1 / periodYears) - 1) * 100
        : 0;

    return {
      postTaxRate54Ec,
      ending54Ec,
      equityPreTax,
      equityPostTax,
      additionalInEquity,
      effectiveIrr54Ec,
    };
  }, [
    investmentAmount,
    interest54Ec,
    investorTaxRate,
    equityReturn,
    periodYears,
  ]);

  const barData = useMemo(
    () => [
      {
        name: "54 EC",
        value: calc.ending54Ec,
        label: formatAmount(calc.ending54Ec),
      },
      {
        name: "Equity",
        value: calc.equityPostTax,
        label: formatAmount(calc.equityPostTax),
      },
      {
        name: "Additional",
        value: calc.additionalInEquity,
        label: formatAmount(calc.additionalInEquity),
      },
    ],
    [calc.ending54Ec, calc.equityPostTax, calc.additionalInEquity]
  );

  const yMax =
    Math.ceil(
      Math.max(calc.ending54Ec, calc.equityPostTax, calc.additionalInEquity) /
        1_000_000
    ) * 1_000_000 || 1_000_000;

  return (
    <div>
      <PageTitle
        title="54EC vs Equity Calculator"
        caption="Compare post-tax ending amounts: 54 EC bonds vs equity investment"
      />
      <div className="p-5 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="ime-grid-3col gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investment-amount">Investment Amount (₹)</Label>
                  <Input
                    id="investment-amount"
                    type="number"
                    min={0}
                    step={100000}
                    value={investmentAmount}
                    onChange={(e) =>
                      setInvestmentAmount(Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>54 EC Interest Rate (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={15}
                    step={0.05}
                    value={interest54Ec}
                    onValueChange={setInterest54Ec}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Investor Tax Rate (%)</Label>
                  <select
                    id="tax-rate"
                    value={investorTaxRate}
                    onChange={(e) =>
                      setInvestorTaxRate(Number(e.target.value))
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm"
                  >
                    {INVESTOR_TAX_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Equity Return (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={25}
                    step={0.5}
                    value={equityReturn}
                    onValueChange={setEquityReturn}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                  <Label>Investment Period (years)</Label>
                  <SliderWithValue
                    min={1}
                    max={10}
                    step={1}
                    value={periodYears}
                    onValueChange={setPeriodYears}
                  />
                </div>
            </div>
          </CardContent>
        </Card>
        <div className="ime-grid-2col gap-4">
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">
              Post-Tax Ending Amount
            </h3>
            <ChartContainer config={CHART_CONFIG} className="h-[280px] w-full">
              <BarChart
                data={barData}
                margin={{ top: 32, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  interval={0}
                />
                <YAxis
                  type="number"
                  domain={[0, yMax]}
                  tickFormatter={(v) => `${v / 1_000_000}L`}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={[2, 2, 0, 0]}
                  barSize={48}
                >
                  <LabelList
                    dataKey="label"
                    position="top"
                    className="fill-foreground font-medium"
                    style={{ fontSize: 11 }}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm max-w-lg">
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Investment Amount</td>
                  <td className="p-3 text-right">
                    {formatAmount(investmentAmount)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Pre-tax Interest Rate</td>
                  <td className="p-3 text-right">{interest54Ec.toFixed(2)}%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Investor Tax Rate</td>
                  <td className="p-3 text-right">{investorTaxRate}%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Post-tax Interest Rate</td>
                  <td className="p-3 text-right">
                    {calc.postTaxRate54Ec.toFixed(2)}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Investment Period</td>
                  <td className="p-3 text-right">{periodYears} years</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">
                    Ending Amount 54 EC (Post Tax)
                  </td>
                  <td className="p-3 text-right font-semibold text-blue-800">
                    {formatAmount(calc.ending54Ec)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">
                    Effective Post-tax IRR on 54 EC
                  </td>
                  <td className="p-3 text-right font-semibold text-blue-800">
                    {calc.effectiveIrr54Ec.toFixed(1)}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Equity Return</td>
                  <td className="p-3 text-right">{equityReturn}%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">
                    Ending Amount Equity (Pre-tax)
                  </td>
                  <td className="p-3 text-right">
                    {formatAmount(calc.equityPreTax)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">
                    Ending Amount Equity (Post-tax)
                  </td>
                  <td className="p-3 text-right font-semibold text-blue-800">
                    {formatAmount(calc.equityPostTax)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">
                    Additional Returns Made in Equity
                  </td>
                  <td className="p-3 text-right font-semibold text-blue-800">
                    {formatAmount(calc.additionalInEquity)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
