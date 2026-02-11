import type { ReactNode } from "react";

import CalculatorSeoContent from "./seo-content";
import { getCalculatorSeoRecord } from "./seo";

function jsonLdForCalculator(slug: string) {
  const rec = getCalculatorSeoRecord(slug);
  const url = `https://imecapital.in/financial-calculator/${slug}`;

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: rec.title,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description: rec.summary,
    url,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Financial Calculators",
        item: "https://imecapital.in/financial-calculator",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: rec.title,
        item: url,
      },
    ],
  };

  return { softwareApplication, breadcrumbList };
}

export default function CalculatorSeoLayout({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const { softwareApplication, breadcrumbList } = jsonLdForCalculator(slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
      />

      {children}

      <div className="p-5 max-w-5xl mx-auto">
        <CalculatorSeoContent slug={slug} />
      </div>
    </>
  );
}

