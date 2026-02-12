/**
 * POST /api/revalidate-isr — on-demand ISR revalidation for public (public) routes.
 *
 * Auth: body must include "secret" equal to process.env.REVALIDATE_SECRET.
 * Keep the secret in env only (e.g. Vercel env vars, .env.local). Do not put
 * the real secret in this file or in the repo.
 * 
 * SECRET CAN BE FOUND ON VERCEL
 *
 * --- Call from terminal ---
 *
 * 1) Revalidate by type + slug (one content piece + its list page):
 *
 *    curl -X POST https://your-domain.com/api/revalidate-isr \
 *      -H "Content-Type: application/json" \
 *      -d '{"secret":"YOUR_REVALIDATE_SECRET","type":"webinar","slug":"ai-trade"}'
 *
 *    Valid types: webinar, whitepaper, blog, media-interview, investment-query, pms-amc, pms-scheme.
 *    Local: use http://localhost:3000 instead of https://your-domain.com
 *
 * 2) Revalidate specific paths:
 *
 *    curl -X POST https://your-domain.com/api/revalidate-isr \
 *      -H "Content-Type: application/json" \
 *      -d '{"secret":"YOUR_REVALIDATE_SECRET","paths":["/webinars/ai-trade","/webinars"]}'
 *
 * Use the value of REVALIDATE_SECRET from your environment when running curl;
 * do not commit that value anywhere.
 */

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const ISR_TYPES = [
  "webinar",
  "whitepaper",
  "blog",
  "media-interview",
  "investment-query",
  "pms-amc",
  "pms-scheme",
] as const;

type IsrType = (typeof ISR_TYPES)[number];

function pathsForType(type: IsrType, slug: string): string[] {
  const s = slug.trim();
  if (!s) return [];
  switch (type) {
    case "webinar":
      return [`/webinars/${s}`, "/webinars"];
    case "whitepaper":
      return [`/whitepapers/${s}`, "/whitepapers"];
    case "blog":
      return [`/blogs/${s}`, "/blogs"];
    case "media-interview":
      return [`/media-interview/${s}`, "/media-interview"];
    case "investment-query":
      return [`/investment-query/${s}`, "/investment-query"];
    case "pms-amc":
      return [`/pms-amc/${s}`, "/pms-amc"];
    case "pms-scheme":
      return [`/pms-scheme/${s}`, "/pms-scheme"];
    default:
      return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { secret, paths: rawPaths, type, slug } = body as {
      secret?: string;
      paths?: string[];
      type?: string;
      slug?: string;
    };

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    let paths: string[] = [];

    if (rawPaths && Array.isArray(rawPaths) && rawPaths.length > 0) {
      paths = rawPaths.filter((p): p is string => typeof p === "string" && p.length > 0);
    } else if (type && slug && ISR_TYPES.includes(type as IsrType)) {
      paths = pathsForType(type as IsrType, String(slug));
    }

    if (paths.length === 0) {
      return NextResponse.json(
        {
          error:
            "Provide either paths (array of URL paths) or type + slug. Valid types: " +
            ISR_TYPES.join(", "),
        },
        { status: 400 }
      );
    }

    const revalidatedPaths: string[] = [];
    for (const path of paths) {
      revalidatePath(path);
      revalidatedPaths.push(path);
    }

    return NextResponse.json({
      success: true,
      message: `Revalidated ${revalidatedPaths.length} path(s)`,
      revalidatedPaths,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
