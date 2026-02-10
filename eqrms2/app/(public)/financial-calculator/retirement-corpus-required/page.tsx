"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

function fvExpense(
  currentAnnualExpLakhs: number,
  inflationPct: number,
  age: number,
  currentAge: number
): number {
  const inf = inflationPct / 100;
  return currentAnnualExpLakhs * Math.pow(1 + inf, age - currentAge);
}

/**
 * Back-calculate starting corpus at each age from lifespan down to retirement.
 * - Ending corpus at end of life (lifespan) = 0.
 * - Return for a year = (Starting corpus - FV expenses) * yield.
 * - Ending = (Starting - FV expenses) * (1 + yield).
 * So: Starting(age) = Starting(age+1)/(1+yield) + FV_Exp(age), with Starting(lifespan) = FV_Exp(lifespan).
 */
function startingCorpusByAgeBackward(
  currentAnnualExpLakhs: number,
  inflationPct: number,
  yieldPct: number,
  retirementAge: number,
  lifespan: number,
  currentAge: number
): Map<number, number> {
  const y = yieldPct / 100;
  const map = new Map<number, number>();
  if (retirementAge > lifespan) return map;
  // Last year: we need exactly FV_Exp(lifespan) so that (Starting - FV_Exp)*(1+y) = 0 => Starting = FV_Exp
  let starting = fvExpense(
    currentAnnualExpLakhs,
    inflationPct,
    lifespan,
    currentAge
  );
  map.set(lifespan, starting);
  for (let age = lifespan - 1; age >= retirementAge; age--) {
    const fvExp = fvExpense(
      currentAnnualExpLakhs,
      inflationPct,
      age,
      currentAge
    );
    starting = starting / (1 + y) + fvExp;
    map.set(age, starting);
  }
  return map;
}

