import Section from "@/components/uiComponents/section";
import PageTitle from "@/components/uiComponents/page-title";
import TextHighlight from "@/components/uiBlocks/TextHighlight";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import AlertBox from "@/components/uiBlocks/AlertBox";
import HeadlineTextBox from "@/components/uiComponents/headline-text-box";
import InfoCard from "@/components/uiBlocks/InfoCard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FamilySolutionsPage() {
    return (
        <div>
            <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ultrahni%20(1).jpg" alt="Ultra HNI Solutions" className="w-2/4 mx-auto my-6"></img>
            <PageTitle 
                title="Family Office & Ultra HNI Solutions" 
                caption="Specialised Investment Solutions for the Ultra-Wealthy." 
            />
            


            <Section className="py-6">
                <TextHighlight>
                    <p>As a research-first investments firm, we have a deep understanding of the investment ecosystem and the needs of Ultra-HNIs and Family offices.</p>
                    <p>From helping manage multi-advisor multi-investor complex portfolios, helping evaluate more complex investment options, playing an advisor-of-advisor role or helping deal with complex succession planning - IME's Family Office & Ultra HNI Solutions help cater to your every need.</p>
                </TextHighlight>
            </Section>
            <h2>The Problems we help family offices & ultra-HNIs solve</h2>

            <Section className="py-6">
                
                <p>More often than not, we have noticed the following common challenges while evaluating the investment portfolios of larger family offices & ultra-HNIs. Here are some examples and also a glimpse into what we would do differently:</p>
                <p className="font-bold text-center mt-12 text-lg">Dealing with complexity of too many investment options</p>
                    <AlertBox color="red" heading="Too many investment options">
                        <p>The complexities dealing with a large universe of investible options & the increasing complexities of sophisticated investment products focused on the Ultra-HNI segment</p>
                        <p>Over the past decade, the range of investment options have exploded, especially with the tremendous growth in the alternatives investments industry.</p>
                        <p>Many of these investment options have been made available only recently in the Indian markets (including long-short strategies, asset-yielding funds as replacements to debt, unlisted funds across different stages of the funding lifecycle etc.) and may not have a historic track record to give investors a good  comprehensive perspective on their true risk-reward and how these operate.</p>
                    </AlertBox>
                    <AlertBox color="green" heading="Deep Alternatives Insights">
                        <p>When it comes to more complex alternative investment options, we benefit from deep insider insights (as compared to a wealth manager looking in) into the functioning of the alternatives space.</p>
                        <p>A massive advantage here is that Ashi’s entire experience has been concentrated around alternative investment vehicles, from the very early stages of the industry’s development. This includes Fund Management (of PMS & Quasi Private-Equity strategies), Structured Product development (India’s first capital preservation & capital guaranteed pdts) & managing complex ultra-HNI mandates (including overseas trusts).</p>
                        <p>We accordingly understand some of the deeper nuances of how these funds operate, and their investment merits within your portfolios.</p>
                    </AlertBox>

                <p className="font-bold text-center mt-12 text-lg"> A common degradation of combined investment portfolio that occurs when dealing with multiple advisors</p>
                
                    <AlertBox color="red" heading="Too many advisors">
                        <p>Ultra-HNI’s often deal with more than one advisor, each of whom are looking at their individual allocations in isolation. With each advisor trying to optimize their individual allocations, this often leads to over diversification issues around too many funds and very poor portfolio construction at the combined level. </p>
                    </AlertBox>
                    <AlertBox color="green" heading="Superior Portfolio Construction">
                    <p>Ultimately,<strong> what truly matters for wealth creation is the portfolio construction of the total investment portfolio</strong>&nbsp;(across all investment advisors). Our Investment Mandate development process (driven by institutional fund management best-practices of portfolio construction &amp; mandate development)&nbsp; &amp; our focus on Level 1-5 Investing (which helps evaluate your true exposures), helps ensure clarity around how you wish to have your overall portfolio to be constructed.</p>
                    <p>Allocations to specific advisors can then focus around their areas of specialisation, as compared to multiple advisors all running similar mandates.</p>
                    </AlertBox>

                <p className="font-bold text-center mt-12 text-lg"> Complexities dealing with multi-advisors & multi-family member portfolios</p>
                
                    <AlertBox color="red" heading="Disparate Portfolio Reports">
                        <p>When dealing with multiple advisors & for different family members, it is often very challenging reconciling the very large number of different portfolio reports for you to get a holistic view of the total portfolio and to drill down to specific advisors, family members, asset classes or investments. </p>
                    </AlertBox>
                    <AlertBox color="green" heading="Intuitive & Interactive Portfolio Reporting">
                        <p>Our highly intuitive & interactive client portal has been designed to address this very common issue when dealing with multi-advisor multi-family member portfolios. Our reporting allows for you to view your portfolio in any manner that you want, and allows for a level of interactiveness & an ability to drill down to any small part of the portfolio you wish to evaluate in a manner that is unparalleled in portfolio reporting. </p>
                    </AlertBox>

                <p className="font-bold text-center mt-12 text-lg"> Needs that go beyond traditional wealth management</p>
                
                    <AlertBox color="red" heading="Complex Needs">
                        <p>Family Offices & Ultra-HNIs often have needs that go well beyond traditional wealth management services. This includes needs such as sophisticated estate planning, complex international investing, multi-tiered trust structures, more sophisticated tax planning, investment banking or advice on non-financial security assets (such as complex real-estate, art etc).  </p>
                    </AlertBox>
                    <AlertBox color="green" heading="Strategic Tie-ups">
                        <p>We have tie-ups in place with some of the best-in-class service providers to assist our investors with their more complex requirements. This includes tie-ups with international trust creation firms, investment banks, high-end art specialists, CA firms and more.   </p>
                    </AlertBox>

            </Section>
            <h2>Flexible Engagement Models</h2>
            <Section>
                
                <p className="text-center mt-12 text-lg">Keeping in mind the sensitivity that comes with dealing with larger investors, we have a number of different ways in which we can collaborate together and add value to your investments</p>
                <div className="ime-grid-3col">
                    <InfoCard headline="Outsourced Family Office">
                        <p>With the full bouquet of investment options, we can provide you with all the benefits of your own dedicated family office, at a fraction of the cost of hiring a full-fledged investment team. </p>
                    </InfoCard>
                    <InfoCard headline="Advisor of Advisors">
                        <p>We can help you with investment banking services, helping you raise capital for your family office or ultra-HNI. </p>
                    </InfoCard>
                    <InfoCard headline="Custom Solutions">
                        <p>We also have the ability to engage with you in specific parts of our services where you see the greatest level of value-addition. Our arrangement/partnership can be tailor made depending on what you need us to do. </p>
                    </InfoCard>
                </div>
            </Section>
        </div>


    )
};