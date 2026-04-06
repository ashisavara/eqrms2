import Section from "@/components/uiComponents/section";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import YouTube from "@/components/uiComponents/youtube";
import PageTitle from "@/components/uiComponents/page-title";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AlertBox from "@/components/uiBlocks/AlertBox";
import TextHighlight from "@/components/uiBlocks/TextHighlight";
import RmaCta from "@/components/uiComponents/rma-cta";

export default function PmsAifPage() {
    return (
        <div>
            <PageTitle 
                title="PMS and AIFs @IME" 
                caption="What makes the IME RMS the best platform to evaluate PMS & AIF Funds  " 
            />
            <Section>
                <TextHighlight>
                <p>Most investors evaluating a PMS or AIF are shown performance numbers, factsheets, and product pitches. But for more complex products like PMS and AIFs, this is rarely enough.</p>

<p>IME Capital offers a more rigorous alternative — combining **proprietary research-driven fund insights, detailed rating rationales, and one-on-one consultations with a Senior Private Banker** to help you assess whether a particular PMS or AIF deserves a place in your portfolio.</p>
                </TextHighlight>
                <div className="flex justify-center gap-4">
                    <Button><Link href="https://rms.imecapital.in">IME RMS (Free 15-day trial)</Link></Button>
                    <Button><Link href="https://wa.me/918088770050">Ask a query (WhatsApp)</Link></Button>
                </div>
            </Section>
            
            <Section className="bg-red-100">
            <h2 className="bg-red-100">Data alone is not enough for PMS & AIF Evaluation - Here's why</h2>
            <p>Many PMS and AIF platforms give investors access to data — factsheets, return tables, portfolio disclosures, and broad strategy labels. While this can be useful, it only tells part of the story.</p>   

<p>For complex products like PMS and AIFs, what matters far more is <b>insight; not just data</b>. A serious evaluation needs to go deeper into the quality of the <b>AMC</b>, the investment team, the process, the portfolio construction, the true risk profile of the strategy, and how it compares with the alternatives available to you.</p>

<p>That is where many investors face a challenge: there is no shortage of information in the market - in fact there may be too much! What is required however is clarity on what truly makes one PMS or AIF stand out — and whether a recommendation is genuinely suited to your needs.</p>
            </Section>


            <Section>
                <h2 className="bg-green-50 mb-6">What makes the IME RMS unique?</h2>
            <div className="w-full md:w-2/3 mx-auto md:flex-1">
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
                <h2 className="mt-12">Built on Deep Alternatives Expertise</h2>
                <p>At IME Capital, our understanding of PMSs and AIFs is rooted in the deep alternatives experience of our Ashi Anand (CEO & founder, IME Capital), whose work in India’s alternatives industry goes back to its formative years, including direct involvement in the launch of alternative fund structures (including India's first Arbitrage & Capital Guaranteed funds).</p>

<p>This gives IME Capital a much deeper insider perspective on how PMS and AIF strategies are actually designed, managed, and evaluated — helping us identify the real strengths, risks, and qualitative differences that matter while assessing these products.</p>
           
<h2 className="mt-12">The most comprehensive evaluation of PMSs/AIFs in India</h2>
<p>IME's ratings are driven by a comprehensive assessment of both quantitative & qualitative factors - with a larger emphasis on key qualitative factors such as the pedigree of the AMC & the Investment team, the value of the investment philosophy, the longevity of the fund & team, actual portfolio construction & more. </p>
<p>With over 250 PMS/AIF schemes rated & analysed, IME provides the largest & most detailed analysis of PMS & AIF funds in India. And via the IME RMS, you get direct access to these insights - a level of transparency which is unparrarelled in India.</p>

            <h2 className="mt-12">The Transparency of a Platform. The Guidance of a Private Banker.</h2>

<p>Most PMS and AIF platforms give you data but leave the decision-making entirely to you. Many traditional wealth managers offer advice, but with far less transparency into how those views are formed.</p>

<p>IME Capital brings together the transparency of a platform with the guidance of a private banker. Through the <b>IME RMS</b>, you get transparent access to research-backed fund views, ratings, and detailed rationale. Through a <b>one-on-one consultation with a Senior Private Banker</b>, you get the personalised guidance needed to evaluate which PMS or AIF recommendations are truly right for your portfolio.</p>

</Section>

<Section className="bg-green-50">

<h2 className="bg-green-50">Take a More Informed View on Your PMS & AIF Recommendations</h2>

<p>A rigorous evaluation process can help you move beyond performance data, product pitches, and incomplete comparisons. It can help you understand the true quality of a strategy, how it compares with alternatives, and whether it is genuinely right for your needs.</p>

<p>With IME Capital, you can take the next step in the way that suits you best — start your <b>complimentary 15-day IME RMS trial</b> for direct access to our research-backed fund views, or <b>book a one-on-one consultation with a Senior Private Banker</b> for a more personalised discussion around your PMS and AIF options.</p>
<RmaCta />
</Section>



        </div>
    );
}