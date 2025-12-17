import Section from "@/components/uiComponents/section";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import PageTitle from "@/components/uiComponents/page-title";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import RmaCta from "@/components/uiComponents/rma-cta";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AlertBox from "@/components/uiBlocks/AlertBox";

export default function RMSPage() {
    return (
        <div>
            <PageTitle 
                title="IME RMS (Research Management Solution)" 
                caption="Gain direct access to investment ratings & rationales of IME’s Central Research Team across MFs, PMSs, AIFs & Global investments." 
            />
            
      <Section className="py-12">
            <RmaCta />
            </Section>

            <SectionTextHighlight>
        <p>The IME RMS is the first tool ever, to give investors direct access to the insights of the central research team. Investors gain direct access to our ratings, rating rationales & analysis across thousands of funds (MFs, PMSs, AIFs, Global funds), asset classes, categories & more.</p>
        <p>The RMS helps address one of the biggest fundamental flaws of the wealth management industry, the weak flow down of investment insights. This often leads to investors taking investment decisions with incomplete, biased or flawed insights.</p>
      </SectionTextHighlight>

      <Section className="py-12">
        <div className="ime-grid-2col">

        <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/weak-flow-down-insights.png" alt="Weak Flow Down of Insights" className="w-full h-full" />

        <div>
          <AlertBox color="red" heading="The Problem - Weak Flow Down of Insights">
            <ul>
            <li>In traditional wealth management, insights flow down multiple levels from fund managers, to central research teams, to relationship managers and finally to end investors. </li>
            <li>At each step of the process important insights get lost, due to a combination of chinese whispers, conflicts, biases and other such issues.</li>
            </ul>
          </AlertBox>
          <AlertBox color="green" heading="The Solution - Direct Access to Insights">
            <ul>
            <li>Gain direct access to the qualitative & quantitative insights that go into IME's central research team's ratings of investment funds. </li>
            <li>A single-source of truth for all stakeholders - an unparrarelled level of transparency  </li>
            <li>Have access to all critical insights before making an investment decision.</li>
            </ul>

          </AlertBox>
        </div>
        </div>
      </Section>

      <Section className="py-12 bg-green-50">
        <ImageTextBox
          imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME-Investment-Mandate.png"
          heading="Fully Customisable"
          subHeading="See only what is relevant to you"
          imgSide="right"
        >
          <p>The IME Investment Mandate helps narrow down the set of investment structures, asset classes & fund categories, to the specific options that meet your unique requirements. The Investment Mandate is developed after a detailed evaluation of your unique needs – based on your risk-profile, financial plan, preferences & beliefs, and other needs. </p>
        </ImageTextBox>
      </Section>

      <SectionTextHighlight color="blue">
        <p>We offer a no-commitment free 30-Day Trial of the IME RMS, which includes access to a Dedicated Private Banker who can help build your customised Financial Plan & Investment Mandate, and review your existing portfolio. </p>
        <p>Sign-up today to experience the difference of direct access to central research insights makes (as compared to depending solely on Relationship Managers/Sales People for your investment advice). </p>
        <Button variant="outline"><Link href="https://rms.imecapital.in">Free Trial</Link></Button>
      </SectionTextHighlight>

        
        </div>
    );
}