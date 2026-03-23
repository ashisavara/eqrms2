// usage
// import RmaCta from "@/components/uiComponents/rma-cta";
// <RmaCta />
// will render the RMA CTA section with a 30-day free trial alert box and a preview video

import Section from "@/components/uiComponents/section";
import AlertBox from "@/components/uiBlocks/AlertBox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import YouTube from "@/components/uiComponents/youtube";

const RmaCta = () => {
  return (
    
      <div>
        <div>
          <AlertBox color="green" heading="Free 15-Day Trial of IME RMS App">
          <div className="ime-grid-2col pb-6">
            <div className="flex flex-col justify-center items-center px-0 md:px-6 text-gray-700">
              <p className="text-center mb-0"> Enjoy a complimentary <b>15-day trial of IME RMS and 3 1-hour consultations</b> with a Senior Private Banker.</p>
              <p className="text-center mb-0"> Access IME’s central research insights across MFs, PMSs, AIFs, SIFs and global funds, along with personalised support on risk profiling, mandate design, financial planning, and a portfolio review. 
 </p>
                <p className="text-center">Experience the difference a <b>research-first, transparent approach</b> can make to your wealth journey. </p>
              <Button className="w-full">
                <Link href="https://rms.imecapital.in"> Activate Free Trial</Link>
              </Button>
            </div>
            <div className="mr-4 mt-6">
              <h3 className="text-center mb-2">IME RMS Demo</h3>
              <YouTube url="https://youtu.be/3WnkkjU5S0g" />
           </div>
        </div>
          </AlertBox>
        </div>
        </div>
  );
};

export default RmaCta;

