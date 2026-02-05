"use client";

import { useState, useMemo } from "react";
import { AcademyWhitepaperDetail } from "@/types/academy-whitepaper-detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import PageTitle from "@/components/uiComponents/page-title";

interface WhitepapersClientProps {
  whitepapers: AcademyWhitepaperDetail[];
}

export default function WhitepapersClient({ whitepapers }: WhitepapersClientProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const truncateText = (text: string | null, maxLength: number = 150): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const filteredWhitepapers = useMemo(() => {
    return whitepapers.filter((wp) => {
      const name = wp.whitepaper_name?.toLowerCase() || "";
      const summary = wp.whitepaper_summary?.toLowerCase() || "";
      const tagline = wp.whitepaper_tagline?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return name.includes(search) || summary.includes(search) || tagline.includes(search);
    });
  }, [whitepapers, searchTerm]);

  return (
    <div>
      <PageTitle
        title="Whitepapers"
        caption="In-depth research and analysis on investment themes and market insights."
      />
      <div className="p-5 max-w-7xl mx-auto">
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search whitepapers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredWhitepapers.length} of {whitepapers.length} whitepapers
        </div>

        {filteredWhitepapers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {whitepapers.length === 0 ? "No whitepapers available" : "No whitepapers match your search"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWhitepapers.map((whitepaper) => (
              <Link
                key={whitepaper.whitepaper_id}
                href={`/whitepapers/${whitepaper.slug}`}
                className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Featured Image */}
                <div className="aspect-[850/850] overflow-hidden bg-gray-100">
                  <img
                    src={whitepaper.whitepaper_img ?? ''}
                    alt={whitepaper.whitepaper_name || "Whitepaper"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-base text-center font-semibold text-blue-800 mb-2 group-hover:text-blue-600 group-hover:underline transition-colors duration-200 line-clamp-2">
                    {whitepaper.whitepaper_name}
                  </h3>

                  {whitepaper.whitepaper_tagline && (
                    <p className="text-sm text-center text-gray-600 mb-2 line-clamp-2">
                      {whitepaper.whitepaper_tagline}
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
