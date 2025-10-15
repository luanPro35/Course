"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";

interface SearchResultItem {
  id: string;
  title: string;
  type: string;
  url: string;
}

interface CourseSearchProps {
  onSearch?: (query: string) => void;
}

export default function CourseSearch({ onSearch }: CourseSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim().length > 1) {
        fetch(`/api/search?query=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => setResults(data))
          .catch(() => setResults([]));
        setShowSuggestions(true);
      } else {
        setResults([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
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

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Tìm khóa học, bài viết, video..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-3xl px-3 py-2 w-full placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-3xl hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {showSuggestions && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-2xl overflow-hidden z-50">
          {results.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item.url)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 transition-all"
            >
              <div className="text-sm font-medium text-gray-900">
                {item.title}
              </div>
              <div className="text-xs text-gray-500">{item.type}</div>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions && results.length === 0 && query.trim().length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-2xl p-3 text-gray-500 text-sm">
          Không tìm thấy kết quả phù hợp.
        </div>
      )}
    </div>
  );
}
