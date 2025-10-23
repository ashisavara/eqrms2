import { supabaseSingleRead } from "@/lib/supabase/serverQueryHelper";
import { FinCalculatorDetail } from "@/types/fin-calculator-detail";

export default async function FinCalculatPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const finCalculator = await supabaseSingleRead<FinCalculatorDetail>({
        table: "fin_calculators",
        columns: "*",
        filters: [
            (query) => query.eq("slug", slug)
        ]
    })

    if (!finCalculator) {
        return <div>Media Interviews not found</div>;
    }

    return (
        <div className="p-5 max-w-5xl mx-auto">
            <h2>{finCalculator.title}</h2>
            <p className="mb-6">{finCalculator.summary }</p>
            <div dangerouslySetInnerHTML={{ __html: finCalculator.calculator }} /> | 
        </div>  
    );
    
    }