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
            <Section>
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
                <p>Anil is the chief mentor at IME Capital, helping oversee and refine best practices around fund selection & equity stock research. As a veteran stock market investor, Anil brings a wealth of experience to IME Capital.</p>
                <p>Over a fruitful 30 year career in finance, Anil has held senior positions at leading investment firms. These include Fund Manager at Birla Mutual Fund, FM & Co-head Equities at ICICI Prudential Mutual Fund, Managing Director at Bessemer Venture Partners, CIO at Edelweiss PMS and CIO at Centrum PMS.</p>
                <p>Prior to his career in finance, Anil served in the Indian army as an Infantry officer and saw action in Sri Lanka as part of the IPKF. Aside from being an active investor, Anil practices Vipassna meditation and makes time every year to attend a ten day Vipassna retreat.</p>
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
            <Section>    
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/maneesh-gupta-profile.jpeg"
                name="Maneesh Gupta"
                designation="Executive Director"
            >
                <p>Maneesh heads Business Development for Corporate Treasuries & Partnerships at IME Capital. Maneesh is a business leader with over 2 decades of experience in the banking, finance and real estate industry, which includes heading the valuation business for Colliers International in India.</p>
                <p>He has worked extensively in the real estate domain across India and SAARC nations, and is an expert in expansion activities, valuation services, strategic consulting and also scaling up business to their true potential. Maneesh has co-founded as well as invested in several start-ups within prop-tech, AI and food-tech domains.</p>
                <p>Maneesh spends his free time reading and/or watching media about modern history – ranging from business to economics and geopolitics, with a global view in general and India in particular.</p>
            </TeamProfileBox>
            <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/deepak-jayakumar-profile.jpeg"
                name="Deepak Jayakumar"
                designation="Executive Director"
            >
                <p>Deepak is a Senior Private Banker at IME Capital. With over 2 decades of experience in Business Development & Entrepreneurship (in IT & Defense), Deepak comes with rich experience of building long-term relationships. His natural instinct and empathy, along with his deep passion for the field of investments, are an ideal combination in his role as a private banker. Deepak is constantly learning, and continues to further his knowledge in the field of investing by following top investors global & local.</p>
                <p>As part of his experience, Deepak has managed key relationships involved with the Chandrayaan-2 and Mangalyaan missions – perfect for a space enthusiast.</p>
            </TeamProfileBox>
            </Section>
            <h2>Communication & Marketing</h2>
            <Section>
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