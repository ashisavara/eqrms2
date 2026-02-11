import Link from "next/link";
import { CALCULATORS_LIST } from "./calculators-config";
import { getCalculatorSeoRecord } from "./seo";

type SeoContentBlock = {
  overview: string[];
  howToUse?: string[];
  assumptions?: string[];
  faqs?: Array<{ q: string; a: string }>;
  relatedSlugs?: string[];
};

const SEO_CONTENT: Record<string, SeoContentBlock> = {
  "time-value-of-money-calculations": {
    overview: [
      "Money has a time value — ₹1 today is worth more than ₹1 tomorrow because it can be invested and grow. This calculator helps you translate values across time using a growth rate.",
      "Use it when you want to compare options across different time horizons: future value (FV), present value (PV), and the growth rate required to reach a target amount.",
    ],
    howToUse: [
      "Pick the tab (FV, PV, or CAGR).",
      "Enter the amount, years, and expected rate of return.",
      "Use the result to sanity-check goals and compare alternatives on the same basis.",
    ],
    assumptions: [
      "Return rate is assumed to compound annually at a constant rate.",
      "No taxes, fees, or interim cashflows are considered unless you model them separately.",
    ],
  },
  "lumpsum-sip-future-value-calculator": {
    overview: [
      "If you invest via a lumpsum and/or SIP, the timing of cashflows matters — SIP contributions get less time to compound than the initial amount.",
      "This calculator compares how a lumpsum and SIP can grow over time given a return assumption.",
    ],
    howToUse: [
      "Enter lumpsum amount, SIP amount, and investment horizon.",
      "Adjust the expected return to reflect a conservative vs optimistic scenario.",
      "Use the snapshot to understand invested amount vs future value and gains.",
    ],
    assumptions: [
      "Returns are modeled using a constant annual rate (converted internally to periodic growth where applicable).",
      "No taxes/expense ratios are included; treat results as pre-tax illustrations.",
    ],
  },
  "cash-futures-arbitrage": {
    overview: [
      "Arbitrage funds typically exploit price differences between the cash market and the futures market for the same security.",
      "This calculator illustrates a cash-futures trade and the resulting return based on the spread and margin/capital deployed.",
    ],
    howToUse: [
      "Enter the cash buy price and the futures sell price, and the closing prices.",
      "Set the margin/capital assumptions to understand deployed capital.",
      "Review monthly vs annualised return to compare to other low-risk alternatives.",
    ],
    assumptions: [
      "Illustrative example only; real-world arbitrage returns depend on execution, costs, and market conditions.",
      "Taxes, brokerage, and slippages are not explicitly modeled unless captured via inputs.",
    ],
  },
  "understanding-impact-of-compounding": {
    overview: [
      "Compounding is powerful because returns themselves begin to earn returns over time — the effect becomes more visible as the horizon increases.",
      "This calculator helps you see how different return assumptions can lead to meaningfully different outcomes over 5, 10, 15, and 20 years.",
    ],
    howToUse: [
      "Enter the investment amount and set your return assumptions (e.g., debt vs equity).",
      "Compare outcomes across multiple horizons rather than focusing only on the final year.",
      "Use it to set expectations and understand why time-in-the-market matters.",
    ],
    assumptions: [
      "Returns are assumed to compound at constant rates for the chosen scenarios.",
      "No taxes/fees are included; treat as an illustration of compounding mechanics.",
    ],
  },
  "profit-share-fee-structure": {
    overview: [
      "Investment products can have different fee structures — fixed fees, profit sharing, and hurdles can change the manager's incentives and your net outcome.",
      "This calculator compares fee outcomes across return scenarios so you can understand what you're paying and when.",
    ],
    howToUse: [
      "Set the fixed fee / profit share / hurdle rate assumptions.",
      "Review the fee table across a range of fund returns.",
      "Use it to compare structures on a like-for-like basis before committing capital.",
    ],
    assumptions: [
      "Outputs are scenario-based and simplified; actual fund documents can include additional clauses.",
      "Taxes are not included — interpret fees as pre-tax costs unless specified.",
    ],
  },
  "aif-taxation": {
    overview: [
      "Gross returns are not the same as investor outcomes — fees and taxes can materially change what you take home.",
      "This calculator estimates post-tax outcomes for an AIF-style fee model from gross returns under a chosen structure.",
    ],
    howToUse: [
      "Enter gross return and fee parameters (fixed fee, performance sharing, hurdle).",
      "Choose the applicable structure/tax assumption.",
      "Compare gross vs post-fee vs post-tax to understand the gap and sensitivity.",
    ],
    assumptions: [
      "Tax rates are modeled as simplified effective rates for illustration.",
      "Does not cover investor-specific nuances such as loss set-offs, surcharge/cess changes, or holding-period effects.",
    ],
  },
  "54ec-bonds-vs-equity": {
    overview: [
      "54EC bonds can offer capital gains tax relief in specific situations, while equity can offer higher growth potential — but outcomes depend on returns and tax assumptions.",
      "This calculator compares post-tax ending values so you can quantify the trade-off.",
    ],
    howToUse: [
      "Enter investment amount, 54EC rate, investor tax rate, equity return, and horizon.",
      "Review post-tax ending values side-by-side.",
      'Use "Additional" value to quantify the incremental benefit (or cost) of choosing equity vs 54EC.',
    ],
    assumptions: [
      "Assumes constant return rates and simplified tax application for comparability.",
      "Not a substitute for tax advice; eligibility and limits for 54EC may apply.",
    ],
  },
  "annual-expense-calculator": {
    overview: [
      "Retirement planning starts with a realistic estimate of ongoing monthly expenses and one-time (lumpy) expenses.",
      "This calculator helps you organise expenses into categories and arrive at an annual cost estimate to use in deeper retirement models.",
    ],
    howToUse: [
      "Enter monthly recurring costs and lumpy annual/one-time costs.",
      "Review the totals for monthly, annualised monthly, and overall annual estimate.",
      "Use the annual estimate as an input to retirement corpus calculators.",
    ],
    assumptions: [
      "This calculator focuses on estimating costs; it does not apply inflation/returns by itself.",
      "Treat outputs as a planning baseline and refine as spending patterns change.",
    ],
    relatedSlugs: ["retirement-corpus-required", "retirement-corpus"],
  },
  "feeder-fund-mechanism": {
    overview: [
      "Feeder funds invest in an overseas fund. Your INR outcome depends on both the underlying fund performance and currency movement.",
      "This calculator breaks the return into asset appreciation and currency impact so you can see where gains/losses came from.",
    ],
    howToUse: [
      "Enter INR investment, FX rate at investment and redemption, and USD fund return/NAV inputs.",
      "Review investment details (units) and redemption details (value).",
      "Use the returns breakdown to understand asset vs currency contribution.",
    ],
    assumptions: [
      "Assumes clean conversion at the chosen FX rates; does not include transaction costs/spreads.",
      "Taxation and remittance costs are not included.",
    ],
  },
  "return-ranges-across-fund-categories": {
    overview: [
      "Different fund categories behave differently across market environments. Comparing ranges helps you set realistic expectations rather than relying on a single-point return assumption.",
      "This calculator compares category outcomes under multiple debt/equity return scenarios and shows how a blended portfolio can behave.",
    ],
    howToUse: [
      "Set low/average/high return assumptions for debt and equity.",
      "Adjust portfolio allocation by category to match your intended mix.",
      "Use the table to compare category returns and the portfolio blend across scenarios.",
    ],
    assumptions: [
      "Scenario-based; real returns can deviate and correlations can change during stress periods.",
      "Does not include category-specific taxes, costs, or tracking error.",
    ],
  },
  "retirement-corpus-required": {
    overview: [
      "This calculator estimates the retirement corpus required to fund annual expenses from your retirement age through your expected lifespan.",
      "It models expenses growing with inflation and corpus growing with a post-retirement yield, and computes the starting corpus needed at retirement.",
    ],
    howToUse: [
      "Set current age, retirement age, and expected lifespan.",
      "Enter current annual expense (in ₹ lakhs) and adjust inflation and post-retirement yield assumptions.",
      "Use the charts and cash flow table to understand how the corpus evolves year-by-year.",
    ],
    assumptions: [
      "Inflation and yield are assumed to be constant rates for the illustration horizon.",
      "Does not include taxes, healthcare shocks, or changes in spending patterns unless captured via expense inputs.",
    ],
    relatedSlugs: ["annual-expense-calculator", "retirement-corpus"],
  },
  "retirement-corpus": {
    overview: [
      "If you’re already retired, the key question is whether your existing corpus can sustain your expenses over time.",
      "This calculator projects your corpus year-by-year based on investment returns, other income, and inflation on expenses/income.",
    ],
    howToUse: [
      "Enter current age, plan-till age, starting retirement corpus, and annual income/expenses (₹ lakhs).",
      "Adjust return and inflation rates to test conservative vs optimistic scenarios.",
      "Use the corpus-by-age chart to identify if/when the corpus is depleted.",
    ],
    assumptions: [
      "Assumes constant rates for return and inflation; actual returns and inflation vary year to year.",
      "Does not model sequence-of-returns risk beyond the constant-rate assumption.",
    ],
    relatedSlugs: ["retirement-corpus-required", "annual-expense-calculator"],
  },
  "debt-mf-vs-bank-fd-buy-hold": {
    overview: [
      "Even when debt mutual funds are taxed at the slab rate, they can still be more tax efficient than bank fixed deposits because taxation happens only on redemption — and only on the capital gains portion of the redeemed units.",
      "This calculator compares annual tax paid and post-tax income when you redeem from a debt MF each year an amount equal to the FD interest.",
    ],
    howToUse: [
      "Enter investment amount, interest rate, and your tax slab rate.",
      "Review the tax and post-tax income charts year-by-year.",
      "Use the table to see units redeemed, capital gain per unit, and the tax difference vs FD.",
    ],
    assumptions: [
      "Assumes the debt MF grows at the same rate as the FD interest rate for a like-for-like illustration.",
      "Uses a simplified cost base (initial NAV) to compute capital gains per redeemed unit.",
    ],
    faqs: [
      {
        q: "Why is Debt MF tax lower even if the slab rate is the same?",
        a: "Because in a Debt MF you pay tax only on the capital gains portion of redeemed units. In an FD, the full interest amount is taxable each year.",
      },
      {
        q: "Why does the tax increase over time for Debt MF in the table?",
        a: "As NAV rises, the capital gain per unit increases. When you redeem units, a larger portion of the redemption becomes capital gains, increasing tax gradually.",
      },
    ],
  },
};

