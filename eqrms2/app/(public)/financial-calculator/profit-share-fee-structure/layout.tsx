import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("profit-share-fee-structure");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorSeoLayout slug="profit-share-fee-structure">
      {children}
    </CalculatorSeoLayout>
  );
}

