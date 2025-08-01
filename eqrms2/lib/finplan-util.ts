import { FinGoalsDetail } from "@/types/fin-goals-detail";
import { Investments } from "@/types/investment-detail";
import { SipDetail } from "@/types/sip-detail";

/**
 * Step 1: Calculate years to goal
 * Formula: yrs_to_goal = Max(0, goal_date - today())
 */
export function calculateYearsToGoal(goalDate: Date): number {
  const today = new Date();
  const timeDiff = goalDate.getTime() - today.getTime();
  const yearsDiff = timeDiff / (1000 * 3600 * 24 * 365.25); // Account for leap years
  return Math.max(0, yearsDiff);
}

/**
 * Step 2: Calculate present value of goals
 * Formula: pv_goal = fv_goals/((1+inflation_rate)^(yrs_to_goal))
 */
export function calculatePresentValueGoals(fvGoals: number, inflationRate: number, yearsToGoal: number): number {
  if (yearsToGoal === 0) return fvGoals;
  const inflationRateDecimal = inflationRate / 100;
  return fvGoals / Math.pow(1 + inflationRateDecimal, yearsToGoal);
}

/**
 * Step 3: Calculate future value of investments based on allocated goal
 * Formula: fv_inv = cur_amt * ((1+ exp_return) ^ yrs_to_goal)
 */
export function calculateFutureValueInvestments(currentAmount: number, expectedReturn: number, yearsToGoal: number): number {
  if (yearsToGoal === 0) return currentAmount;
  const returnRateDecimal = expectedReturn / 100;
  return currentAmount * Math.pow(1 + returnRateDecimal, yearsToGoal);
}

/**
 * Step 4: Calculate future value of SIPs based on allocated goal
 * Two scenarios:
 * 1) Months to Goal < SIP months left: calculate based on months_to_goal
 * 2) SIP months left < Months to Goal: calculate based on sip_months_left, then compound for remaining period
 */
export function calculateFutureValueSIPs(sipAmount: number, monthsLeft: number, expectedReturn: number, yearsToGoal: number): number {
  if (sipAmount === 0 || monthsLeft === 0) return 0;
  
  const monthsToGoal = yearsToGoal * 12;
  const annualReturn = expectedReturn / 100;
  const monthlyReturn = annualReturn / 12;
  
  // If no time to goal, return 0
  if (monthsToGoal <= 0) return 0;
  
  // Situation 1: Months to Goal < SIP months left
  if (monthsToGoal <= monthsLeft) {
    // Calculate FV for the months to goal period only
    const n = monthsToGoal;
    const fvSip = sipAmount * ((Math.pow(1 + monthlyReturn, n) - 1) / monthlyReturn) * (1 + monthlyReturn);
    return fvSip;
  } 
  // Situation 2: SIP months left < Months to Goal
  else {
    // Calculate FV for SIP period
    const n = monthsLeft;
    let fvSip = sipAmount * ((Math.pow(1 + monthlyReturn, n) - 1) / monthlyReturn) * (1 + monthlyReturn);
    
    // Compound this value for the remaining period
    const remainingMonths = monthsToGoal - monthsLeft;
    const remainingYears = remainingMonths / 12;
    fvSip = fvSip * Math.pow(1 + annualReturn, remainingYears);
    
    return fvSip;
  }
}

/**
 * Step 5: Calculate pv_inv and fv_inv for each goal
 * pv_inv = sum of cur_amt of all investments linked to this goal
 * fv_inv = sum of fv_inv of all investments + fv_sip of all SIPs linked to this goal
 */
export function calculateGoalAllocations(
  goalId: number, 
  investments: Investments[], 
  sips: SipDetail[], 
  yearsToGoal: number
): { pvInv: number; fvInv: number } {
  // Calculate present value investments (sum of current amounts)
  const pvInv = investments
    .filter(inv => inv.goal_id === goalId)
    .reduce((sum, inv) => sum + (inv.cur_amt || 0), 0);

  // Calculate future value investments
  const fvInvestments = investments
    .filter(inv => inv.goal_id === goalId)
    .reduce((sum, inv) => {
      const fv = calculateFutureValueInvestments(inv.cur_amt || 0, inv.exp_return || 0, yearsToGoal);
      return sum + fv;
    }, 0);

  // Calculate future value SIPs
  const fvSips = sips
    .filter(sip => sip.goal_id === goalId)
    .reduce((sum, sip) => {
      const fv = calculateFutureValueSIPs(sip.sip_amount || 0, sip.months_left || 0, sip.exp_return || 0, yearsToGoal);
      return sum + fv;
    }, 0);

  const fvInv = fvInvestments + fvSips;

  return { pvInv, fvInv };
}

