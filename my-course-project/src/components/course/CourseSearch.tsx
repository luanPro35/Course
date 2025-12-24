"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";

interface SearchResultItem {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface CourseSearchProps {
  onSearch?: (query: string) => void;
}

const CATEGORY_FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "Khóa học", value: "course" },
  { label: "Bài viết", value: "post" },
  { label: "Video", value: "video" },
];

export default function CourseSearch({ onSearch }: CourseSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResultItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fuzzyMatch = (text: string, query: string): boolean => {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();
    if (textLower.includes(queryLower)) return true;
    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === queryLower.length;
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        fetch(`/api/search?query=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data);
            setIsLoading(false);
          })
          .catch(() => {
            setResults([]);
            setIsLoading(false);
          });
        setShowSuggestions(true);
      } else {
        setResults([]);
        setFilteredResults([]);
        setShowSuggestions(false);
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredResults(results);
    } else {
      const filtered = results.filter((item) => {
        const type = item.type.toLowerCase();
        if (selectedCategory === "course") {
          return type.includes("khóa học") || type.includes("course");
        } else if (selectedCategory === "post") {
          return type.includes("bài viết") || type.includes("post");
        } else if (selectedCategory === "video") {
          return type.includes("video");
        }
        return true;
      });
      setFilteredResults(filtered);
    }
  }, [results, selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleSelect = (url: string) => {
    setShowSuggestions(false);
    setQuery("");
    router.push(url);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setFilteredResults([]);
    setShowSuggestions(false);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getCategoryIcon = (type: string) => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("khóa học") || typeLower.includes("course")) {
      return "📚";
    } else if (typeLower.includes("bài viết") || typeLower.includes("post")) {
      return "📝";
    } else if (typeLower.includes("video")) {
      return "🎥";
    }
    return "📄";
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-400">
            <FiSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Tìm khóa học, bài viết, video..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 rounded-full pl-11 pr-20 py-3 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <div className="text-gray-500">
                  <FiX size={18} />
                </div>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Filter results"
            >
              <div className={selectedCategory !== "all" ? "text-blue-600" : "text-gray-500"}>
                <FiFilter size={18} />
              </div>
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-2xl p-3 z-50 border border-gray-200">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(filter.value);
                    setShowFilters(false);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === filter.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-2xl p-4 z-50 border border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 text-sm">Đang tìm kiếm...</span>
          </div>
        </div>
      )}

      {showSuggestions && !isLoading && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-2xl overflow-hidden z-50 border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-2 bg-gray-50 border-b border-gray-200">
            <p className="text-xs text-gray-500 px-2">
              Tìm thấy {filteredResults.length} kết quả
              {selectedCategory !== "all" && ` (${CATEGORY_FILTERS.find(f => f.value === selectedCategory)?.label})`}
            </p>
          </div>
          <ul>
            {filteredResults.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelect(item.url)}
                className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-all border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">
                    {getCategoryIcon(item.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                      {highlightMatch(item.title, query)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && !isLoading && filteredResults.length === 0 && query.trim().length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-2xl p-6 z-50 border border-gray-200 text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-700 font-medium mb-1">
            Không tìm thấy kết quả
          </p>
          <p className="text-gray-500 text-sm">
            Thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc
          </p>
          {selectedCategory !== "all" && (
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-3 text-blue-600 text-sm font-medium hover:underline"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
}
