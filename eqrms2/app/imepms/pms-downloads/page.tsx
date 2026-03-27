import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";
import { Button } from "@/components/ui/button";

export default function ImeBespokeStrategiesPage() {
    return (
        <div>
            <RmsPageTitle 
                title="IME PMS Downloads" 
                caption="Download our latest presentations, factsheets & other documents" 
            />


        <Section className="text-center">
                <h2>IME PMS</h2>
                <div className="border-box flex items-center justify-center mb-6 gap-6">
                <Button>
                <a href="https://drive.google.com/file/d/1cc5BgdwT2iabUz3PZjRncOhxqrOJQw3n/view?usp=drive_link" target="_blank" rel="noopener noreferrer">IME PMS Presentation</a>
                </Button>
                <Button>
                <a href="https://drive.google.com/file/d/1xtCPp5F-cu9NVbI_2rz4GJaS5KIL73zQ/view" target="_blank" rel="noopener noreferrer">Disclosure Document</a>
                </Button>
                </div>

                <h2>IME Digital Disruption</h2>
                <div className="border-box flex items-center justify-center mb-6 gap-6">
                <Button>
                <a href="https://drive.google.com/file/d/1l9CkW4VaKZcfmfNNf7ycUs3ImplTebv8/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Presentation</a>
                </Button>
                <Button>
                <a href="https://drive.google.com/file/d/1xeEfP-_wYuEqz7hRuCmlTrT26dApoqn4/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Factsheet</a>
                </Button>
                </div>
                <h2>IME Concentrated Microtrends</h2>
                <div className="border-box flex items-center justify-center mb-6 gap-6">
                <Button>
                <a href="https://drive.google.com/file/d/1oTCFFDZQGWYL_KijnqJ4Aipp_kU1qups/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Presentation</a>
                </Button>
                <Button>
                <a href="https://drive.google.com/file/d/1wm0LYPGoV-pgi59OB9ZweNdrD0x3Y9Tx/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Factsheet</a>
                </Button>
                </div>

                <h2>Funding Your Account</h2>
                <div className="border-box">
                <p>Please note, you can fund your PMS account via a NEFT/RTGS transfer to the PMS bank account. Please connect with your private banker for these details.</p>
                <p>Payments can also be made via UPI using IME's SEBI-approved official UPI ID - imeportfolio.pms@validhdfc </p>
                <div className="flex justify-center">
                  <div className="w-32 flex justify-center">
                    <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ime-pms-qrcode.jpeg" alt="IME UPI Code" />
                  </div>
                </div>
                </div>
            
    
        </Section>

       

        </div>
    )
}