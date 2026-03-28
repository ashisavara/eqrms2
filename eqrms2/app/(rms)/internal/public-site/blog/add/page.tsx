// Usage
import { AddBlogForm } from "@/components/forms/AddBlog";
import UserLog from '@/components/rms/UserLog';

export default function AddBlogPage() {
    return (
        <div>
            <UserLog segment="internal" entityTitle="Add Blog" pagePath="/internal/public-site/blog/add" entitySlug="internal-blog-add" />
            <AddBlogForm />
        </div>
    );
}