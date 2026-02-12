import { MDXRemote } from "next-mdx-remote-client/rsc";
import type { AcademyWebinarDetail } from "@/types/webinar-detail";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import {
  supabaseStaticListRead,
  supabaseStaticSingleRead,
} from "@/lib/supabase/serverQueryHelper";
import type { Metadata } from "next";
import { useMDXComponents } from "@/mdx-components";
import RmaCta from "@/components/uiComponents/rma-cta";
import PageTitle from "@/components/uiComponents/page-title";
import { OtpConditionalVisibility } from "@/components/uiComponents/otp-conditional-visibility";
import YouTube from "@/components/uiComponents/youtube";
import TeamProfileBox from "@/components/uiComponents/team-profile-box";

export async function generateStaticParams() {
  const webinars = await supabaseStaticListRead<{ slug: string }>({
    table: "academy_webinar",
    columns: "slug",
    filters: [(query) => query.not("slug", "is", null)],
  });
  return webinars.filter((w) => w.slug).map((w) => ({ slug: w.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const webinar = await supabaseStaticSingleRead<AcademyWebinarDetail>({
    table: "academy_webinar",
    columns: "*",
    filters: [(query) => query.eq("slug", slug)],
  });
  if (!webinar) return {};
  return {
    title: `${webinar.webinar_name || "Webinar"} | IME Capital`,
    description: webinar.webinar_summary || undefined,
  };
}

export const revalidate = 604800;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WebinarPage({ params }: PageProps) {
  const { slug } = await params;

  const webinar = await supabaseStaticSingleRead<AcademyWebinarDetail>({
    table: "academy_webinar",
    columns: "*",
    filters: [(query) => query.eq("slug", slug)],
  });

  if (!webinar) {
    notFound();
  }

  const normalizedBody = webinar.webinar_body
    ? webinar.webinar_body.replace(/\n{3,}/g, "\n\n").trim()
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
        title={webinar.webinar_name || ""}
        caption={
          webinar.webinar_tagline ?? `${webinar.webinar_tagline}`
        }
      />
      <div className="max-w-4xl mx-auto ime-blog-page px-6 md:px-0 pt-5">

        <div className="ime-grid-2col">
          <div>
            {webinar.webinar_img && (
            <img src={webinar.webinar_img} alt={webinar.webinar_name ?? ""} className="w-full h-auto rounded-lg shadow-sm" />
          )}
          </div>
          <div>
            {webinar.webinar_summary && (
            <div
              className="border-b-2 border-gray-200 pb-6 mb-6"
              dangerouslySetInnerHTML={{ __html: webinar.webinar_summary }}
            />
            )}
          
          
          <h3 className="text-center">Webinar Sign-up</h3>
          {webinar.otp_hidden_content && (
          <OtpConditionalVisibility
            hvoc={`webinar--${webinar.webinar_name ?? webinar.webinar_id}`}
          >
            
            <div
              className="prose prose-sm max-w-none mb-8"
              dangerouslySetInnerHTML={{
                __html: webinar.otp_hidden_content ?? "",
              }}
            />
          </OtpConditionalVisibility>
        )}
        </div>
        </div>
        

        {!webinar.show_upcoming_webinar && (
          <div>
        <h2>Watch Webinar Recording</h2>
        {webinar.youtube_url && (
          <div className="mb-8">
            <YouTube
              url={webinar.youtube_url}
              title={webinar.webinar_name || "Webinar video"}
            />
          </div>
        )}
        </div>
      )}

       
        <h2>About the Webinar</h2>
        {normalizedBody && (
          <div className="ime-blog-page">
            <MDXRemote
              source={normalizedBody}
              options={{ mdxOptions }}
              components={components}
            />
          </div>
        )}
        <h2>About the Speaker</h2>
        <TeamProfileBox 
                imgSrc="https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ashi-profile.jpg"
                name="Ashi Anand"
                designation="Founder & CEO - IME Capital"
            >
        <p><b>Ashi Anand</b> is the Founder & CEO of IME Capital. He comes with over 25 years of fund management experience, at some of India's top AMCs including ICICI Pru & Kotak. Over this period, Ashi has been able to consistently outperform the markets, over a wide range of different investment strategies & market conditions.</p>
        <p>Some of Ashi's key achievements include: </p>
        <ul>
          <li>ICICI Pru PMS Deep Value  (#3 out of 127 funds)</li>
          <li>Allegro Healthcare (strong outperformance when most PMS firms struggled to perform)</li>
          <li>Valcreate IME Digital Disruption (#4 out of 379 PMS schemes)</li>
          <li>Responsible for the launch of India's first Arbitrage Fund (2003) & Capital Guaranteed Fund - CPPI (2004)</li>
        </ul>
        </TeamProfileBox>
        <h2 className="mt-12 mb-4 !text-xl">
          Experience the benefits of working with a &apos;research-first&apos;
          investments firm
        </h2>
        <RmaCta />
      </div>
    </div>
  );
}