export default function RetirementCorpusRequiredPage() {
  const [currentAge, setCurrentAge] = useState(45);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifespan, setLifespan] = useState(90);
  const [currentAnnualExpLakhs, setCurrentAnnualExpLakhs] = useState(60);
  const [inflationPct, setInflationPct] = useState(7);
  const [yieldPostRetirementPct, setYieldPostRetirementPct] = useState(9);

  const startingCorpusMap = useMemo(
    () =>
      startingCorpusByAgeBackward(
        currentAnnualExpLakhs,
        inflationPct,
        yieldPostRetirementPct,
        retirementAge,
        lifespan,
        currentAge
      ),
    [
      currentAnnualExpLakhs,
      inflationPct,
      yieldPostRetirementPct,
      retirementAge,
      lifespan,
      currentAge,
    ]
  );

  const retirementCorpusLakhs = useMemo(() => {
    return startingCorpusMap.get(retirementAge) ?? 0;
  }, [startingCorpusMap, retirementAge]);

  const corpusByAge = useMemo(() => {
    return Array.from({ length: lifespan - retirementAge + 1 }, (_, i) => {
      const age = retirementAge + i;
      const corpus = startingCorpusMap.get(age) ?? 0;
      return { age, corpus: Math.round(corpus), ageLabel: `${age}` };
    });
  }, [startingCorpusMap, retirementAge, lifespan]);

  const cashFlows = useMemo(() => {
    const y = yieldPostRetirementPct / 100;
    const rows: Array<{
      age: number;
      startingCorpus: number;
      fvExpenses: number;
      return: number;
      endingCorpus: number;
    }> = [];
    for (let age = retirementAge; age <= lifespan; age++) {
      const s = startingCorpusMap.get(age) ?? 0;
      const fvExp = fvExpense(
        currentAnnualExpLakhs,
        inflationPct,
        age,
        currentAge
      );
      const afterExpenses = s - fvExp;
      const ret = afterExpenses * y;
      const ending = afterExpenses * (1 + y);
      rows.push({
        age,
        startingCorpus: Math.round(s * 10) / 10,
        fvExpenses: Math.round(fvExp * 10) / 10,
        return: Math.round(ret * 10) / 10,
        endingCorpus: Math.round(ending * 10) / 10,
      });
    }
    return rows;
  }, [
    startingCorpusMap,
    currentAnnualExpLakhs,
    inflationPct,
    yieldPostRetirementPct,
    retirementAge,
    lifespan,
    currentAge,
  ]);

  const expensesAndReturnsChart = useMemo(
    () =>
      cashFlows.map((r) => ({
        age: r.age,
        ageLabel: `${r.age}`,
        fvExpenses: r.fvExpenses,
        return: r.return,
      })),
    [cashFlows]
  );

  const corpusCrores = retirementCorpusLakhs / 100;

  const CHART_CONFIG = {
    corpus: { label: "Corpus", color: "hsl(var(--chart-3))" },
    fvExpenses: { label: "FV Expenses", color: "hsl(0 0% 75%)" },
    return: { label: "Return", color: "hsl(270 60% 50%)" },
  };

  return (
    <div>
      <PageTitle
        title="Retirement Corpus Required"
        caption="Estimate the corpus needed at retirement to fund expenses to expected lifespan"
      />
      <div className="p-5 max-w-5xl mx-auto space-y-6">
        <div className="ime-grid-2col gap-8">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-age">Current Age</Label>
                <Input
                  id="current-age"
                  type="number"
                  min={18}
                  max={80}
                  value={currentAge}
                  onChange={(e) =>
                    setCurrentAge(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retirement-age">Retirement Age</Label>
                <Input
                  id="retirement-age"
                  type="number"
                  min={currentAge}
                  max={90}
                  value={retirementAge}
                  onChange={(e) =>
                    setRetirementAge(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lifespan">Expected Lifespan</Label>
                <Input
                  id="lifespan"
                  type="number"
                  min={retirementAge}
                  max={100}
                  value={lifespan}
                  onChange={(e) =>
                    setLifespan(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual-exp">
                  Current Annual Exp (Rs. Lakhs)
                </Label>
                <Input
                  id="annual-exp"
                  type="number"
                  min={0}
                  step={1}
                  value={currentAnnualExpLakhs}
                  onChange={(e) =>
                    setCurrentAnnualExpLakhs(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Inflation Rate (%)</Label>
                <SliderWithValue
                  min={0}
                  max={15}
                  step={0.5}
                  value={inflationPct}
                  onValueChange={setInflationPct}
                  formatValue={(v) => `${v}%`}
                />
              </div>
              <div className="space-y-2">
                <Label>Yield Post-Retirement (%)</Label>
                <SliderWithValue
                  min={0}
                  max={15}
                  step={0.5}
                  value={yieldPostRetirementPct}
                  onValueChange={setYieldPostRetirementPct}
                  formatValue={(v) => `${v}%`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-2">
                  Retirement Corpus Required
                </h3>
                <p className="text-2xl font-bold text-green-800">
                  {corpusCrores.toFixed(1)} Crores
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  (Rs. {Math.round(retirementCorpusLakhs).toLocaleString("en-IN")} lakhs at retirement)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-4">
                  Starting Corpus Required at each Age
                </h3>
                <ChartContainer config={CHART_CONFIG} className="h-[260px] w-full">
                  <BarChart
                    data={corpusByAge}
                    margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="ageLabel"
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={(v) => `${v}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Bar
                      dataKey="corpus"
                      fill="var(--color-corpus)"
                      radius={[2, 2, 0, 0]}
                      barSize={8}
                    />
                  </BarChart>
                </ChartContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Rs. lakhs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-4">
                  Future Expenses & Investment Returns
                </h3>
                <ChartContainer config={CHART_CONFIG} className="h-[260px] w-full">
                  <BarChart
                    data={expensesAndReturnsChart}
                    margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="ageLabel"
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                    />
                    <Legend />
                    <Bar
                      dataKey="fvExpenses"
                      fill="var(--color-fvExpenses)"
                      radius={[2, 2, 0, 0]}
                      barSize={12}
                      name="FV Expenses"
                    />
                    <Bar
                      dataKey="return"
                      fill="var(--color-return)"
                      radius={[2, 2, 0, 0]}
                      barSize={12}
                      name="Return"
                    />
                  </BarChart>
                </ChartContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Rs. lakhs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-base mb-4">Annual Cash Flows</h3>
            <div className="overflow-x-auto rounded-md border max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left font-semibold p-3">Age</th>
                    <th className="text-right font-semibold p-3">
                      Starting Corpus
                    </th>
                    <th className="text-right font-semibold p-3">
                      FV Expenses
                    </th>
                    <th className="text-right font-semibold p-3">Return</th>
                    <th className="text-right font-semibold p-3">
                      Ending Corpus
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlows.map((r) => (
                    <tr key={r.age} className="border-b">
                      <td className="p-3 font-medium">{r.age}</td>
                      <td className="p-3 text-right">
                        {r.startingCorpus.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="p-3 text-right">
                        {r.fvExpenses.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="p-3 text-right">
                        {r.return.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="p-3 text-right">
                        {r.endingCorpus.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All figures in Rs. lakhs. Return = (Starting − FV Expenses) ×
              yield; Ending = (Starting − FV Expenses) × (1 + yield). Ending
              corpus at lifespan is 0.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
