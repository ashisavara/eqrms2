import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("54ec-bonds-vs-equity");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalculatorSeoLayout slug="54ec-bonds-vs-equity">{children}</CalculatorSeoLayout>;
}

