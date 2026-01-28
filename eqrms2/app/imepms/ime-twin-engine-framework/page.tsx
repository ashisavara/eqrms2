import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";
import { FlexRms2Col } from "@/components/grids/flex-rms-2col";
import TextHighlight from "@/components/uiBlocks/TextHighlight";


export default function ImeConcentratedMicrotrendsPage() {
    return (
        <div>
            <RmsPageTitle 
                title="IME Twin-Engine Investment Framework" 
                caption="Stock selection driven by the 2 core drivers of long-term value creation: Earnings Growth & Change in Valuation Multiples" 
            />


        <Section>
            <h2>Understanding the Twin-Engine Investment Framework</h2>
            <div className="flex justify-center">
            <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ime-twin-engine/ime-twin-engine-equation.png" alt="IME Twin-Engine Equation"/>
            </div>

            <p>We identify two primary drivers of value creation –</p>
            <ul>
                <li><b>Earnings Growth:</b> The core driver of companies becoming larger &  increasing value over a period of time</li>
                <li><b>Valuation Multiple Changes:</b> Changes are driven by changes in growth outlook, fundamentals, sentiment & perception</li>
            </ul>
            <p>We call this the “Twin Engine Framework”.</p>
            <p className="mb-12">Our research focus is on a detailed assessment of how earnings and multiples are likely to change over time.</p>
            <TextHighlight>
            <p>This provides a clear perspective on likely stock prices in the future &  clarity on what drives changes in stock prices (business growth, multiple changes, or both).</p>
            <p>The twin-engine framework helps build a strong quantitative rigour & discipline to stock selection.</p>
            </TextHighlight>
        </Section>

        <Section className="bg-blue-50 !py-12">
            <h2 className="bg-blue-50">Engine 1 - Earnings Growth</h2>
            <FlexRms2Col label="Growth Tailwinds">Our focus is on investing in business with <b>strong growth tailwinds</b> - macro, industry or company-level. <b>Value-migration trends</b> that can boost growth further are keenly watched. Avoid companies that are swimming against the tide. 
            </FlexRms2Col>
            <FlexRms2Col label="Strategy & Execution">Assess management's ability to build scalable operational frameworks that capitalize on identified tailwinds - look for teams that don't just have a vision but a proven track of <b>disciplined execution</b>.
            </FlexRms2Col>
            <FlexRms2Col label="Competitive Dynamics">Seek industries with <b>rational competitive intensity</b> and companies that consistently gain market share through superior product offerings or cost leadership.
            </FlexRms2Col>
            <FlexRms2Col label="Profitable Growth">While growth is of utmost importance - not all growth is the same. We look for "good growth" - <b>strong return on equity and reinvestment rates</b>. Sales engine the primary focus. Beyond top-line expansion, we prioritize margin sustainability or expansion.
            </FlexRms2Col>
            <FlexRms2Col label="Predictability">We prioritize businesses with <b>high predictability</b>, where the drivers of growth—such as recurring revenue, pricing power, or market expansion—are clearly defined and sustainable. We avoid companies or industries that are prone for disruption.
            </FlexRms2Col>
        </Section>

        <Section className="bg-green-50 !py-12">
            <h2 className="bg-green-50">Engine 2 - Valuation Multiples</h2>
            <FlexRms2Col label="Growth Rate">High-quality, long-term growth acts as a catalyst for valuation. We look for a sustainable and <b>predictable growth runway</b> that gives the market the confidence to assign a higher multiple today for the cash flows of tomorrow.
            </FlexRms2Col>
            <FlexRms2Col label="Sentiment">Market sentiment towards sectors/industries/businesses, can change over time (driven by both fundamental & technical factors) - which can lead to large changes in valuation multiples. We focus on identifying companies & sectors, where we see the <b>potential for market sentiment to improve over time</b>.
            </FlexRms2Col>
            <FlexRms2Col label="Moats">A strong competitive advantage, or 'moat,' protects high returns on capital from being eroded by competition. The <b>durability of the moat determines the longevity of the growth</b>, justifying a premium valuation multiple over the long term.
            </FlexRms2Col>
            <FlexRms2Col label="Capital Allocation">We assess management's <b>track record of recycling internal accruals</b> to maximize shareholder value. We prioritize leaders who intelligently balance organic reinvestment, strategic acquisitions, and timely share buybacks to enhance per-share value.
            </FlexRms2Col>
            <FlexRms2Col label="Quality">We seek businesses where the quality of earnings is high and led by strong management execution & high governance standard, leading to <b>lower perceived risk</b> and a structural upward re-rating of the earnings multiple.
            </FlexRms2Col>
        </Section>

        <Section>
            <h2>The twin-engine framework simplifes analysis of highly dynamic factors driving stock prices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
                <div className="border-box">
                    <h3 className="text-base font-bold text-gray-600">Industry Trends</h3>
                    <p className="mt-0 mb-0">Industry outlook</p>
                    <p className="mt-0 mb-0">Competitive dynamics</p>
                    <p className="mt-0 mb-0">Pricing trends</p>
                </div>
                <div className="border-box p-4">
                    <h3 className="text-base font-bold text-gray-600">Financials</h3>
                    <p className="mt-0 mb-0">Growth drivers</p>
                    <p className="mt-0 mb-0">Margin outlook</p>
                    <p className="mt-0 mb-0">Capital efficiency</p>
                </div>
                <div className="border-box p-4">
                    <h3 className="text-base font-bold text-gray-600">Risks</h3>
                    <p className="mt-0 mb-0">Regulatory</p>
                    <p className="mt-0 mb-0">Disruption</p>
                    <p className="mt-0 mb-0">Competition</p>
                </div>
                <div className="border-box p-4">
                    <h3 className="text-base font-bold text-gray-600">Quality</h3>
                    <p className="mt-0 mb-0">Accounting</p>
                    <p className="mt-0 mb-0">Balance sheet strength</p>
                    <p className="mt-0 mb-0">Barriers to entry</p>
                </div>
                <div className="border-box p-4">
                    <h3 className="text-base font-bold text-gray-600">Management</h3>
                    <p className="mt-0 mb-0">Mgmt vision & execution</p>
                    <p className="mt-0 mb-0">Corporate governance</p>
                    <p className="mt-0 mb-0">Professionalisation</p>
                </div>
                <div className="border-box p-4">
                    <h3 className="text-base font-bold text-gray-600">Catalysts/Triggers</h3>
                    <p className="mt-0 mb-0">Management change</p>
                    <p className="mt-0 mb-0">Cyclical uptick</p>
                    <p className="mt-0 mb-0">Restructuring</p>
                </div>
            </div>
            <TextHighlight>
            <p>The twin-engine framework simplifies complex changes in diverse business fundamentals, 
into two quantifiable factors i.e. expected changes in growth & multiples. </p>

<p>This provides clear visibility into expected drivers of future stock price movements. </p>
            </TextHighlight>

            <h2 className="mt-12">Understanding the segments we focus on</h2>
            <div className="flex justify-center"><img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ime-twin-engine/ime-twin-engine-matrix.png" alt="IME Twin-Engine Matric"/></div>


            <p>Our ideal companies are companies with high growth, that have the potential to re-rate. These can be hard to find, and are typically found by idenitifying sectors & companies where there is an underlying change in growth momentum or the quality of the business. Both the earnings growth & valuation multiple engines work in tandem to deliver strong outperformance in this quadrant.  </p>

<p>We also invest in companies which we believe have high growth and are available at reasonable valuations. Here, stock price growth is driven by earnings growth, and not an increase in valuation multiples.  </p>

        </Section>

        
        </div>
    )
}