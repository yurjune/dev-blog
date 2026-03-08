import MarkdownRenderer from "@/components/markdown-renderer/MarkdownRenderer";
import { PageHeader } from "@/components/PageHeader";
import { Metadata } from "next";
import { SITE_METADATA } from "@/lib/seo";
import fs from "fs";
import path from "path";
import { parsePostMatter } from "@/lib/matter";

export const metadata: Metadata = {
  title: `Profile`,
  description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
  alternates: {
    canonical: "/profile",
  },
  keywords: [...SITE_METADATA.keywords, "프로필", "경력", "소개"],
  openGraph: {
    title: `Profile - ${SITE_METADATA.title}`,
    description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
    type: "profile",
    url: `${SITE_METADATA.baseUrl}/profile`,
  },
  twitter: {
    title: `Profile - ${SITE_METADATA.title}`,
    description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
  },
};

export default async function ProfilePage() {
  const fullPath = path.join(process.cwd(), "src/profile/profile.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = parsePostMatter(fileContents);

  return (
    <div className="max-w-content mx-auto px-4 py-4">
      <div className="space-y-6">
        <PageHeader title="Profile" />

        <article className="prose prose-invert prose-lg max-w-none">
          <MarkdownRenderer content={matterResult.content} />
        </article>
      </div>
    </div>
  );
}
