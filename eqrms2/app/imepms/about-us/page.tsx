import AlertBox from "@/components/uiBlocks/AlertBox";
import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";

export default function ImeAboutUsPage() {
    return (
        <div>
            <RmsPageTitle 
                title="About Us" 
                caption="Background of IME PMS and our Team" 
            />


        <Section>
            <h2>About IME PMS</h2>
            <ul>
            <li>IME Portfolio Managers (IME PMS) was founded in 2025 by Ashi Anand</li>
<li>Ashi Anand comes with 20+ years of fund management experience at ICICI Pru AMC, Kotak AMC, Allegro Capital Advisors and Valcreate Investment Managers LLP</li>
<li>IME PMS follows a strong fundamental investment approach (driven by the IME Twin-Engine Investment Framework), with industry leading investment processes & documentation</li>
<li>IME Digital Disruption and IME Concentrated Microtrends were earlier managed by Ashi Anand at Valcreate Investment Managers from 10-Feb-23 to 30-Sep-25. </li>
<li>IME Portfolio Managers obtained it’s SEBI PMS license on 1st July 2025, post which all clients & AUM under IME-branded strategies at Valcreate Investment Managers LLP were transitioned to IME Portfolio Managers LLP in Oct-25</li>
</ul>

<h2 className="mt-12">Background of Ashi Anand - CIO </h2>
<p className="font-bold">A seasoned fund manager with 20+ years of fund management experience at ICICI Pru AMC, Kotak AMC, Allegro Capital Advisors and Valcreate Investment Managers</p>
<p className="font-bold">Ashi's investment experience includes:</p>
<ul>
    <li><b>Fund Manager - ICICI Pru PMS (Jul-03 to Jul-07):</b> Fund Manager Deep Value strategy, Structured Pdt Development</li>
    <li><b>Fund Manager - Kotak (Sep-07 to Mar-15):</b> Fund Manager Kotak India Focus fund (quasi-private equity FII structure)</li>
    <li><b>Research Management Solution (Apr-15 to Mar-17):</b> Proprietary RMS for FM's (base of the IME RMS)</li>
    <li><b>Fund Manager - Allegro Capital (Mar-17 to Oct-20):</b> PMS Head, Fund Manager - Healthcare & High Growth strategies</li>
    <li><b>Fund Manager - Valcreate Investment Managers (Feb-03 to Sep-25):</b> CIO - IME Strategies (IME Digital Disruption, IME Concentrated Microtrends)</li>
</ul>
<p>Ashi is an MBA-Finance from XIM-B & a BSc (Mathematics) from St. Xaviers, Mumbai.</p>
<AlertBox color="blue" heading="Performance Track Record">
    <div>
<img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ashi-track-record.png" alt="Ashi Performance Track Record"/>
<ul>
    <li><b>Consistent outperformance over 2 decades:</b> Ashi has outperformed benchmarks across all funds managed over 2 decades of investing, across a wide range of investment strategies & market conditions.</li>
    <li><b>Deep Value (#3 out of 127 funds):</b> Deep Value Strategy delivered a <b>63% CAGR</b> over Jul-03 to Jul-07, making it the 3rd best fund in performance during one of India's biggest bull markets.</li>
    <li><b>Allegro Healthcare (one of India's best performing funds over 2017-20):</b> Allegro Healthcare delivered a <b>17% IRR</b> over Jun-17 to Oct-20 (vs <b>4.5% for BSE-500</b>), a period where most actively managed funds struggled to beat the markets due to the small & mid-cap collapse.</li>
    <li><b>Valcreate IME Digital Disruption (#4 out of 379 PMS schemes):</b> With a <b>130% absolute gain</b> in ~2.5 years, the fund was in the <b>top 1% of PMS schemes</b> in the country. The fund was launched at a time to the deep distress in the tech space (both in India & globally), a strong aggressive contra-call that paid off substantially.</li>
</ul>
</div>
</AlertBox>


<h2 className="mt-12">Past Background - Continuation of strategies run previously at Valcreate PMS</h2>
<p>IME Concentrated Microtrends and IME Digital Disruption were managed under Valcreate Investment Managers LLP from 10 Feb 2023 to 30 Sep 2025, after which
all existing investors and AUM were migrated to IME Portfolio Managers LLP effective 1 Oct 2025. The strategies continue to be run by the same investment team
with the same philosophy, research process, and risk framework.</p>
<p>Performance shown combines HDFC Fund Accounting-verified & SEBI-reported performance under Valcreate with HDFC Fund Accounting-verified & SEBI-reported
NAV performance under IME Portfolio Managers, with the earlier NAV series extended using the ROR of post-migration NAVs to reflect continuity of the same
underlying strategy.</p>
<p>This representation is only for continuity of the strategy and does not constitute a regulatory/audited performance record of IME Portfolio Managers LLP prior to 1
Oct 2025. The official performance record of IME Portfolio Managers LLP begins 1 Oct 2025.</p>
<div className="flex justify-center"><img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/valcreate-performance.png" alt="Ashi Performance Track Record"/></div>


    
        </Section>

       

        </div>
    )
}