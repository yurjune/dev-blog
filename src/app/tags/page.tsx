import { getSortedPostsData } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { PageHeader } from "@/components/PageHeader";
import { TagList } from "@/components/TagList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse posts by tags",
};

export default async function TagsPage() {
  const posts = getSortedPostsData();

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || [])),
  ).toSorted();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="space-y-6 sm:space-y-8">
        <section className="space-y-6">
          <PageHeader
            title="All Tags"
            rightContent={`${posts.length} post${posts.length !== 1 ? "s" : ""}`}
          />

          <TagList tags={allTags} />

          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
