import Section from "@/components/uiComponents/section";
import TeamProfileBox from "@/components/uiComponents/team-profile-box";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/uiBlocks/AlertBox";
import Link from "next/link";
import PageTitle from "@/components/uiComponents/page-title";

export default function OurTeamPage() {
    return (
        <div>
            <PageTitle 
                title="Our Team" 
                caption="Learn more about IME's leadership team." 
            />
            <h2>Research</h2>
            <Section className="py-0">
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ashi-profile.jpg"
                name="Ashi Anand"
                designation="Founder & CEO"
            >
                <p>IME was founded by Ashi Anand – in his career of over 20 years as a fund manager, Ashi found structural flaws in the workings of the wealth management industry. He used his experience, knowledge and instinct to found IME Capital – a firm free of conventional restraints; one that focuses on research, expertise and innovation, and can do this with integrity.</p>
                <p>Ashi spent 2 decades managing funds and investments for large firms like ICICI Prudential and Kotak Mahindra. Among his accomplishments are the fact that he was one of the youngest fund managers of his time, which helped him gain years of insight and experience.</p>
                <Button variant="outline">
                    <Link href="/ime-founder-ashi-anand">Read More</Link>
                </Button>
            </TeamProfileBox>
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/anil-sarin-profile.jpg"
                name="Anil Sarin"
                designation="Chief Mentor"
            >
                <p>Anil is the Chief Mentor at IME Capital, guiding best practices in fund selection and equity research. A veteran investor with over 30 years in finance, he has held senior leadership roles across asset management and private investing, including Fund Manager at Birla Mutual Fund, Co-Head of Equities at ICICI Prudential Mutual Fund, Managing Director at Bessemer Venture Partners, and CIO roles at Edelweiss PMS and Centrum PMS. </p>
                <p>Earlier, Anil served as an Infantry officer in the Indian Army and saw active duty with the IPKF in Sri Lanka. He is also a long-time practitioner of Vipassana meditation.</p>
            </TeamProfileBox>
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/aravind-kodipaka-profile.jpeg"
                name="Aravind Kodipaka"
                designation="Senior Analyst"
            >
                <p>Aravind is a Senior Research Analyst at IME. Poised at the intersection between economics and psychology, Aravind busies himself with constantly finding new companies, studying them and analysing them. Prior to joining IME Capital, Aravind was a senior Research Analyst at Allegro PMS. His years as an analyst have helped him gain a wealth of institutional research experience. He is a CFA Charterholder and a BBA-Finance from Flame University.</p>
                <p>As a lifelong learner, Aravind reads voraciously in his free time, and his interest varies from science fiction to cult classics. He also filmed a documentary with a focus on finance which went on to win an award.</p>
            </TeamProfileBox>
            </Section>
            <h2>Business Development</h2>
            <Section className="py-0">
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/Paresh%20Vaish%20Profile.jpg"
                name="Paresh Vaish"
                designation="Strategic Advisor"
            >
                <p>Paresh brings over 30 years of experience in business transformation, delivering measurable results for large and mid-sized clients in India and globally. An alumnus of Harvard Business School (MBA) and Dartmouth College, his career spans finance, strategy, and operations. He co-founded McKinsey’s India practice, advising leading family-owned business groups on long-term transformations. He later led Management Consulting at EY India and served as Managing Partner at Alvarez & Marsal India. As a partner and board member at SFW Capital Partners, he helped identify and evaluate multiple investment opportunities.</p><p> His strategic insight and relationship-building strengths make him a valuable asset in private banking and investment advisory.</p>
            </TeamProfileBox>    
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/maneesh-gupta-profile1.jpeg"
                name="Maneesh Gupta"
                designation="Executive Director"
            >
                <p>Maneesh heads Business Development for Corporate Treasuries and Partnerships at IME Capital. He brings over two decades of experience across banking, finance, and real estate, including leading the valuation business for Colliers International in India. Maneesh has worked extensively across India and SAARC markets, with deep expertise in business expansion, valuation, strategic advisory, and scaling enterprises. He has also co-founded and invested in multiple startups across prop-tech, AI, and food-tech sectors, combining institutional experience with an entrepreneurial mindset to drive long-term partnerships and growth initiatives.</p>
                <p>Maneesh spends his free time reading and/or watching media about modern history – ranging from business to economics and geopolitics, with a global view in general and India in particular.</p>
            </TeamProfileBox>
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/deepak-profile.jpg"
                name="Deepak Jayakumar"
                designation="Executive Director"
            >
                <p>Deepak is a Senior Private Banker at IME Capital. With over 2 decades of experience in Business Development & Entrepreneurship (in IT & Defense), Deepak comes with rich experience of building long-term relationships. His natural instinct and empathy, along with his deep passion for the field of investments, are an ideal combination in his role as a private banker. Deepak is constantly learning, and continues to further his knowledge in the field of investing by following top investors global & local.</p>
                <p>As part of his experience, Deepak has managed key relationships involved with the Chandrayaan-2 and Mangalyaan missions – perfect for a space enthusiast.</p>
            </TeamProfileBox>
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/Srini%20P.jpeg"
                name="Srini Parthasathy"
                designation="Executive Director"
            >
                <p>Srini brings a diverse background spanning sales, financial planning, operations, entrepreneurship, and investing. This breadth of experience enables him to deliver comprehensive, client-specific wealth planning and management solutions. Throughout his career, Srini has maintained a strong client-centric approach, designing personalized strategies aligned with both individual and business financial goals.</p><p> His entrepreneurial mindset, combined with operational depth, allows him to navigate complex financial situations with clarity and precision, positioning him as a trusted advisor for long-term wealth creation and stewardship.</p>
            </TeamProfileBox>
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/Ankita%20Singh.jpeg"
                name="Ankita Singh"
                designation="Vice President"
            >
                <p>Ankita is a seasoned wealth manager with over 12 years of experience. In her role, she focuses on transforming financial futures for individuals, retirees, and corporate treasuries by designing tailored financial strategies.</p><p> At HDFC Securities, she used to manage NRI accounts across APAC and EMEA, overseeing client onboarding, investment advisory, and retention strategies across equity, PMS, AIF, mutual funds, and insurance products. She previously worked at ICICIdirect and Geojit Financial, where she provided equity portfolio management, trade execution, and personalized investment strategies.</p>
            </TeamProfileBox>
            </Section>
            <h2>Communication & Marketing</h2>
            <Section className="py-0">
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/shagun-profile.jpeg"
                name="Shagun Luthra"
                designation="Senior VP"
            >
                <p>Shagun heads communications and personnel at IME Capital. Shagun has spent twenty years in the media and entertainment sector, where, as a producer, she managed logistics, operations, budgets, communications, people and relationships. She is now using these skills to manage teams at IME, to simplify the journey for investors, and to redefine conversations about money. She did her Mass Communication from the prestigious SCM course at Sophia Polytechnic, Mumbai.</p>
                <p>Shagun pursues her passion for reading by being part of several book clubs and is always seen in the company of her trusty Kindle.</p>
            </TeamProfileBox>
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/himani-shetty-profile1.jpg"
                name="Himani Shetty"
                designation="Senior VP"
            >
                <p>Himani leads marketing and client engagement initiatives at IME Capital. A seasoned retail professional, Himani has worked with premium international brands – which has given her a unique insight into the best practices in design and into cutting edge marketing techniques employed by international corporate giants. She also handles branding identity and is specially skilled in leading customer engagement to drive sales.</p>
                <p>Himani is an animal lover and spends her free time rescuing and rehoming stray animals.</p>
            </TeamProfileBox>
            </Section>


        </div>
    );
}