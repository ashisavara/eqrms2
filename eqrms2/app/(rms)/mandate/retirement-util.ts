export type RetirementAssumptions = {
  primaryInvestorDob: Date;
  currentAge: number;
  retirementAge: number;
  lifespan: number;
  currentAnnualExpLakhs: number;
  inflationPct: number;
  yieldPostRetirementPct: number;
};

export type RetirementCashFlowRow = {
  age: number;
  startingCorpus: number;
  fvExpenses: number;
  investmentReturn: number;
  endingCorpus: number;
};

export function ageFromDob(dob: Date, asOf = new Date()): number {
  let age = asOf.getFullYear() - dob.getFullYear();
  const monthDiff = asOf.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && asOf.getDate() < dob.getDate())) age--;
  return age;
}

function inflatedExpenseAtAge(baseLakhs: number, inflationPct: number, age: number, currentAge: number): number {
  const inflation = inflationPct / 100;
  return baseLakhs * Math.pow(1 + inflation, age - currentAge);
}

function startingCorpusByAgeBackward({
  currentAnnualExpLakhs,
  inflationPct,
  yieldPostRetirementPct,
  startAge,
  lifespan,
  currentAge,
}: {
  currentAnnualExpLakhs: number;
  inflationPct: number;
  yieldPostRetirementPct: number;
  startAge: number;
  lifespan: number;
  currentAge: number;
}): Map<number, number> {
  const y = yieldPostRetirementPct / 100;
  const byAge = new Map<number, number>();
  if (startAge > lifespan) return byAge;

  let starting = inflatedExpenseAtAge(currentAnnualExpLakhs, inflationPct, lifespan, currentAge);
  byAge.set(lifespan, starting);

  for (let age = lifespan - 1; age >= startAge; age--) {
    const fvExpense = inflatedExpenseAtAge(currentAnnualExpLakhs, inflationPct, age, currentAge);
    starting = starting / (1 + y) + fvExpense;
    byAge.set(age, starting);
  }

  return byAge;
}

export function resolveRetirementStartAge(currentAge: number, retirementAge: number): number {
  return Math.max(currentAge, retirementAge);
}

export function calculateRetirementCorpusRequired(assumptions: RetirementAssumptions): number {
  const startAge = resolveRetirementStartAge(assumptions.currentAge, assumptions.retirementAge);
  const byAge = startingCorpusByAgeBackward({
    currentAnnualExpLakhs: assumptions.currentAnnualExpLakhs,
    inflationPct: assumptions.inflationPct,
    yieldPostRetirementPct: assumptions.yieldPostRetirementPct,
    startAge,
    lifespan: assumptions.lifespan,
    currentAge: assumptions.currentAge,
  });
  return byAge.get(startAge) ?? 0;
}

export function calculateCorpusByAge(assumptions: RetirementAssumptions): Array<{ age: number; corpus: number }> {
  const startAge = resolveRetirementStartAge(assumptions.currentAge, assumptions.retirementAge);
  const byAge = startingCorpusByAgeBackward({
    currentAnnualExpLakhs: assumptions.currentAnnualExpLakhs,
    inflationPct: assumptions.inflationPct,
    yieldPostRetirementPct: assumptions.yieldPostRetirementPct,
    startAge,
    lifespan: assumptions.lifespan,
    currentAge: assumptions.currentAge,
  });

  return Array.from({ length: assumptions.lifespan - startAge + 1 }, (_, idx) => {
    const age = startAge + idx;
    return { age, corpus: byAge.get(age) ?? 0 };
  });
}

export function calculateRetirementCashFlows(
  assumptions: RetirementAssumptions,
  startingCorpusLakhs: number
): RetirementCashFlowRow[] {
  const rows: RetirementCashFlowRow[] = [];
  const startAge = resolveRetirementStartAge(assumptions.currentAge, assumptions.retirementAge);
  const y = assumptions.yieldPostRetirementPct / 100;
  let corpus = startingCorpusLakhs;

  for (let age = startAge; age <= assumptions.lifespan; age++) {
    const fvExpenses = inflatedExpenseAtAge(
      assumptions.currentAnnualExpLakhs,
      assumptions.inflationPct,
      age,
      assumptions.currentAge
    );
    const postExpenseCorpus = corpus - fvExpenses;
    const investmentReturn = postExpenseCorpus * y;
    const endingCorpus = postExpenseCorpus * (1 + y);
    rows.push({ age, startingCorpus: corpus, fvExpenses, investmentReturn, endingCorpus });
    corpus = endingCorpus;
  }

  return rows;
}

export function areRetirementAssumptionsComplete(values: {
  ret_primary_investor_dob: Date | null | undefined;
  ret_retirement_age: number | null | undefined;
  ret_lifespan: number | null | undefined;
  ret_current_annual_exp_lakhs: number | null | undefined;
  ret_inflation_pct: number | null | undefined;
  ret_yield_post_retirement_pct: number | null | undefined;
  ret_corpus_exp_return_corpus_build: number | null | undefined;
}): boolean {
  return (
    values.ret_primary_investor_dob != null &&
    values.ret_retirement_age != null &&
    values.ret_lifespan != null &&
    values.ret_current_annual_exp_lakhs != null &&
    values.ret_inflation_pct != null &&
    values.ret_yield_post_retirement_pct != null &&
    values.ret_corpus_exp_return_corpus_build != null
  );
}

