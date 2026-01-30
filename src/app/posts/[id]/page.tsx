import {
  getPostMarkdown,
  getAllPostIds,
  getAdjacentPosts,
  Post,
} from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Tag } from "@/components/Tag";
import { PostNavigation } from "@/components/PostNavigation";
import { Metadata } from "next";
import { SITE_METADATA } from "@/lib/constants";
import { TableOfContents } from "@/components/TableOfContents";
import { extractHeadings } from "@/lib/toc";

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const post = await getPostMarkdown(id);

    const postUrl = `${SITE_METADATA.baseUrl}/posts/${id}`;

    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.keywords || [],
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        url: postUrl,
        publishedTime: post.date,
        tags: post.tags,
        // authors: [SITE_METADATA.author],
      },
      twitter: {
        title: post.title,
        description: post.excerpt,
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { id } = await params;
    const post = await getPostMarkdown(id);
    const adjacentPosts = getAdjacentPosts(id);

    return (
      <div className="flex-col py-4">
        <div className="max-w-3xl mx-auto px-4 mb-4">
          <div className="mb-4">
            <GoBackNavigator href="/" text="홈으로 돌아가기" />
          </div>

          <Header post={post} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-4">
          <div className="hidden xl:block" />

          <div className="w-full max-w-3xl px-4 mx-auto">
            <article className="prose prose-invert prose-lg max-w-none mb-8">
              <MarkdownRenderer content={post.content} />
            </article>

            <div className="h-[1px] bg-neutral-700 mb-8" />

            <PostNavigation
              prev={adjacentPosts.prev}
              next={adjacentPosts.next}
            />
          </div>

          <div className="hidden xl:block w-44">
            <TableOfContents items={extractHeadings(post.content)} />
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

const GoBackNavigator = ({ href, text }: { href: string; text: string }) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      {text}
    </Link>
  );
};

const Header = ({ post }: { post: Post }) => {
  const date = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {post.title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="text-gray-400 text-sm">
          {date} • {post.readingTime}분 읽기
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => {
              const href = `/tags/${encodeURIComponent(tag)}`;

              return (
                <Tag key={tag} href={href} size="small">
                  {tag}
                </Tag>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
