"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/shadcn-ui/input";
import { PostCard } from "@/components/PostCard";
import { PageHeader } from "@/components/PageHeader";
import { Post } from "@/lib/posts";
import { useDebounce } from "@/lib/hooks";

interface SearchProps {
  initialPosts: Post[];
}

export function Search({ initialPosts }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return initialPosts;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return initialPosts.filter(({ title, excerpt, tags }) => {
      return (
        title.toLowerCase().includes(searchLower) ||
        excerpt.toLowerCase().includes(searchLower) ||
        (tags ?? []).some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [initialPosts, debouncedSearchTerm]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="space-y-6">
        <PageHeader
          title="Search Posts"
          rightContent={`${filteredPosts.length} of ${initialPosts.length}`}
        />

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="제목, 내용, 카테고리로 게시글 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-neutral-700/50 border-neutral-500/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">
                {debouncedSearchTerm
                  ? "검색 결과가 없습니다."
                  : "게시글이 없습니다."}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                searchTerm={debouncedSearchTerm}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
