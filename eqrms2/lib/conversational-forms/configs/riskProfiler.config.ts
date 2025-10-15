import { z } from "zod";
import { MandateFormConfig } from "../types";

export const riskProfilerFormConfig: MandateFormConfig = {
  formType: "risk_profile",
  title: "Investor Risk Profile",
  description: "Answer a few questions to help us assess your risk tolerance and preferences.",
  questions: [
    // RT1 — Age bracket
    {
      id: "q1_age",
      type: "radio",
      label: "What is your current age?",
      field: "rt1_score",
      validation: z.enum(["0", "2.5", "5", "7.5", "10"], {
        required_error: "Please select an option",
      }),
      options: [
        { value: "0", label: "60+" },
        { value: "2.5", label: "50-60" },
        { value: "5", label: "40-50" },
        { value: "7.5", label: "30-40" },
        { value: "10", label: "Below 30" },
      ],
      helperText: "Age can influence time horizon and capacity for risk.",
    },

    // RT2 — Investment horizon
    {
      id: "q2_horizon",
      type: "radio",
      label: "For the major part of your portfolio, how many years do you have before you need to start making significant withdrawals?",
      field: "rt2_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "Less than 1 year" },
        { value: "2.5", label: "1-2 years" },
        { value: "5", label: "3-5 years" },
        { value: "7.5", label: "6-10 years" },
        { value: "10", label: "Above 10 years" },
      ],
      helperText: "Longer horizons generally allow for higher equity allocation.",
    },

    // RT3 — Income / cash-flow stability
    {
      id: "q3_stability",
      type: "radio",
      label: "How stable are your income and cash flows?",
      field: "rt3_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "Very Unstable" },
        { value: "2.5", label: "Unstable" },
        { value: "5", label: "Average" },
        { value: "7.5", label: "Stable" },
        { value: "10", label: "Very Stable" },
      ],
      helperText: "Stable income can support higher short-term volatility.",
    },

    // RT4 — Liquidity needs
    {
      id: "q4_liquidity",
      type: "radio",
      label: "If you were to lose your job today, how many months of expenses will your investments cover?",
      field: "rt4_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "3 months" },
        { value: "2.5", label: "3-12 months" },
        { value: "5", label: "1-3 years" },
        { value: "7.5", label: "3-5 years" },
        { value: "10", label: ">5 years OR other sources take care of expenses" },
      ],
      helperText: "Shorter liquidity windows usually call for lower risk assets.",
    },

    // RT5 — Market experience
    {
      id: "q5_experience",
      type: "radio",
      label: "As an investor, I would describe myself as",
      field: "rt5_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "Very inexperienced (less than 1 year, limited understanding)" },
        { value: "2.5", label: "Fairly inexperienced (1-3 years, low understanding)" },
        { value: "5", label: "Experienced (3-5 years, reasonable understanding)" },
        { value: "7.5", label: "Fairly Experienced (5-7 years, good understanding)" },
        { value: "10", label: "Very Experienced (more than 7 years, strong understanding)" },
      ],
      helperText: "Experience can affect comfort with volatility and complex products.",
    },

    // RA1 — Max temporary fall you can tolerate
    {
      id: "q6_drawdown_tolerance",
      type: "radio",
      label: "Corrections in equity markets are normal, but can be painful. How much would your portfolio need to fall, to make you uncomfortable?",
      field: "ra1_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "Any fall would make me uncomfortable" },
        { value: "2.5", label: "5%" },
        { value: "5", label: "10%" },
        { value: "7.5", label: "15%" },
        { value: "10", label: "20% and above" },
      ],
      helperText: "Helps us size your equity exposure.",
    },

    // RA2 — Risk attitude statement
    {
      id: "q7_risk_attitude",
      type: "radio",
      label: "Which statement best reflects your attitude towards risk?",
      field: "ra2_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "VERY LOW RISK-TAKER: Capital preservation is paramount. I don't care as much about returns" },
        { value: "2.5", label: "LOW RISK-TAKER: Capital preservation is more important than returns I make" },
        { value: "5", label: "AVERAGE RISK TAKER: Balanced between capital preservation and returns" },
        { value: "7.5", label: "HIGH RISK-TAKER: I am a risk-taker. I am ok with risking some capital in the short-term for higher returns" },
        { value: "10", label: "AGGRESSIVE RISK-TAKER: I am seeking higher returns, and am willing to risk some capital for the same" },
      ],
      helperText: "Your mindset guides strategic asset allocation.",
    },

    // RA3 — Return expectation
    {
      id: "q8_return_expectation",
      type: "radio",
      label: "Over the long term, what annual return range are you aiming for?",
      field: "ra3_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "5-8%" },
        { value: "2.5", label: "8-12%" },
        { value: "5", label: "12-15%" },
        { value: "7.5", label: "15-18%" },
        { value: "10", label: "Above 18%" },
      ],
      helperText: "Higher return targets typically imply higher volatility.",
    },

    // RA4 — Return vs drawdown trade-off profile
    {
      id: "q9_tradeoff_profile",
      type: "radio",
      label: "Equity funds with higher volatility, often offer higher returns. Which return/volatility profile are you most comfortable with?",
      field: "ra4_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "12-13% average returns | 10-15% fall during market corrections" },
        { value: "2.5", label: "13-15% average returns | 15-20% fall during market corrections" },
        { value: "5", label: "15-18% average returns | 20-25% fall during market corrections" },
        { value: "7.5", label: "18-20% average returns | 25-30% fall during market corrections" },
        { value: "10", label: "20% average returns | 30-50% fall during market corrections" },
      ],
      helperText: "Choose the mix of return potential vs. downside you can live with.",
    },

    // RA5 — Fixed income return preference
    {
      id: "q10_fixed_income_pref",
      type: "radio",
      label: "For lower-risk fixed-income investments, what return profile do you prefer?",
      field: "ra5_score",
      validation: z.enum(
        ["0", "2.5", "5", "7.5", "10"],
        { required_error: "Please select an option" }
      ),
      options: [
        { value: "0", label: "Similar to Bank FDs (5-7.5% annual returns)" },
        { value: "2.5", label: "Slightly higher than Bank FDs (3-9% annual returns)" },
        { value: "5", label: "More than Bank FDs (0-12% annual returns)" },
        { value: "7.5", label: "Want to make higher returns from Fixed Income (-5% to 15% annual returns)" },
        { value: "10", label: "Want to make equity-type returns from Fixed Income (-20% to 20% annual returns)" },
      ],
      helperText: "Higher fixed-income returns typically come with higher risk.",
    },
  ],
};
