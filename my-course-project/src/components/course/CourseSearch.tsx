"use client";

import React, { useState } from "react";

interface CourseSearchProps {
  onSearch: (query: string) => void;
}

export default function CourseSearch({ onSearch }: CourseSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Tìm khóa học, bài viết, video, ..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded-3xl px-3 py-2 w-full placeholder-black"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-3xl"
      >
        Search
      </button>
    </form>
  );
}
