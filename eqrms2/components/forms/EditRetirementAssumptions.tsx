'use client';

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SliderWithValue } from "@/components/ui/slider-with-value";
import { DatePicker, NumberInput } from "./FormFields";
import { RetirementAssumptionsSchema, RetirementAssumptionsValues } from "@/types/forms";
import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { upsertRetirementGoal } from "@/lib/actions/retirementGoalActions";
import {
  ageFromDob,
  areRetirementAssumptionsComplete,
  calculateCorpusByAge,
  calculateRetirementCashFlows,
  calculateRetirementCorpusRequired,
  resolveRetirementStartAge,
  type RetirementAssumptions,
} from "@/app/(rms)/mandate/retirement-util";

function toRetirementAssumptions(values: RetirementAssumptionsValues): RetirementAssumptions {
  const currentAge = ageFromDob(values.ret_primary_investor_dob!);
  return {
    primaryInvestorDob: values.ret_primary_investor_dob!,
    currentAge,
    retirementAge: values.ret_retirement_age!,
    lifespan: values.ret_lifespan!,
    currentAnnualExpLakhs: values.ret_current_annual_exp_lakhs!,
    inflationPct: values.ret_inflation_pct!,
    yieldPostRetirementPct: values.ret_yield_post_retirement_pct!,
  };
}

function buildRetirementGoalDate(dob: Date, retirementAge: number, currentAge: number): Date {
  if (currentAge >= retirementAge) return new Date();
  const goalDate = new Date(dob);
  goalDate.setFullYear(dob.getFullYear() + retirementAge);
  return goalDate;
}

