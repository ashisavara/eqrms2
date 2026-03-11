# Financial Calculators

## 1. Scope and Principles

- **Standalone only**: No database, no external APIs. Each calculator takes inputs, runs client-side logic, and produces outputs (and optional charts).
- **Same look and feel**: Use existing shadcn UI and project UI components so calculators match the rest of the site.
- **Recharts for charts**: Use Recharts (and existing chart wrappers) whenever a calculator needs a chart.
- **Keep it simple**: Prefer one calculator per route, with logic and UI in that route’s `page.tsx` (or a single dedicated client component for that calculator). Extract shared components only when the same pattern is reused across multiple calculators.

---

## 2. Route and File Structure

- **Base path**: `app/(public)/financial-calculator/` (under the public layout with PublicNavBar and PublicFooter).
- **One folder per calculator**: Each calculator lives in its own segment, e.g.:
  - `financial-calculator/retirement-corpus-required/page.tsx`
  - `financial-calculator/annual-expense-calculator/page.tsx`
- **List page**: `financial-calculator/page.tsx` lists all calculators. The list is driven by a **static config** (e.g. an array of `{ slug, title, summary }`) linking to each `/financial-calculator/[slug]`. No DB dependency for the list or for calculator content.
- **Current state**: The existing `financial-calculator/page.tsx` and `financial-calculator/[slug]/page.tsx` use the `fin_calculators` table and server fetch. The new pattern replaces that with static routes and in-page logic; the list page is updated to use a static config instead of the database.

---

## 3. Tech Stack and Components

- **UI (shadcn)**: `components/ui` – Card, Button, Input, Label, Select, Tabs, etc., as needed per calculator.
- **Layout / content**: Reuse patterns from imepms content pages where relevant:
  - `Section` (`components/uiComponents/section.tsx`)
  - `PageTitle` or `RmsPageTitle` (`components/uiComponents/page-title.tsx`, `rms-page-title.tsx`) for title + caption
  - `FinCalculatorClient` already uses `PageTitle` for the list; individual calculator pages should use the same or similar for consistency.
- **Charts**: Use Recharts and existing wrappers for consistency:
  - `components/ui/chart.tsx` (Recharts-based)
  - `components/charts/CountPieCharts.tsx` as a reference for pie charts
- **Language**: TypeScript; avoid `any` for core calculation logic.

---

## 4. Workflow for Adding a New Calculator

1. **You provide**: A snapshot or description of the existing calculator (from the other platform): inputs, formula/logic, outputs, and whether a chart is needed.
2. **Implementation**:
   - Add a new folder under `app/(public)/financial-calculator/[calculator-slug]/` with a `page.tsx`.
   - Implement inputs (controlled inputs with local state), calculation logic (pure functions where possible), and results (and optional chart) in that page or one client component for that calculator.
   - Use the agreed UI components and Recharts as above.
3. **Listing**: Add an entry for the new calculator to the static config used by `financial-calculator/page.tsx` so it appears on the main Calculators list.

---

## 5. Layout and Formatting Preferences

Apply these consistently across all calculator pages:

- **Page structure**: PageTitle sits in a parent div **above** the content div. The content div (tabs, cards) uses `className="p-5 max-w-5xl mx-auto"` — so the title is full-width, the calculator content is constrained.
- **Grids**: Use `ime-grid-2col` and `ime-grid-3col` (with `gap-12` as needed) for responsive 2- and 3-column layouts to keep calculators concise.
- **Results**: Style result lines so they stand out: `className="text-lg font-semibold pt-2 text-blue-800 text-center"` (e.g. "Future Value = **152**").
- **Cards**: Use Card + CardContent only; no CardHeader or CardTitle. Cards go straight to content.

---

## 6. Current / Planned Calculators

