"use client";

import { useState, useMemo } from "react";
import type { AcademyWebinarDetail } from "@/types/webinar-detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import PageTitle from "@/components/uiComponents/page-title";

interface WebinarsClientProps {
  webinars: AcademyWebinarDetail[];
}

export default function WebinarsClient({ webinars }: WebinarsClientProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const truncateText = (text: string | null, maxLength: number = 150): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const filteredWebinars = useMemo(() => {
    return webinars.filter((w) => {
      const name = w.webinar_name?.toLowerCase() || "";
      const summary = w.webinar_summary?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return name.includes(search) || summary.includes(search);
    });
  }, [webinars, searchTerm]);

  return (
    <div>
      <PageTitle
        title="Webinars"
        caption="Recorded sessions and discussions on investment themes and market insights."
      />
      <div className="p-5 max-w-7xl mx-auto">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search webinars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredWebinars.length} of {webinars.length} webinars
        </div>

        {filteredWebinars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {webinars.length === 0
                ? "No webinars available"
                : "No webinars match your search"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.map((webinar) => (
              <Link
                key={webinar.webinar_id}
                href={webinar.slug ? `/webinars/${webinar.slug}` : "#"}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  <h3 className="text-base font-semibold text-blue-800 mb-2 group-hover:text-blue-600 group-hover:underline transition-colors duration-200 line-clamp-2">
                    {webinar.webinar_name}
                  </h3>
                  {webinar.webinar_date && (
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDate(webinar.webinar_date)}
                    </p>
                  )}
                  {webinar.webinar_summary && (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {truncateText(webinar.webinar_summary, 120)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
