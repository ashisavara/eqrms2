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
            <PageTitle 
                title="Family Solutions" 
                caption="Tailored Investment Solutions to help secure your family's future" 
            />

            <Section className="py-12">
                <TextHighlight>
                    <p>So far, the industry focuses on “Which fund / investment is right for you?”.</p>
                    <p>At IME, our question is “What do you want from your life and when would you like to achieve it? What will free you from your worries?” </p>
                </TextHighlight>
            </Section>

            <Section className="bg-green-50 py-12 text-center">
                <p>A financial plan is not just about where to invest your money. A financial plan is a way for you to be able to plan to achieve what you want and need from your life. While from a technical perspective, this means we will find the right investment category and asset class that fits your needs, what it actually means is that we make your money for you. </p>
                <p>At IME Capital, we help families and individuals plan their future goals, after a careful understanding of your risk profile, investment beliefs and level of investment knowledge. </p>
            </Section>

            <h2 className="my-12">The Benefits of a Clear Financial Plan</h2>

            <Section>
                <div className="ime-grid-3col pb-12">
                    <InfoCard headline="Fund Requirements">
                    Have clear visibility of the amount of money you require through different stages of life
                    </InfoCard>
                    <InfoCard headline="Clarity on Investment Horizon">
                    Gain a better sense of your true investment horizon, helping deal with market volaility. 
                    </InfoCard>
                    <InfoCard headline="Better Portfolio Construction">
                    Better Portfolio Construction aligned to your goals and risk profile.
                    </InfoCard>
                
                </div>
            
            <AlertBox color="green" heading="Solve Lumpiness of Life Goals">
                <p>Income & expenses for families do not move at the same pace. There are certain expenses related to core life goals (retirement, child’s education, home purchase) that are very large and lumpy; they tend to all come to a head at the same time. This leads to families having to make major compromises at later years of their life.</p>
                <p>We work around this by investing a small amount every month. This plan can be made after we work out your investment mandate. </p>
            </AlertBox>
            <AlertBox color="blue" heading="Dealing with Inflation">
                <p>The same annual expenditure of Rs. 20 lakhs today, will cost you Rs. 40 lakhs in 10 years, Rs. 80 lakhs in 20 years and Rs. 1.6 cr in 30 years.</p>
                <p>The only way to mitigate the impact of inflation, is to use the power of compounding in your favour. With smart and careful planning, you can save yourself from a lot of pressure. For instance, an investment of Rs. 20 lakhs in equity today (earning 15% p.a.), will be worth Rs. 80 lakhs (10 years), 3.2 cr (20 years) and Rs.12.8 cr (30 years). </p>
            </AlertBox>
            
            </Section>

        <Section>
            <h2>FAQs on Financial Planning</h2>
            <Accordion type="single" collapsible>

                <AccordionItem value="item-1">
                <AccordionTrigger>How do you plan for your retirement?</AccordionTrigger>
                <AccordionContent>
                    <p>The amount you require for your retirement corpus, is likely to overshadow any other expense that you have in life. It is important to understand, that your retirement corpus will need to meet an elevated level of expenses (due to inflation), for almost 20 to 30 years. </p>
                    <p>All you need to calculate your retirement corpus are 3 key numbers – (a) your current annual expenses (b) your planned retirement age (c) your expected lifespan. </p>
                    <p>There are a few things to keep in mind while planning your retirement corpus:</p>
                    <p className="font-bold">Getting the right estimate of your current annual expenses </p>
                    <p>Many people make the mistake of relying on simplified online calculators (that add up various components of monthly expenses to arrive at your annual expenses). When we have analysed existing financial plans of clients, we have typically found that many people significantly under-estimate their actual level of expenses. </p>
                    <p>This is because it is easy to forget to include the non-monthly lumpy expenses that take place through the year. This includes travel, special occasions, gadget purchases, periodic changes of cars etc. </p>
                    <p>The best method: is not to try to estimate how much you spend, but to calculate what you spend in reality. The easiest way to do this, is to take your annual post-tax income and reduce the amount you actually saved last year. If you do choose to estimate your requirements, it is best to do this with a trained consultant who can ensure that you are not leaving out any important expenses that may skip your mind. </p>
                    <p className="font-bold">Understanding your post-retirement lifestyle</p>
                    <p>Every person has different needs post-retirement. Some people choose to simplify their life, move to a smaller city and sharply reduce their expenditure. </p>
                    <p>For others (especially those that have the financial means), retirement throws open a number of lifestyle choices that are simply not possible while you are working. If you have the money, you have the luxury of taking extended international holidays, to spend more on leisure & entertainment and invest more on your hobbies & interests. </p>
                    <p>This is a lifestyle choice which differs from person to person. You need to think this through, to estimate whether your current level of annual expenses is adequate (or lower/higher) than what you would need to meet your desired post-retirement lifestyle. </p>
                    <p className="font-bold">You should remember the number</p>
                    <p>Once you have calculated your retirement corpus, this is a number that you should commit to memory. At any time, you should be able to answer (I need Rs___ cr as a retirement corpus). </p>
                    <p>This is important as it helps you stay motivated and committed through your investment plan. </p>
                </AccordionContent>

                </AccordionItem>

                <AccordionItem value="item-3">

                <AccordionTrigger>How do you plan for your child's education?</AccordionTrigger>

                <AccordionContent>
                    <p>How do you plan for something, when you don’t know what that something is? When your child is young, you have no clue whether he/she would want to be an engineer, a doctor, an artist, a sportsmen, a businessman or a fire-fighter. </p>
                    <p>The simple answer is, you don’t know and by the time you do, it will be too late to do anything about it if you have not planned in advance. </p>
                    <p>The only thing you can do as a parent, is to be prepared for any reasonable eventuality that fits within your budget. Perhaps you have planned to fund an Ivy League MBA, but your kid drops out of college to start a business instead – the money you saved could be used to buy a vacation home, boost your retirement corpus or help provide starting capital for your child’s venture. It is a lot better than planning for your kid to drop out and then having to pay for an Ivy League MBA with expensive credit card debt. </p>
                    <p>Given the very wide range of education options available, there is no one right number to aim for when it comes to funding your child’s education. However, our research has indicated that the <strong>annual cost of a top ranking school in the US can cost upto Rs. 100 lakhs a year (i.e. Rs. 2 cr for post graduate / Rs. 6 cr for undergraduate & post grad).</strong> </p>
                    <p><strong>Other international schools can be cheaper, but can still cost upto Rs. 20-50 lakhs a year. More expensive colleges in India can also cost upwards of Rs. 10 lakhs per year, even as there are a number of cheaper options available. </strong></p>
                    <p>These are just certain benchmarks, and the right number for you to aim for would depend on your specific unique requirements. This is at the upper end of cost (top schools in the US with no scholarship), but can be used as a benchmark for you to estimate a number that you would like to target. </p>
                </AccordionContent>

                </AccordionItem>

                <AccordionItem value="item-4">

                <AccordionTrigger>Should you invest in your child's name?</AccordionTrigger>

                <AccordionContent>
                    <p>Many investor’s make the mistake of investing for their child’s education (or other requirements), by investing directly in the child’s name. <strong>We typically recommend against doing so!</strong>   </p>
                    <p>It is important to understand that any investment held in your child’s name, is their money the moment they turn 18. As a guardian, you no longer have any control over how that money is spent. </p>
                    <p>You may have saved up for your child’s education, but if the investment is in his/her name there is  <strong>nothing that you can do</strong> if you child desires to spend this money to buy a car, take an international vacation or anything else that he/she wants to use the money for. </p>
                    <p>Instead, we recommend having a clearly demarcated fund (in your individual name) that you know is kept aside for your child’s education, and is not to be used for anything else. </p>
                </AccordionContent>

                </AccordionItem>

                <AccordionItem value="item-5">

                <AccordionTrigger>What is a Piggybank Fund?</AccordionTrigger>

                <AccordionContent>
                    <p>A piggybank fund is simply a low-risk liquid debt fund, that you can use as your piggybank. You can use this fund to keep making small investments/withdrawals to help you plan for any specific larger & lumpy consumption expenses in the near-term.   </p>
                    <p>For example, piggybank funds can be used to help fund your vacations, save up for a new phone/bike/car, go on an extravagant shopping spreed, plan for a special occasion etc. </p>
                    <p>It’s a handy way to set some money aside, that is easy to draw upon whenever some larger expenses come around. </p>

                </AccordionContent>

                </AccordionItem>

                <AccordionItem value="item-6">

                <AccordionTrigger>What is a Contingency Fund?</AccordionTrigger>

                <AccordionContent>

                    <p>A contingency fund is some money that you set aside in low-risk debt funds, that can be used to meet any unplanned sudden large expenses. Contingency funds can be used to fund medical emergencies, help meet expenses in case of a loss of your job or any other such unexpected contingencies. </p>
                    <p>The benefit of a contingency fund, is that you have an ability to meet any unexpected expenses without having to draw upon your longer-term savings (this can help prevent you from being forced to redeem equity, when markets may be weak). </p>
                    <p>There are a few things to keep in mind while planning a contingency fund:</p>
                    <p>3-6 months of expenses: A good benchmark for how much to set aside as a contingency fund. </p>
                    <p>A separate fund: This is a fund that you never touch for any other expense, apart from meeting unplanned contingencies</p>

                </AccordionContent>

                </AccordionItem>

                <AccordionItem value="item-7">

                <AccordionTrigger>How do you plan for a home purchase?</AccordionTrigger>

                <AccordionContent>
                <p>From a financial planning perspective, you need to keep the following in mind while planning for a home purchase:</p>
                <ul>
                    <li><strong>Plan for your own contribution:&nbsp;</strong>in case you are taking a loan, your own contribution would include the downpayment, registration/brokerage/stamp duty charges and the cost of home interiors</li>
                    <li><strong>Important to consider the impact of EMI’s on your financial plan:&nbsp;</strong>buying a house too early in life (when your income is still at a lower level), may lead to very little amount left to invest after paying off your EMI’s. This reduces your ability to take advantage of the power of compounding, leading to your having to invest substantially more to meet your other goals.&nbsp;</li>
                    <li><strong>Keep in mind your LT financial plan while deciding on the budget for your home:&nbsp;</strong>many people make the mistake of stretching their budgets to buy a home (since for most this is a once-in-a-lifetime purchase), and not considering the impact going above budget would have on their ability to invest for their other core life goals.&nbsp;</li>
                </ul>

                </AccordionContent>

                </AccordionItem>

                <AccordionItem value="item-8">

                <AccordionTrigger>What are the examples of other goals?</AccordionTrigger>

                <AccordionContent>

                <p>Your financial plan is customised to your unique requirements. Any specific larger expense that you need to plan for can be included as part of your financial plan. This could include</p>
                    <ul>
                    <li>the purchase of a vacation home/farm</li>
                    <li>the purchase of a car (or a yatch!)</li>
                    <li>saving for milestone events</li>
                    <li>planning an inheritance you wish to leave for your children</li>
                    <li>anything else that you wish to save up for</li>
                    </ul>
                </AccordionContent>

                </AccordionItem>

                <AccordionItem value="item-9">

                <AccordionTrigger>Why STPs & SWPs are as important as SIPs to meet your financial goal?</AccordionTrigger>

                <AccordionContent>

                    <p>Systematic Investment Plans (SIPs) are very valuable to help reduce the impact of market volatility while investing in equities. However a well-planned financial plan can fail to achieve it&rsquo;s objectives, if the markets happen to have a sharp correction at the time when you need the money.&nbsp;</p>
                    <p>This is why Systematic Withdrawal Plans (SWPs) or Systematic Transfer Plans (STPs), are as important as SIPs for your financial plan. Instead of redeeming the money at one-go, it is recommended that you start to systematically transfer your money away from equity and into lower-risk debt funds, a few years prior to your goal date.</p>
                    <p>This helps ensure that you are not exposed to a sudden sharp correction in the markets, when you require your funds.</p>
                </AccordionContent>

                </AccordionItem>

                </Accordion>



        </Section>



        </div>
    );
}