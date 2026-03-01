import { Search } from "@/components/Search";
import { Metadata } from "next";
import { getSortedPostsData } from "@/lib/utils/posts";

export const metadata: Metadata = {
  title: `Search`,
  description: "Search through all blog posts",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage() {
  const posts = getSortedPostsData().map((post) => ({
    ...post,
    content: "",
  }));

  return (
    <div className="max-w-content mx-auto px-4 py-4">
      <Search initialPosts={posts} />
    </div>
  );
}
