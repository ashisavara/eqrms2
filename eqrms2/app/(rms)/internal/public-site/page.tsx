import Link from 'next/link';

export default function PublicSitePage() {
    return (
        <div>
            <h1>Public Website Sections </h1>
            <p className="blue-hyperlink"><Link href="/internal/public-site/blog">Blog</Link></p>
            <p className="blue-hyperlink"><Link href="/internal/public-site/media-interview">Media Interview</Link></p>
            <p className="blue-hyperlink"><Link href="/internal/public-site/investment-query">Investment Query</Link></p>
            
        </div>
    );
}