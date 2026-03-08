import {
  getPostMarkdown,
  getAllPostSlugs,
  getAdjacentPosts,
  getPostImage,
} from "@/lib/utils/posts";
import { Post } from "@/lib/interface/post";
import { notFound } from "next/navigation";
import MarkdownRenderer from "@/components/markdown-renderer/MarkdownRenderer";
import { PostNavigation } from "@/app/posts/[slug]/_components/PostNavigation";
import { Metadata } from "next";
import { SITE_METADATA, TWITTER_CONFIG } from "@/lib/seo";
import { TableOfContents } from "@/components/TableOfContents";
import { ProfileSection } from "@/components/ProfileSection";
import { extractHeadings } from "@/lib/toc";
import { cache } from "react";
import { GoBackNavigator } from "./_components/GoBackNavigator";
import { PostHeader } from "./_components/PostHeader";

const getCachedPostMarkdown = cache(async (slug: string) => {
  return getPostMarkdown(slug);
});

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getCachedPostMarkdown(slug);
    const postUrl = `${SITE_METADATA.baseUrl}/posts/${slug}`;
    const postImage = getPostImage(post.image, slug) ?? SITE_METADATA.ogImage;

    return {
      alternates: {
        canonical: postUrl,
      },
      title: post.title,
      description: post.excerpt,
      keywords: post.keywords || [],
      openGraph: {
        url: postUrl,
        type: "article",
        locale: SITE_METADATA.locale,
        siteName: SITE_METADATA.siteName,
        title: post.title,
        description: post.excerpt,
        images: [postImage],
        publishedTime: post.date,
        tags: post.tags,
      },
      twitter: {
        card: TWITTER_CONFIG.card,
        title: post.title,
        description: post.excerpt,
        images: [postImage],
      },
    };
  } catch {
    return {
      title: "Post Not Found",
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  let post: Post;

  try {
    const { slug } = await params;
    post = await getCachedPostMarkdown(slug);
  } catch {
    notFound();
  }

  const adjacentPosts = getAdjacentPosts(post.slug);

  return (
    <div className="flex-col py-4">
      <div className="max-w-content mx-auto px-4 mb-4">
        <div className="mb-4">
          <GoBackNavigator href="/" text="홈으로 돌아가기" />
        </div>

        <PostHeader post={post} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-4">
        <div className="hidden xl:block" />

        <div className="max-w-content mx-auto w-full px-4">
          <article className="prose prose-invert prose-lg max-w-none mb-8">
            <MarkdownRenderer content={post.content} />
          </article>

          <div className="h-px bg-neutral-700 mb-8" />

          <div className="mb-6">
            <PostNavigation
              prev={adjacentPosts.prev}
              next={adjacentPosts.next}
            />
          </div>

          <ProfileSection />
        </div>

        <div className="hidden xl:block w-44">
          <TableOfContents items={extractHeadings(post.content)} />
        </div>
      </div>
    </div>
  );
}
