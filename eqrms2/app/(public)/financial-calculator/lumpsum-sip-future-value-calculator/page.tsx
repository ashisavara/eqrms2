"use client";

import { useState, useMemo } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";

function formatCurrency(value: number): string {
  return "₹" + Math.round(value).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function lumpsumFutureValue(
  principal: number,
  annualRatePct: number,
  years: number
): number {
  const r = annualRatePct / 100;
  return principal * Math.pow(1 + r, years);
}

function sipTotalInvested(
  monthlyAmount: number,
  stepUpPct: number,
  years: number
): number {
  const s = stepUpPct / 100;
  if (s === 0) return 12 * monthlyAmount * years;
  const annual = 12 * monthlyAmount;
  return annual * (Math.pow(1 + s, years) - 1) / s;
}

function sipFutureValue(
  monthlyAmount: number,
  stepUpPct: number,
  annualRatePct: number,
  years: number
): number {
  const r = annualRatePct / 100;
  const rMonthly = Math.pow(1 + r, 1 / 12) - 1;
  const months = years * 12;
  let fv = 0;
  for (let m = 0; m < months; m++) {
    const yearIndex = Math.floor(m / 12);
    const contribution = monthlyAmount * Math.pow(1 + stepUpPct / 100, yearIndex);
    fv += contribution * Math.pow(1 + rMonthly, months - 1 - m);
  }
  return fv;
}

export default function LumpsumSipPage() {
  const [sipAmount, setSipAmount] = useState(10000);
  const [stepUp, setStepUp] = useState(22);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [expectedRate, setExpectedRate] = useState(12);
  const [years, setYears] = useState(5);

  const snapshot = useMemo(() => {
    const lumpsumInv = lumpsumAmount;
    const lumpsumFv = lumpsumFutureValue(lumpsumAmount, expectedRate, years);
    const lumpsumGains = lumpsumFv - lumpsumInv;

    const sipInvTotal = sipTotalInvested(sipAmount, stepUp, years);
    const sipFv = sipFutureValue(sipAmount, stepUp, expectedRate, years);
    const sipGains = sipFv - sipInvTotal;

    return {
      lumpsum: {
        invested: lumpsumInv,
        totalInvestment: lumpsumInv,
        futureValue: lumpsumFv,
        gains: lumpsumGains,
      },
      sip: {
        invested: sipAmount,
        totalInvestment: sipInvTotal,
        futureValue: sipFv,
        gains: sipGains,
      },
      total: {
        totalInvestment: lumpsumInv + sipInvTotal,
        futureValue: lumpsumFv + sipFv,
        gains: lumpsumGains + sipGains,
      },
    };
  }, [sipAmount, stepUp, lumpsumAmount, expectedRate, years]);

  return (
    <div>
      <PageTitle
        title="Lumpsum + SIP Value Calculator"
        caption="Project future value of lumpsum and step-up SIP investments"
      />
      <div className="p-5 max-w-5xl mx-auto">
        <div className="ime-grid-3col gap-12 mb-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-base">SIP Inputs</h3>
              <div className="space-y-2">
                <Label htmlFor="sip-amount">SIP Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="sip-amount"
                    type="number"
                    min={0}
                    step={100}
                    value={sipAmount}
                    onChange={(e) =>
                      setSipAmount(Number(e.target.value) || 0)
                    }
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Step Up</Label>
                <SliderWithValue
                  min={0}
                  max={50}
                  step={1}
                  value={stepUp}
                  onValueChange={setStepUp}
                  formatValue={(v) => `${v}%`}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-base">Lumpsum Inputs</h3>
              <div className="space-y-2">
                <Label htmlFor="lumpsum-amount">Lumpsum Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    ₹
                  </span>
                  <Input
                    id="lumpsum-amount"
                    type="number"
                    min={0}
                    step={1000}
                    value={lumpsumAmount}
                    onChange={(e) =>
                      setLumpsumAmount(Number(e.target.value) || 0)
                    }
                    className="pl-7"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-base">Common Inputs</h3>
              <div className="space-y-2">
                <Label>Expected Rate of Return</Label>
                <SliderWithValue
                  min={0}
                  max={30}
                  step={0.5}
                  value={expectedRate}
                  onValueChange={setExpectedRate}
                  formatValue={(v) => `${v}%`}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Years</Label>
                <SliderWithValue
                  min={1}
                  max={40}
                  step={1}
                  value={years}
                  onValueChange={setYears}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Snapshot</h3>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left font-semibold p-3"></th>
                  <th className="text-right font-semibold p-3">Invested</th>
                  <th className="text-right font-semibold p-3">
                    Total Investment Amount
                  </th>
                  <th className="text-right font-semibold p-3">Future Value</th>
                  <th className="text-right font-semibold p-3">Gains</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="font-medium p-3">Lumpsum</td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.lumpsum.invested)}
                  </td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.lumpsum.totalInvestment)}
                  </td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.lumpsum.futureValue)}
                  </td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.lumpsum.gains)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="font-medium p-3">SIP</td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.sip.invested)}
                  </td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.sip.totalInvestment)}
                  </td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.sip.futureValue)}
                  </td>
                  <td className="text-right p-3">
                    {formatCurrency(snapshot.sip.gains)}
                  </td>
                </tr>
                <tr className="border-b-2 bg-muted/30">
                  <td className="font-semibold p-3">Total</td>
                  <td className="text-right p-3"></td>
                  <td className="text-right p-3 font-medium">
                    {formatCurrency(snapshot.total.totalInvestment)}
                  </td>
                  <td className="text-right p-3 font-medium">
                    {formatCurrency(snapshot.total.futureValue)}
                  </td>
                  <td className="text-right p-3 font-medium">
                    {formatCurrency(snapshot.total.gains)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
