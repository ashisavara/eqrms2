import RmsPageTitle from "@/components/uiComponents/rms-page-title";
import Section from "@/components/uiComponents/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ImeBespokeStrategiesPage() {
    return (
        <div>
            <RmsPageTitle 
                title="IME PMS Disclosures" 
                caption="Links to our Disclosure Documents, Investment Charter & more" 
            />


        <Section className="text-center">
                <h2>IME Disclosure Document & Investment Charter</h2>
                <div className="flex justify-center items-center gap-6 border-box">
                <Button>
                <a href="https://drive.google.com/file/d/1xtCPp5F-cu9NVbI_2rz4GJaS5KIL73zQ/view" target="_blank" rel="noopener noreferrer">Disclosure Document</a>
                </Button>
                <Button>
                <a href="https://drive.google.com/file/d/1yEt8nDuou85Cvw4FSkFI0J65H2yGf8yk/view?usp=drive_link" target="_blank" rel="noopener noreferrer">Investment Charter</a>
                </Button>
                </div>
                <h2 className="mt-6">Funding Your Account</h2>
                <div className="border-box">
                <p>Please note, you can fund your PMS account via a NEFT/RTGS transfer to the PMS bank account. Please connect with your private banker for these details.</p>
                <p>Payments can also be made via UPI using IME's SEBI-approved official UPI ID - imeportfolio.pms@validhdfc </p>
                <div className="flex justify-center">
                  <div className="w-32 flex justify-center">
                    <img src="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/imepms/ime-pms-qrcode.jpeg" alt="IME UPI Code" />
                  </div>
                </div>
                </div>

                <h2 className="mt-6">Regulatory Links</h2>
                <div className="border-box">
                <p>Complaints: You can email our Compliance Officer at compliance@imepms.in for any complaints that you may have.</p>
                <p> <Link href="https://pms.wealthspectrum.com/feecalc.html" className="blue-hyperlink">Fee Calculation Tool </Link>  
         | <Link href="https://scores.sebi.gov.in/" className="blue-hyperlink">SCORES </Link>
         | <Link href="https://smartodr.in/login" className="blue-hyperlink">ODR</Link> | <Link href="https://www.sebi.gov.in/" className="blue-hyperlink">SEBI</Link>  | <Link href="https://www.sebi.gov.in/legal/master-circulars/dec-2023/master-circular-for-online-resolution-of-disputes-in-the-indian-securities-market_80236.html" className="blue-hyperlink">SEBI Online Dispute Master Circular</Link>
        </p>
        </div>
                
            
    
        </Section>

       

        </div>
    )
}