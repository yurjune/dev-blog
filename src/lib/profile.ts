import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import { parsePostMatter } from "./matter";

interface Profile {
  title: string;
  date: string;
  content: string;
  slug: string;
}

export async function getProfileData(): Promise<Profile> {
  const fullPath = path.join(process.cwd(), "src/profile/profile.md");
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = parsePostMatter(fileContents);
  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    ...matterResult.data,
    slug: "profile",
    content: contentHtml,
  };
}
