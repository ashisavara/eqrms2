"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const TAX_RATE_OPTIONS = [
  { value: 5.2, label: "5.2%" },
  { value: 20.8, label: "20.8%" },
  { value: 31.2, label: "31.2%" },
  { value: 33, label: "33%" },
  { value: 34.3, label: "34.3%" },
  { value: 35.9, label: "35.9%" },
  { value: 39, label: "39%" },
];

const INITIAL_NAV = 100;

const CHART_CONFIG = {
  debtMFTax: { label: "Debt MF Tax", color: "hsl(270 60% 50%)" },
  bankFDTax: { label: "Bank FD Tax", color: "hsl(45 90% 65%)" },
  debtMFPostTax: { label: "Debt MF Post-tax", color: "hsl(270 60% 50%)" },
  bankFDPostTax: { label: "Bank FD Post-tax", color: "hsl(45 90% 65%)" },
};

function formatAmount(n: number): string {
  return Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function DebtMfVsBankFdPage() {
  const [investmentAmount, setInvestmentAmount] = useState(10_000_000);
  const [interestRatePct, setInterestRatePct] = useState(7.5);
  const [taxRatePct, setTaxRatePct] = useState(39);
  const years = 10;

  const redemptionAmount = useMemo(
    () => (investmentAmount * interestRatePct) / 100,
    [investmentAmount, interestRatePct]
  );

  const bankFDInterest = redemptionAmount;
  const bankFDTax = (bankFDInterest * taxRatePct) / 100;
  const bankFDPostTaxIncome = bankFDInterest - bankFDTax;

  const cashFlows = useMemo(() => {
    const rows: Array<{
      year: number;
      investmentAmount: number;
      startingUnits: number;
      startingNAV: number;
      endingNAV: number;
      redemptionAmount: number;
      unitsRedeemed: number;
      endingUnits: number;
      endingValue: number;
      capitalGainPerUnit: number;
      debtMFTax: number;
      bankFDTax: number;
      debtMFPostTaxIncome: number;
      bankFDPostTaxIncome: number;
      pctHigherPostTax: number;
    }> = [];
    const r = interestRatePct / 100;
    const costPerUnit = INITIAL_NAV;
    let units = investmentAmount / INITIAL_NAV;
    let nav = INITIAL_NAV;

    for (let year = 1; year <= years; year++) {
      const startingNAV = nav;
      const endingNAV = nav * (1 + r);
      const unitsRedeemed = redemptionAmount / endingNAV;
      const endingUnits = units - unitsRedeemed;
      const endingValue = endingUnits * endingNAV;
      const capitalGainPerUnit = endingNAV - costPerUnit;
      const totalCapitalGain = capitalGainPerUnit * unitsRedeemed;
      const debtMFTax = (totalCapitalGain * taxRatePct) / 100;
      const debtMFPostTaxIncome = redemptionAmount - debtMFTax;
      const pctHigher =
        bankFDPostTaxIncome > 0
          ? ((debtMFPostTaxIncome - bankFDPostTaxIncome) / bankFDPostTaxIncome) *
            100
          : 0;

      rows.push({
        year,
        investmentAmount,
        startingUnits: units,
        startingNAV,
        endingNAV,
        redemptionAmount,
        unitsRedeemed,
        endingUnits,
        endingValue,
        capitalGainPerUnit,
        debtMFTax,
        bankFDTax,
        debtMFPostTaxIncome,
        bankFDPostTaxIncome,
        pctHigherPostTax: pctHigher,
      });

      units = endingUnits;
      nav = endingNAV;
    }
    return rows;
  }, [
    investmentAmount,
    interestRatePct,
    taxRatePct,
    years,
    redemptionAmount,
    bankFDPostTaxIncome,
  ]);

  const taxChartData = useMemo(
    () =>
      cashFlows.map((r) => ({
        year: `Year ${r.year}`,
        yearNum: r.year,
        debtMFTax: Math.round(r.debtMFTax),
        bankFDTax: Math.round(r.bankFDTax),
      })),
    [cashFlows]
  );

  const postTaxChartData = useMemo(
    () =>
      cashFlows.map((r) => ({
        year: `Year ${r.year}`,
        yearNum: r.year,
        debtMFPostTax: Math.round(r.debtMFPostTaxIncome),
        bankFDPostTax: Math.round(r.bankFDPostTaxIncome),
      })),
    [cashFlows]
  );

  const taxChartMax =
    Math.ceil(
      Math.max(
        ...cashFlows.map((r) => Math.max(r.debtMFTax, r.bankFDTax))
      ) / 50000
    ) * 50000 || 100000;
  const postTaxChartMax =
    Math.ceil(
      Math.max(
        ...cashFlows.map((r) =>
          Math.max(r.debtMFPostTaxIncome, r.bankFDPostTaxIncome)
        )
      ) / 100000
    ) * 100000 || 500000;

  return (
    <div>
      <PageTitle
        title="Debt MF vs Bank FD (Redeeming Interest every year)"
        caption="New Tax Structure"
      />
      <div className="p-5 mx-auto space-y-6">
        <p className="text-sm text-muted-foreground">
          Since Debt Funds are only taxed on redemption (on the capital gains
          portion of redeemed units), while bank fixed deposits are taxed every
          year on the full interest, the difference in taxes between Debt MF and
          Bank FD remains substantial even under the new tax regime. The example
          below shows the difference when you redeem from the Debt MF each year
          an amount equivalent to the bank FD interest.
        </p>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="grid ime-grid-3col gap-6">
              <div className="space-y-2">
                <Label htmlFor="investment">Investment Amount (₹)</Label>
                <Input
                  id="investment"
                  type="number"
                  min={100000}
                  step={100000}
                  value={investmentAmount}
                  onChange={(e) =>
                    setInvestmentAmount(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Interest Rate (%)</Label>
                <SliderWithValue
                  min={4}
                  max={12}
                  step={0.25}
                  value={interestRatePct}
                  onValueChange={setInterestRatePct}
                  formatValue={(v) => `${v}%`}
                />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate</Label>
                <Select
                  value={String(taxRatePct)}
                  onValueChange={(v) => setTaxRatePct(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_RATE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="ime-grid-2col gap-8">
              <div>
                <h3 className="font-semibold text-base mb-4">
                  Annual Taxes Paid
                </h3>
                <ChartContainer
                  config={CHART_CONFIG}
                  className="h-[320px] w-full"
                >
                  <BarChart
                    layout="vertical"
                    data={taxChartData}
                    margin={{ top: 8, right: 24, bottom: 8, left: 60 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={[0, taxChartMax]}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <YAxis type="category" dataKey="year" width={50} />
                    <Legend />
                    <Bar
                      dataKey="debtMFTax"
                      fill="var(--color-debtMFTax)"
                      name="Debt MF"
                      radius={[0, 2, 2, 0]}
                      barSize={14}
                    />
                    <Bar
                      dataKey="bankFDTax"
                      fill="var(--color-bankFDTax)"
                      name="Bank FD"
                      radius={[0, 2, 2, 0]}
                      barSize={14}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
              <div>
                <h3 className="font-semibold text-base mb-4">
                  Post-Tax Income
                </h3>
                <ChartContainer
                  config={CHART_CONFIG}
                  className="h-[320px] w-full"
                >
                  <BarChart
                    layout="vertical"
                    data={postTaxChartData}
                    margin={{ top: 8, right: 24, bottom: 8, left: 60 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={[0, postTaxChartMax]}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <YAxis type="category" dataKey="year" width={50} />
                    <Legend />
                    <Bar
                      dataKey="debtMFPostTax"
                      fill="var(--color-debtMFPostTax)"
                      name="Debt MF"
                      radius={[0, 2, 2, 0]}
                      barSize={14}
                    />
                    <Bar
                      dataKey="bankFDPostTax"
                      fill="var(--color-bankFDPostTax)"
                      name="Bank FD"
                      radius={[0, 2, 2, 0]}
                      barSize={14}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">
              Annual Cash Flows (Debt MF & comparison)
            </h3>
            <div className="overflow-x-auto rounded-md border max-h-[420px] overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left font-semibold p-2">Year</th>
                    <th className="text-right font-semibold p-2">
                      Investment (₹)
                    </th>
                    <th className="text-right font-semibold p-2">
                      Start # units
                    </th>
                    <th className="text-right font-semibold p-2">Start NAV</th>
                    <th className="text-right font-semibold p-2">End NAV</th>
                    <th className="text-right font-semibold p-2">
                      Redemption (₹)
                    </th>
                    <th className="text-right font-semibold p-2">
                      Units redeemed
                    </th>
                    <th className="text-right font-semibold p-2">
                      End # units
                    </th>
                    <th className="text-right font-semibold p-2">
                      End Value (₹)
                    </th>
                    <th className="text-right font-semibold p-2">
                      CG per unit
                    </th>
                    <th className="text-right font-semibold p-2">
                      Debt MF Tax
                    </th>
                    <th className="text-right font-semibold p-2">
                      Bank FD Tax
                    </th>
                    <th className="text-right font-semibold p-2">
                      Debt MF Post-tax
                    </th>
                    <th className="text-right font-semibold p-2">
                      Bank FD Post-tax
                    </th>
                    <th className="text-right font-semibold p-2">
                      % higher
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlows.map((r) => (
                    <tr key={r.year} className="border-b">
                      <td className="p-2 font-medium">{r.year}</td>
                      <td className="p-2 text-right">
                        {formatAmount(r.investmentAmount)}
                      </td>
                      <td className="p-2 text-right">
                        {Math.round(r.startingUnits).toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-right">
                        {r.startingNAV.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        {r.endingNAV.toFixed(2)}
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(r.redemptionAmount)}
                      </td>
                      <td className="p-2 text-right">
                        {Math.round(r.unitsRedeemed).toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-right">
                        {Math.round(r.endingUnits).toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(r.endingValue)}
                      </td>
                      <td className="p-2 text-right">
                        {Math.round(r.capitalGainPerUnit)}
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(r.debtMFTax)}
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(r.bankFDTax)}
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(r.debtMFPostTaxIncome)}
                      </td>
                      <td className="p-2 text-right">
                        {formatAmount(r.bankFDPostTaxIncome)}
                      </td>
                      <td className="p-2 text-right">
                        {r.pctHigherPostTax.toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Each year you redeem from the Debt MF an amount equal to the Bank
              FD interest. Tax on Debt MF is only on the capital gains of the
              redeemed units (at your slab). Bank FD interest is fully taxed every
              year. Ending value is kept at investment amount by design (growth
              minus redemption).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
