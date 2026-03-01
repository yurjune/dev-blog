import fs from "fs";
import path from "path";
import markdownToText from "markdown-to-text";
import { getReadingTime } from ".";
import { Post } from "../interface/post";
import { parsePostMatter } from "../matter";

const postsDirectory = path.join(process.cwd(), "src/posts");

export function processImagePaths(content: string, postSlug: string): string {
  // ![alt](image.png) 형태의 이미지 태그를 찾아서 절대 경로로 변환
  return content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imagePath) => {
      // 이미 절대 경로인 경우 그대로 유지
      if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
        return match;
      }
      // 상대 경로인 경우 절대 경로로 변환
      return `![${alt}](/posts/${postSlug}/${imagePath})`;
    },
  );
}

export function getAllPostSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const isDirectory = (fileName: string) => {
    return fs.statSync(path.join(postsDirectory, fileName)).isDirectory();
  };

  const isPublished = (fileName: string) => {
    const fullPath = path.join(postsDirectory, fileName, `${fileName}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = parsePostMatter(fileContents);
    return !matterResult.data.draft;
  };

  return fileNames.filter(isDirectory).filter(isPublished);
}

export function getSortedPostsData(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      return fs.statSync(fullPath).isDirectory();
    })
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName, `${fileName}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = parsePostMatter(fileContents);
      const excerpt =
        matterResult.data.excerpt || getPostExcerpt(matterResult.content);

      return {
        ...matterResult.data,
        slug: fileName,
        readingTime: getReadingTime(matterResult.content),
        content: matterResult.content,
        excerpt,
      };
    })
    .filter((post) => !post.draft);

  return allPostsData.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });
}

export async function getPostMarkdown(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, slug, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = parsePostMatter(fileContents);
  const processedMarkdown = processImagePaths(matterResult.content, slug);
  const excerpt =
    matterResult.data.excerpt || getPostExcerpt(matterResult.content);

  return {
    ...matterResult.data,
    slug,
    content: processedMarkdown,
    excerpt,
    readingTime: getReadingTime(matterResult.content),
  };
}

export function getPostExcerpt(
  content: string,
  maxLength: number = 150,
): string {
  const textContent = markdownToText(content);
  const cleanText = textContent.replace(/\s+/g, " ").trim();
  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  const fallback = cleanText.substring(0, maxLength).trim() + "...";

  const sentences = cleanText.match(/[^.!?]+[.!?]+/g);
  const hasSentences = sentences && sentences.length > 0;
  if (!hasSentences) {
    return fallback;
  }

  // 문장 단위로 자르기 (마침표, 느낌표, 물음표 기준)
  let result = "";
  for (const sentence of sentences) {
    if ((result + sentence).length <= maxLength) {
      result += sentence;
    } else {
      break;
    }
  }

  return result.trim() || fallback;
}

export interface AdjacentPosts {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export function getAdjacentPosts(currentSlug: string): AdjacentPosts {
  const sortedPosts = getSortedPostsData();
  const currentIndex = sortedPosts.findIndex(
    (post) => post.slug === currentSlug,
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  const prev =
    currentIndex < sortedPosts.length - 1
      ? {
          slug: sortedPosts[currentIndex + 1].slug,
          title: sortedPosts[currentIndex + 1].title,
        }
      : null;

  const next =
    currentIndex > 0
      ? {
          slug: sortedPosts[currentIndex - 1].slug,
          title: sortedPosts[currentIndex - 1].title,
        }
      : null;

  return { prev, next };
}
