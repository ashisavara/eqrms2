import Section from "@/components/uiComponents/section";
import PageTitle from "@/components/uiComponents/page-title";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import AlertBox from "@/components/uiBlocks/AlertBox";

export default function HomePage() {
    return (
        <div>
            <PageTitle 
                title="A research-first investments firm" 
                caption="IME Capital is a research-first investments firm. We aim to disrupt the wealth management industry, by shrinking the gap in investment insights between central research teams & RMs/Clients. " 
            />

        <Section className="py-12 bg-gray-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME%20Capital%203%20Differentiators%20light.png"
                heading="3 Core Differentiators"
                imgSide="right"
            >
                <p> These differentiators are not just empty promises, but lay the foundation of our entire business. </p>
                <p>On each of these core differentiators, we can demonstrate the extra-mile we go as compared to any other wealth management firm in India.  </p>
            </ImageTextBox>
        </Section>

        <Section className="py-12 bg-blue-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/depth-of-expertise.png"
                heading="Depth of our Expertise"
                
            >
                <p>IME is the only wealth manager in India to be founded & run by an institutional fund manager.</p>
                <p>This gives us unprecedented access to unique insider insights, critical for fund selection & portfolio construction.</p>
            </ImageTextBox>
        </Section>

        <Section className="py-12 bg-green-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/weak-flow-down-insights.png"
                heading="Unmatched Transparency"
                imgSide="right"
            >
                <p>As a 100% founder-owned company, we have no external shareholders to please and that frees us from many of the short-term growth pressures common with larger firms.</p>
                <p> Our revolutionary <b>Research Management Solution (IME RMS)</b> allows you to directly access the insights of our unbiased central research team, as compared to the chinese-whispers, conflicts, biases and shielded information common in the current industry structure.</p>
            </ImageTextBox>
        </Section>

        <Section className="py-12 bg-blue-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME-Investment-Mandate.png"
                heading="Client Centricity"
                
            >
                <p>The value of any investment portfolio comes down to how well it meets your specific requirements (driven by your risk-profile, your financial goals, investments beliefs, preferences and understanding). </p>
                <p>Our superior process for developing an Investment mandate combined with our cutting edge Interactive Client Portfolio  reflects our level of dedication to the clients needs.</p>
            </ImageTextBox>
        </Section>

        <Section className="py-12 bg-green-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME%2030-day%20Free%20Trial.png"
                heading="Free 30-Day Trial"
                imgSide="right"
            >
                <p> We are so confident on the value of our services that we offer you a completely free, no-commitement 30-day trial of our entire range of services. </p>
                <p> You get to experience first hand, just how different it is interacting with a research-first investments firm, and the value it adds to your investments - prior to commiting a single rupee.</p>
            </ImageTextBox>
        </Section>

       

        
        </div>
    );
}