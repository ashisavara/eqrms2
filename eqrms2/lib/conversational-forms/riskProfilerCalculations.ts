/**
 * Risk Profiler Calculation Utilities
 * Handles score calculations and category tagging for the Risk Profiler
 */

export interface RiskProfilerAnswers {
  rt1_score?: string;
  rt2_score?: string;
  rt3_score?: string;
  rt4_score?: string;
  rt5_score?: string;
  ra1_score?: string;
  ra2_score?: string;
  ra3_score?: string;
  ra4_score?: string;
  ra5_score?: string;
}

export interface RiskProfilerScores {
  rt_score: number | null;           // Risk Taking total (0-50)
  ra_score: number | null;           // Risk Appetite total (0-50)
  rp_score: number | null;           // Risk Profile average (0-50)
  risk_taking_ability: string | null;     // Category label
  risk_appetite: string | null;           // Category label
  risk_profile: string | null;            // Category label
}

/**
 * Get category label based on score
 * Score ranges:
 * - Very Conservative: < 10
 * - Conservative: 10-20
 * - Balanced: 20-30
 * - Aggressive: 30-40
 * - Very Aggressive: 40-50
 */
export function getCategoryFromScore(score: number | null): string | null {
  if (score === null || score === undefined) return null;
  
  if (score < 10) return 'Very Conservative';
  if (score < 20) return 'Conservative';
  if (score < 30) return 'Balanced';
  if (score < 40) return 'Aggressive';
  return 'Very Aggressive';
}

/**
 * Calculate sum of risk taking scores (RT1-RT5)
 * Returns null if any question is unanswered
 */
export function calculateRiskTakingScore(answers: RiskProfilerAnswers): number | null {
  const scores = [
    answers.rt1_score,
    answers.rt2_score,
    answers.rt3_score,
    answers.rt4_score,
    answers.rt5_score,
  ];

  // Check if all questions are answered
  if (scores.some(score => !score)) {
    return null;
  }

  // Sum up the scores
  return scores.reduce((sum, score) => sum + parseFloat(score!), 0);
}

/**
 * Calculate sum of risk appetite scores (RA1-RA5)
 * Returns null if any question is unanswered
 */
export function calculateRiskAppetiteScore(answers: RiskProfilerAnswers): number | null {
  const scores = [
    answers.ra1_score,
    answers.ra2_score,
    answers.ra3_score,
    answers.ra4_score,
    answers.ra5_score,
  ];

  // Check if all questions are answered
  if (scores.some(score => !score)) {
    return null;
  }

  // Sum up the scores
  return scores.reduce((sum, score) => sum + parseFloat(score!), 0);
}

/**
 * Calculate overall risk profile score (average of RT and RA)
 * Returns null if either RT or RA is not complete
 */
export function calculateRiskProfileScore(rtScore: number | null, raScore: number | null): number | null {
  if (rtScore === null || raScore === null) {
    return null;
  }

  return (rtScore + raScore) / 2;
}

/**
 * Calculate all scores and categories
 */
export function calculateAllScores(answers: RiskProfilerAnswers): RiskProfilerScores {
  const rt_score = calculateRiskTakingScore(answers);
  const ra_score = calculateRiskAppetiteScore(answers);
  const rp_score = calculateRiskProfileScore(rt_score, ra_score);

  return {
    rt_score,
    ra_score,
    rp_score,
    risk_taking_ability: getCategoryFromScore(rt_score),
    risk_appetite: getCategoryFromScore(ra_score),
    risk_profile: getCategoryFromScore(rp_score),
  };
}

/**
 * Check if all required questions are answered
 */
export function isRiskProfilerComplete(answers: RiskProfilerAnswers): boolean {
  const requiredFields: (keyof RiskProfilerAnswers)[] = [
    'rt1_score', 'rt2_score', 'rt3_score', 'rt4_score', 'rt5_score',
    'ra1_score', 'ra2_score', 'ra3_score', 'ra4_score', 'ra5_score',
  ];

  return requiredFields.every(field => answers[field] && answers[field] !== '');
}

/**
 * Count how many questions have been answered in each section
 */
export function getAnsweredCounts(answers: RiskProfilerAnswers): { rt: number; ra: number } {
  const rtFields = ['rt1_score', 'rt2_score', 'rt3_score', 'rt4_score', 'rt5_score'] as const;
  const raFields = ['ra1_score', 'ra2_score', 'ra3_score', 'ra4_score', 'ra5_score'] as const;

  const rtAnswered = rtFields.filter(field => answers[field] && answers[field] !== '').length;
  const raAnswered = raFields.filter(field => answers[field] && answers[field] !== '').length;

  return { rt: rtAnswered, ra: raAnswered };
}

