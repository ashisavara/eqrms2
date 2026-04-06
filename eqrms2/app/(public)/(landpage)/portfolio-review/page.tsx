import Section from "@/components/uiComponents/section";
import PageTitle from "@/components/uiComponents/page-title";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import AlertBox from "@/components/uiBlocks/AlertBox";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RMSPage() {
    return (
        <div>
            <PageTitle 
                title="Comprehensive Portfolio Review" 
                caption="A detailed audit of your existing investment plan & portfolio holdings" 
            />

        <Section>
        <AlertBox color="red" heading="Is your portfolio really working for you?">
            <ul>
                <li>Is your portfolio aligned to your risk-profile, goals & liqudity requirements?</li>
                <li>Are you in the right structures, asset classes & categories?</li>
                <li>Are there important investment options that you have not considered?</li>
                <li>Are there funds that are pulling down your returns OR not well suited for your needs?</li>
            </ul>

            <p>Even sophoisticated investors, can grapple with some of these questions. That is where a deeper, more personalised portfolio review can add significant value.</p>
        </AlertBox>
            
        </Section>

        <Section className="bg-gray-100 py-12">
            <h2>A More Trustworthy, Personalised Portfolio Review</h2>
            <p>Most portfolio reviews are either too generic, too performance-led, or too influenced by what the reviewer wants you to do next. IME Capital offers a stronger alternative — combining the credibility of the <b>IME RMS </b>(our proprietary research platform), with a <b>highly customised review</b> built around your goals, risk profile, and financial needs.</p>
            <div className="ime-grid-2col">
                <AlertBox color="blue" heading="Driven by The IME RMS">
                <p>Access high-quality, institutional-grade fund research, detailed rating rationales, and a single point of truth that eliminates biased reviews.</p>
                </AlertBox>
                <AlertBox color="green" heading="Personalised to You">
                <p>A meaningful review should assess not just whether a fund is good or bad, but whether it is appropriate for your portfolio, your goals, and your risk appetite.</p>
                </AlertBox>
            </div>
            <p><b>IME's Comprehensive Portfolio review </b>includes a complimentary <b>15-day IME RMS trial</b> and <b> 3 detailed one-on-one consultations </b>with a Senior Private Banker. </p>
            <div className="flex justify-center mt-6">
              <Button>
                <Link href="https://rms.imecapital.in">Sign-up: IME Access + Portfolio Review</Link>
              </Button>
            </div>
        </Section>

        <Section>
       <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-12 py-12">
        <div className="w-full md:w-[400px] md:min-w-[200px] md:flex-shrink-0 text-center my-auto"> 
            <h2 className="bg-white">The IME RMS</h2>
            <p>All portfolio reviews are driven by the IME RMS - which gives investors direct access to IME's ratings & detailed rating rationales across all funds. This single point-of-truth add tremendous credibility & transparency to reviews, making agenda-based or selective reviews impossible. </p>

<p>Our rating methodology is driven by a combination of quantitative & qualitative factors, resulting in much more robust & valuable insights as compared to reviews driven primarily by past performance (which may or may not be repeated in the future).</p>
           
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

        <Section className="py-12 bg-gray-100">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ime-mandate-full.png"
                heading="IME Investment Mandate"
                subHeading="A strategic & customised blueprint for your investments"
            >
                <p>A portfolio review has limited value unless it assesses whether your investments are truly right for you. That means evaluating not just individual funds, but also whether your portfolio construction is sound — whether the risks are appropriate, liquidity needs are being respected, the right categories have been considered, and whether relevant options may have been overlooked.</p>

<p>Through a one-on-one consultation with a Senior Private Banker, we work to understand your goals, risk profile, and broader requirements in depth, and help define your IME Investment Mandate — a written document, that clearly spells out your unique requirements and provides a strategic roadmap that defines how you would like your investment to be managed.</p>
            </ImageTextBox>
            </Section>

            <Section>
                <AlertBox color="green" heading="Gain greater confidence in your portfolio">
                <p>A comprehensive portfolio review can add value even before any action is taken. By going through the process, you gain greater clarity on:</p>
                <ul>
                    <li>how  your portfolio aligns with your goals and requirements</li>
                    <li>whether your portfolio construction is robust</li>
                    <li>the quality and suitability of your existing investments</li>
                    <li>the risks, gaps, and missed opportunities within the portfolio</li>
                    <li>the broader principles that should guide your investments going forward</li>
                </ul>

<p>Even if you choose not to implement our recommendations, the value of having your portfolio examined through a deeper, research-backed, and personalised process can be significant. </p>
                </AlertBox>
            </Section>

        <SectionTextHighlight className="bg-blue-900">
            <p>Sign up for a Complimentary Portfolio Review, along with a complimentary 15-day trial of the IME RMS & 3 detailed one-on-one consultations with a Senior Private Banker. </p>
            <Button><Link href="https://rms.imecapital.in">Sign-up: IME Access + Portfolio Review</Link></Button>
        </SectionTextHighlight>

        

        </div>
    );
}