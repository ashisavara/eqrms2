export type blogDetail = {
    id: number;
    created_at: Date;
    body: string;
    title: string;
    slug: string;
    featured_image: string;
    status: string;
    category: string;
    // Optional SEO fields
    seo_title?: string | null;
    seo_description?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
};


