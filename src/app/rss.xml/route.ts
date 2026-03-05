import { SITE_METADATA } from "@/lib/seo";
import { getSortedPostsData } from "@/lib/utils/posts";
import { getGitLastCommitIsoDate } from "@/lib/utils/git";
import path from "path";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getSortedPostsData();

  const items = posts
    .map((post) => {
      const postUrl = `${SITE_METADATA.baseUrl}/posts/${post.slug}`;
      const pubDate = new Date(
        getGitLastCommitIsoDate(
          path.join("src/posts", post.slug, `${post.slug}.md`),
        ) || post.date,
      ).toUTCString();

      return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${postUrl}</link>
        <guid>${postUrl}</guid>
        <pubDate>${pubDate}</pubDate>
        <description>${escapeXml(post.excerpt)}</description>
      </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_METADATA.siteName)}</title>
    <link>${SITE_METADATA.baseUrl}</link>
    <description>${escapeXml(SITE_METADATA.description)}</description>
    <language>ko</language>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
