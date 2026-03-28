import Link from 'next/link';
import UserLog from '@/components/rms/UserLog';

export default function PublicSitePage() {
    return (
        <div className="p-6">
            <UserLog segment="internal" entityTitle="Public Site" pagePath="/internal/public-site" entitySlug="internal-public-site" />
            <h1>Public Website Sections </h1>
            <p className="blue-hyperlink"><Link href="/internal/public-site/blog">Blog</Link></p>
            <p className="blue-hyperlink"><Link href="/internal/public-site/media-interview">Media Interview</Link></p>
            <p className="blue-hyperlink"><Link href="/internal/public-site/investment-query">Investment Query</Link></p>
            <p className="blue-hyperlink"><Link href="/internal/public-site/pmsblog">PMS Blog</Link></p>
            
        </div>
    );
}