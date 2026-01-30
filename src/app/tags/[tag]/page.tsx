import { getSortedPostsData } from "@/lib/posts";
import { PostCard } from "@/components/post-card/PostCard";
import { PageHeader } from "@/components/header/PageHeader";
import { TagList } from "@/components/tag/TagList";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  return allTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }));
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `Posts tagged with "${decodedTag}"`,
    description: `Browse all posts tagged with ${decodedTag}`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const posts = getSortedPostsData().map((post) => ({
    ...post,
    content: "",
  }));

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || [])),
  ).toSorted();

  const tagCounts = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const filteredPosts = posts.filter((post) => post.tags?.includes(decodedTag));

  if (filteredPosts.length === 0) {
    notFound();
  }

  return (
    <div className="max-w-content mx-auto px-4 py-4">
      <div className="space-y-6 sm:space-y-8">
        <section className="space-y-6">
          <PageHeader
            title={`Tag: ${decodedTag}`}
            rightContent={`${filteredPosts.length} post${filteredPosts.length !== 1 ? "s" : ""}`}
          />

          <TagList
            tags={allTags}
            selectedTag={decodedTag}
            tagCounts={tagCounts}
            totalCount={posts.length}
          />

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
