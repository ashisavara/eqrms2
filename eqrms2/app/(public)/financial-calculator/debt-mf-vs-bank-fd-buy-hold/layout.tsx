import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("debt-mf-vs-bank-fd-buy-hold");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorSeoLayout slug="debt-mf-vs-bank-fd-buy-hold">
      {children}
    </CalculatorSeoLayout>
  );
}

