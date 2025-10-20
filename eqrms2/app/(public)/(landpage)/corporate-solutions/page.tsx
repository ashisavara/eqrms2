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
                title="IME Corporate Treasury Solutions" 
                caption="Board-approved Investment Mandates for Corporates" 
            />


            <Section className="py-6">
                <TextHighlight>
                    <p>IME Corporate Treasury Solutions collaborates with corporates towards creating a board approved investment plan that provides an optimal balance of risk, returns and liquidity.</p>
                </TextHighlight>
            </Section>
            <h2>The Problems we help Corporate Treasuries solve</h2>
            

            <Section className="py-6">
                <p>More often than not, we have noticed the following common fundamental investment errors while investing corporate funds. Here are some examples and also a glimpse into what we would do differently:</p>
                
                <div className="ime-grid-2col">
                    <AlertBox color="red" heading="Overtly conservative asset allocation">
                        <p> An over-reliance on ultra-low risk debt funds (especially liquid).</p>
                    </AlertBox>
                    <AlertBox color="green" heading="Optimal Asset Allocation">
                        <p>There is an ability to increase yields without a substantial increase in risk (via low-duration or short-duration debt funds, conservative hybrid funds or even the use of equity for longer-term goals for unlisted companies).</p>
                    </AlertBox>
                </div>

                <div className="ime-grid-2col">
                    <AlertBox color="red" heading="Sub-optimal Goal-based allocation">
                        <p> Every company has different goals and needs – contingency fund, an acquisition fund, a monthly recurring expense fund, funds for specific projects etc. However often, investments are made at an overall corporate treasury level, as compared to investments against specific goals.</p>
                    </AlertBox>
                    <AlertBox color="green" heading="Investments linked to Goals">
                        <p>Keeping in mind the liquidity requirements of specific goals, we would identify investments and allocate them against each goal. This allows for substantial efficiencies in identifying the optimal investment for each goal. </p>
                    </AlertBox>
                </div>

                <div className="ime-grid-2col">
                    <AlertBox color="red" heading="Over-diversification">
                        <p> Large treasuries often have too many debt funds in their portfolio, with the misconception that a larger number of funds helps reduce risk. </p>
                    </AlertBox>
                    <AlertBox color="green" heading="Optimal Diversification">
                        <p>In reality, it is better to carefully select the best high-quality low-risk debt funds and have a concentrated exposure, as compared to increasing the number of funds that forces you to include lower-quality funds in the portfolio. </p>
                    </AlertBox>
                </div>

                <div className="ime-grid-2col">
                    <AlertBox color="red" heading="Excess liquidity held in current accounts">
                        <p> Typically to keep money available for monthly overheads (rent, salaries etc). </p>
                    </AlertBox>
                    <AlertBox color="green" heading="Low-Duration funds for liquidity management">
                        <p>Idle funds can be used to earn a return via low-duration funds with automated transfers to your bank account just prior to expense due-dates.</p>
                    </AlertBox>
                </div>

                <div className="ime-grid-2col">
                    <AlertBox color="red" heading="Bank funding lines against Bank FDs">
                        <p> These are investments that a company is unlikely to redeem (to keep the funding lines open), yet pays taxes on these every year.  </p>
                    </AlertBox>
                    <AlertBox color="green" heading="Substantial reduction in annual taxes">
                        <p>You can substantially reduce taxes on such investments, by using low-risk debt-type funds for these funding lines instead.</p>
                    </AlertBox>
                </div>

            </Section>

            <h2>IME Corporate Treasury Services</h2>
            <Section>
                <p>Our corporate treasury solutions can help boost your investment yields, with virtually no incremental risk, while ensuring that all investments are being managed via a board-approved investment mandate that gives clear visibility of the investment book to all key stakeholders. Our services include:</p>
                <HeadlineTextBox headline="Goal Planning"> 
                    <p>Identify your core financial goals and timelines (e.g. monthly recurring expenses, M&A warchests, contingency funds, specific project funding).</p>
                </HeadlineTextBox>
                <HeadlineTextBox headline="Investment Options"> 
                    <p>Help identify the most suitable investment option for each goal, in order to get the optimal balance between risk, return and liquidity requirements. </p>
                </HeadlineTextBox>
                <HeadlineTextBox headline="Investment Mandate"> 
                    <p>A board-approvable investment Mandate that details out risk-appetite (MTM volatility, capital risk, liquidity management & other such criteria), approved investment options and core goals to drive future investments. </p>
                </HeadlineTextBox>
                <HeadlineTextBox headline="Dedicated Consultant"> 
                    <p>The needs of your company will evolve regularly and a dedicated consultant will work on all of the above keeping track of your needs. Also, you will have real time monitoring and advice on portfolio changes by our investment professionals.</p>
                </HeadlineTextBox>
                <HeadlineTextBox headline="Compliance Reporting"> 
                    <p>Top management / board reporting on compliance, suitability and progress on plans.</p>
                </HeadlineTextBox>
            </Section>

            <h2>Our Engagement Process</h2>
            <Section>
                <AlertBox color="gray" heading="1) Initial Consultation">
                    <p>We are 100% sure about the value we can deliver so we offer a free consultation where we assess your organisation goals, risk appetite and ability (including capital risk, reputation risk). At this step, we also offer an existing analysis of your existing portfolio and its suitability in terms of risks, returns and volatility. </p>

                    <p>This allows us to invest considerable time & effort on a no-fee, no-commitment basis. Once the consultation is completed, we can then evaluate if there are any specific areas where we can engage with you, to help add value to your portfolio on an on-going basis.</p>
                </AlertBox>

                <AlertBox color="gray" heading="2) Investment Plan">
                    <p>After this, we provide a detailed investment plan that includes documenting goals, defining white listed investment options, level of risk at a company and loan level, and actions that can be taken to improve risk return trade off on existing investments.  </p>
                </AlertBox>

                <AlertBox color="gray" heading="3) Management / Board Approval">
                    <p>We present the investment plan for consensus across the key stake-holders for specific approval. A clearly defined path for investment decisions makes the process more strategic and reduces the chance of conflict or errors. </p>
                </AlertBox>

                <AlertBox color="gray" heading="4) Flexible Engagement Models">
                    <p>Based on the corporates requirements, we have the ability to operate across different engagement models, including as a fully-outsourced corporate treasury, a distributor or an advisor.</p>
                </AlertBox>

            </Section>
            <h2>FAQs on IME Corporate Treasury Solutions</h2>

            <Section>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>I have a CFO/CA who handles this. Why do I require your services?</AccordionTrigger>
                    <AccordionContent>
                        <p>Your CFO / CA specialises in corporate finance, which is a different field altogether from investments. Selecting the right funds (even for low-risk debt funds) requires a careful assessment of the risk-return at a fund level (which includes analysing the individual fund holdings, understanding the trade-off between YTM &amp; risk, the different debt fund categories etc).&nbsp;</p>
                        <p>Most CFO/CA&rsquo;s have a lack of time and specific expertise required for a detailed assessment of each funds suitability. This is the main reason why corporate treasuries often end-up with issues around over-diversification and overtly conservative asset allocation.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Can you provide some examples of corporate financial goals?</AccordionTrigger>
                    <AccordionContent>
                        <p>The actual goals are unique to each and every company. Our advisors will help you identify the goals that are the most relevant for your specific requirements.</p>
                        <p>However, as an example, these are some of the common goals for corporates that we can help create specific plans for:</p>
                        <ul>
                        <li><strong>Monthly Overhead fund:</strong>&nbsp;invest idle funds in liquid debt funds with automatic redemptions prior to salary/rent payment dates</li>
                        <li><strong>Capex planning fund:</strong>&nbsp;set aside funds to be used for your next major capex requirements</li>
                        <li><strong>Contingency fund:</strong>&nbsp;you never know when cash flows can take a sudden hit. Be prepared for such contingencies and avoid being stuck at your bank&rsquo;s mercy</li>
                        <li><strong>Loan repayment fund:</strong>&nbsp;set aside money for loan repayments</li>
                        <li><strong>Strategic funds:</strong>&nbsp;capital set aside to fund strategic growth opportunities (such as new business opportunities &amp; acquisitions)</li>
                        <li><strong>Contingent Liability Funds:</strong>&nbsp;set aside funds for potential unfavourable rulings on any specific contingent liability (such as tax disputes, court cases etc.)</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>I don't wish to take risk on my corporate funds. Why do you seem to advice it?</AccordionTrigger>
                    <AccordionContent>
                        <p>It is very important to understand, that we are not recommending that you take risk with your corporate funds. Losing money in the markets that limits your ability to fund required corporate projects is the worst thing to happen for any company.&nbsp;</p>
                        <p>What we are advising however, is moving away from overtly conservative corporate treasuries, that sharply reduces the returns on your funds. Specifically, we recommend:</p>
                        <ul>
                        <li><strong>Minimising idle funds in current accounts &amp; bank fixed deposits</strong>&nbsp;&mdash; replacing them with liquid low-risk debt funds instead</li>
                        <li><strong>Reducing over-diversification</strong>&nbsp;&mdash; to reduce the risk associated with investing in low-quality funds in an aim to diversify&nbsp;</li>
                        <li><strong>Moving away from liquid</strong>&nbsp;&mdash; whose returns have got compromised post recent regulatory changes, to liquid + fund categories (such as low-duration, ulta ST funds) which offer similar risk-return as liquid funds</li>
                        <li><strong>Consider some medium-risk investment options:&nbsp;</strong>specifically for your longer-term investment goals and if you are an unlisted family-run firm that can afford some MTM volatility risk</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>I already have my financial goals in place. What are you offering that is different?</AccordionTrigger>
                    <AccordionContent>
                        <p>All corporate&rsquo;s will already have their fund requirements planned and it may appear that our goal planning offers nothing much incrementally from what you are currently doing. The main benefits of our financial goal planning services for corporates includes:</p>
                        <ul>
                        <li><strong>Clearly documented goals:&nbsp;</strong>with fund requirements, investment horizons and risk-tolerance at a goal level</li>
                        <li><strong>Immediate visibility of funding against each goal:&nbsp;</strong>with customised reports to provide you complete clarity on how much you have invested against each bucket</li>
                        <li><strong>Goal-level investment options:&nbsp;</strong>since each goal differs in time-horizons and risk-tolerance, this helps us optimise the selection of funds for each specific goal</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>What is a board-approveable investment plan?</AccordionTrigger>
                    <AccordionContent>
                        <p>While not strictly required (especially for smaller companies), it is recommended that all corporates (big or small) have a clearly defined investment plan that spells out the risk-appetite, core goals and allowed investment options for the corporate treasury. This plan should ideally be approved by the board (or top management), which helps provide clarity for all future investments and helps avoid too much discretion allowed at the finance level.&nbsp;&nbsp;</p>
                        <p>Investment plans are dynamic, and any desired changes can always be incorporated at a future date.&nbsp;</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>My Bank does not provide funding lines against debt MFs?</AccordionTrigger>
                    <AccordionContent>
                        <p>Since banks wish to push their own product, they will typically first respond in the negative when you ask about replacing bank FDs with debt MFs. However, in our experience, once pushed on the same almost all banks do allow you to substitute bank FD&rsquo;s with low-risk debt funds.&nbsp;</p>
                        <p>The benefit to you is the virtual elimination of taxes on investments against your funding lines.&nbsp;</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger>What are your charges for corporate advisory services?</AccordionTrigger>
                    <AccordionContent>
                        <p>We charge a percentage of the Asset under Advice (AuA). The specific charges are dependent on the portfolio size, level of engagement and other factors. We are confident that our ability to increase risk-adjusted returns on your portfolio, more than make up for our charges. </p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                    <AccordionTrigger>Investment Restrictions due to Regulatory or other reasons (such as DPIIT sec 80 IAC)</AccordionTrigger>
                    <AccordionContent>
                    <p>It is important for companies to be aware about any regulatory or compliance reasons, that could prevent certain classes of investments. One important such restriction is for companies that are registered with the DPIIT for tax-exemptions under the start-up scheme, which does prevent a very large number of common investment securities used by corporates. </p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            </Section>

        </div>


    )
};