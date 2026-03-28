import { AddMediaInterviewForm } from "@/components/forms/AddMediaInterview";
import UserLog from '@/components/rms/UserLog';

export default function AddMediaInterviewPage() {
    return (
        <div>
            <UserLog segment="internal" entityTitle="Add Media Interview" pagePath="/internal/public-site/media-interview/add" entitySlug="internal-media-interview-add" />
            <AddMediaInterviewForm />
        </div>
    );
}

