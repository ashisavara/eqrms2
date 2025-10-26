import Section from "@/components/uiComponents/section";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import YouTube from "@/components/uiComponents/youtube";
import PageTitle from "@/components/uiComponents/page-title";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AlertBox from "@/components/uiBlocks/AlertBox";
import HeadlineTextBox from "@/components/uiComponents/headline-text-box";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function PmsAifPage() {
    return (
        <div>
            <PageTitle 
                title="International Investing" 
                caption="Discover the benefits of overseas investing and the benefits of investing via Singapore" 
            />
            <h2>The Benefits of International Investing</h2>
            <Section>
               <HeadlineTextBox headline="Economy & Currency Diversification">
                    <p>Regardless of how diversified your fund portfolio is in terms of categories, it can still have a 100% concentration to growth of a single economy (Level 4). There are many factors (wars, geopolitical, political, currency) that can have a large adverse impact on a single economy. Adding geographical diversification to your portfolio, helps reduce market & currency risk. </p>
               </HeadlineTextBox>
               <HeadlineTextBox headline="Exposure to Global Trends">
                    <p>The are various attractive trends plays out globally (such as AI, Cloud Softwares, EV etc.) which you cannot get exposures to via Indian listed companies. International investing allows you to build specific exposures to such attractive global trends.</p>
               </HeadlineTextBox>
               <HeadlineTextBox headline="More Investment Options">
                    <p>Investing is the art of balancing growth, quality & valuations. Each global market trades at different valuations, based on respective growth outlooks. Investing overseas opens up a range of more attractively valued markets or markets/specific themes with a higher growth potential.</p>
               </HeadlineTextBox>
            </Section>
            <h2>Invest in International Assets via a Singapore Advisory Platform</h2>
            <Section>
                <p>IME Capital has a strategic partnership with Kristal (a Monetary Authority of Singapore (MAS)-regulated Singapore Advisory platform), that provides investors with a platform to access the full-bouquet of international investing options. You continue to deal with your trusted IME Capital RM for all account opening, execution & advisory requirements, while being able to access international markets via a Singapore based platform.</p>

            <p>While India-based feeder funds are our recommended option for most Resident Indians to gain international exposure, investing via the Singapore-based Kristal platform, has a number of benefits for investors including</p>
            <AlertBox color="green" heading="Benefits of Investing via Singapore">
                <ul>
                    <li> <b>Assets held legally outside India:</b> (helps build overseas assets to protect against capital control or political risk in the future)</li>
                    <li> <b>Open to Foriegn Nationals:</b> The platform is open for foreign nationals of all countries (ex-US and FATF Black-listed countries)</li>
                    <li> <b>Tax-friendly Jurisdiction: </b>For NRI's, investing via India-feeder funds would lead to tax implications in India. While the impact of this is eliminated typically by double taxation avoidance treaties, investing via Singapore helps avoid taxation of global investments in India (especially valuable for those resident in countries with zero-capital gains tax or without double tax avoidance treaties with India)</li>
                    <li> <b>Protection against estate-duty (or inheritance tax risk): </b>by investing via funds domiciled out of tax-friendly jurisdictions</li>
                    <li><b>Wide Range of Investment Options: </b> including MFs, ETFs, Institutional Funds, Bonds, Structured Products & more</li>
                </ul>
            </AlertBox>
            </Section>
            <h2>FAQs on International Investing via Kristal</h2>
            <Section>
                <h3>About Kristal</h3>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is the background of Kristal?</AccordionTrigger>
                        <AccordionContent>
                            <p>Kristal was founded in 2016, and has achieved strong scale in a short period of time. As of Apr-23, Kristal managed over $1.2 bn in assets, across over 50,000 users and with over 190 employees across Singapore, HK, India & Dubai. It’s leadership team comprises senior professional from various Fortune 500 companies and it’s investment committee comes in with over 150 years of investing experience. Kristal has been funded by marque private equity investors, including Chirate Ventures (the founder of which is also on the Board of Directors of Kristal).</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>What is the Kristal Platform?</AccordionTrigger>
                        <AccordionContent>
                            <p>Kristal is a Monetary Authority of Singapore Regulated Fund Manager, that has developed a sophisticated investing platform that provides investors with access to a large suite of global investment products (including ETFs, MFs, Institutional Funds, Alternatives, Bonds and others). </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is Kristal Licensed & Regulated?</AccordionTrigger>
                        <AccordionContent>
                            <p>Kristal Advisors (SG) Pte Ltd is regulated and licensed by the Monetary Authority of Singapore (MAS) to provide Advisory and Investment Management Services under the Capital Markets Services Licence (CMSL). </p>
                            <p>Kristal Advisors (HK) Limited is regulated and licensed by the Securities and Futures Commission (SFC) to provide Advisory and Investment Management Services under the Type 4 and Type 9 license categories.</p>
                            <p>Kristal Advisors Private Limited is regulated and licensed by the Securities and Exchange Board of India (SEBI) to provide Advisory services under the Registered Investment Advisor (RIA) license.</p>
                            <p>MAS & SFC are the Singapore & Hong Kong equivalents of SEC in the US & SEBI in India.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Who are the founders of Kristal?</AccordionTrigger>
                        <AccordionContent>
                            <p>Asheesh Chanda and Vineeth Narasimhan are the founders of Kristal. </p>
                            <p>Asheesh Chanda, the CEO, is a post-graduate from IIM Bangalore 2002 batch and a Computer Science Engineer from IIT Delhi 2000. He has more than 15 years of experience in the financial industry including 8 years at JPMorgan and 2 years at a Singapore-based hedge fund which he started.</p>
                            <p>Vineeth Narasimhan, CTO and Co-Founder, is a Computer Science Engineering graduate from IIT Delhi 2000 and a Gold Medallist from IIM Kolkata in 2003. He comes with 14+ years of experience in Product Management in Mobile, Cloud, Analytics. He has helped build MaaS360 into a leading Enterprise Mobility Management solution which was acquired by IBM Security in 2013.   
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>What is the nature of IME Capital & Kristal's Partnership?</AccordionTrigger>
                        <AccordionContent>
                            <p>IME Capital has a Strategic tie-up with Kristal, to provide it’s clients access to a wide range of global investment solutions. IME Capital operates as a registered channel partner for Kristal, fully compliant with Singapore & Indian regulations. </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>Are my funds safe with Kristal? What happens if Kristal were to shut down?</AccordionTrigger>
                        <AccordionContent>
                            <p>Kristal.AI is regulated by MAS, thus there will be a MAS approved liquidator in place. In the unlikely event, anything happens to Kristal.AI, MAS will ensure that all assets are sold and the proceeds will be returned to the registered client.</p>
                            <p>Moreover, All client cash is held in trust in a segregated and ring-fenced account with DBS. This account is distinguished and maintained separately from any other account in which Kristal deposits its own monies. DBS cannot, in any way whatsoever, exercise any right of set-off against the monies in this account for any debt owed by Kristal.</p>
                            <p>All client investments are held with regulated custodians in either unique client accounts or in Kristal’s name held on behalf of the clients. The custodians that Kristal work with are the custodians for Interactive brokers, Saxo and All funds.</p>
                            <p>Under MAS Regulations, </p>
                            <p>“The FMC should ensure an orderly winding down of its business prior to cessation. This includes but is not limited to: (i) putting in place communication plans to ensure sufficient notice period has been given to its customers, business partners and other relevant stakeholders regarding its cessation; and (ii) discharging all customer obligations and ensuring that customer assets and/or moneys have been accounted for and returned to customers before it ceases.</p>
                            <p>The FMC should also ensure that all funds and managed accounts managed or advised by the FMC have been (i) transferred to another fund management company; and/or (ii) liquidated and all underlying assets and moneys returned to their beneficial owners or customers.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Section>


            <Section>
                <h3>Investment Options</h3>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What investment options are available on Kristal?</AccordionTrigger>
                        <AccordionContent>
                            <p>Kristal has an exhaustive listing of global ETF’s. These ETF’s can provide investors very specific exposures on specific themes, geographies or investment styles (based on the investors requirements). For Accredited Investors, a wider range of investment options that include Mutual Funds, Institutional Funds, Alternatives & Direct Stocks open up on the platform.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>How can I invest in Institutional Funds with lower minimum investment requirements?</AccordionTrigger>
                        <AccordionContent>
                            <p>Many of the more successful institutional funds (especially in the unlisted & alternatives space), have very large minimum investment sizes (sometimes running into millions of dollars). This makes these funds inaccessible to most investors. Kristal provides access to such specialised funds to accredited investors, at a fraction of the minimum investment value (as low as $25,000), by making the investment in their own name & then sub-dividing this investment into the various investors that have made the investment (via their omni-bus structure, that is regulated by MAS Singapore).</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Is Kristal Licensed & Regulated?</AccordionTrigger>
                        <AccordionContent>
                            <p>Kristal Advisors (SG) Pte Ltd is regulated and licensed by the Monetary Authority of Singapore (MAS) to provide Advisory and Investment Management Services under the Capital Markets Services Licence (CMSL). </p>
                            <p>Kristal Advisors (HK) Limited is regulated and licensed by the Securities and Futures Commission (SFC) to provide Advisory and Investment Management Services under the Type 4 and Type 9 license categories.</p>
                            <p>Kristal Advisors Private Limited is regulated and licensed by the Securities and Exchange Board of India (SEBI) to provide Advisory services under the Registered Investment Advisor (RIA) license.</p>
                            <p>MAS & SFC are the Singapore & Hong Kong equivalents of SEC in the US & SEBI in India.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Who are the founders of Kristal?</AccordionTrigger>
                        <AccordionContent>
                            <p>Asheesh Chanda and Vineeth Narasimhan are the founders of Kristal. </p>
                            <p>Asheesh Chanda, the CEO, is a post-graduate from IIM Bangalore 2002 batch and a Computer Science Engineer from IIT Delhi 2000. He has more than 15 years of experience in the financial industry including 8 years at JPMorgan and 2 years at a Singapore-based hedge fund which he started.</p>
                            <p>Vineeth Narasimhan, CTO and Co-Founder, is a Computer Science Engineering graduate from IIT Delhi 2000 and a Gold Medallist from IIM Kolkata in 2003. He comes with 14+ years of experience in Product Management in Mobile, Cloud, Analytics. He has helped build MaaS360 into a leading Enterprise Mobility Management solution which was acquired by IBM Security in 2013.   
                            </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>What are the requirements to be classified as an Accredited Investor?</AccordionTrigger>
                        <AccordionContent>
                            <p>For an individual investor to be classified as an Accredited Investor, investors need to sign the ‘Accredited Investor Opt-In Agreement’ and meet ANY of the following criteria:</p>

                            <p>Annual income in the preceding year is greater than 300,000 Singapore Dollars OR</p>
                            <ul>
                                <li> Net Financial Assets greater than 1 Million Singapore Dollars OR</li>
                                <li>Net Personal Assets greater than 2 Million Singapore Dollars (of which the net equity of primary residence is capped at SGD $1 mn)</li>
                                <li>In case of individual who is also a Karta of an HUF, the income/assets of the HUF can be accepted as that of the individual.</li>
                            </ul>
                            <p>The acceptable proofs for individuals include:</p>
                            <ul>
                                <li>Annual Income: Salary slip (for last 12 months), Bank statement showing salary credit (last 12 months), company letter indicating annual compensation (not more than 3 months old), last filed Tax Return</li>
                                <li>Financial Networth: Bank or Broker holdings statement (value needs to be included) | For privately held shares, proof of ownership including valuation certificate of company</li>
                                <li>For Property & Other Assets: Valuation certificate (not more than 3 months old) issued by a recognised valuer</li>
                            </ul>
                            <p>Greater details on <a href="https://kristalai.zendesk.com/hc/en-us/articles/360020160997-Who-is-an-Accredited-Investor-" className="blue-hyperlink">Accredited Investor requirements</a>  on the Kristal Platform. </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>Can you set up SIPs (Systematic Investment Plans)?</AccordionTrigger>
                        <AccordionContent>
                            <p>SIP’s can be set-up for ETFs by selecting ‘SIP’ as the order type while placing an order. An OTP will be sent to your email/phone to authorise the SIP. The frequency can be decided by you, whether it is weekly, or monthly.</p>
                            <p>The deduction will be deducted from the ‘Available Cash’ portion in your Kristal account on a periodic basis. Hence, you will have to maintain sufficient funds on the SIP date for it to successfully go through!</p>
                            <p>You can cancel a SIP that you have set-up at anytime, via the SIP/SWP section in Portfolio. </p>
                            <p>You can educate yourself with the funding instructions for the subscription, by just clicking on the hyperlink in the popup. </p>
                            <p>Please Note: In case of multiple SIPs from the same account scheduled on the same date, it is possible that a few might fail, with the SIP order placed last having the highest probability of failure.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Section>


            <Section>
                <h3>Who can Invest?</h3>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What types of Investors can invest via IME International Solutions?</AccordionTrigger>
                        <AccordionContent>
                            <p>Individual & Non-Individual Investors from all countries (with the exception of the US), can invest on the Kristal platform. </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>Can joint accounts be opened?</AccordionTrigger>
                        <AccordionContent>
                            <p>Yes, Kristal does support the opening of joint accounts.</p>
                            <ul>
                                <li><strong>Mode of Holding:&nbsp;</strong>Joint Accounts can be opened at Kristal in an&nbsp;<strong>Either or Survivor mode</strong>. In case of the unfortunate demise of one of the account holders, the other joint holder can continue to operate the account.&nbsp;</li>
                                <li><strong>Process to open a joint account:&nbsp;</strong>In order to open a joint account, individual accounts for each of the joint holders needs to be first set up, and then an email can be sent to Kristal indicating who will be the Primary &amp; Secondary holder. An addendum will then be sent by Kristal to the clients, which require to be e-signed in order for the joint account to be opened.&nbsp;</li>
                                <li><strong>Asset Ownership:&nbsp;</strong>In case of Joint Accounts, asset ownership proportion is usually determined by the proportion of funds sent or specific arrangements/Disclosure made by the Joint holders (for example, when they file their taxes or make submissions to the authorised bodies.). Certain CA&rsquo;s prefer to show the primary account holder as the owner of the assets.</li>
                                <li><strong>Withdrawal:&nbsp;</strong>Funds can be withdrawn to a bank account in either of the clients name OR in the joint name.&nbsp;</li>
                                <li><strong>Funding the Account:&nbsp;</strong>Either of the holders can fund the joint account they have at Kristal.&nbsp;</li>
                                <li><strong>Accredited Status of Joint Account:&nbsp;</strong>The Joint Account can be treated as an Accredited Investor if at least one joint holder meets the Accredited Investor criteria. For the Joint Account to be considered an AI, the controller of the Joint Account necessarily needs to be an AI.&nbsp;</li>
                                <li><strong>Controller of the Joint Account:&nbsp;</strong>At the time of creation of the Joint Account, one of the holders needs to be designated as the controller of the joint account. The controller will get access to transact on the Joint Account via his/her Kristal log-in, and all OTP/authorisation emails etc will go to the controllers mobile/email ids for approval. It is the responsibility of the controller of the account to manage consensus, only execute trades post getting consensus from other joint holders etc.&nbsp;</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can minors invest?</AccordionTrigger>
                        <AccordionContent>
                            <p>Kristal.ai is able to accept minors who have a joint account with a legal guardian and a primary account holder. It is a mandatory requirement for all 3, the Primary Holder, Secondary Holder (minor) and the Guardian, to have completed the KYC process to be onboarded onto the platform.</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Section>


            <Section>
                <h3>Account Opening</h3>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What documents are required to open an account?</AccordionTrigger>
                        <AccordionContent>
                            <p>The documents required for completing the Kristal.AI application process is based on your country of residence. All clients are required to produce some basic information as per their country’s KYC standards. In terms of documetns required</p>
                            <p><b>Singapore residents</b> can provide their IC/FIN and authorise Kristal.AI to extract the required information from MyInfo (Government controlled database). This process will allow you to complete your KYC within minutes.</p>
                            <p><b>India residents</b> need to provide their Date of Birth and relevant identifier ID (e.g. PAN) and authorise us to extract the required information from CKYC (Centralised KYC database). And, the latest address proof (within 3 months).</p>
                            <p><b>In other jurisdictions</b>, we require investors to submit soft copies of the following documents: ID proof (Passport / National ID) & Latest Address proof (Bank Statement / Utility Bill).</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does it take for my acount to be activated?</AccordionTrigger>
                        <AccordionContent>
                            <p>Once you have completed the KYC process, the Compliance Team will verify and approve your account in 2 working days. You will receive an e-mail notification stating that your account is ready for funding. All you now have to do is add funds to your account and start investing in the Kristal of your choice!</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Section>

            <Section>
                <h3>Funding your Account</h3>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How do I fund my Investment Account?</AccordionTrigger>
                        <AccordionContent>
                            <p>The Bank account details are dependent on the remitting country. Bank Account details for transfer from <a href="https://help.kristal.ai/hc/en-us/article_attachments/5053756102545/Transfer_Details_for_funding_from_Bank_in_India.pdf" target="_blank" className="blue-hyperlink">India</a>, <a href="https://help.kristal.ai/hc/en-us/article_attachments/5053749571473/Transfer_Details_for_funding_from_Bank_in_Singapore.pdf" target="_blank" className="blue-hyperlink">Singapore</a>, <a href="https://help.kristal.ai/hc/en-us/article_attachments/13902713061521/Transfer_Details_for_funding_from_a_bank_in_Hongkong.docx" target="_blank" className="blue-hyperlink">Hong Kong</a>, or <a href="https://help.kristal.ai/hc/en-us/article_attachments/5053861447825/Transfer_Details_for_funding_from_Bank_in_any_Other_Country.pdf" target="_blank" className="blue-hyperlink">Other Countries</a>. Please note, Resident Indian investors will need to provide their bank an LRS declaration along with the transfer request. Once a fund transfer is initiated, it can take between 2-5 business days for the amount to reflect in the client’s account. </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                        Where does my money/investments lie when I invest via the Kristal platform?</AccordionTrigger>
                        <AccordionContent>
                            Kristal is an advisory platform, that facilitates investments in ETFs, stocks, Mutual Funds, Institutional Funds, Bonds, Private Equity Deals amongst others. The custodian of the underlying investments vary based on the type of investments
                            <ul>
                                <li><b>Cash Holdings:</b> DBS Singapore</li>
                                <li><b>ETFs, Stocks and other Exchange-traded products:</b> Interactive Brokers, SAXO</li>
                                <li><b>Funds:</b> Direct (custody with DBS), Others (All Funds)</li>
                                <li><b>Private Markets</b> ROC (depending on the jurisdiction)</li>
                            </ul>
                            <p>Exchange traded assets are held in a Client Segregated Numbered Account (this ac number is visible to the Client).</p> 
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger>How does the LRS Route Work?</AccordionTrigger>
                        <AccordionContent>
                            <p>Under the LRS (Liberalised Remittance Scheme), all resident individuals (including minors) are allowed to freely remit upto $250,000 in any Financial year for any premissible capital/current account transaction. This scheme applies to each individual seperately, so technically a family of 4 can remit upto $ 1mn in a financial year. </p>
                            <p>All banks have a form that requires to be filled while transferring money overseas, which typically includes the purpose of the remittance & the sum of past remittances in the previous year. </p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger>Tax Implications for overseas investments for Resdent Indians?</AccordionTrigger>
                        <AccordionContent>
                        <p>All residents of India have to declare holdings of overseas assets (if any) as part of their annual tax filing. The format is prescribed in the relevant sections of the IT Act. Kristal provides the relevant information to Clients for their filing. Kristal can refer Clients to a CA should they need any advice or services in this regard.</p>

                        <p><b>Long-term capital gains (for holdings more than 24 months)</b> are taxed at 12.5%.</p>

                        <p><b>For holdings less than 24 months,</b> gains made on overseas equity stocks will be taxed at 20%, while gains on all other overseas assets will be taxed at your slab rate.</p>                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger>What are the fees that are charged by Kristal Platform?</AccordionTrigger>
                        <AccordionContent>
                        <p>Kristal charges an advisory fee for it’s services (billed as a % of AUM).Other fees & charges include Safe-Keeping/Custody Fees, Transaction fees and Bank Charges (for bank transfers, forex conversion etc.). Kristal’s bank charges $7.5 for inward transfers, and $50 per transfer for withdrawals.</p>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                        <AccordionTrigger>How do I withdraw funds?</AccordionTrigger>
                        <AccordionContent>
                        <p>In order to withdraw funds, you need to first redeem your investments and make sure that the money is reflecting in ‘Available Cash’. </p>
                        <p>For first-time withdrawals, you need to upload bank proof (cheque, bank statement) to prove that the bank account is held in your own name (3rd party transfers not allowed) and that the account details are correct. It takes upto 1 day for Kristal to approve the bank proof provided. </p>
                        <p>Once an approved bank is made available, a withdrawal request can be placed simply online via the Funds Transfer section. </p>
                        <p>It can take upto 4 working days for the amount to be credited to your bank account (depending on your bank account processing times). </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Section>



        </div>
    );
}