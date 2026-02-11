import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("annual-expense-calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorSeoLayout slug="annual-expense-calculator">
      {children}
    </CalculatorSeoLayout>
  );
}

