"use client";

import { useState, useMemo } from "react";
import { blogDetail } from "@/types/blog-detail";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PageTitle from "@/components/uiComponents/page-title";

interface BlogsClientProps {
  blogs: blogDetail[];
}

export default function BlogsClient({ blogs }: BlogsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const getImageSrc = (featuredImage: string | null): string => {
    if (featuredImage) return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/${featuredImage}`;
    return 'https://hyxycvugnnzjydwscmas.supabase.co/storage/v1/object/public/pages/ime-logo.png';
  };

  // Get unique categories from blogs
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(blogs.map(blog => blog.category).filter(Boolean)));
    return uniqueCategories.sort();
  }, [blogs]);

  // Filter blogs based on selected category and search term
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchTerm]);

  return (
    <div>
      <PageTitle title="Blog" caption="Thoughts & insights across various investment topics & themes." />
   
    <div className="p-5 max-w-7xl mx-auto">
      
      
      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Category Dropdown */}
        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Search Input */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search blog titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredBlogs.length} of {blogs.length} blogs
      </div>
      
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {blogs.length === 0 ? 'No blogs available' : 'No blogs match your filters'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <Link 
              key={blog.id} 
              href={`/blogs/${blog.slug}`}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Featured Image */}
              <div className="aspect-[850/450] overflow-hidden bg-gray-100">
                <img
                  src={getImageSrc(blog.featured_image)}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              {/* Card Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-base text-center font-semibold text-blue-800 mb-2 group-hover:text-blue-600 group-hover:underline transition-colors duration-200 line-clamp-2">
                  {blog.title}
                </h3>
                
                {/* Category Badge and Date */}
                <div className="flex flex-row justify-center">
                  <Badge variant="secondary">{blog.category}</Badge>
                  <div className="text-sm text-gray-500 pl-3">
                    {formatDate(blog.created_at)}
                  </div>
                </div>
                
                {/* Body Preview */}
                <p className="text-sm text-center text-gray-600 line-clamp-3 mt-2">
                  {truncateText(blog.body)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