- **Time Value of Money** (`time-value-of-money`) – FV, PV, CAGR with tabs.
- **Lumpsum + SIP Value Calculator** (`lumpsum-sip`) – SIP amount, step-up %, lumpsum amount, expected return, years → Snapshot table (Invested, Total Investment Amount, Future Value, Gains) for Lumpsum, SIP, and Total.
- **Arbitrage Return Calculation** (`arbitrage-return`) – Stock price (starting), future price (starting), closing stock price, margin % → table (Buy Stock / Sell Future / Total: Starting Price, Ending Price, Gain/Loss, Capital Deployed); Monthly Return and Annualised Return in blue.
- **Power of Compounding** (`power-of-compounding`) – Amount invested (Rs. lakhs), Debt %, Equity % (sliders). Equity Savings = 33% equity + 67% debt, Agg Hybrid = 66% equity + 34% debt. Grouped bar chart + table: ending value at 5, 10, 15, 20 years for Debt, Equity Savings, Agg Hybrid, Equity.
- **Comparison of Fee Structure** (`fee-structure-comparison`) – Three options: fixed fees, profit share, hurdle rate (%). Catch-up clause (switch, default off): when off, profit share on returns above hurdle; when on, profit share on total returns. Table: fund return 0–30% → (1)(2)(3) fixed fee, profit sharing, total fee.
- **AIF Post-Tax Returns** (`aif-post-tax-returns`) – Gross returns, performance sharing, fixed mgmt fee, hurdle rate (sliders). Structure: LLP (35% tax) / Trust (39% tax). Catch-up Yes: profit share on (gross − fixed fee); No: profit share on (gross − fixed fee − hurdle). Horizontal bar chart (Gross, Pre-Tax Post Fees, Post-Tax, Total Fees) + summary table.
- **54EC vs Equity** (`54ec-vs-equity`) – Investment amount, 54 EC interest rate, investor tax rate (dropdown), equity return, investment period. Post-tax ending 54 EC vs equity; additional returns in equity. Vertical bar chart with value labels on each bar + summary table.
- **Annual Expense** (`annual-expense`) – Current vs retirement expenses in current cost terms (no inflation). Monthly: Home Running Expenses, EMIs, Meals & Entertainment, Other Monthly. Lumpy: Children Education/Others, Medical, Travel, Other Lumpy. Totals: Total Monthly, annualised monthly, Total Lumpy, Total Annual Cost Estimate.
- **Feeder Fund Mechanism** (`feeder-fund`) – Investment in Rs. lakhs, $ rate at investment, fund return in USD (%), currency rate at redemption, US Fund NAV at investment. Investment details (amount in $, units), redemption details (NAV at redemption, redemption in $, Rs. lakhs), returns breakdown (% Returns in INR, from Asset Appreciation, from Currency).
- **Comparing Returns of Different Fund Categories** (`fund-categories-comparison`) – Debt returns (low / average / high), Equity returns (low / average / high), Portfolio allocation in INR Lakhs (Debt MF, Conservative Hybrid, Equity Savings, Aggressive Hybrid, Equity MF). Asset Class vs Returns table: % Equity, Low / Average / High returns per category and for portfolio.
- **Retirement Corpus Required** (`retirement-corpus-required`) – Current age, retirement age, expected lifespan, current annual expense (Rs. lakhs), inflation rate and yield post-retirement (sliders). Output: retirement corpus in Crores; bar chart of starting corpus required at each age; bar chart of FV expenses vs return by age; annual cash flow table (Age, Starting Corpus, FV Expenses, Return, Ending Corpus).
- **Retirement Corpus How Long Will Last** (`retirement-corpus-how-long-will-last`) – For people already retired. Current age, lifespan to plan till, annual expenses (Rs. lakhs), annual income (Rs. lakhs), retirement corpus (Rs. lakhs), rate of return on corpus, inflation on expenses, inflation on income (sliders). Bar chart of retirement corpus by age (can go negative); annual cash flow table (Age, Starting Corpus, Annual Expenses, Annual Income, Investment Returns, Corpus Addition/(Depletion), Ending Corpus).
- **Debt MF vs Bank FD (Redeeming Interest every year)** (`debt-mf-vs-bank-fd`) – New tax structure. Investment amount, interest rate (slider), tax rate (dropdown). Assumes you redeem from Debt MF each year an amount equal to the FD interest. Debt MF tax only on capital gains of redeemed units; Bank FD tax on full interest every year. Two horizontal bar charts: Annual Taxes Paid, Post-Tax Income (Debt MF vs Bank FD by year). Table: Year, Investment, Start # units, Start NAV, End NAV, Redemption, Units redeemed, End # units, End Value, CG per unit, Debt MF Tax, Bank FD Tax, Debt MF Post-tax, Bank FD Post-tax, % higher.
