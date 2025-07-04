import { MetadataRoute } from "next";
import { getSortedPostsData } from "@/lib/posts";
import { SITE_METADATA } from "@/lib/constants";

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
    {
      url: `${SITE_METADATA.baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    },
  ];

  const posts = getSortedPostsData();
  const postPages = posts.map((post) => ({
    url: `${SITE_METADATA.baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 1,
  }));

  return [...staticPages, ...postPages];
}
