import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("lumpsum-sip-future-value-calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorSeoLayout slug="lumpsum-sip-future-value-calculator">
      {children}
    </CalculatorSeoLayout>
  );
}

