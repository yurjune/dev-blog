import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Github, Mail } from "lucide-react";
import { getSortedPostsData, formatDate } from "@/lib/posts";
import Link from "next/link";

export default async function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="space-y-6 sm:space-y-12">
        {/* 프로필 섹션 */}
        <section className="py-4">
          <div className="flex flex-row items-center gap-6">
            {/* 아바타 */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  J
                </span>
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="flex flex-col items-start text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Jerry Park
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-4 max-w-2xl">
                Hello, I&apos;m front-end developer
              </p>

              {/* 소셜 링크 */}
              <div className="flex gap-4">
                <a
                  href="https://github.com/jerrykim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="mailto:jerry@example.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 최근 포스트 섹션 */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              최근 포스트
            </h2>
            <span className="text-gray-400">총 {posts.length}개의 게시글</span>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                className="block"
                href={`/posts/${post.slug}`}
              >
                <Card className="bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardDescription className="text-neutral-400 mb-2 text-sm font-medium">
                          {formatDate(post.date)}
                        </CardDescription>
                        <CardTitle className="text-neutral-100 text-xl mb-3 font-semibold leading-tight">
                          {post.title}
                        </CardTitle>
                        <p className="text-neutral-300 text-base leading-relaxed">
                          {post.excerpt}
                        </p>
                        {post.categories && post.categories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.categories.map((category) => (
                              <span
                                key={category}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-700/50 text-neutral-300 border border-neutral-600/50"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
