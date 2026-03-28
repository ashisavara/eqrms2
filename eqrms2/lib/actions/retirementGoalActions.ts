"use server";

import { createClient } from "@/lib/supabase/server";

type UpsertRetirementGoalParams = {
  groupId: number;
  goalDateIso: string;
  expReturns: number;
  inflationRate: number;
  fvGoals: number;
};

export async function upsertRetirementGoal({
  groupId,
  goalDateIso,
  expReturns,
  inflationRate,
  fvGoals,
}: UpsertRetirementGoalParams): Promise<void> {
  const supabase = await createClient();
  const { data: existingGoal, error: readError } = await supabase
    .from("fin_goals")
    .select("goal_id")
    .eq("group_id", groupId)
    .eq("is_retirement_corpus", true)
    .order("goal_id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (readError) throw readError;

  const payload = {
    goal_name: "Retirement Corpus",
    goal_date: goalDateIso,
    exp_returns: expReturns,
    inflation_rate: inflationRate,
    fv_goals: fvGoals,
    is_retirement_corpus: true,
  };

  if (existingGoal?.goal_id) {
    const { error: updateError } = await supabase.from("fin_goals").update(payload).eq("goal_id", existingGoal.goal_id);
    if (updateError) throw updateError;
    return;
  }

  const { error: insertError } = await supabase.from("fin_goals").insert({ ...payload, group_id: groupId });
  if (insertError) throw insertError;
}

