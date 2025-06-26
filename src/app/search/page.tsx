import { Search } from "@/components/Search";
import { Metadata } from "next";
import { getSortedPostsData } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Search",
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
    categories: post.categories ?? [],
    tags: post.tags ?? [],
    keywords: post.keywords ?? [],
    draft: post.draft ?? false,
  }));

  return <Search initialPosts={posts} />;
}
