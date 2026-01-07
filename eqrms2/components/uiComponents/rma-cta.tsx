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
          <AlertBox color="green" heading="Free 15-Day Trial of IME RMS">
          <div className="ime-grid-2col pb-6">
            <div className="flex flex-col justify-center items-center px-6 text-gray-700">
              <p className="text-center mb-0"> Get <b> complimentary access</b> to the <b>revolutionary IME RMS</b> (direct access to IME's central team insights across 1000's of MFs, PMSs, AIFs & Global funds - a first in the industry). </p>
                <p className="text-center">Additionally, a <b>dedicated private banker</b> will help build your <b>financial plan, investment mandate & undertake a comprehensive portfolio review</b> for free. </p>
              <Button className="w-full">
                <Link href="https://rms.imecapital.in"> Activate Free Trial</Link>
              </Button>
            </div>
            <div className="border border-gray-300 rounded-md mr-4 mt-6">
              <YouTube url="https://youtu.be/3WnkkjU5S0g" />
           </div>
        </div>
          </AlertBox>
        </div>
        </div>
  );
};

export default RmaCta;

