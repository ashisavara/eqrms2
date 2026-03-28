import { AddInvestmentQueryForm } from "@/components/forms/AddInvestmentQuery";
import UserLog from '@/components/rms/UserLog';

export default function AddInvestmentQueryPage() {
    return (
        <div>
            <UserLog segment="internal" entityTitle="Add Investment Query" pagePath="/internal/public-site/investment-query/add" entitySlug="internal-investment-query-add" />
            <AddInvestmentQueryForm />
        </div>
    );
}

