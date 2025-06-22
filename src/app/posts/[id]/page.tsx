import { getPostMarkdown, getAllPostIds } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { id } = await params;
    const post = await getPostMarkdown(id);

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* 게시글 헤더 */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <div className="text-gray-400 text-sm">
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-700/50 text-neutral-300 border border-neutral-600/50"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 게시글 내용 */}
        <article className="prose prose-invert prose-lg max-w-none">
          <MarkdownRenderer content={post.content} />
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
