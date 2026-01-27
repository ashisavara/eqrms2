import ImageTextBox from "@/components/uiComponents/image-text-box";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import YouTube from "@/components/uiComponents/youtube";

export default function ImeDigitalDisruptionPage() {
    return (
        <div>
            <RmsPageTitle 
                title="IME Digital Disruption" 
                caption="India's only fund that invests exclusively in listed Digital Platforms" 
            />

        <Section className="bg-gray-100 !py-12 text-center">
            <h2 className="bg-gray-100">About IME Digital Disruption Strategy</h2>

            <p>Concentrated portfolio investing exclusively in listed digitally-native platform businesses</p>
            <p>Tightly defined stock selection & portfolio construction methodologies</p>
            <p>Private-equity approach to listed market investing</p>
            <p>Fund managed by Ashi Anand - over 2 decades of fund management experience, with sustained outperformance</p>
        </Section>

        <Section className="bg-blue-50 !py-12">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/digital_platforms.jpg"
                heading="Why you need digital in your portfolio"
                
            >
                <p> - Substantially higher growth </p>
                <p> - Very strong core LT profitability evident</p>
                <p> - Very strong business moats </p>
                <p> - Consumers are becoming digitally native </p>
                <p> - Tremendous wealth creation globally</p>
            </ImageTextBox>
        </Section>

        <Section className="bg-gray-100 !py-12">
            <div className="ime-grid-2col gap-12">
                <div className="text-center">
               <h2 className="bg-gray-100">Is investing in loss-making companies sensible?</h2>
               <p>Listed market investors misunderstand new-age digital platform business models.</p>
                <p>Building the network requires large upfront investments. These investments help drive super-normal growth & very strong competitive moats.</p>
                <p>Once the networks stabilise, these upfront investments can be pulled down sharply & monetisation can increase substantially.</p>
                </div>
                <div>
                <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/digital-profits-linked-customer-journey.png" alt="Digital Platforms"/>
                </div>
            </div>
        </Section>

        <Section className="text-center">
            <h2 className="bg-white">Value-creation potential of this model seen globally </h2>
            <p>The large upfront investments leads to sustainable super-normal profitability & very high-value creation over the longer term.</p>
            <p>This has been seen clearly in US Tech’s disproportionate value creation in the past decade. Very strong signs of the same happening in India going forward.</p>
            <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/top-10-comp-decade.jpeg" alt="US Tech Value Creation"/>
        </Section>

            <SectionTextHighlight color="blue">
                <p>The trends for value-creation in Indian Digital Platforms is clear. </p>
                <p>Strong Business Growth + Clear Path to Profitability = Significant Value Creation</p>
            </SectionTextHighlight>

            <div className="max-w-6xl mx-auto ime-grid-2col !gap-12 py-12">
                <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/digital-hyper-growth.png" alt="Digital Platforms"/>
                <div> <p className="font-bold text-lg">Expected Profitability Timelines</p><img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/path_to_profitablity.png" alt="Digital Platforms"/></div>
            </div>

            <Section className="bg-gray-100 !py-12">
                <h2 className="bg-gray-100">Learn More</h2>
                <YouTube url="https://www.youtube.com/watch?v=qjVzeMROG14" />
            </Section>



        

        </div>
    )
}