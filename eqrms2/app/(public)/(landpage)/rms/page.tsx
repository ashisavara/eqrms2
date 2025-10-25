import Section from "@/components/uiComponents/section";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import YouTube from "@/components/uiComponents/youtube";
import PageTitle from "@/components/uiComponents/page-title";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RMSPage() {
    return (
        <div>
            <PageTitle 
                title="IME RMS (Research Management Solution)" 
                caption="Gain direct access to investment ratings & rationales of IME’s Central Research Team across MFs, PMSs, AIFs & Global investments." 
            />
            

            <Section className="py-12">
                <div className="ime-grid-2col">
                    <div>
                        <h3 className="text-center">Sign-up Box</h3>
                        <Button><Link href="https://rms.imecapital.in">Free Trial</Link></Button>
                    </div>
                    <div><h3 className="text-center">IME RMS Demo</h3><YouTube url="https://www.youtube.com/watch?v=QNrr0nsUX3M" /></div>
                </div>
            </Section>

        <SectionTextHighlight>
            <p>The IME RMS is the first tool ever, to give investors direct access to the insights of the central research team. Investors gain direct access to our ratings, rating rationales & analysis across thousands of funds (MFs, PMSs, AIFs, Global funds), asset classes, categories & more.</p>
            <p>The RMS helps address one of the biggest fundamental flaws of the wealth management industry, the weak flow down of investment insights. This often leads to investors taking investment decisions with incomplete, biased or flawed insights.</p>
        </SectionTextHighlight>

        <Section className="py-12 bg-gray-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/weak-flow-down-insights.png"
                heading="The problem we solve"
                subHeading="The weak flow down of insights"
            >
                <p>In traditional wealth management, insights flow down multiple levels from fund managers, to central research teams, to relationship managers and finally to end investors. At each step of the process important insights get lost, due to a combination of chinese whispers, conflicts, biases and other such issues.</p>
                <p>By providing a single-centralised view on investment funds, the IME RMS ensures that investors have access to all critical insights before making an investment decision.</p>
            </ImageTextBox>
        </Section>

        <Section className="py-12 bg-green-50">
            <ImageTextBox
                imgSide="right"
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/weak-flow-down-insights.png"
                heading="The IME RMS Solution"
                subHeading="Direct access to insights"
            >
                <p>With the IME RMS, you get transparent access to the qualitative & quantitative insights that go into our ratings of investment funds. Every stakeholder at IME sees the same identical view on investment options, a level of transparency that is unmatched in the investments industry. </p>
            </ImageTextBox>
        </Section>

        <Section className="py-12 bg-gray-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME-Investment-Mandate.png"
                heading="Fully Customisable"
                subHeading="See only what is relevant to you"
            >
                <p>The IME Investment Mandate helps narrow down the set of investment structures, asset classes & fund categories, to the specific options that meet your unique requirements. The Investment Mandate is developed after a detailed evaluation of your unique needs – based on your risk-profile, financial plan, preferences & beliefs, and other needs. </p>
            </ImageTextBox>
        </Section>

        <SectionTextHighlight color="blue">
            <p>We offer a no-commitment free 30-Day Trial of the IME RMS, which includes access to a Dedicated Private Banker who can help build your customised Financial Plan & Investment Mandate, and review your existing portfolio. </p>
            <p>Sign-up today to experience the difference of direct access to central research insights makes (as compared to depending solely on Relationship Managers/Sales People for your investment advice). </p>
        </SectionTextHighlight>

        
        </div>
    );
}