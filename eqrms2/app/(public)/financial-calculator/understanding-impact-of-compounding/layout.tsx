import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("understanding-impact-of-compounding");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorSeoLayout slug="understanding-impact-of-compounding">
      {children}
    </CalculatorSeoLayout>
  );
}

