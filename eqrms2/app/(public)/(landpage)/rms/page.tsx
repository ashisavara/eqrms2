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


        <Section className="bg-blue-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/weak-flow-down-insights.png"
                heading="The problem we help solve"
                imgSide="left"
            >
                <p>In traditional wealth management, investors <b>depend on their relationship managers</b> for investment advice - these are sales-persons with targets, incentives and clear conflicts of interest. </p>
                <p>Additionally, <b>important insights get lost,</b> as views flow down multiple levels from fund managers, to central research teams, to relationship managers and finally to you, the end investor.</p>
                <p> By giving you <b>direct access</b> to the detailed ratings & rationales of IME's central research team, the IME RMS helps ensure a <b>single point-of-truth</b> and ensures that <b>investment advice is driven by research</b>, and not sales.</p>
            </ImageTextBox>
        </Section>
<div>
        <Section>
       <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-12 py-12">
        <div className="w-full md:w-[400px] md:min-w-[200px] md:flex-shrink-0 text-center my-auto"> 
            <h2 className="bg-white">Unmatched Transparency</h2>
            <p>Gain <b>direct access</b> to the <b>detailed rating rationales</b> across an exhaustive universe of MFs, PMSs, AIFs & Global Funds. <br /><br /> The <b>first-time ever</b> an investments firm is making publicly available the thoughts that go behind fund recommendations - ensuring a <b>single-point-of truth</b> and investment advice driven by research, not sales.</p>
            
           
        </div>
        <div className="w-full md:flex-1">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          >
            <source src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME%20RMS%20Rating%20Demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>        
        </div>
        </Section>

        <Section className="bg-gray-100">
       <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-12 py-12">
        <div className="w-full md:flex-1">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          >
            <source src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/Mandate%20Gif.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>  
        <div className="w-full md:w-[400px] md:min-w-[200px] md:flex-shrink-0 text-center my-auto"> 
            <h2 className="bg-gray-100">True Customisation</h2>
            <p>The <b>IME Investment Mandate </b> helps you move <b>from the confusion</b> of too many investment option <b>to clarity </b>on the specific categories  that are tailor-made to your unique needs. <br/><br/> Your Mandate is developed in consultation with an <b>IME Private Banker</b>, on the basis of a <b>detailed evaluation</b> of your risk-profile, financial plan, preferences, beliefs, and other needs.</p>
        </div>      
        </div>
        </Section>
      <SectionTextHighlight color="blue">
        <p>We offer a no-commitment free 15-Day Trial of the IME RMS, which includes access to a Dedicated Private Banker who can help build your customised Financial Plan & Investment Mandate, and review your existing portfolio. </p>
        <p>Sign-up today to experience the difference of direct access to central research insights makes to your wealth creation journey! </p>
      </SectionTextHighlight>
    </div>
    </div>
    );
}