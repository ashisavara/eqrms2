import { Card } from "@/components/ui/card";
import AlertBox from "@/components/uiBlocks/AlertBox";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import YouTube from "@/components/uiComponents/youtube";

export default function ImeBespokeStrategiesPage() {
    return (
        <div>
            <RmsPageTitle 
                title="IME Bespoke Strategies" 
                caption="Tailor-made portfolios built around your goals — backed by institutional research and boutique attention." 
            />


        <Section className="text-center">
            <h2>What are IME Bespoke Strategies?</h2>
            <p>IME Bespoke Strategies are fully customised investment solutions designed to match each client’s unique objectives, constraints and values. Combining IME’s institutional research rigour with the personalised service of a boutique firm, these strategies give clients direct access to our research-driven investment thinking, implemented at a portfolio level that reflects their circumstances and preferences.</p>
        </Section>

        <Section className="bg-gray-100">
            <div className="ime-grid-2col gap-12">
                <div className="text-center border-box">
                    <h2 className="bg-gray-100">IME Equity Bespoke</h2>
                    <p>A concentrated, high-conviction equity portfolio constructed and managed to the client’s specifications while strictly aligned to IME’s investment philosophy. Ideal for investors seeking direct stock ownership, active oversight, and bespoke risk controls.</p>
                    <p>Minimum investment: ₹10 crore.</p><p>Note: alignment with IME’s investment philosophy is a precondition for acceptance.</p>
                </div>
                <div className="text-center border-box">
                    <h2 className="bg-gray-100">IME Bespoke Wealth</h2>
                    <p>A curated portfolio of mutual funds, REITs/Invits and ETFs selected to meet client objectives — where diversification, fund selection and allocation are tailored to your mandate.</p>
                    <p>Minimum investment: ₹5 crore.</p>
                </div>
            </div>
        </Section>

        <Section>
            <AlertBox color="blue" heading="Our approach — simple, disciplined, collaborative">
                <p><b>1) Discovery & objectives:</b> We start with a deep discovery to document goals, liquidity needs, tax considerations and non-financial preferences.</p>
                <p><b>2) Investment Mandate:</b> We co-create a formal mandate that becomes the blueprint for portfolio design and ongoing governance.</p>
                <p><b>3) Portfolio construction:</b> Using proprietary research and concentrated conviction ideas (equities) or rigorous fund selection (wealth), we design a portfolio tailored to the mandate.</p>
                <p><b>4) Implementation & ongoing management:</b> Portfolios are monitored and rebalanced according to the mandate and changing market context. For Equity Bespoke, strict adherence to our investment philosophy guides all stock decisions.</p>
                <p><b>5) Review & reporting:</b> Regular reviews, performance attribution and clear research rationales keep clients informed and aligned.</p>
            </AlertBox>
        </Section>
    

        </div>
    )
}