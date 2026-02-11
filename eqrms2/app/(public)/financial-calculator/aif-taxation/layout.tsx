import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("aif-taxation");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalculatorSeoLayout slug="aif-taxation">{children}</CalculatorSeoLayout>;
}

