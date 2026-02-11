import type { Metadata } from "next";

import { CALCULATORS_LIST } from "./calculators-config";

export type CalculatorSeoRecord = {
  slug: string;
  title: string;
  summary: string;
  category?: string;
};

export function getCalculatorSeoRecord(slug: string): CalculatorSeoRecord {
  const rec = CALCULATORS_LIST.find((c) => c.slug === slug);
  if (!rec) {
    return { slug, title: "Financial Calculator", summary: "", category: undefined };
  }
  return rec;
}

export function buildCalculatorMetadata(slug: string): Metadata {
  const rec = getCalculatorSeoRecord(slug);
  const title = `${rec.title} | Financial Calculator`;
  const description = rec.summary;
  const canonicalPath = `/financial-calculator/${rec.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export function buildFinancialCalculatorsIndexMetadata(): Metadata {
  const title = "Financial Calculators | IME";
  const description =
    "Explore practical financial calculators covering concepts, retirement planning, debt, taxation, and funds.";

  return {
    title,
    description,
    alternates: { canonical: "/financial-calculator" },
    openGraph: {
      title,
      description,
      url: "/financial-calculator",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

