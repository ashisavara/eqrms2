"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import {
  ChartContainer,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const TAX_LLP = 35;
const TAX_TRUST = 39;

const CHART_CONFIG = {
  value: { label: "Value", color: "hsl(var(--chart-2))" },
};

function performanceFeePct(
  grossPct: number,
  fixedFeePct: number,
  hurdlePct: number,
  performanceSharePct: number,
  catchUp: boolean
): number {
  const base = catchUp
    ? Math.max(0, grossPct - fixedFeePct)
    : Math.max(0, grossPct - fixedFeePct - hurdlePct);
  return base * (performanceSharePct / 100);
}

export default function AifPostTaxReturnsPage() {
  const [grossReturns, setGrossReturns] = useState(15);
  const [performanceSharing, setPerformanceSharing] = useState(10);
  const [fixedMgmtFee, setFixedMgmtFee] = useState(2);
  const [hurdleRate, setHurdleRate] = useState(10);
  const [structure, setStructure] = useState<"LLP" | "Trust">("LLP");
  const [catchUp, setCatchUp] = useState(true);

  const calc = useMemo(() => {
    const perfFee = performanceFeePct(
      grossReturns,
      fixedMgmtFee,
      hurdleRate,
      performanceSharing,
      catchUp
    );
    const totalFees = fixedMgmtFee + perfFee;
    const postFeePreTax = grossReturns - totalFees;
    const taxRate = structure === "LLP" ? TAX_LLP : TAX_TRUST;
    const postTax = postFeePreTax * (1 - taxRate / 100);

    return {
      performanceFee: perfFee,
      totalFees,
      postFeePreTax,
      taxRate,
      postTax,
    };
  }, [
    grossReturns,
    fixedMgmtFee,
    hurdleRate,
    performanceSharing,
    catchUp,
    structure,
  ]);

  const barData = useMemo(
    () => [
      { name: "Gross Returns", value: grossReturns },
      { name: "Pre-Tax Post Fees", value: calc.postFeePreTax },
      { name: "Post-Tax Returns", value: calc.postTax },
      { name: "Total Fees", value: calc.totalFees },
    ],
    [grossReturns, calc.postFeePreTax, calc.postTax, calc.totalFees]
  );

  const xMax = Math.ceil(Math.max(grossReturns, calc.postFeePreTax, calc.postTax, calc.totalFees) / 2) * 2 || 16;

  return (
    <div>
      <PageTitle
        title="AIF Post-Tax Returns Calculator"
        caption="Estimating post-tax returns of an AIF from gross returns"
      />
      <div className="p-5 max-w-5xl mx-auto">
        <Card>
          <CardContent className="p-6 space-y-6">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Estimating Post-Tax Returns of an AIF from Gross Returns
            </h3>

            <div className="ime-grid-2col gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Gross Returns (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={40}
                    step={0.5}
                    value={grossReturns}
                    onValueChange={setGrossReturns}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Performance Sharing (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={50}
                    step={0.5}
                    value={performanceSharing}
                    onValueChange={setPerformanceSharing}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fixed Management Fee (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={10}
                    step={0.1}
                    value={fixedMgmtFee}
                    onValueChange={setFixedMgmtFee}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hurdle Rate (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={25}
                    step={0.5}
                    value={hurdleRate}
                    onValueChange={setHurdleRate}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Structure</Label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="structure"
                        checked={structure === "LLP"}
                        onChange={() => setStructure("LLP")}
                        className="rounded-full border-input text-primary focus:ring-primary"
                      />
                      <span>LLP</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="structure"
                        checked={structure === "Trust"}
                        onChange={() => setStructure("Trust")}
                        className="rounded-full border-input text-primary focus:ring-primary"
                      />
                      <span>Trust</span>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    LLP: {TAX_LLP}% tax. Trust: {TAX_TRUST}% tax.
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Catch-up?</Label>
                  <div className="flex gap-6 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="catchup"
                        checked={catchUp === true}
                        onChange={() => setCatchUp(true)}
                        className="rounded-full border-input text-primary focus:ring-primary"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="catchup"
                        checked={catchUp === false}
                        onChange={() => setCatchUp(false)}
                        className="rounded-full border-input text-primary focus:ring-primary"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Yes: profit share on (gross − fixed fee). No: profit share on
                    (gross − fixed fee − hurdle).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="ime-grid-2col gap-8">
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">Returns</h3>
            <ChartContainer config={CHART_CONFIG} className="h-[220px] w-full">
              <BarChart
                layout="vertical"
                data={barData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, xMax]}
                  tickFormatter={(v) => `${v}%`}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={90}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar
                  dataKey="value"
                  fill="var(--color-value)"
                  radius={[0, 2, 2, 0]}
                  barSize={24}
                />
              </BarChart>
            </ChartContainer>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Post-fee returns (%)
            </p>
          </CardContent>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Summary</h3>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm max-w-md">
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Gross Returns</td>
                  <td className="p-3 text-right">{grossReturns.toFixed(2)}%</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Fixed Mgmt Fee</td>
                  <td className="p-3 text-right">
                    {fixedMgmtFee.toFixed(2)}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Performance Fee</td>
                  <td className="p-3 text-right">
                    {calc.performanceFee.toFixed(2)}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Post-fee Pre-Tax Returns</td>
                  <td className="p-3 text-right">
                    {calc.postFeePreTax.toFixed(2)}%
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Tax Rate</td>
                  <td className="p-3 text-right">{calc.taxRate}%</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Post-tax Returns</td>
                  <td className="p-3 text-right text-blue-800 font-semibold">
                    {calc.postTax.toFixed(2)}%
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
