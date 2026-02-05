import { MDXRemote } from "next-mdx-remote-client/rsc";
import { AcademyWhitepaperDetail } from "@/types/academy-whitepaper-detail";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { supabaseStaticListRead, supabaseStaticSingleRead } from "@/lib/supabase/serverQueryHelper";
import type { Metadata } from "next";
import { useMDXComponents } from "@/mdx-components";
import RmaCta from "@/components/uiComponents/rma-cta";
import PageTitle from "@/components/uiComponents/page-title";
import { OtpConditionalVisibility } from "@/components/uiComponents/otp-conditional-visibility";

// Generate static params for all whitepapers (uses anonymous client - no cookies)
export async function generateStaticParams() {
  const whitepapers = await supabaseStaticListRead<{ slug: string }>({
    table: "academy_whitepapers",
    columns: "slug",
    filters: [(query) => query.not("slug", "is", null)],
  });
  return whitepapers.filter((wp) => wp.slug).map((wp) => ({ slug: wp.slug! }));
}

// Generate SEO metadata for whitepaper posts (uses static client for build-time)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const whitepaper = await supabaseStaticSingleRead<AcademyWhitepaperDetail>({
    table: "academy_whitepapers",
    columns: "*",
    filters: [(query) => query.eq("slug", slug)],
  });
  if (!whitepaper) return {};
  return {
    title: `${whitepaper.whitepaper_name || "Whitepaper"} | IME Capital`,
    description: whitepaper.whitepaper_summary || whitepaper.whitepaper_tagline || undefined,
  };
}

// ISR: Revalidate every 7 days
export const revalidate = 604800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WhitepaperPage({ params }: PageProps) {
  const { slug } = await params;

  const whitepaper = await supabaseStaticSingleRead<AcademyWhitepaperDetail>({
    table: "academy_whitepapers",
    columns: "*",
    filters: [(query) => query.eq("slug", slug)],
  });

  if (!whitepaper) {
    notFound();
  }

  // Normalize body content
  const normalizedBody = whitepaper.whitepaper_body
    ? whitepaper.whitepaper_body.replace(/\n{3,}/g, "\n\n").trim()
    : "";

  const [remarkBreaks, remarkGfm] = await Promise.all([
    import("remark-breaks").then((mod) => mod.default),
    import("remark-gfm").then((mod) => mod.default),
  ]);

  const mdxOptions = {
    remarkPlugins: [remarkGfm, remarkBreaks],
  };

  const components = useMDXComponents();

  return (
    <div>
      <PageTitle
        title={whitepaper.whitepaper_name || ""}
        caption={`${whitepaper.whitepaper_tagline ? whitepaper.whitepaper_tagline + " | " : ""}Published: ${formatDate(whitepaper.whitepaper_date)}`}
      />
    <div className="max-w-4xl mx-auto ime-blog-page px-6 md:px-0 pt-5">
      {/* Featured Image */}
      <div className="ime-grid-2col border-b-2 border-gray-200 pb-4">
        <div className="my-auto">
          {whitepaper.whitepaper_img && (
            <div className="mb-8">
              <img
                src={whitepaper.whitepaper_img}
                alt={whitepaper.whitepaper_name || "Whitepaper"}
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
        <div>
          {whitepaper.whitepaper_summary && (
         <div dangerouslySetInnerHTML={{ __html: whitepaper.whitepaper_summary ?? '' }} />
          )}
          <h3 className="text-center">Download Now</h3>
          <OtpConditionalVisibility hvoc="whitepaper--${whitepaper.whitepaper_name}">
          {whitepaper.whitepaper_url && (
          <div className="my-4 flex justify-center">
            <a
              href={whitepaper.whitepaper_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors"
            >
              Download Whitepaper (PDF)
            </a>
          </div>
         )}
         </OtpConditionalVisibility>
        </div>
        
      </div>

      {/* Download Link */}
      

      {/* Body Content (MDX) */}
      {normalizedBody && (
        <div className="ime-blog-page">
          <MDXRemote
            source={normalizedBody}
            options={{ mdxOptions }}
            components={components}
          />
        </div>
      )}

      <h2 className="mt-12 mb-4 !text-xl">
        Experience the benefits of working with a &apos;research-first&apos; investments firm
      </h2>
      <RmaCta />
    </div>
    </div>
  );
}
