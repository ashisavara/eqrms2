import { CALCULATORS_LIST } from "./calculators-config";
import FinCalculatorClient from "./FinCalculatorClient";

export default function FinCalculatorPage() {
  return <FinCalculatorClient finCalculator={CALCULATORS_LIST} />;
}

