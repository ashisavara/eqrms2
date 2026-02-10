"use client";

import { useMemo, useState } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

function inflatedValue(
  baseLakhs: number,
  inflationPct: number,
  age: number,
  currentAge: number
): number {
  const inf = inflationPct / 100;
  return baseLakhs * Math.pow(1 + inf, age - currentAge);
}

export default function RetirementCorpusHowLongWillLastPage() {
  const [currentAge, setCurrentAge] = useState(60);
  const [planTillAge, setPlanTillAge] = useState(90);
  const [annualExpensesLakhs, setAnnualExpensesLakhs] = useState(24);
  const [annualIncomeLakhs, setAnnualIncomeLakhs] = useState(5);
  const [retirementCorpusLakhs, setRetirementCorpusLakhs] = useState(500);
  const [rateOfReturnPct, setRateOfReturnPct] = useState(8);
  const [inflationExpensesPct, setInflationExpensesPct] = useState(7);
  const [inflationIncomePct, setInflationIncomePct] = useState(5);

  const cashFlows = useMemo(() => {
    const rows: Array<{
      age: number;
      startingCorpus: number;
      annualExpenses: number;
      annualIncome: number;
      investmentReturns: number;
      corpusAdditionDepletion: number;
      endingCorpus: number;
    }> = [];
    let starting = retirementCorpusLakhs;
    const r = rateOfReturnPct / 100;
    for (let age = currentAge; age <= planTillAge; age++) {
      const expenses = inflatedValue(
        annualExpensesLakhs,
        inflationExpensesPct,
        age,
        currentAge
      );
      const income = inflatedValue(
        annualIncomeLakhs,
        inflationIncomePct,
        age,
        currentAge
      );
      const invReturn = starting * r;
      const ending = starting - expenses + income + invReturn;
      const additionDepletion = ending - starting;
      rows.push({
        age,
        startingCorpus: Math.round(starting * 10) / 10,
        annualExpenses: Math.round(expenses * 10) / 10,
        annualIncome: Math.round(income * 10) / 10,
        investmentReturns: Math.round(invReturn * 10) / 10,
        corpusAdditionDepletion: Math.round(additionDepletion * 10) / 10,
        endingCorpus: Math.round(ending * 10) / 10,
      });
      starting = ending;
    }
    return rows;
  }, [
    currentAge,
    planTillAge,
    annualExpensesLakhs,
    annualIncomeLakhs,
    retirementCorpusLakhs,
    rateOfReturnPct,
    inflationExpensesPct,
    inflationIncomePct,
  ]);

  const corpusChartData = useMemo(
    () =>
      cashFlows.map((r) => ({
        age: r.age,
        ageLabel: `${r.age}`,
        corpus: r.startingCorpus,
      })),
    [cashFlows]
  );

  const CHART_CONFIG = {
    corpus: { label: "Retirement Corpus", color: "hsl(220 70% 45%)" },
  };

  return (
    <div>
      <PageTitle
        title="Retirement Corpus How Long Will Last"
        caption="For those already retired: see how your corpus changes each year with returns, income and expenses"
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
                  min={50}
                  max={95}
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-till">Lifespan to plan till</Label>
                <Input
                  id="plan-till"
                  type="number"
                  min={currentAge}
                  max={100}
                  value={planTillAge}
                  onChange={(e) => setPlanTillAge(Number(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual-exp">Annual Expenses (Rs. lakhs)</Label>
                <Input
                  id="annual-exp"
                  type="number"
                  min={0}
                  step={1}
                  value={annualExpensesLakhs}
                  onChange={(e) =>
                    setAnnualExpensesLakhs(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="annual-income">Annual Income (Rs. lakhs)</Label>
                <Input
                  id="annual-income"
                  type="number"
                  min={0}
                  step={1}
                  value={annualIncomeLakhs}
                  onChange={(e) =>
                    setAnnualIncomeLakhs(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="corpus">Retirement Corpus (Rs. lakhs)</Label>
                <Input
                  id="corpus"
                  type="number"
                  min={0}
                  step={10}
                  value={retirementCorpusLakhs}
                  onChange={(e) =>
                    setRetirementCorpusLakhs(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Rate of Return on Corpus (%)</Label>
                <SliderWithValue
                  min={0}
                  max={15}
                  step={0.5}
                  value={rateOfReturnPct}
                  onValueChange={setRateOfReturnPct}
                  formatValue={(v) => `${v}%`}
                />
              </div>
              <div className="space-y-2">
                <Label>Inflation on Expenses (%)</Label>
                <SliderWithValue
                  min={0}
                  max={15}
                  step={0.5}
                  value={inflationExpensesPct}
                  onValueChange={setInflationExpensesPct}
                  formatValue={(v) => `${v}%`}
                />
              </div>
              <div className="space-y-2">
                <Label>Inflation on Income (%)</Label>
                <SliderWithValue
                  min={0}
                  max={15}
                  step={0.5}
                  value={inflationIncomePct}
                  onValueChange={setInflationIncomePct}
                  formatValue={(v) => `${v}%`}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-4">
                  Retirement Corpus (Rs. lakhs)
                </h3>
                <ChartContainer
                  config={CHART_CONFIG}
                  className="h-[320px] w-full"
                >
                  <BarChart
                    data={corpusChartData}
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
                      domain={["auto", "auto"]}
                    />
                    <Bar
                      dataKey="corpus"
                      fill="var(--color-corpus)"
                      radius={[2, 2, 0, 0]}
                      barSize={10}
                    />
                  </BarChart>
                </ChartContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Starting corpus at each age. Corpus can go negative when
                  depleted.
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
                      Annual Expenses
                    </th>
                    <th className="text-right font-semibold p-3">
                      Annual Income
                    </th>
                    <th className="text-right font-semibold p-3">
                      Investment Returns
                    </th>
                    <th className="text-right font-semibold p-3">
                      Corpus Addition / (Depletion)
                    </th>
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
                        {r.annualExpenses.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="p-3 text-right">
                        {r.annualIncome.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="p-3 text-right">
                        {r.investmentReturns.toLocaleString("en-IN", {
                          maximumFractionDigits: 1,
                        })}
                      </td>
                      <td className="p-3 text-right">
                        {r.corpusAdditionDepletion >= 0
                          ? r.corpusAdditionDepletion.toLocaleString("en-IN", {
                              maximumFractionDigits: 1,
                            })
                          : `(${Math.abs(r.corpusAdditionDepletion).toLocaleString("en-IN", {
                              maximumFractionDigits: 1,
                            })})`}
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
              All figures in Rs. lakhs. Ending Corpus = Starting Corpus −
              Annual Expenses + Annual Income + Investment Returns. Corpus
              Addition/(Depletion) = Ending − Starting.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
