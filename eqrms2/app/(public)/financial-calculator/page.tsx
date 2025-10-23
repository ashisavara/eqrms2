import { FinCalculatorDetail } from "@/types/fin-calculator-detail";
import { supabaseListRead } from "@/lib/supabase/serverQueryHelper";
import Link from "next/link";

export default async function FinCalculatorPage() {
  const finCalculator = await supabaseListRead<FinCalculatorDetail>({
    table: "fin_calculators",
    columns: "*",
    filters: [
      (query) => query.order('calculator_id', { ascending: false })
    ],
  });

  return (
      <div>
        <h1>finCalculator List</h1>
        {finCalculator.map((finCalculator) => (
          <div key={finCalculator.calculator_id}>
            <span>{finCalculator.calculator_id}</span>
            <Link href={`/financial-calculator/${finCalculator.slug}`}><span className="blue-hyperlink my-5">      {finCalculator.title}</span></Link>
          </div>
        ))}
      </div>
  );
}

