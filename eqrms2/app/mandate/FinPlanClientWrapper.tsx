"use client";

import { useState, useMemo } from "react";
import { MultiSelectFilter } from "@/components/data-table/MultiSelectFilter";
import { FinGoalsDetail } from "@/types/fin-goals-detail";
import { Investments } from "@/types/investment-detail";
import { SipDetail } from "@/types/sip-detail";
import { orchestrateCalculations } from "./finplan-util";
import TableFinPlan from "./TableFingoals";
import TableInvFinPlan from "./TableInvFinPlan";
import TableSipFinPlan from "./TableSipFinPlan";
import TableGoalDesc from "./TableGoalDesc";
import { AddFinGoalsButton } from "@/components/forms/AddFinGoals";
import { can } from '@/lib/permissions';

interface FinPlanClientWrapperProps {
  finGoalsData: FinGoalsDetail[];
  investmentFinPlanData: Investments[];
  sipFinGoalsData: SipDetail[];
  userRoles: string[];
}

export default function FinPlanClientWrapper({ 
  finGoalsData, 
  investmentFinPlanData, 
  sipFinGoalsData,
  userRoles
}: FinPlanClientWrapperProps) {
  
  // State for selected goals filter
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Calculate all financial planning data using utility functions
  const calculatedData = useMemo(() => {
    return orchestrateCalculations(finGoalsData, investmentFinPlanData, sipFinGoalsData);
  }, [finGoalsData, investmentFinPlanData, sipFinGoalsData]);

  // Extract unique goal names from calculated goals (master source)
  const goalOptions = useMemo(() => {
    const uniqueGoals = new Set<string>();
    calculatedData.calculatedGoals.forEach(goal => {
      if (goal.goal_name && goal.goal_name.trim() !== '') {
        uniqueGoals.add(goal.goal_name);
      }
    });
    return Array.from(uniqueGoals).sort();
  }, [calculatedData.calculatedGoals]);

  // Filter each calculated dataset based on selected goals
  const filteredFinGoals = useMemo(() => {
    if (selectedGoals.length === 0) return calculatedData.calculatedGoals;
    return calculatedData.calculatedGoals.filter(item => selectedGoals.includes(item.goal_name));
  }, [calculatedData.calculatedGoals, selectedGoals]);

  const filteredInvestmentFinPlan = useMemo(() => {
    if (selectedGoals.length === 0) return calculatedData.calculatedInvestments;
    return calculatedData.calculatedInvestments.filter(item => 
      item.goal_name && selectedGoals.includes(item.goal_name)
    );
  }, [calculatedData.calculatedInvestments, selectedGoals]);

  const filteredSipFinGoals = useMemo(() => {
    if (selectedGoals.length === 0) return calculatedData.calculatedSips;
    return calculatedData.calculatedSips.filter(item => 
      item.goal_name && selectedGoals.includes(item.goal_name)
    );
  }, [calculatedData.calculatedSips, selectedGoals]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold pt-2">Financial Planning</h3>
      
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
        { can(userRoles, 'investments', 'add_edit_financial_goals') && (
        <AddFinGoalsButton />)}
      </div>

      {/* Financial Goals Table */}
      <div>
        <h3>Financial Goals</h3>
        <TableFinPlan data={filteredFinGoals} />
        <div className="mt-6 hidden md:block">
          <TableGoalDesc data={filteredFinGoals} />
        </div>
      </div>

      {/* Investment FinPlan Table */}
      <div>
        <h3>Investment FinPlan</h3>
        <TableInvFinPlan data={filteredInvestmentFinPlan} />
      </div>

      {/* SIP FinGoals Table */}
      <div>
        <h3>SIP FinGoals</h3>
        <TableSipFinPlan data={filteredSipFinGoals} />
      </div>
    </div>
  );
}