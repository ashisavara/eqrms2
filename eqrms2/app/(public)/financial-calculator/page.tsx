import { CALCULATORS_LIST } from "./calculators-config";
import FinCalculatorClient from "./FinCalculatorClient";
import { buildFinancialCalculatorsIndexMetadata } from "./seo";

export const metadata = buildFinancialCalculatorsIndexMetadata();

export default function FinCalculatorPage() {
  return <FinCalculatorClient finCalculator={CALCULATORS_LIST} />;
}

