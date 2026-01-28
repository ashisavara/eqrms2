import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";

export default function ImeBespokeStrategiesPage() {
    return (
        <div>
            <RmsPageTitle 
                title="IME Investment Processes" 
                caption="How our research team identifies investment opportunities" 
            />


        <Section className="text-center">
            <h2>From Universe to Stock Selection</h2>
            <p>A clearly defined process, to filter down from the larger investable universe to companies that enter detailed coverage, a focus list and finally portfoli inclusion. </p>
            <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ime-twin-engine/ime-inv-universe.png" alt="From Universe to Stock Selection"/>
            

            <h2 className="mt-12">IME RMS - Valuation Screen</h2>
            <p><b>Valuation Screen:</b> Iterative, sortable universe that allows quick & easy analysis across IME’s Investment Universe - with (a) qualitative tagging on quality, growth & momentum factors (b) clearly identified target prices based on the twin-engine framework </p>
            <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ime-twin-engine/ime-val-screen.png" alt="IME RMS Valuation Screen"/>
            

            <h2 className="mt-12">IME RMS - Detailed Company Notes</h2>
            <p>Detailed fundamental analysis notes maintained for all companies in the investment universe, with clarity on the core pros, cons, business outlook and investment views. This level of process rigour ensures nothing slips between the cracks, and helps early identification of trends. 
 </p>
            <div className="flex justify-center"><img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ime-twin-engine/ime-detail-comp-note.png" alt="IME RMS Company Views"/></div>
            
    
        </Section>

       

        </div>
    )
}