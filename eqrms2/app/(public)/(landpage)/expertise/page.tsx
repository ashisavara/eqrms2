import Section from "@/components/uiComponents/section";
import PageTitle from "@/components/uiComponents/page-title";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import AlertBox from "@/components/uiBlocks/AlertBox";

export default function RMSPage() {
    return (
        <div>
            <PageTitle 
                title="Depth of Expertise" 
                caption="Understanding what makes our Expertise different" 
            />

        <Section className="py-12 bg-gray-50">
            <ImageTextBox
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/depth-of-expertise.png"
                heading="Fund Manager Insights"
            >
                <p>All investment firms claim to have great depth of expertise. What makes our expertise in understanding the investment ecosystem stand out? </p>
                <p>As the only wealth management firm that is founded by an institutional fund manager, IME Capital is unique in terms of bringing the expertise of institutional investments of AMCs to the management of individual investor portfolios. </p>
            </ImageTextBox>
        </Section>

        <Section>
            <AlertBox color="blue" heading="The benefits of having a Fund-Manager Founder">
                <p>A sales person focuses on sales, while a fund manager focuses on research & investments. </p>
                <p>Unlike traditional wealth management firms that are typically founded & headed by finance professionals with a sales or RM background, IME Capital is founded & headed by Ashi Anand (an institutional fund manager, with over 2 decades of experience directly managing funds at some of India’s top AMCs). </p>
                <p>Hence, at IME Capital, research always comes ahead of sales. Additionally, we benefit from deep insider insights that our founder has on the inner workings of funds and their management. That makes our fund selection & rating process unparalleled. </p>
            </AlertBox>
        </Section>

        <Section>
            <AlertBox color="green" heading="Fund Selection by those with True Investing Experience">
                <p>The central research teams of wealth management firms are typically investment professionals focused on fund selection & have rarely actively managed money themselves. At IME Capital, our central research team is regularly involved in decisions on our equity PMS portfolios, and our founder manages a fund hands on. Naturally, our team has a better appreciation of underlying macro-economic, industry & company trends (what we call Level 3-5 investing) that are critical to understand the market environment and accordingly, portfolio positioning. </p>
            </AlertBox>
        </Section>

        <Section>
            <AlertBox color="blue" heading="The IME RMS">
                <p>Our revolutionary Research Management Solution helps you gain a direct connect with our central team of Investment Experts</p>
                <p>The insights of the central research team can add tremendous value to investor portfolio construction, but only if they are accessible by Relationship Managers & End Investors. </p>
                <p>Our innovative RMS seamlessly transfers insights of our central research team, in a genuinely ground-breaking manner</p>
            </AlertBox>
        </Section>

        <Section className="bg-green-900 py-12 text-white text-center text-lg">
            <p>A combination of our greater depth of investment expertise & the ability to share this directly with you – our end investor, results in superior portfolio construction. </p>
        </Section>

        
        </div>
    );
}