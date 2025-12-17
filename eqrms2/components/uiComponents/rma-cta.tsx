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
    
      <div className="ime-grid-2col">
        <div>
          <AlertBox color="green" heading="Free 30-Day Trial">
            <p>
              Get <b> complimentary access</b> to the <b>revolutionary IME RMS</b> (direct access to IME's central team insights across 1000's of MFs, PMSs, AIFs & Global funds - a first in the industry). </p>
              <p>Additionally, a <b>dedicated private banker</b> will help build your <b>financial plan, investment mandate & undertake a comprehensive portfolio review</b> for free. </p>
            <Button>
              <Link href="https://rms.imecapital.in">Free Trial</Link>
            </Button>
          </AlertBox>
        </div>
        <div>
        <AlertBox color="blue" heading="IME RMS - Preview">
           <YouTube url="https://youtu.be/3WnkkjU5S0g" />
        </AlertBox>
          
        </div>
      </div>
  );
};

export default RmaCta;

