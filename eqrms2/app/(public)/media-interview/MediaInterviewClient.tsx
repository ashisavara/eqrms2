"use client";

import { useState, useMemo } from "react";
import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import PageTitle from "@/components/uiComponents/page-title";
import YouTube from "@/components/uiComponents/youtube";
import { Button } from "@/components/ui/button";

interface MediaInterviewClientProps {
  mediaInterview: MediaInterviewDetail[];
}

export default function MediaInterviewClient({ mediaInterview }: MediaInterviewClientProps) {
  const [selectedPublication, setSelectedPublication] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Get unique publications from media interviews
  const publications = useMemo(() => {
    const uniquePublications = Array.from(new Set(mediaInterview.map(interview => interview.publication).filter(Boolean)));
    return uniquePublications.sort();
  }, [mediaInterview]);

  // Filter media interviews based on selected publication and search term
  const filteredInterviews = useMemo(() => {
    return mediaInterview.filter(interview => {
      const matchesPublication = selectedPublication === 'all' || interview.publication === selectedPublication;
      const matchesSearch = interview.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPublication && matchesSearch;
    });
  }, [mediaInterview, selectedPublication, searchTerm]);

  return (
    <div>
      <PageTitle title="Media Interviews" caption="Our founders interviews on news media channels & leading media publications"/>
    <div className="p-5 max-w-7xl mx-auto">
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Publication Dropdown */}
        <div className="sm:w-64">
          <select
            value={selectedPublication}
            onChange={(e) => setSelectedPublication(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Publications</option>
            {publications.map((publication) => (
              <option key={publication} value={publication}>
                {publication}
              </option>
            ))}
          </select>
        </div>
        
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search interview titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredInterviews.length} of {mediaInterview.length} interviews
      </div>
      
      {filteredInterviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {mediaInterview.length === 0 ? 'No media interviews available' : 'No interviews match your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 center-items">
          {filteredInterviews.map((interview) => (
            <div 
              key={interview.interview_id} 
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Content */}
              <div className="p-4">
                {interview.youtube_url ? (
                  <YouTube url={interview.youtube_url} />
                ) : interview.article_link ? (
                  <a 
                    href={interview.article_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <div className="absolute inset-0 h-full w-full rounded-md bg-black flex items-center justify-center">
                        <span className="text-red-400 text-2xl font-semibold text-center px-4">
                          Media Article <br/> {interview.publication}
                        </span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                    <div className="absolute inset-0 h-full w-full rounded-md bg-black flex items-center justify-center">
                      <span className="text-red-400 text-2xl font-semibold text-center px-4">
                        Media Article <br/> {interview.publication}
                      </span>
                    </div>
                  </div>
                )}

                {/* Publication Badge */}
                <div className="flex flex-row justify-center mt-4">
                  <span className="inline-block bg-blue-800 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {interview.publication}
                  </span>
                    <span className="text-sm text-gray-500 pl-3"> 
                    {formatDate(interview.publication_date)}
                  </span>
                </div>
                {/* Title */}
                <Link href={`/media-interview/${interview.slug}`}>
                  <h3 className="text-base !text-center font-semibold blue-hyperlink mt-2 mb-2">
                    {interview.title}
                  </h3>
                </Link>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
