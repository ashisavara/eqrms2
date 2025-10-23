import { FinCalculatorDetail } from "@/types/fin-calculator-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import FinCalculatorClient from "./FinCalculatorClient";

export default async function FinCalculatorPage() {
  const finCalculator = await supabaseListRead<FinCalculatorDetail>({
    table: "fin_calculators",
    columns: "*",
    filters: [
      (query) => query.order('calculator_id', { ascending: false })
    ],
  });

  return <FinCalculatorClient finCalculator={finCalculator} />;
}

