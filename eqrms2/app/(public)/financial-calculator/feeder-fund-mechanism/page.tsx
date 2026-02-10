"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";

const NAV_AT_INVESTMENT = 10;

export default function FeederFundPage() {
  const [amountLakhs, setAmountLakhs] = useState(100);
  const [rateAtInvestment, setRateAtInvestment] = useState(90);
  const [fundReturnPct, setFundReturnPct] = useState(20);
  const [rateAtRedemption, setRateAtRedemption] = useState(93);

  const calc = useMemo(() => {
    const investmentRs = amountLakhs * 100_000;
    const investmentUsd = rateAtInvestment > 0 ? investmentRs / rateAtInvestment : 0;
    const units = investmentUsd / NAV_AT_INVESTMENT;
    const navAtRedemption = NAV_AT_INVESTMENT * (1 + fundReturnPct / 100);
    const redemptionUsd = units * navAtRedemption;
    const redemptionRsLakhs = (redemptionUsd * rateAtRedemption) / 100_000;
    const returnInrPct =
      amountLakhs > 0
        ? ((redemptionRsLakhs - amountLakhs) / amountLakhs) * 100
        : 0;
    const returnCurrencyPct =
      rateAtInvestment > 0
        ? ((rateAtRedemption - rateAtInvestment) / rateAtInvestment) * 100
        : 0;

    return {
      investmentUsd,
      units,
      navAtRedemption,
      redemptionUsd,
      redemptionRsLakhs,
      returnInrPct,
      returnCurrencyPct,
    };
  }, [amountLakhs, rateAtInvestment, fundReturnPct, rateAtRedemption]);

  return (
    <div>
      <PageTitle
        title="Feeder Fund Mechanism"
        caption="Returns in INR from a USD-denominated fund: asset appreciation and currency impact"
      />
      <div className="p-5 max-w-5xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
              Input parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount (Rs. lakhs)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step={1}
                  value={amountLakhs}
                  onChange={(e) =>
                    setAmountLakhs(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>$ rate at investment</Label>
                <SliderWithValue
                  min={70}
                  max={100}
                  step={0.5}
                  value={rateAtInvestment}
                  onValueChange={setRateAtInvestment}
                />
              </div>
              <div className="space-y-2">
                <Label>Fund Returns in US $ (%)</Label>
                <SliderWithValue
                  min={-20}
                  max={50}
                  step={0.5}
                  value={fundReturnPct}
                  onValueChange={setFundReturnPct}
                  formatValue={(v) => `${v}%`}
                />
              </div>
              <div className="space-y-2">
                <Label>$ rate at redemption</Label>
                <SliderWithValue
                  min={70}
                  max={100}
                  step={0.5}
                  value={rateAtRedemption}
                  onValueChange={setRateAtRedemption}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="ime-grid-3col gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">
              Investment details
            </h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm max-w-md">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      Investment Amount (Rs lakhs)
                    </td>
                    <td className="p-3 text-right">{amountLakhs}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      Currency Rate at investment
                    </td>
                    <td className="p-3 text-right">{rateAtInvestment}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Investment Amount ($)</td>
                    <td className="p-3 text-right">
                      {Math.round(calc.investmentUsd).toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">US Fund NAV at investment</td>
                    <td className="p-3 text-right">{NAV_AT_INVESTMENT}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium"># of Units</td>
                    <td className="p-3 text-right">
                      {Math.round(calc.units).toLocaleString("en-IN")}
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
              Redemption details
            </h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm max-w-md">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium"># of Units sold</td>
                    <td className="p-3 text-right">
                      {Math.round(calc.units).toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">% $ returns of Fund</td>
                    <td className="p-3 text-right">{fundReturnPct}%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">US Fund NAV at redemption</td>
                    <td className="p-3 text-right">
                      {calc.navAtRedemption.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Redemption Amount in $</td>
                    <td className="p-3 text-right">
                      {Math.round(calc.redemptionUsd).toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      Currency Rate at Redemption
                    </td>
                    <td className="p-3 text-right">{rateAtRedemption}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      Redemption Amount (Rs. lakhs)
                    </td>
                    <td className="p-3 text-right font-semibold text-blue-800">
                      {Math.round(calc.redemptionRsLakhs)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

          <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">Returns breakdown</h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm max-w-md">
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">% Returns in INR</td>
                    <td className="p-3 text-right font-semibold text-blue-800">
                      {calc.returnInrPct.toFixed(0)}%
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      % Returns from Asset Appreciation
                    </td>
                    <td className="p-3 text-right">
                      {fundReturnPct}%
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">% Returns from Currency</td>
                    <td className="p-3 text-right">
                      {calc.returnCurrencyPct.toFixed(0)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Total INR return combines fund performance in USD and the change in
              USD/INR rate between investment and redemption.
            </p>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
