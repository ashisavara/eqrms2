import PageTitle from "@/components/uiComponents/page-title";
import AlertBox from "@/components/uiBlocks/AlertBox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InvestmentProductsPage() {
    return (
        <div>
            <PageTitle 
                title="Investment Products at IME" 
                caption="Exhaustive Range of Investment Options" 
            />


            <div className="ime-grid-2col p-6 gap-12">
                <AlertBox color="blue" heading="Mutual Funds">
                    <p> Seamless online execution of entire range of Indian MF's, via a strategic tie-up with Fundzbazar (Top 5 distributor of MFs in India). We offer a fully-managed solution, where all transactions are set up by our private bankers, requiring only an approval from your end. You gain all the benefits of the substantial ease & convinience of an online platform, with the dedicated & personalised service of a trusted advisor on a single platform. </p>
                    <Button><Link href="/mutual-funds-ime">Read More</Link></Button>
                </AlertBox>
                <AlertBox color="green" heading="PMS & AIFs">
                    <p>Benefit from unique insider insights, with our founder being a part of the alternatives industry since its very beginning in 2002. Our understanding & depth of research in the Indian Alternatives investment space is unparalleled, and we can help identify the best Indian alternative funds based on your requirements </p>
                    <Button><Link href="/pms-aif-ime">Read More</Link></Button>
                </AlertBox>
                <AlertBox color="green" heading="Global">
                    <p>Build your global portfolio, with access to multi-asset class, multi-structure global investment options ranging from Indian feeder funds, our Singapore structure for global investments, GIFT funds & more. </p>
                    <Button><Link href="/international-investing-ime">Read More</Link></Button>
                </AlertBox>
                <AlertBox color="blue" heading="IME PMS">
                    <p>Differentiated & highly customisable discretionary, non-discretionary & advisory PMS solutions, for investors seeking that additional edge. </p>
                </AlertBox>
            </div>


        </div>


    )
};