function EditRetirementAssumptionsForm({
  initialData,
  groupId,
  onSuccess,
}: {
  initialData: RetirementAssumptionsValues;
  groupId: number;
  onSuccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const today = new Date();
  const dobFromMonth = new Date(1900, 0, 1);
  const dobToMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const { control, handleSubmit, watch } = useForm<RetirementAssumptionsValues>({
    defaultValues: initialData,
    resolver: zodResolver(RetirementAssumptionsSchema) as any,
  });

  const watched = watch();
  const assumptionsComplete = areRetirementAssumptionsComplete(watched);
  const assumptions = assumptionsComplete ? toRetirementAssumptions(watched) : null;
  const startAge = assumptions ? resolveRetirementStartAge(assumptions.currentAge, assumptions.retirementAge) : null;
  const isRetired = assumptions ? assumptions.currentAge >= assumptions.retirementAge : false;

  const corpusRequired = useMemo(
    () => assumptions ? calculateRetirementCorpusRequired(assumptions) : 0,
    [assumptions]
  );

  const corpusByAge = useMemo(
    () =>
      assumptions
        ? calculateCorpusByAge(assumptions).map((row) => ({
            ...row,
            corpus: Math.round(row.corpus),
            ageLabel: String(row.age),
          }))
        : [],
    [assumptions]
  );

  const cashFlows = useMemo(
    () =>
      assumptions
        ? calculateRetirementCashFlows(assumptions, corpusRequired).map((row) => ({
            ...row,
            startingCorpus: Math.round(row.startingCorpus * 10) / 10,
            fvExpenses: Math.round(row.fvExpenses * 10) / 10,
            investmentReturn: Math.round(row.investmentReturn * 10) / 10,
            endingCorpus: Math.round(row.endingCorpus * 10) / 10,
          }))
        : [],
    [assumptions, corpusRequired]
  );

  const expensesAndReturnsChart = useMemo(
    () =>
      cashFlows.map((r) => ({
        age: r.age,
        ageLabel: String(r.age),
        fvExpenses: r.fvExpenses,
        investmentReturn: r.investmentReturn,
      })),
    [cashFlows]
  );

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      await supabaseUpdateRow("client_group", "group_id", groupId, data);

      const assumptions = toRetirementAssumptions(data);
      const goalDate = buildRetirementGoalDate(
        assumptions.primaryInvestorDob,
        assumptions.retirementAge,
        assumptions.currentAge
      );
      const fvGoals = calculateRetirementCorpusRequired(assumptions);
      await upsertRetirementGoal({
        groupId,
        goalDateIso: goalDate.toISOString().slice(0, 10),
        expReturns: data.ret_corpus_exp_return_corpus_build ?? 0,
        inflationRate: data.ret_inflation_pct ?? 0,
        fvGoals,
      });

      if (typeof window !== "undefined") {
        toast.success("Retirement assumptions and goal saved successfully!");
        setTimeout(() => {
          onSuccess();
          router.refresh();
        }, 1200);
      }
    } catch (error) {
      console.error("Error updating retirement assumptions:", error);
      if (typeof window !== "undefined") {
        toast.error("Failed to save retirement assumptions. Please try again.");
      }
      setIsLoading(false);
    }
  });

  const CHART_CONFIG = {
    corpus: { label: "Corpus", color: "hsl(var(--chart-3))" },
    fvExpenses: { label: "FV Expenses", color: "hsl(0 0% 75%)" },
    investmentReturn: { label: "Return", color: "hsl(270 60% 50%)" },
  };

  return (
    <div className="p-4 space-y-4">
      <Toaster position="top-center" toastOptions={{ className: "!bg-green-100 !text-green-900" }} />
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DatePicker
            name="ret_primary_investor_dob"
            label="Primary Investor DOB"
            control={control}
            fromMonth={dobFromMonth}
            toMonth={dobToMonth}
            disabled={(date) => date > today}
          />
          <NumberInput name="ret_retirement_age" label="Retirement Age" control={control} step="1" min={18} max={100} />
          <NumberInput name="ret_lifespan" label="Expected Lifespan" control={control} step="1" min={18} max={110} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <NumberInput
            name="ret_current_annual_exp_lakhs"
            label="Current Annual Expenses (Rs. Lakhs)"
            control={control}
            step="0.1"
            min={0}
          />
            <Controller
              name="ret_inflation_pct"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Inflation (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={20}
                    step={0.5}
                    value={field.value ?? 0}
                    onValueChange={field.onChange}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
              )}
            />
            <Controller
              name="ret_yield_post_retirement_pct"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Post-Retirement Yield (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={20}
                    step={0.5}
                    value={field.value ?? 0}
                    onValueChange={field.onChange}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
              )}
            />
            <Controller
              name="ret_corpus_exp_return_corpus_build"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Corpus Build Return (%)</Label>
                  <SliderWithValue
                    min={0}
                    max={20}
                    step={0.5}
                    value={field.value ?? 0}
                    onValueChange={field.onChange}
                    formatValue={(v) => `${v}%`}
                  />
                </div>
              )}
            />
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-bold">
            {isRetired
              ? "Retiree mode: Current Age is greater than or equal to Retirement Age. Corpus is calculated from Current Age."
              : "Pre-retirement mode: Corpus is calculated from Retirement Age."}
          </p>
          <Button type="submit" disabled={isLoading || !assumptionsComplete}>{isLoading ? "Saving..." : "Save Assumptions"}</Button>
        </div>
      </form>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-base mb-2">Retirement Corpus Required</h3>
          {assumptionsComplete && assumptions && startAge != null ? (
            <>
              <p className="text-2xl font-bold text-green-800">
                {(corpusRequired / 100).toFixed(1)} Crores
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                (Rs. {Math.round(corpusRequired).toLocaleString("en-IN")} lakhs at age {startAge})
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-red-800">
              Please add all assumptions to see retirement corpus required.
            </p>
          )}
        </CardContent>
      </Card>

      {assumptionsComplete && assumptions && startAge != null && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-4">Starting Corpus Required at each Age</h3>
                <ChartContainer config={CHART_CONFIG} className="h-[260px] w-full">
                  <BarChart data={corpusByAge} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="ageLabel" tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tickLine={false} axisLine={false} />
                    <Bar dataKey="corpus" fill="var(--color-corpus)" radius={[2, 2, 0, 0]} barSize={10} />
                  </BarChart>
                </ChartContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">Rs. lakhs</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-base mb-4">Future Expenses and Investment Returns</h3>
                <ChartContainer config={CHART_CONFIG} className="h-[260px] w-full">
                  <BarChart data={expensesAndReturnsChart} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="ageLabel" tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tickLine={false} axisLine={false} />
                    <Legend />
                    <Bar dataKey="fvExpenses" fill="var(--color-fvExpenses)" radius={[2, 2, 0, 0]} barSize={12} name="FV Expenses" />
                    <Bar dataKey="investmentReturn" fill="var(--color-investmentReturn)" radius={[2, 2, 0, 0]} barSize={12} name="Return" />
                  </BarChart>
                </ChartContainer>
                <p className="text-xs text-muted-foreground mt-2 text-center">Rs. lakhs</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-base mb-4">Annual Cash Flows (No Post-Retirement Income)</h3>
              <div className="overflow-x-auto rounded-md border max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/50">
                    <tr className="border-b">
                      <th className="text-left font-semibold p-3">Age</th>
                      <th className="text-right font-semibold p-3">Starting Corpus</th>
                      <th className="text-right font-semibold p-3">FV Expenses</th>
                      <th className="text-right font-semibold p-3">Return</th>
                      <th className="text-right font-semibold p-3">Ending Corpus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlows.map((row) => (
                      <tr key={row.age} className="border-b">
                        <td className="p-3 font-medium">{row.age}</td>
                        <td className="p-3 text-right">
                          {row.startingCorpus.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                        </td>
                        <td className="p-3 text-right">
                          {row.fvExpenses.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                        </td>
                        <td className="p-3 text-right">
                          {row.investmentReturn.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                        </td>
                        <td className="p-3 text-right">
                          {row.endingCorpus.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                All values are in Rs. lakhs. Return = (Starting Corpus − FV Expenses) x Yield; Ending Corpus = (Starting Corpus − FV Expenses) x (1 + Yield).
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export function EditRetirementAssumptionsButton({
  groupId,
  groupData,
  children,
}: {
  groupId: number;
  groupData: any;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const defaults: RetirementAssumptionsValues = {
    ret_primary_investor_dob: groupData?.ret_primary_investor_dob ? new Date(groupData.ret_primary_investor_dob) : null,
    ret_retirement_age: groupData?.ret_retirement_age ?? null,
    ret_lifespan: groupData?.ret_lifespan ?? null,
    ret_current_annual_exp_lakhs: groupData?.ret_current_annual_exp_lakhs ?? null,
    ret_inflation_pct: groupData?.ret_inflation_pct ?? 7,
    ret_yield_post_retirement_pct: groupData?.ret_yield_post_retirement_pct ?? 8,
    ret_corpus_exp_return_corpus_build: groupData?.ret_corpus_exp_return_corpus_build ?? null,
  };

  return (
    <>
      <span onClick={() => setOpen(true)} className="blue-hyperlink mt-2">
        {children || "Retirement Corpus"}
      </span>
      {open && (
        <Sheet open={true} onOpenChange={() => setOpen(false)}>
          <SheetContent className="!w-[95vw] md:!w-[1000px] !max-w-[1000px]">
            <SheetHeader>
              <SheetTitle>Retirement Assumptions and Corpus</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
              <EditRetirementAssumptionsForm initialData={defaults} groupId={groupId} onSuccess={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

