import { getSortedPostsData } from "@/lib/posts";
import { PostCard } from "@/components/post-card/PostCard";
import { PageHeader } from "@/components/header/PageHeader";
import { TagList } from "@/components/tag/TagList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags",
  description: "Browse posts by tags",
};

export default async function TagsPage() {
  const posts = getSortedPostsData().map((post) => ({
    ...post,
    content: "",
  }));

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || [])),
  ).toSorted();

  const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
    post.tags?.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div className="max-w-content mx-auto px-4 py-4">
      <div className="space-y-6 sm:space-y-8">
        <section className="space-y-6">
          <PageHeader
            title="All Tags"
            rightContent={`${posts.length} post${posts.length !== 1 ? "s" : ""}`}
          />

          <TagList
            tags={allTags}
            tagCounts={tagCounts}
            totalCount={posts.length}
          />

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
