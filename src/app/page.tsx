import { Github, Mail, User } from "lucide-react";
import { getSortedPostsData } from "@/lib/posts";
import { SITE_CONFIG, SITE_METADATA, TWITTER_CONFIG } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { PostCard } from "@/components/PostCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  keywords: [...SITE_METADATA.keywords],
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.shortDescription,
    type: SITE_METADATA.type,
    url: "/",
    images: [SITE_METADATA.image],
  },
  twitter: {
    card: TWITTER_CONFIG.card,
    title: SITE_METADATA.title,
    description: SITE_METADATA.shortDescription,
    images: [SITE_METADATA.image],
  },
};

export default async function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="space-y-6 sm:space-y-8">
        {/* 프로필 섹션 */}
        <section className="py-4">
          <div className="flex flex-row items-center gap-6">
            {/* 아바타 */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                <Image
                  src="/avatar.jpg"
                  alt="Profile Avatar"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="flex flex-col items-start text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                {SITE_CONFIG.name}
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-2 max-w-2xl">
                {SITE_CONFIG.description}
              </p>

              {/* 소셜 링크 */}
              <div className="flex gap-4">
                <a
                  href={SITE_CONFIG.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <User className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Recent Posts
            </h2>
            <span className="text-gray-400 text-md font-bold self-end">
              Total {posts.length}
            </span>
          </div>

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
