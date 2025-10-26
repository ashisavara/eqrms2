import Section from "@/components/uiComponents/section";
import ImageTextBox from "@/components/uiComponents/image-text-box";
import YouTube from "@/components/uiComponents/youtube";
import PageTitle from "@/components/uiComponents/page-title";
import SectionTextHighlight from "@/components/uiComponents/section-text-highlight";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RMSPage() {
    return (
        <div>
            <PageTitle 
                title="Mutual Funds @IME" 
                caption="Seamless investments in Mutual Funds, via a robust, secure & scalabable online platform. " 
            />
            <Section>
            <p>Mutual Funds are amongst the most popular investment options, due to their relative ease of operations, tax-efficiency, ease of creating systematic transactions and low initial entry sizes. At IME, investors are offered the entire range of Mutual Fund options, via an easy-to-use, seamless online transacting experience.</p>
            </Section>
            <h2>Fully-Managed Online Execution platform</h2>
            <Section>
                <p>We offer a seamless, online execution experience for investors, via our strategic partnership with Fundzbazar (India’s leading online MF investment platform). We have chosen Fundzbazar based on the the robustness of their platform (over 2,00,000 cr in AUM) and their excellence in terms of the customer experience.</p>
                <p>Unlike other online platforms, we offer investor’s a completely managed solution. All investments, redemptions or systematic transactions are set-up at our end based on your discussions with your RM. You simply need to authorise these pre set-up transactions at your end.</p>
                <p>You gain all the benefits of the substantial ease & convinience of an online platform, with the dedicated & personalised service of a trusted advisor on a single platform. </p>
            </Section>
            <h2>Robust Process for Fund Selection</h2>
            <Section>
                <p>With over 40 AMC’s (Asset Management Companies) and thousands of schemes to choose from, selecting the right fund in any given catgeory can be a major challenge for investors. At IME Capital, we have a rigorous fund selection process that is based on global best-practices to select the best funds in terms of longer-term risk-adjusted returns. </p>
                <p>We follow a multi-step selection process, that starts with first identifying the AMC’s that are the best suited for specific categories of funds, and then doing a deep dive into the longer-term performance track record of the fund, the fund manager & the level of focus on the same. </p>
                <p>You can learn more about our fund selection criteria at <span className="blue-hyperlink"> <Link href="/blogs/ime-fund-selection-methodology"> IME MF Selection Criteria. </Link></span></p>
                <p>We only recommend funds from 10 of the 40+ AMC’s in India. Discover more about how we identify the right AMC’s for specific categories of funds at <span className="blue-hyperlink"> <Link href="/blogs/mf-amc-reviews-ratings"> MF AMC Review & Ratings. </Link></span></p>  
            </Section>
        </div>
    );
}