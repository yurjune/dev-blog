import { PostMeta } from "@/lib/posts";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Profile {
  id: string;
  title: string;
  date: string;
  content: string;
  slug: string;
}

export default async function ProfilePage() {
  const profile = await getProfileData();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>
      </div>

      <article className="prose prose-invert prose-lg max-w-none">
        <MarkdownRenderer content={profile.content} />
      </article>
    </div>
  );
}

export async function getProfileData(): Promise<Profile> {
  const fullPath = path.join(process.cwd(), "src/profile/profile.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // profile 데이터를 반환합니다
  return {
    id: "profile",
    slug: "profile",
    content: contentHtml,
    ...(matterResult.data as PostMeta),
  };
}
