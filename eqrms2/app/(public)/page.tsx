import Section from "@/components/uiComponents/section";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import ImageCarousel from "@/components/uiComponents/image-carousel";
import TextHighlight from "@/components/uiBlocks/TextHighlight";
import RmaCta from "@/components/uiComponents/rma-cta";

const images = [
    { src: "https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/landing-page-carousel/family-inv-solutions.jpg", alt: "Individual and Family Investment Solutions" },
    { src: "https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/landing-page-carousel/ultra-HNI-investment-solutions.jpg", alt: "Family Office and Ultra HNI Investment Solutions" },
    { src: "https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/landing-page-carousel/retiree_investment_solutions.jpg", alt: "Retiree Investment Solutions" },
    { src: "https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/landing-page-carousel/corporate_treasury_solutions.jpg", alt: "Corporate Treasury Solutions" },
    { src: "https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/landing-page-carousel/nri_investment_solutions.jpg", alt: "NRI Investement Solutions" },
  ];

export default function HomePage() {
    return (
        <div>
            <div className="flex flex-col md:flex-row bg-blue-950">
                <div className="min-w-[400px] w-full md:w-1/4 px-6 flex flex-col justify-center">
                    <h2 className="bg-blue-50 mt-12 text-blue-950 text-center'">A Research-First Investments Firm</h2>
                    <p className="text-white text-center">
                        Specialised Investment Solutions for Families, Retirees, NRIs, Ultra-HNIs, Family Offices and Corporate Treasuries.
                    </p> 
                </div>
                <div className="w-full">
                    <ImageCarousel 
                    images={images}
                    autoplay={true}
                    autoplayInterval={4000}
                    />
                </div>  
            </div>

            <Section className="py-12">
                <TextHighlight>
                    <p>IME Capital is a <b>‘research-first’</b> investments firm, with <b>3 core differentiators</b> - <br/> the<b> Depth of our Expertise, <br/>Unmatched Transparency</b> <br/>and our <b>Levels of Portfolio Customisation</b>. </p>
                </TextHighlight>
            </Section>

        <Section className="bg-blue-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/depth-of-expertise.png"
                heading="Depth of our Expertise"
                
            >
                <p>IME is the one of the only wealth managers in India to be founded & run by an institutional fund manager. </p><p> Our founder Ashi Anand, has over 25 years of experience at some of India's largest AMCs (including ICICI Pru & Kotak), and is responsible for the launch of India's first Arbitrage (2003) & Capital Guaranteed funds (2004).</p>
                <p>This gives us access to unique insider insights, critical for superior fund selection & portfolio construction.</p>
            </ImageTextBox>
        </Section>

        <Section>
       <div className="flex flex-col md:flex-row max-w-7xl mx-auto gap-12 py-12">
        <div className="w-full md:w-[400px] md:min-w-[200px] md:flex-shrink-0 text-center my-auto"> 
            <h2 className="bg-white">Unmatched Transparency</h2>
            <p>Via our proprietary <b>IME RMS,</b> you gain <b>direct access</b> to our <b>detailed rating rationales</b> across MFs, PMSs, AIFs & Global Funds. <br /><br /> This is the <b>first-time ever</b> an investments firm is making available the thoughts behind fund recommendations - ensuring a <b>single-point-of truth</b> and that <b>advice is driven by research, not sales.</b></p>
            
           
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

        <Section className="bg-gray-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME-Investment-Mandate.png"
                heading="Levels of Portfolio Customisation"
                
            >
                <p>The IME Investment Mandate helps you move from the <b>confusion of too many investment options </b>to <b>clarity on the specific categories</b> that are <b>tailor-made to your unique needs.</b></p>
                <p>Your Mandate is developed in consultation with an IME Private Banker, on the basis of a detailed evaluation of your risk-profile, financial plan, preferences, beliefs, and other needs.</p>
            </ImageTextBox>
        </Section>

        <div className="max-w-5xl mx-auto pt-8"><RmaCta /></div>

      </div>
       

    );
}