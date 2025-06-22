import { getPostData, getAllPostIds } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PostPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await getPostData(params.id);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div
            className="text-gray-300 leading-relaxed [&>*]:mb-6 [&>*:last-child]:mb-0
                       [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-6 [&_h1]:mt-8
                       [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-4 [&_h2]:mt-6
                       [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-3 [&_h3]:mt-5
                       [&_p]:text-gray-300 [&_p]:leading-relaxed
                       [&_a]:text-blue-400 [&_a]:hover:text-blue-300 [&_a]:underline
                       [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-gray-300
                       [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-gray-300
                       [&_li]:text-gray-300 [&_li]:mb-1
                       [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-600 [&_blockquote]:bg-neutral-800 [&_blockquote]:p-4 [&_blockquote]:italic [&_blockquote]:text-gray-400
                       [&_code]:bg-gray-800 [&_code]:text-rose-400 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                       [&_pre]:bg-gray-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-gray-700
                       [&_pre_code]:bg-transparent [&_pre_code]:text-gray-200 [&_pre_code]:p-0
                       [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-lg [&_img]:my-6
                       [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-600
                       [&_th]:border [&_th]:border-gray-600 [&_th]:px-4 [&_th]:py-2 [&_th]:bg-gray-800 [&_th]:text-white
                       [&_td]:border [&_td]:border-gray-600 [&_td]:px-4 [&_td]:py-2 [&_td]:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
