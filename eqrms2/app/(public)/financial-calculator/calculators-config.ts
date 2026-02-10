export type CalculatorListItem = {
  slug: string;
  title: string;
  summary: string;
  category?: string;
};

export const CALCULATORS_LIST: CalculatorListItem[] = [
  {
    slug: "return-ranges-across-fund-categories",
    title: "Return Ranges across Fund Categories",
    summary:
      "Understand the range of returns across different fund categories (debt, hybrid & equity) across a range of market returns.",
    category: "Concepts",
  },
  {
    slug: "time-value-of-money-calculations",
    title: "Time Value of Money Calculations",
    summary:
      "A calculator to find the future value and current value of investments.",
    category: "Concepts",
  },
  {
    slug: "debt-mf-vs-bank-fd-buy-hold",
    title: "Debt MF vs Bank FD",
    summary:
      "Even under the new tax structure, Debt Mutual Funds are more tax efficient than Bank Fixed Deposits due to a difference in the manner in which they are taxed.",
    category: "Debt",
  },
  {
    slug: "retirement-corpus-required",
    title: "Retirement Corpus Required",
    summary:
      "This calculator allows one to calculate the sufficiency of retirement corpus",
    category: "Fin Plan",
  },
  {
    slug: "profit-share-fee-structure",
    title: "Profit Share Fee Structure",
    summary:
      "Using this calculator one could compare the different fee structure options available",
    category: "Funds",
  },
  {
    slug: "feeder-fund-mechanism",
    title: "Feeder Fund Mechanism",
    summary:
      "Using this calculator one can understand how feeder funds give both, country and currency diversification",
    category: "Funds",
  },
  {
    slug: "aif-taxation",
    title: "AIF Taxation",
    summary:
      "Use this calculator to estimate the post-tax returns of AIF from gross returns",
    category: "Taxation",
  },
  {
    slug: "understanding-impact-of-compounding",
    title: "Understanding Impact of Compounding",
    summary:
      "Using this calculator, one could understand the effect of compounded returns on an investment",
    category: "Concepts",
  },
  {
    slug: "annual-expense-calculator",
    title: "Annual Expense Calculator",
    summary:
      "This calculator helps us calculate the current costs & the current costs post retirement and accordingly compare the annualized monthly expenses & lumpy expenses",
    category: "Fin Plan",
  },
  {
    slug: "retirement-corpus",
    title: "Retirement Corpus (how long will it last)",
    summary: "Estimate how long your retirement corpus will last",
    category: "Fin Plan",
  },
  {
    slug: "lumpsum-sip-future-value-calculator",
    title: "Lumpsum & SIP Future Value Calculator",
    summary:
      "Compare the future values of lumpsum investments and SIP investments",
    category: "Concepts",
  },
  {
    slug: "54ec-bonds-vs-equity",
    title: "54EC Bonds vs Equity Calculator",
    summary:
      "Calculate the difference in post-tax returns between 54EC bonds & Equity",
    category: "Real Estate",
  },
  {
    slug: "cash-futures-arbitrage",
    title: "Cash Futures Arbitrage",
    summary:
      "Arbitrage mutual funds invest in cash future transactions - i.e. by buying and selling of the same security in the cash & futures market, the fund locks in the price differential between the 2 markets. This calculator helps explain how this cash future transaction is executed.",
    category: "Debt",
  },
];
