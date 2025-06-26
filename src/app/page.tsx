import { getSortedPostsData } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { PageHeader } from "@/components/PageHeader";
import { Metadata } from "next";
import { ProfileSection } from "@/components/ProfileSection";

export const metadata: Metadata = {};

export default async function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="space-y-6 sm:space-y-8">
        {/* 프로필 섹션 */}
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
