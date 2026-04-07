export type MethodologyProductType =
  | "mf"
  | "pms"
  | "aif"
  | "global"
  | "default";

const METHODOLOGY_PRODUCT_TYPES: MethodologyProductType[] = [
  "mf",
  "pms",
  "aif",
  "global",
  "default",
];

export const methodologyContent = {
  mf: {
    heading: "How IME evaluates funds in this category",
    body: `At IME Capital, our fund selection process goes beyond looking at recent returns alone. We evaluate the quality and category strengths of the AMC, the relevance of the strategy, and the overall suitability of the fund within its category and an investor’s portfolio. Our aim is to identify funds backed by strong institutions, clear investment processes, and category-specific strengths, rather than simply chasing past performance. Readers can explore our <a href="/blogs/mf-amc-reviews-ratings">mutual fund review methodology</a> for more detail.`,
  },

  pms: {
    heading: "How IME evaluates PMS strategies",
    body: `Our PMS selection process is designed to be significantly more rigorous than a simple comparison of recent returns. We assess both the quality of the PMS house and the strength of the individual strategy, including factors such as AMC pedigree, investment philosophy, team quality, strategy differentiation, strategy adherence, and track record across market cycles. This matters because PMS strategies can vary widely in quality, style consistency, and risk profile, even within the same category. Readers can explore our <a href="/blogs/ime-pms-amc-selection-criteria">PMS AMC methodology</a> and <a href="/blogs/ime-pms-scheme-rating-selection-criteria">PMS scheme methodology</a> for more detail.`,
  },

  aif: {
    heading: "How IME reviews alternative strategies",
    body: `Our approach to evaluating AIFs goes well beyond headline returns. We look at whether the fund structure is sensible, whether the investment mandate is genuinely attractive, how disciplined the manager is in executing that mandate, and whether the strategy offers a meaningful role in an investor’s portfolio. In alternative funds, factors such as liquidity, lock-ins, downside risk, and portfolio fit can be just as important as return potential, which is why we prefer a more research-driven and selective approach.`,
  },

  global: {
    heading: "How IME evaluates global funds",
    body: `When evaluating global funds, we look beyond recent market performance and focus on the quality of the exposure being offered. This includes the attractiveness of the geography, theme, or strategy, the structure of the fund, concentration risks, the quality of the underlying manager, and the role the allocation can play in an Indian investor’s portfolio. Global investing can add valuable diversification, but it also introduces factors such as currency risk, market-specific cycles, and differences in valuation, which is why fund selection matters.`,
  },

  default: {
    heading: "How IME evaluates funds",
    body: `At IME Capital, our recommendations are driven by a research-led framework rather than recent performance alone. We look at the quality of the fund house or manager, the strength and relevance of the strategy, the consistency with which that strategy is followed, and the role the fund can play within an investor’s portfolio. The aim is to identify high-quality funds with stronger long-term merit, rather than simply highlighting what has done well most recently.`,
  },
} satisfies Record<MethodologyProductType, { heading: string; body: string }>;

export type IMEMethodologyBlockProps = {
  productType?: MethodologyProductType | string;
  showHeading?: boolean;
  className?: string;
};

function resolveProductType(productType: string | undefined): MethodologyProductType {
  if (productType && METHODOLOGY_PRODUCT_TYPES.includes(productType as MethodologyProductType)) {
    return productType as MethodologyProductType;
  }
  return "default";
}

export default function IMEMethodologyBlock({
  productType = "default",
  showHeading = true,
  className = "",
}: IMEMethodologyBlockProps) {
  const key = resolveProductType(productType);
  const { heading, body } = methodologyContent[key];

  return (
    <div
      className={[
        "my-8 ",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showHeading && (
        <h2>
          {heading}
        </h2>
      )}
      <div
        className={[
          "text-sm text-stone-700 md:text-[0.9375rem]",
          "[&_a]:font-medium [&_a]:text-amber-800 [&_a]:underline [&_a]:decoration-blue-600/50 [&_a]:underline-offset-2",
          "hover:[&_a]:text-blue-900 hover:[&_a]:decoration-blue-700",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}
