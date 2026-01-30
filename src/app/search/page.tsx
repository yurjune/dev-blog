import { Search } from "@/components/Search";
import { Metadata } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { SITE_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Search - ${SITE_METADATA.title}`,
  description: "Search through all blog posts",
};

export default async function SearchPage() {
  // 빌드 타임에 posts 데이터 로드
  const sortedPosts = getSortedPostsData();
  const posts = sortedPosts.map((post) => ({
    id: post.id,
    title: post.title,
    content: "",
    date: post.date,
    excerpt: post.excerpt,
    slug: post.slug,
    readingTime: post.readingTime,
    tags: post.tags ?? [],
    keywords: post.keywords ?? [],
    draft: post.draft ?? false,
  }));

  return (
    <div className="max-w-content mx-auto px-4 py-4">
      <Search initialPosts={posts} />
    </div>
  );
}
