"use client";

import { useState, useMemo } from "react";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { FinGoalsDetail } from "@/types/fin-goals-detail";
import { Investments } from "@/types/investment-detail";
import { SipDetail } from "@/types/sip-detail";
import TableFinPlan from "./TableFingoals";
import TableInvFinPlan from "./TableInvFinPlan";
import TableSipFinPlan from "./TableSipFinPlan";

interface FinPlanClientWrapperProps {
  finGoalsData: FinGoalsDetail[];
  investmentFinPlanData: Investments[];
  sipFinGoalsData: SipDetail[];
}

export default function FinPlanClientWrapper({ 
  finGoalsData, 
  investmentFinPlanData, 
  sipFinGoalsData 
}: FinPlanClientWrapperProps) {
  
  // State for selected goals filter
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Extract unique goal names from finGoals (master source)
  const goalOptions = useMemo(() => {
    const uniqueGoals = new Set<string>();
    finGoalsData.forEach(goal => {
      if (goal.goal_name && goal.goal_name.trim() !== '') {
        uniqueGoals.add(goal.goal_name);
      }
    });
    return Array.from(uniqueGoals).sort();
  }, [finGoalsData]);

  // Filter each dataset based on selected goals
  const filteredFinGoals = useMemo(() => {
    if (selectedGoals.length === 0) return finGoalsData;
    return finGoalsData.filter(item => selectedGoals.includes(item.goal_name));
  }, [finGoalsData, selectedGoals]);

  const filteredInvestmentFinPlan = useMemo(() => {
    if (selectedGoals.length === 0) return investmentFinPlanData;
    return investmentFinPlanData.filter(item => 
      item.goal_name && selectedGoals.includes(item.goal_name)
    );
  }, [investmentFinPlanData, selectedGoals]);

  const filteredSipFinGoals = useMemo(() => {
    if (selectedGoals.length === 0) return sipFinGoalsData;
    return sipFinGoalsData.filter(item => 
      item.goal_name && selectedGoals.includes(item.goal_name)
    );
  }, [sipFinGoalsData, selectedGoals]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold pt-4">Financial Planning</h3>
      
      {/* Top-level Goal filter */}
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[180px]">
          <MultiSelectFilter
            title="Goals"
            options={goalOptions}
            selectedValues={selectedGoals}
            onSelectionChange={setSelectedGoals}
            placeholder="Filter by Goals..."
          />
        </div>
      </div>

      {/* Financial Goals Table */}
      <div>
        <h2 className="text-md font-semibold mb-2">Financial Goals</h2>
        <TableFinPlan data={filteredFinGoals} />
      </div>

      {/* Investment FinPlan Table */}
      <div>
        <h2 className="text-md font-semibold mb-2">Investment FinPlan</h2>
        <TableInvFinPlan data={filteredInvestmentFinPlan} />
      </div>

      {/* SIP FinGoals Table */}
      <div>
        <h2 className="text-md font-semibold mb-2">SIP FinGoals</h2>
        <TableSipFinPlan data={filteredSipFinGoals} />
      </div>
    </div>
  );
}