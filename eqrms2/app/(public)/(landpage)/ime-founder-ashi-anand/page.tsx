import Section from "@/components/uiComponents/section";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/uiBlocks/AlertBox";
import PageTitle from "@/components/uiComponents/page-title";
import TeamProfileBox from "@/components/uiComponents/team-profile-box";

export default function IMEFounderAshiAnandPage() {
    return (
        <div>
            <PageTitle 
                title="IME's Founder - Ashi Anand" 
             
            />

            <Section> 
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ashi-profile.jpg"
                name="Ashi Anand"
                designation="Founder & CEO"
            >
                <p>IME was founded by Ashi Anand – in his career of over 20 years as a fund manager, Ashi found structural flaws in the workings of the wealth management industry. He used his experience, knowledge and instinct to found IME Capital – a firm free of conventional restraints; one that focuses on research, expertise and innovation, and can do this with integrity.</p>
                <p>Ashi spent 2 decades managing funds and investments for large firms like ICICI Prudential and Kotak Mahindra. Among his accomplishments are the fact that he was one of the youngest fund managers of his time, which helped him gain years of insight and experience.</p>
            </TeamProfileBox>

                <p>At ICICI Pru PMS, Ashi was an indispensable member of a 4 person team that took the PMS firm from 40 crores to 5000 crores. The fund he was managing (ICICI Pru Deep Value Portfolio) was ranked 3rd amongst over 127 funds in terms of performance over the period he was the manager, making him one of the most sought after Fund managers almost as soon as he started his career.</p>

                <p>Ashi has been part of the alternatives investing industry since 2002 (a time when the PMS industry was just forming) and been responsible for designing & launching a number of innovative structured products (including India's first institutional arbitrage fund, first capital protection fund and the first capital guaranteed product in India launched by an AMC).</p>

                <p>At Kotak, Ashi managed one of India's first quasi-private equity strategies (taking a private equity approach towards investing in listed equities) managed under Kotak's International FII structure. This gave Ashi direct exposure to dealing with international institutional investors and using overseas trust structures for investing in India.</p>

                <p>Ashi's other accomplishments include managing one of the best performing healthcare strategies in India while at Allegro and having designed from scratch a highly innovative & disruptive Research Management Solution (RMS) to help manage investment insights for Asset Management firms (the bedrock of IME's RMS).</p>
                <h2>Ashi - Performance Track Record</h2>
                <div className="p-12 border border-gray-200 rounded-lg">
                <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/Ashi%20Anand%20Performance%20TrackRecord.jpeg" alt="Ashi - Performance Track Record" />
                </div>

                <AlertBox color="blue" heading="Performance highlights">
                    <ul>
                    <li> Consistent outperformance across 2 decades (across different AMCs, fund strategies & market conditions)</li>
                    <li>ICICI Pru PMS Deep Value  (#3 out of 127 funds)</li>
                    <li>Allegro Healthcare (strong outperformance when most PMS firms struggled to perform)</li>
                    <li>Valcreate IME Digital Disruption (#4 out of 379 PMS schemes)</li>
                    <li>Responsible for the launch of India's first Arbitrage Fund (2003) & Capital Guaranteed Fund - CPPI (2004)</li>
                    </ul>
                </AlertBox>

                <AlertBox color="gray" heading="Founders Note">
                    <div className="text-sm">
                    <p>For me, investments have always been my passion, more than a job. It has never been the money that the profession offers, but the sheer joy of studying the interactions between economics, trends, sectors & companies and how it relates to investments that has been the driving force through my professional journey. For someone who loves dealing with ever-changing information, numbers and analysis, I feel truly lucky to be able to work in a field that challenges, excites and rewards me.</p>

                    <p>While the nuances of institutional investing are truly complex, at its core, investing is actually very simple. Equity gives you part ownership of a business, and your wealth grows as these businesses grow. Debt gives you a more assured return, but can never match the return potential of business ownership. While there are a wide range of investment categories & structures, each address a specific requirement and it is relatively easy to understand which are the most relevant for you. Basics like this can be understood in less than 30 minutes (as I have attempted to do, in my 25-min course Understanding your Investment Options).</p>

                    <p>Despite how easy the core fundamentals of investing are, it has always surprised me why so many investors seem to have a fear of learning more about investments, and rely so extensively on their relationship managers for managing their hard-earned money. This has allowed the wealth management industry to develop into a sales machine focused on selling the most profitable products (as compared to products that best serve an investor's requirements). This helps explain why so many investors end up losing money in the markets and why some of the worst investment products sell so well.</p>

                    <p>In my experience, if investors are willing to put in the same level of effort to understand some basic fundamentals of investing, as they do when researching which phone or car to buy, the majority of the current "mis-selling" and misunderstanding would disappear leading to happier, wealthier and more informed investors.</p>

                    <p>As someone who is genuinely passionate about the field of investing and who truly takes the fiduciary responsibility of managing someone else's money seriously, the actual workings of the wealth management industry have always bothered me. Founding IME Capital is my way of trying to get the field of wealth management back to its foundational roots – an investment expert that truly puts their client's requirements first.</p>

                    <p>The idea was to build a wealth management firm that puts research & client interests very clearly above sales. I care strongly about investors getting a better & more holistic understanding of what they are investing in before they invest. This is reflected in the substantial effort we have made in our innovative research & educational tools, including IME's Research Management Solution, IME Academy and our innovative financial calculators.</p>

                    <p>Since IME Capital is 100% owned by me, I have no external shareholders to please, allowing me to continue to operate in terms of what is in the best long-term interest of our clients (which in my view is also what is in the best interests for the firm in the long-run).</p>

                    <p>For me, IME Capital is a mission & a passion, and my way of reclaiming the purity of what investments is all about. Above all else, this reality is what allows us to put ethics & client interest truly first, and this is something which I will never allow to change regardless of how big we grow. I hope you give us the opportunity to prove all of this to you.</p>
                    </div>
                    <p>Yours Sincerely,</p>
                    <p className="font-bold"> Ashi Anand</p>
                </AlertBox>
            </Section>
        </div>
    );
}