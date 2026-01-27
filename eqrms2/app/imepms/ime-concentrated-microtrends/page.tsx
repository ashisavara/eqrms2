import { Card } from "@/components/ui/card";
import AlertBox from "@/components/uiBlocks/AlertBox";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import YouTube from "@/components/uiComponents/youtube";

export default function ImeConcentratedMicrotrendsPage() {
    return (
        <div>
            <RmsPageTitle 
                title="IME Concentrated Microtrends" 
                caption="Flexi-cap fund (large & midcap bias) that invests in value-creating microtrends." 
            />


        <Section className="text-center">
            <h2>About IME Concentrated Microtrends</h2>

            <p>Concentrated exposures to specific microtrends with the highest value-creation potential</p>
            <p>Portfolio constructed across 4-8 microtrends, with 20-30 holdings</p>
            <p>Twin-engine investment philosophy helps identify both microtrends & companies</p>
            <p>Concentrated microtrend exposure helps deliver outperformance with higher-quality & larger companies</p>
            <p>Fund managed by Ashi Anand - over 2 decades of fund management experience, with sustained outperformance</p>
        </Section>
        <Section className="bg-gray-100 !py-12 text-center">
            <h2 className="bg-gray-100">Understanding Microtrends</h2>
            <p>Microtrends are pockets of the economy with greater value-creation potential</p>
            <p>Microtrends are different from sectoral or thematic funds with their much granular focus on sub-trends within specific themes</p>
            <p>Value creation by microtrends is dynamic and often differs based on unique economic and market conditions</p>
        </Section>
        <div className="max-w-5xl mx-auto">
        <AlertBox color="blue" heading="
How do Microtrends differ from Macro-trends, Sectoral or Thematic Funds?">
        <p>To understand micro-trends better, we can take an example of Financial Services in India. Structural Reforms and the Strong Demographic dividends of India are macro-trends that are aiding growth for financial services. The BFSI Sector in India, can be broken up into the Banking, NBFC, Capital Market & Insurance Industries. Microtrends within financial services include Asset Quality Normalisation for Corporate Banks, Value Migration towards Financial Franchises, or the Financialisation of Savings.</p>
        <p>Micro-trends are not sectoral or thematic in nature - they are specific sub-parts of a sector, theme or the economy where we see the greatest potential for value-creation within the larger investment universe.</p>
        </AlertBox>
        </div>

        <Section>
            <h2>Microtrend case-studies</h2>
            <p>Every market cycle has certain underlying trends that drive the greatest value creation, which we call microtrends.</p>
            <div className="ime-grid-2col">
                <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/capital-goods-microtrend.png" alt="Capital Goods Microtrend"/>
                <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/fmcg_microtrend.png" alt=" FMCG Microtrend"/>
                <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/healthcare-microtrend.png" alt="Healthcare Microtrend"/>
                <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/pvt_bank_microtrend.png" alt="Private Bank Microtrend"/>
            </div>
        </Section>

        <Section>
            <h2>Examples of microtrends we are currently investing in</h2>
            <div className="ime-grid-2col gap-12 text-center">
                <div>
                    <h3>Asset Quality Normalisation</h3>
                    <p>We expect the discount of leading corporate & secured retail financiers to narrow versus retail bank leaders, as corporate asset quality normalises leading to an improvement in growth & profitability ratios.</p>     
                </div>
                <div>
                    <h3>Financilisation of Savings</h3>
                    <p>Strong secular trend with significant amount of household saving/net worth in physical assets (Real estate and gold) moving away from these towards equities + insurance along with demographic tailwinds provide a big opportunity</p>     
                </div>
                <div>
                    <h3>Digital Disruption</h3>
                    <p>Digital platforms are amongst the highest growing companies, with their current high losses being due to hyper-growth investments. As these companies turn profitable in coming years, substantial value creation is expected to play out.</p>     
                </div>
                <div>
                    <h3>Consumer Aspirational</h3>
                    <p>Rising consumption demand is a clear multi-year theme on the back of strong demographic trends, rising incomes & aspirations and changing consumer preferences.</p>     
                </div>
                <div>
                    <h3>Capex Revival</h3>
                    <p>Starting with China +1 and India’s timely response with tax cuts and PLI incentives - a confluence of factors are driving the rise of manufacturing and green energy transition in India. This is expected to lead to a capex recovery.</p>     
                </div>
                <div>
                    <h3>Lending Franchises</h3>
                    <p>Expect leading lending franchises to continue to compound investor returns, driven by the large growth runway driven by value migration from PSU banks to private lenders.</p>     
                </div>
            </div>
        </Section>

        
            <Section className="bg-gray-100 !py-12">
                <h2 className="bg-gray-100">Learn More</h2>
                <YouTube url="https://www.youtube.com/watch?v=OWayQ5S5xp4" />
            </Section>

        </div>
    )
}