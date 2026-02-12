import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { AcademyWebinarDetail } from "@/types/webinar-detail";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imecapital.in";

function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env");
  return createClient(url, key);
}

/** ISO string -> YYYYMMDDTHHmmssZ for Google / .ics */
function toCalendarDateTime(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Strip HTML tags for plain-text description */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

/** Escape DESCRIPTION content for .ics (backslash-escape special chars and newlines) */
function escapeIcsText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const format = req.nextUrl.searchParams.get("format") ?? "ics";

    const supabase = createSupabaseAdmin();
    const { data: webinar, error } = await supabase
      .from("academy_webinar")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 });
    }

    const w = webinar as AcademyWebinarDetail;
    const title = w.calendar_title || w.webinar_name || "Webinar";
    const startIso = w.webinar_date ?? null;
    const endIso = w.webinar_end_time ?? null;
    const startDt = toCalendarDateTime(startIso);
    const endDt = endIso ? toCalendarDateTime(endIso) : startDt; // fallback same as start if no end
    const webinarUrl = `${BASE_URL}/webinars/${slug}`;
    const description = w.otp_hidden_content ? stripHtml(w.otp_hidden_content) : "";

    if (format === "google") {
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        details: description,
      });
      if (startDt) params.set("dates", endDt ? `${startDt}/${endDt}` : startDt);
      const googleUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
      return NextResponse.redirect(googleUrl, 302);
    }

    // .ics (default)
    const dtStart = startDt || "20250101T000000Z";
    const dtEnd = endDt || dtStart;
    const icsDescription = escapeIcsText(description);
    const icsSummary = escapeIcsText(title.replace(/\n/g, " "));
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//IME Capital//Webinar//EN",
      "BEGIN:VEVENT",
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${icsSummary}`,
      `DESCRIPTION:${icsDescription}`,
      `URL:${webinarUrl}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="webinar-${slug}.ics"`,
      },
    });
  } catch (e) {
    console.error("[webinar-calendar]", e);
    return NextResponse.json({ error: "Failed to generate calendar" }, { status: 500 });
  }
}
