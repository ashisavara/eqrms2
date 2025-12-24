"use server";

import { supabaseUpdateRow } from "@/lib/supabase/serverQueryHelper";
import { ServerActionResponse } from "./types";
import { RiskProfilerAnswers, RiskProfilerScores } from "./riskProfilerCalculations";

/**
 * Submit complete risk profiler data
 * Updates client_group with all scores and calculated values in a single transaction
 */
export async function submitRiskProfiler(
  groupId: number,
  answers: RiskProfilerAnswers,
  scores: RiskProfilerScores
): Promise<ServerActionResponse> {
  try {
    // Prepare data for database update
    const updateData = {
      // Individual question scores
      rt1_score: parseFloat(answers.rt1_score!),
      rt2_score: parseFloat(answers.rt2_score!),
      rt3_score: parseFloat(answers.rt3_score!),
      rt4_score: parseFloat(answers.rt4_score!),
      rt5_score: parseFloat(answers.rt5_score!),
      ra1_score: parseFloat(answers.ra1_score!),
      ra2_score: parseFloat(answers.ra2_score!),
      ra3_score: parseFloat(answers.ra3_score!),
      ra4_score: parseFloat(answers.ra4_score!),
      ra5_score: parseFloat(answers.ra5_score!),
      
      // Calculated scores
      rt_score: scores.rt_score,
      ra_score: scores.ra_score,
      rp_score: scores.rp_score,
      
      // Category labels
      risk_taking_ability: scores.risk_taking_ability,
      risk_appetite: scores.risk_appetite,
      risk_profile_calculated: scores.risk_profile,
    };

    await supabaseUpdateRow("client_group", "group_id", groupId, updateData);
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error submitting risk profiler:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit risk profiler'
    };
  }
}

