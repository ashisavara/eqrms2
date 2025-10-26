import Section from "@/components/uiComponents/section";
import PageTitle from "@/components/uiComponents/page-title";
import TextHighlight from "@/components/uiBlocks/TextHighlight";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import AlertBox from "@/components/uiBlocks/AlertBox";
import HeadlineTextBox from "@/components/uiComponents/headline-text-box";
import InfoCard from "@/components/uiBlocks/InfoCard";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import HeroImgTitle from "@/components/uiComponents/hero-img-title";

export default function FamilySolutionsPage() {
    return (
        <div>
            <HeroImgTitle 
                title="NRI/OCI Investment Solutions" 
                caption="Investment Solutions for Overseas Indians"
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/nri-investment-solutions.jpg"
                imgAlt="NRI Investment Solutions"
            />


            <Section className="py-6">
                <TextHighlight>
                    <p>At IME Capital, we understand the challenges faced by Indians living abroad and hence have designed offerings keeping in mind the specific needs of Non-Resident Individuals (NRIs) and others of Indian Origin (PIO/OCI).&nbsp;</p>
                    <p>We are a digitally native firm and have simplified many processes to cater to our international investors &ndash; be it digital onboarding, online execution or remote transactions. With over 30% of our assets coming from NRIs/PIOs/OCIs, we take care of the tiniest nuances, from documentation to execution, thus enabling a hassle-free experience for our investors.</p>
                </TextHighlight>
            </Section>
            <h2>Key Features of IME NRI Investment Solutions</h2>
            

            <Section className="py-6">
               <div className="ime-grid-2col mb-12">
                <InfoCard headline="Access Best Indian Investment Funds">
                    We have tie-ups with the top investment funds in India (including MFs, PMSs and AIFs), and are well versed with which of these are available for NRI/PIO/OCI investors, including investors from specific geographies.
                    </InfoCard>
                    <InfoCard headline="Exhaustive Global Investment Options">
                    Via our Singapore-based advisory structure, we can help you invest in a wide range of international asset classes. These include multi-asset class (equity, debt, hybrid, unlisted, long-short & other alternative funds), multi-geography (specific regions or countries), thematic funds, direct stocks & bonds, to name a few.
                    </InfoCard>
               </div>

               <div className="ime-grid-3col">
                    <InfoCard headline="Dedicated Private Banker">
                    You will be assigned a dedicated private banker, who is skilled in understanding the nuances of NRI investments. Your private banker will not just help you build your investment plan and make suitable investment recommendations, but will also work with you towards the execution of the same.
                    </InfoCard>
                    <InfoCard headline="Tailor-made Solutions">
                    At IME, we customise each client’s investment portfolio, based on their unique requirements (as defined in their investment mandate). There is no one-size-fits-all, or model portfolio approach. We spend time to identify the investment options that are most suitable for you.
                    </InfoCard>
                    <InfoCard headline="Digitally-Native Offerings">
                    At IME, we are built to be digitally first, and we service virtually all our investors (including Resident Indians) purely online. You will be happy to discover that the vast majority of your investments are being executed via a seamless online experience.
                    </InfoCard>

               </div>

            </Section>

            <h2>FAQs on IME NRI/OCI Investment Solutions</h2>

            <Section>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Are there any geographies that you do not service?</AccordionTrigger>
                    <AccordionContent>
                        <p>We offer services to investors across most geographies, with the exception of countries that are in the FATF Black-List. Countries in the FATF Grey-list, may have a more limited set of investment options available to them, and there may be requirements for some additional levels of documentation.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>Are all investment options available to investors across all countries?</AccordionTrigger>
                    <AccordionContent>
                        <p>While most investment options (MFs, PMSs, AIFs, International) are available to investors across countries, each individual fund house can retain discretion over which regions of investors they accept funds from. This is usually not a problem for investors across the vast majority of countries. However, countries/regions that are likely to have more limited access can include USA, Canada and FATF Black/Grey Listed countries.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>
                    I am not a Resident Individual, NRI, OCI or POI holder. Can I still avail of your investment services?</AccordionTrigger>
                    <AccordionContent>
                        <p>Yes, our international investment route via Singapore allows international investors of all nationalities to invest (with the exception of USA and FATF Black-listed countries).</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                    <AccordionTrigger>What products/services can be accessed purely online, without the need for any hard copies/physical presence?</AccordionTrigger>
                    <AccordionContent>
                        <p>As long as your KYC (Know Your Client) is updated in India, you will be able to invest in Indian Mutual Funds, Indian AIFs and our global investment platform with a pure online paperless onboarding & execution experience. It is only PMSs that would still require hard copies to be couriered.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger>My KYC is reflecting older details. How can I update the same?</AccordionTrigger>
                    <AccordionContent>
                        <p>At times, updation of KYC remains a paper-based process. You can connect with an IME Private Banker, who can guide you through the process, collect the required details and prepare a pre-filled KYC form that you would need to submit along with the required documentary proof.</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger>What are the typical documents required for investments?</AccordionTrigger>
                    <AccordionContent>
                        <p>Documents required can change based on specific investment jurisdictions & investment vehicles. For investments made via the international Singapore structure, you would typically need a passport copy, address proof, bank proof and Tax-Identification Number of the country you reside in (please note, some additional documents may be required if you require an accredited investor status). For investments made in Indian funds, a PAN card, Aadhar card and bank proof (either NRE or NRO) would be required in addition to the above documents.</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            </Section>

        </div>


    )
};