/**
 * Step 6: Calculate pending amount
 * Formula: pending_amt = max(0, fv_goals - fv_inv)
 */
export function calculatePendingAmount(fvGoals: number, fvInv: number): number {
  return Math.max(0, fvGoals - fvInv);
}

/**
 * Step 7: Calculate goal achievement percentage
 * Formula: goal_ach = fv_inv / fv_goals * 100
 */
export function calculateGoalAchievement(fvGoals: number, fvInv: number): number {
  if (fvGoals === 0) return 0;
  return (fvInv / fvGoals) * 100;
}

/**
 * Step 8: Calculate lumpsum required
 * Formula: lumpsum_req = pending_amt / ((1+exp_returns)^(yrs_to_goal))
 */
export function calculateLumpsumRequired(pendingAmount: number, expectedReturns: number, yearsToGoal: number): number {
  if (pendingAmount === 0 || yearsToGoal === 0) return pendingAmount;
  const returnRateDecimal = expectedReturns / 100;
  return pendingAmount / Math.pow(1 + returnRateDecimal, yearsToGoal);
}

/**
 * Step 9: Calculate SIP required
 * Using the exact formula provided in FINPLAN.md
 */
export function calculateSIPRequired(pendingAmount: number, expectedReturns: number, yearsToGoal: number): number {
  if (pendingAmount === 0 || yearsToGoal === 0) return 0;
  if (expectedReturns === 0) return pendingAmount / (yearsToGoal * 12); // Simple division for 0% returns
  
  const expReturns = expectedReturns / 100;
  const monthlyReturn = Math.pow(1 + expReturns, 1 / 12);
  const inverseMonthlyReturn = Math.pow(1 + expReturns, -1 / 12);
  const numerator = (monthlyReturn - 1) * inverseMonthlyReturn * pendingAmount;
  const denominator = Math.pow(monthlyReturn, 12 * yearsToGoal) - 1;

  let sipReq = (numerator / denominator) * Math.pow(10, 5);
  sipReq = Math.round(sipReq * 10) / 10;

  return sipReq;
}

/**
 * Step 10: Calculate total lumpsum and SIP required across all goals
 */
export function calculateTotalRequirements(calculatedGoals: any[]): { totalLumpsumReq: number; totalSipReq: number } {
  const totalLumpsumReq = calculatedGoals.reduce((sum, goal) => sum + (goal.lumpsum_req || 0), 0);
  const totalSipReq = calculatedGoals.reduce((sum, goal) => sum + (goal.sip_req || 0), 0);
  
  return { totalLumpsumReq, totalSipReq };
}

/**
 * Step 11: Main orchestration function that calculates all financial planning data
 * This function runs all calculations in the proper sequence
 */
export function orchestrateCalculations(
  finGoals: FinGoalsDetail[],
  investments: Investments[],
  sips: SipDetail[]
): FinGoalsDetail[] {
  return finGoals.map(goal => {
    // Step 1: Calculate years to goal
    const yearsToGoal = calculateYearsToGoal(new Date(goal.goal_date));
    
    // Step 2: Calculate present value of goals
    const pvGoal = calculatePresentValueGoals(goal.fv_goals, goal.inflation_rate, yearsToGoal);
    
    // Step 5: Calculate allocations for this goal
    const { pvInv, fvInv } = calculateGoalAllocations(goal.goal_id, investments, sips, yearsToGoal);
    
    // Step 6: Calculate pending amount
    const pendingAmt = calculatePendingAmount(goal.fv_goals, fvInv);
    
    // Step 7: Calculate goal achievement
    const goalAch = calculateGoalAchievement(goal.fv_goals, fvInv);
    
    // Step 8: Calculate lumpsum required
    const lumpsumReq = calculateLumpsumRequired(pendingAmt, goal.exp_returns, yearsToGoal);
    
    // Step 9: Calculate SIP required
    const sipReq = calculateSIPRequired(pendingAmt, goal.exp_returns, yearsToGoal);
    
    // Return updated goal with all calculated values
    return {
      ...goal,
      yrs_to_goal: yearsToGoal,
      pv_goal: pvGoal,
      pv_inv: pvInv,
      fv_inv: fvInv,
      pending_amt: pendingAmt,
      goal_ach: goalAch,
      lumpsum_req: lumpsumReq,
      sip_req: sipReq
    };
  });
}
