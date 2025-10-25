import Section from "@/components/uiComponents/section";
import PageTitle from "@/components/uiComponents/page-title";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import AlertBox from "@/components/uiBlocks/AlertBox";

export default function RMSPage() {
    return (
        <div>
            <PageTitle 
                title="Client Dedication" 
                caption="Understanding our commitment to our clients" 
            />

            <Section className="bg-green-50 py-12 text-green-900 text-center">
                <p>We operate on the principle that every investor is unique. Much like thumbprints, it is impossible that any two people are identical. They have differences in goals, wealth levels, risk-profiles, investment experience and many other factors. Thus, there can be no ‘one size fits all’ when it comes to investment advice.</p>
                <p>Our focus is on long term relationship building and to that end, we spend a substantial amount of time upfront getting to know you and understanding your specific requirements. Only after this comprehensive process of defining your investment mandate, do we get into portfolio construction & fund selection.</p>
            </Section>

            <Section className="py-12 bg-gray-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/IME-Investment-Mandate.png"
                heading="IME Investment Mandate"
                subHeading="Strategic Blueprint for Your Investments"
            >
                <p>Your investment mandate is a written document, that clearly spells out your unique requirements and provides a strategic roadmap that defines how you would like your investment to be managed.  </p>
                <p>The development of your investment mandate is a highly consultative process, where the IME Private Banker has a detailed discussion with you to understand your investment preferences and beliefs, financial goals, risk-profile, your past experiences and any other needs.</p>
            </ImageTextBox>
            </Section>

            <Section className="py-12">
                <div className="ime-grid-2col">
                    <AlertBox color="blue" heading="How it works">
                        <p>Each of your requirements, feeds into portfolio construction & fund selection.</p>
                        <ul>
                            <li><strong>Financial Goals</strong>: Investment Horizon & Asset Classes </li>
                            <li><strong>Risk Profile</strong> Category Selection</li>
                            <li><strong>Preferences & Beliefs</strong> Fund Selection</li>
                            <li><strong>Market Environment</strong> Real-time adjustments</li>
                        </ul>
                        
                    </AlertBox>
                    <AlertBox color="green" heading="From Confusion to Clarity">
                        <p><strong>Confusion of too many options:</strong> 1000's of MFs, 250+ PMS/AIF, Global funds & more</p>
                        <p><strong>Clarity via your Mandate:</strong> With structures, asset-classes, categories & funds shortlisted based on your unique requirements.</p>
                    </AlertBox>
                </div>
            </Section>
       
            <Section className="bg-green-900 py-12 text-white text-center">
                <p>By ensuring documentation of core qualitative factors that drive your wealth management decisions, the IME client portal provides a more holistic view on your investments, keeping you and your relationship managers on the same page and protecting against the risk of RM churn.  </p>
            </Section>
            


        </div>
    )};