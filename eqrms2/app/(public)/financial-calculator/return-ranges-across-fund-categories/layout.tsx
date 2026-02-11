import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("return-ranges-across-fund-categories");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorSeoLayout slug="return-ranges-across-fund-categories">
      {children}
    </CalculatorSeoLayout>
  );
}