function RelatedCalculators({ slugs }: { slugs: string[] }) {
  const items = CALCULATORS_LIST.filter((c) => slugs.includes(c.slug));
  if (items.length === 0) return null;

  return (
    <div className="pt-2">
      <h3 className="font-semibold text-base mb-2">Related calculators</h3>
      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
        {items.map((c) => (
          <li key={c.slug}>
            <Link className="underline underline-offset-2" href={`/financial-calculator/${c.slug}`}>
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CalculatorSeoContent({ slug }: { slug: string }) {
  const rec = getCalculatorSeoRecord(slug);
  const block = SEO_CONTENT[slug];
  if (!block) return null;

  return (
    <div className="mt-10 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-blue-900">About this calculator</h2>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{rec.title}</span>
          {rec.category ? ` • ${rec.category}` : ""}
        </p>
      </div>

      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {block.overview.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {block.howToUse?.length ? (
        <div className="space-y-2">
          <h3 className="font-semibold text-base">How to use</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {block.howToUse.map((li, idx) => (
              <li key={idx}>{li}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {block.assumptions?.length ? (
        <div className="space-y-2">
          <h3 className="font-semibold text-base">Key assumptions</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {block.assumptions.map((li, idx) => (
              <li key={idx}>{li}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {block.faqs?.length ? (
        <div className="space-y-3">
          <h3 className="font-semibold text-base">FAQs</h3>
          <div className="space-y-3">
            {block.faqs.map((f, idx) => (
              <div key={idx} className="text-sm">
                <p className="font-medium">{f.q}</p>
                <p className="text-muted-foreground mt-1 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {block.relatedSlugs?.length ? <RelatedCalculators slugs={block.relatedSlugs} /> : null}
    </div>
  );
}

