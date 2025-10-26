import Section from "@/components/uiComponents/section";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import YouTube from "@/components/uiComponents/youtube";
import PageTitle from "@/components/uiComponents/page-title";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AlertBox from "@/components/uiBlocks/AlertBox";

export default function PmsAifPage() {
    return (
        <div>
            <PageTitle 
                title="PMS and AIFs @IME" 
                caption="Discover what makes our understanding of PMS & AIF’s, unparalleled in the industry.  " 
            />
            <Section>
                <AlertBox color="blue" heading="Our founder's extensive Alternative Investing Experience">
                    <p>Our founders (Ashi Anand) extensive experience in India’s alternatives industry, and his personal involvement in PMS & AIF fund selection provide us some unique advantages in PMS/AIF fund selection that no other firms can compete with</p>
                    <p>His fund management experience has been exclusively in alternative funds (PMS/AIF-type structures) from as early as 2003 (the early origins of the alternatives industry in India). He has a deep understanding of more complex investment options, being responsible for launching India’s first institutional capital preservation and capital guaranteed funds (2003-04)</p>
                    <p>As a firm, we accordingly benefit from unique insider perspectives of how PMS & AIF funds truly operate, as compared to the common outsiders perspective (i.e. advisors & wealth managers). We also have a much deeper understanding of the global-best practices of AMC & fund selection processes & methodologies</p>
                </AlertBox>
            </Section>
            <h2>The most rigorous analysis of PMS/AIF's in India</h2>
            <Section>
                <p>Unlike most other PMS platforms in the market, our fund selection criteria goes well beyond simply analysing historical returns. We instead choose to focus on analysing the foundations of the AMC & specific strategies, to identify what PMS/AIFs are best placed to deliver superior long-term risk-adjusted returns. </p>
                <p>Our selection criteria are publicly available on our blog posts - <span className="blue-hyperlink"> <Link href="/blogs/ime-pms-amc-selection-criteria"> IME PMS AMC Selection Criteria. </Link></span> & <span className="blue-hyperlink"> <Link href="/blogs/ime-pms-scheme-selection-criteria"> IME PMS Scheme Selection Criteria. </Link></span></p>
                <p>IME’s 5-star rating system for AMC’s, is much more stringent than typical rating systems. The aim is to ensure that we only recommend the absolute best-in-class PMS providers to our investors. </p>
            </Section>
        </div>
    );
}