export type InvQueryDetail = {
    query_id: number;
    created_at: Date;
    created_by: string;
    title: string;
    body: string;
    slug: string;
    query_categories: string;
    // Optional SEO fields
    seo_title?: string | null;
    seo_description?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
};