import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { PostMeta } from "./posts";

interface Profile {
  id: string;
  title: string;
  date: string;
  content: string;
  slug: string;
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
