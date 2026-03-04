import { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/utils/posts";
import { SITE_METADATA } from "@/lib/seo";
import { getGitLastCommitIsoDate } from "@/lib/utils/git";
import path from "path";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    {
      url: SITE_METADATA.baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${SITE_METADATA.baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const postPages = getSortedPostsData().map((post) => {
    const lastModified = new Date(
      getGitLastCommitIsoDate(
        path.join("src/posts", post.slug, `${post.slug}.md`),
      ) || post.date,
    );

    return {
      url: `${SITE_METADATA.baseUrl}/posts/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 1,
    };
  });

  return [...staticPages, ...postPages];
}
