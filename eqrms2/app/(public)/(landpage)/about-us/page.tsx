import Section from "@/components/uiComponents/section";
import { Button } from "@/components/ui/button";
import AlertBox from "@/components/uiBlocks/AlertBox";
import Image from "@/components/uiBlocks/Image";
import PageTitle from "@/components/uiComponents/page-title";
import HeadlineTextBox from "@/components/uiComponents/headline-text-box";

export default function AboutUsPage() {
  return (
    <div className="prose">
        <PageTitle 
                title="About us" 
                caption="Learn more about our firm, our values and our mission." 
            />
        
        <Section className="bg-gray-50 py-12 text-center">
            <h2>What we are</h2>
            <p>IME (Investments made Easy) Capital is a boutique investments firm that provides end to end services to investors, families and corporates about all their investments, customised to their unique financial needs.</p> 
            <p>What you can expect at IME is the best of two worlds – the DNA, ethos and personal attention of a boutique firm combined with institutional practices and research methodologies of a global asset management firm. </p>
            <h2>Our Genesis</h2>
            <div className="ime-grid-2col flex">
                <div>
                    <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ashi-profile.jpg" alt="Ashi Anand" className="w-[500px] rounded-full" />
                </div>
                <div>
                    <p>IME was founded by Ashi Anand – in his career of over 20 years as a fund manager, Ashi found structural flaws in the workings of the wealth management industry. He used his experience, knowledge and instinct to found IME Capital – a firm free of conventional restraints; one that focuses on research, expertise and innovation, and can do this with integrity.</p>
                    <p>Ashi spent 2 decades managing funds and investments for large firms like ICICI Prudential and Kotak Mahindra. Among his accomplishments are the fact that he was one of the youngest fund managers of his time, which helped him gain years of insight and experience.</p>
                    <Button variant="outline">Read More</Button>
                </div>
            </div>

        </Section>

        <Section className="py-12">
            <h2>Our Values</h2>
            <HeadlineTextBox headline="Our Vision">
                <p>To bring the research process rigour of institutional asset management firms, to the management of individual investor portfolios.</p>
            </HeadlineTextBox>
            <HeadlineTextBox headline="Our Mission">
                <p>At IME Capital, we aim to disrupt the wealth management industry and break new ground by putting research before sales and by executing an unmatched level of knowledge sharing via an innovative Research Management Solution.</p>
            </HeadlineTextBox>
            <HeadlineTextBox headline="Ethics & Transparency">
                <p>Because IME was born out of a desire to do things differently, one of our core differentiators is an unmatched level of ethics & transparency. This is not just an empty or generic promise; the entire organisation has been developed in a manner that keeps our clients interest first. </p>
            </HeadlineTextBox>
            <HeadlineTextBox headline="Boutique firm with 100% ownership">
                <p>IME is wholly owned by its founder (we have no external shareholders).This frees us from the kind of pressures that prompts organisations and therefore relationship managers to often push inferior or unsuitable products to investors.</p>
            </HeadlineTextBox>
            <HeadlineTextBox headline="No Targets">
                <p>Because we do not have conventional quarterly or annual sales targets, we can remain focussed on long term wealth creation for the client.</p>
            </HeadlineTextBox>
            
        </Section>


    </div>
  );
}