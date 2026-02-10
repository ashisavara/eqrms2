"use client";

import { useState, useMemo } from "react";
import PageTitle from "@/components/uiComponents/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function futureValue(pv: number, ratePct: number, years: number): number {
  const r = ratePct / 100;
  return pv * Math.pow(1 + r, years);
}

function presentValue(fv: number, ratePct: number, years: number): number {
  const r = ratePct / 100;
  return fv / Math.pow(1 + r, years);
}

function cagr(initial: number, finalVal: number, years: number): number {
  if (initial <= 0 || years <= 0) return 0;
  return (Math.pow(finalVal / initial, 1 / years) - 1) * 100;
}

export default function TimeValueOfMoneyPage() {
  // Future Value tab – independent state
  const [pv, setPv] = useState(100);
  const [yearsFv, setYearsFv] = useState(5);
  const [yieldFv, setYieldFv] = useState(15);

  // Current Value tab – independent state
  const [fv, setFv] = useState(200);
  const [yearsPv, setYearsPv] = useState(5);
  const [yieldPv, setYieldPv] = useState(15);

  // CAGR tab – independent state
  const [investmentCost, setInvestmentCost] = useState(100);
  const [currentValue, setCurrentValue] = useState(152);
  const [cagrYears, setCagrYears] = useState(3);

  const computedFv = useMemo(
    () => futureValue(pv, yieldFv, yearsFv),
    [pv, yieldFv, yearsFv]
  );
  const computedPv = useMemo(
    () => presentValue(fv, yieldPv, yearsPv),
    [fv, yieldPv, yearsPv]
  );
  const computedCagr = useMemo(
    () => cagr(investmentCost, currentValue, cagrYears),
    [investmentCost, currentValue, cagrYears]
  );

  return (
    <div>
      <PageTitle
        title="Time Value of Money"
        caption="Future value, present value, and compounded annual growth rate (CAGR)"
      />
    <div className="p-5 max-w-5xl mx-auto">
      
      <Tabs defaultValue="future-value" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="future-value">Calculate Future Value</TabsTrigger>
          <TabsTrigger value="current-value">Calculate Current Value</TabsTrigger>
          <TabsTrigger value="cagr">Calculate CAGR</TabsTrigger>
        </TabsList>

        <TabsContent value="future-value">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2 ime-grid-3col gap-12">
                <div>
                <Label htmlFor="fv-pv">Current Value (Rs. lakhs)</Label>
                <Input
                  id="fv-pv"
                  type="number"
                  min={0}
                  step={0.01}
                  value={pv}
                  onChange={(e) => setPv(Number(e.target.value) || 0)}
                />
                </div>
                <div>
                    <div className="space-y-2">
                    <Label># of years</Label>
                    <SliderWithValue
                      min={1}
                      max={60}
                      step={1}
                      value={yearsFv}
                      onValueChange={setYearsFv}
                    />
                  </div>
                </div>
                <div>
                    <div className="space-y-2">
                    <Label>Yield on Investments</Label>
                    <SliderWithValue
                      min={0}
                      max={40}
                      step={0.5}
                      value={yieldFv}
                      onValueChange={setYieldFv}
                      formatValue={(v) => `${v}%`}
                    />
                  </div>
                </div>
              </div>
              
              
              <p className="text-lg font-semibold pt-2 text-blue-800 text-center">
                Future Value = <strong>{Math.round(computedFv)}</strong>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="current-value">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-2 ime-grid-3col gap-12">
                <div> <Label htmlFor="pv-fv">Future Value (Rs. lakhs)</Label>
                <Input
                  id="pv-fv"
                  type="number"
                  min={0}
                  step={0.01}
                  value={fv}
                  onChange={(e) => setFv(Number(e.target.value) || 0)}
                /></div>
                <div className="space-y-2">
                <Label># of years</Label>
                <SliderWithValue
                  min={1}
                  max={60}
                  step={1}
                  value={yearsPv}
                  onValueChange={setYearsPv}
                />
              </div> 
              <div className="space-y-2">
                <Label>Yield on Investments</Label>
                <SliderWithValue
                  min={0}
                  max={40}
                  step={0.5}
                  value={yieldPv}
                  onValueChange={setYieldPv}
                  formatValue={(v) => `${v}%`}
                />
              </div>
                
              </div>
              
              
              <p className="text-lg font-semibold pt-2 text-blue-800 text-center">
                Current Value = <strong>{Math.round(computedPv)}</strong>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cagr">
          <Card>
            <CardContent className="space-y-4">
              <div className="ime-grid-3col gap-12 p-6">
                <div className="space-y-2">
                  <Label htmlFor="cagr-cost">Investment Cost (Rs. lakhs)</Label>
                  <Input
                    id="cagr-cost"
                    type="number"
                    min={0}
                    step={0.01}
                    value={investmentCost}
                    onChange={(e) =>
                      setInvestmentCost(Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cagr-current">Current Value (Rs. lakhs)</Label>
                  <Input
                    id="cagr-current"
                    type="number"
                    min={0}
                    step={0.01}
                    value={currentValue}
                    onChange={(e) =>
                      setCurrentValue(Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label># of years</Label>
                  <SliderWithValue
                    min={1}
                    max={60}
                    step={1}
                    value={cagrYears}
                    onValueChange={setCagrYears}
                  />
                </div>
              </div>
              <p className="text-lg font-semibold pt-2 text-blue-800 text-center">
                CAGR = <strong>{computedCagr.toFixed(1)}%</strong>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
}
