import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("time-value-of-money-calculations");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorSeoLayout slug="time-value-of-money-calculations">
      {children}
    </CalculatorSeoLayout>
  );
}

