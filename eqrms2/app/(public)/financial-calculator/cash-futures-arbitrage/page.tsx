"use client";

import { useState, useMemo } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

const BAR_COLOR_POSITIVE = "hsl(142, 56%, 42%)";
const BAR_COLOR_NEGATIVE = "hsl(var(--destructive))";

const CHART_CONFIG = {
  gain: { label: "Gain / Loss", color: BAR_COLOR_POSITIVE },
};

export default function ArbitrageReturnPage() {
  const [stockPrice, setStockPrice] = useState(1500);
  const [futurePrice, setFuturePrice] = useState(1510);
  const [closingPrice, setClosingPrice] = useState(1500);
  const [marginPct, setMarginPct] = useState(12.5);

  const calc = useMemo(() => {
    const buyStock = {
      starting: stockPrice,
      ending: closingPrice,
      gainLoss: closingPrice - stockPrice,
      capitalDeployed: stockPrice,
    };
    const marginDec = marginPct / 100;
    const sellFuture = {
      starting: futurePrice,
      ending: closingPrice,
      gainLoss: futurePrice - closingPrice,
      capitalDeployed: futurePrice * marginDec,
    };
    const totalGain = buyStock.gainLoss + sellFuture.gainLoss;
    const totalCapital =
      buyStock.capitalDeployed + sellFuture.capitalDeployed;
    const monthlyReturnPct =
      totalCapital > 0 ? (totalGain / totalCapital) * 100 : 0;
    const annualisedPct =
      totalCapital > 0
        ? (Math.pow(1 + totalGain / totalCapital, 12) - 1) * 100
        : 0;

    return {
      buyStock,
      sellFuture,
      totalGain,
      totalCapital,
      monthlyReturnPct,
      annualisedPct,
    };
  }, [stockPrice, futurePrice, closingPrice, marginPct]);

  const gainChartData = useMemo(
    () => [
      { name: "Gain on buy stock", gain: calc.buyStock.gainLoss },
      { name: "Gain on sell future", gain: calc.sellFuture.gainLoss },
      { name: "Gain on total", gain: calc.totalGain },
    ],
    [calc.buyStock.gainLoss, calc.sellFuture.gainLoss, calc.totalGain]
  );

  return (
    <div>
      <PageTitle
        title="Arbitrage Return Calculation"
        caption="See how arbitrage funds work: buy stock, sell future, capture the spread with margin."
      />
      <div className="p-5 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="stock-price">Stock Price (Starting)</Label>
            <Input
              id="stock-price"
              type="number"
              min={0}
              step={1}
              value={stockPrice}
              onChange={(e) =>
                setStockPrice(Number(e.target.value) || 0)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="future-price">Future Price (Starting)</Label>
            <Input
              id="future-price"
              type="number"
              min={0}
              step={1}
              value={futurePrice}
              onChange={(e) =>
                setFuturePrice(Number(e.target.value) || 0)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closing-price">Closing Stock Price</Label>
            <Input
              id="closing-price"
              type="number"
              min={0}
              step={1}
              value={closingPrice}
              onChange={(e) =>
                setClosingPrice(Number(e.target.value) || 0)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="margin">Margin (%)</Label>
            <Input
              id="margin"
              type="number"
              min={0}
              max={100}
              step={0.01}
              value={marginPct}
              onChange={(e) =>
                setMarginPct(Number(e.target.value) ?? 0)
              }
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">
              Arbitrage Return Calculation
            </h3>
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left font-semibold p-3"></th>
                    <th className="text-right font-semibold p-3">
                      Starting Price
                    </th>
                    <th className="text-right font-semibold p-3">
                      Ending Price
                    </th>
                    <th className="text-right font-semibold p-3">
                      Gain / Loss
                    </th>
                    <th className="text-right font-semibold p-3">
                      Capital Deployed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="font-medium p-3">Buy Stock</td>
                    <td className="text-right p-3">
                      {calc.buyStock.starting}
                    </td>
                    <td className="text-right p-3">
                      {calc.buyStock.ending}
                    </td>
                    <td className="text-right p-3">
                      {calc.buyStock.gainLoss}
                    </td>
                    <td className="text-right p-3">
                      {calc.buyStock.capitalDeployed.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="font-medium p-3">Sell Future</td>
                    <td className="text-right p-3">
                      {calc.sellFuture.starting}
                    </td>
                    <td className="text-right p-3">
                      {calc.sellFuture.ending}
                    </td>
                    <td className="text-right p-3">
                      {calc.sellFuture.gainLoss}
                    </td>
                    <td className="text-right p-3">
                      {calc.sellFuture.capitalDeployed.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b-2 bg-muted/30">
                    <td className="font-semibold p-3">Total</td>
                    <td className="text-right p-3"></td>
                    <td className="text-right p-3"></td>
                    <td className="text-right p-3 font-medium">
                      {calc.totalGain}
                    </td>
                    <td className="text-right p-3 font-medium">
                      {calc.totalCapital.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-6">
              <p className="text-lg font-semibold pt-2 text-blue-800">
                Monthly Return: {calc.monthlyReturnPct.toFixed(2)}%
              </p>
              <p className="text-lg font-semibold pt-2 text-blue-800">
                Annualised Return: {calc.annualisedPct.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gain / Loss (Rs.)</h3>
            <ChartContainer config={CHART_CONFIG} className="h-[280px] w-full">
              <BarChart
                data={gainChartData}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => String(v)}
                />
                <Bar dataKey="gain" radius={[4, 4, 0, 0]}>
                  {gainChartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.gain >= 0 ? BAR_COLOR_POSITIVE : BAR_COLOR_NEGATIVE}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
