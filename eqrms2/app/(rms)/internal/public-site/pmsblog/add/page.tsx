import { AddBlogPmsForm } from "@/components/forms/AddBlogPms";
import UserLog from '@/components/rms/UserLog';

export default function AddPmsBlogPage() {
    return (
        <div>
            <UserLog segment="internal" entityTitle="Add PMS Blog" pagePath="/internal/public-site/pmsblog/add" entitySlug="internal-pmsblog-add" />
            <AddBlogPmsForm />
        </div>
    );
}
