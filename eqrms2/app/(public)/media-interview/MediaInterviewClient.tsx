"use client";

import { useState, useMemo } from "react";
import { MediaInterviewDetail } from "@/types/media-interview-detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

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
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Media Interviews</h1>
      
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
            <Link 
              key={interview.interview_id} 
              href={`/media-interview/${interview.slug}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Card Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-base text-center font-semibold text-blue-800 mb-2 group-hover:text-blue-600 group-hover:underline transition-colors duration-200 line-clamp-3">
                  {interview.title}
                </h3>

                {/* Publication Badge */}
                <div className="flex flex-row justify-center">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {interview.publication}
                  </span>
                    <span className="text-sm text-gray-500 pl-3"> 
                    {formatDate(interview.publication_date)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
