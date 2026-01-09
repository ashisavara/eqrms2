import Section from "@/components/uiComponents/section";
import PageTitle from "@/components/uiComponents/page-title";
import TextHighlight from "@/components/uiBlocks/TextHighlight";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import AlertBox from "@/components/uiBlocks/AlertBox";
import HeadlineTextBox from "@/components/uiComponents/headline-text-box";
import InfoCard from "@/components/uiBlocks/InfoCard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import HeroImgTitle from "@/components/uiComponents/hero-img-title";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";

export default function RetireeSolutionsPage() {
    return (
        <div>
            <HeroImgTitle 
                title="Retiree Solutions" 
                caption="Tax-efficient income with clarity on corpus sufficiency."
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/retiree-investment-solutions.jpg"
                imgAlt="Retiree Investment Solutions"
            />

            <Section className="py-6">
                <TextHighlight>
                    <p>As a retiree, your needs are completely different from those who are earning. As are your priorities. </p>
                    <p>After working hard your entire life, the last thing you want is to worry about how long your funds will last, or how to make the best possible use of your nest egg, despite inflation, taxes and changes in the markets.</p>
                    <p>We can help you develop an investment plan that identifies the best investment options for your retirement corpus.</p>
                </TextHighlight>
            </Section>

            <Section className="py-12 bg-gray-50">
                <AlertBox color="blue" heading="Retirement-focused Investment Solutions">
                <ul>
                    <li>Increasing tax efficiency by<strong>drastically reducing the tax</strong> you pay on your existing investments</li>
                    <li>Creating a <strong>monthly income</strong> without impacting your capital</li>
                    <li>Ensuring this income grows with inflation to help maintain your purchasing power</li>
                    <li>Keeping your <strong>capital safe</strong> to fund living expenses</li>
                    <li>Keeping an eye on how long the <strong>corpus will last</strong></li>
                    <li>Ensuring you have some <strong>liquidity</strong> to help fund unplanned expenses</li>
                    <li>Customising your <strong>asset allocation</strong> to meet all your current and future needs, given your risk profile and risk appetite</li>
                    </ul>
                </AlertBox>
            </Section>

            <SectionTextHighlight>
            <p>However unless people have sought out specialised financial advice, too often, advisors offer templated solutions to retirees, for instance: bank fixed deposits but these are taxable, or annuity plans but these are locked in or non flexible, and don’t let you access your money in an emergency. </p>
                <p>While the focus around retirement may always have been “when” to retire; but at IME, we understand that the “how” is important – how your quality of life is important once you stop earning, how to make the most of your corpus, how to make that corpus last longer. </p>
                </SectionTextHighlight>

            <Section className="py-12">
                <h2>FAQs on IME Retiree Solutions</h2>

                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Why do we not recommend investing in bank FDs?</AccordionTrigger>
                        <AccordionContent>
                            <p>All the interest that you earn from a bank fixed deposit is taxable on an annual basis. A considerable amount of your returns are lost in taxes, when you invest in tax in-efficient investments like bank fixed deposits.&nbsp;</p>
                            <p>Instead of bank fixed deposits, we recommend that you consider investing in low-risk debt or Arbitrage funds instead. Low-risk debt or Arbitrage funds provide a similar return as bank fixed deposits, with a similar risk profile, but are much more tax efficient. The main benefit of debt or Arbitrage funds, is that you are only taxed on the capital gains for the units that you redeem in a particular year (and there is no tax applicable on an annual basis for the units that are not redeemed). This substantially reduces the amount of interest that is subject to tax in a given year.&nbsp;</p>
                            <p>Importantly, if you do not have any additional sources of income (such as rent, pensions etc.) it is possible to structure the monthly income from debt/arbitrage funds in such a way that only a small part of the income is considered as taxable income.</p>
                            <p><strong><em>We have been able to reduce the tax slab for some of our retiree clients from the 30% top rate to NIL, by careful structuring of their monthly income. All this with no incremental risk and a higher level of flexibility.&nbsp;&nbsp;</em></strong></p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Why do we not recommend annuity/pension plans?</AccordionTrigger>
                        <AccordionContent>
                            <p>Annuity/Pension plans are very popular amongst retirees, due to the simpleness of the monthly income provided. However in our opinion annuity/pension plans are fundamentally flawed investment products with a number of disadvantages:</p>
                            <ul>
                            <li><strong>Ignore the impact of inflation:&nbsp;</strong>which leads to your purchasing power reducing every year. This is particularly damaging over time, with your purchasing power reducing by 50% in 10 years and 75% in 20 years.&nbsp;</li>
                            <li><strong>Extremely tax-inefficient:&nbsp;</strong>annuity plans are one of the very few investment products, that tax you not only on the returns that you earn but on your principal as well.&nbsp;</li>
                            <li><strong>Money is locked-in:&nbsp;</strong>and is not available to you, even in the case of an emergency.&nbsp;</li>
                            </ul>
                            <p>Please note, that as insurance brokers we have all insurance products (including annuity/pension plans) in our product portfolio. However, this is a product segment that we never recommend to our clients, since annuity/pension plans are clearly not in your best interest and do not meet your requirements.&nbsp;</p>
                            <p>Instead of an annuity/pension plan, we can help you build a low-risk investment portfolio that provides you your desired monthly income, with the additional benefits of your monthly income rising with inflation, being highly tax-inefficient and your having access to your capital at any time in case of emergencies.&nbsp;</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What investment products do you recommend for retirees?</AccordionTrigger>
                        <AccordionContent>
                            <p>In our view, a well-structured diversified portfolio of low-risk debt funds &amp; conservative hybrid funds (80% debt/20% equity) are the best solution for meeting your specific needs as a retiree. Many retirees are unaware of exactly how these products work, which leads them to opt for more inefficient products like bank FDs or annuity plans.&nbsp;</p>
                            <p>By spending time upfront in understanding your requirements, we can help you structure a portfolio that provides a monthly income that rises with inflation, in a very tax-efficient manner, while keeping your money liquid and available if required to meet any unplanned emergencies.&nbsp;</p>
                            <p><em><strong>Please note, we do not take a one-size-fits-all approach. We study the specific needs and financial position of each retiree, to understand the products that work the best for you.&nbsp;</strong></em>This includes having a higher asset allocation to riskier asset classes, for retirees that have the ability and willingness to take on a higher level of risk.&nbsp;</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>As a retiree, what portion of my portfolio should be allocated to equity?</AccordionTrigger>
                        <AccordionContent>
                            <p>We strongly recommend against using any age-template based asset allocation recommendation (e.g. At the age of 60, you should have 20% in equity). This is lazy financial planning, and does not take into account the differences in risk profiles, income requirements, portfolio size and more.</p>
                            <p>An asset allocation should always be customised to your specific requirements, and never let to a general template. If you are very dependent on a steady monthly income, a lower equity allocation would make sense. However, there are retirees that have other sources of income (e.g. rent, pensions etc.), for whom a higher allocation in equity can be recommended.&nbsp;</p>
                            <p>We do however believe that using hybrid funds to build up an equity exposure, may be more suitable for retirees as compared to pure equity funds, due to the benefit of lower volatility seen at a fund level.&nbsp;</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>Can you help with drafting a will?</AccordionTrigger>
                        <AccordionContent>
                            <p>While it is best to have a lawyer draft your will (though not required, especially if it is a simple will), we have an understanding of what should & should not be included while you are writing your will. This is detailed in greater depth in our Blog Post – Important Things to Keep in Mind While Writing a Will. </p>
                            <p>Our advisors would be happy to assist you in the process and run a quick checklist on the most important components of a will. However, please note that we are not lawyers are for more complicated will & estate planning, it is always recommended to get quality legal advice. </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Section>
        </div> 
    )
};