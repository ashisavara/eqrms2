import CalculatorSeoLayout from "../CalculatorSeoLayout";
import { buildCalculatorMetadata } from "../seo";

export const metadata = buildCalculatorMetadata("retirement-corpus");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <CalculatorSeoLayout slug="retirement-corpus">{children}</CalculatorSeoLayout>;
}

