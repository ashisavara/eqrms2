export type MediaInterviewDetail = {
    interview_id: number;
    created_at: Date;
    publication_date: Date;
    publication: string;
    title: string;
    slug: string;
    youtube_url: string;
    summary: string;
    // Optional SEO fields
    seo_title?: string | null;
    seo_description?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    article_link: string | null;
};