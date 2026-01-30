import { Search } from "@/components/Search";
import { Metadata } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { SITE_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Search - ${SITE_METADATA.title}`,
  description: "Search through all blog posts",
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
