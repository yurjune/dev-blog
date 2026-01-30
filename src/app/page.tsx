import { getSortedPostsData } from "@/lib/posts";
import { PostCard } from "@/components/post-card/PostCard";
import { PageHeader } from "@/components/header/PageHeader";
import { Metadata } from "next";
import { ProfileSection } from "@/components/ProfileSection";

export const metadata: Metadata = {};

export default async function Home() {
  const posts = getSortedPostsData().map((post) => ({
    ...post,
    content: "",
  }));

  return (
    <div className="max-w-content mx-auto px-4 py-4">
      <div className="space-y-6 sm:space-y-8">
        <ProfileSection />

        <section className="space-y-6">
          <PageHeader
            title="Recent Posts"
            rightContent={`Total ${posts.length}`}
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
