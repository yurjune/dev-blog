import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import gfm from "remark-gfm";
import markdownToText from "markdown-to-text";
import { getReadingTime } from "./utils";

export interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  slug: string;
  readingTime: number;
  categories?: string[];
}

export interface PostMeta {
  title: string;
  date: string;
  excerpt?: string;
  categories?: string[];
  [key: string]: string | number | boolean | string[] | undefined;
}

const postsDirectory = path.join(process.cwd(), "src/posts");

// 이미지 경로를 절대 경로로 변환하는 함수
function processImagePaths(content: string, postId: string): string {
  // ![alt](image.png) 형태의 이미지 태그를 찾아서 절대 경로로 변환
  return content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (match, alt, imagePath) => {
      // 이미 절대 경로인 경우 그대로 유지
      if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
        return match;
      }
      // 상대 경로인 경우 절대 경로로 변환
      return `![${alt}](/posts/${postId}/${imagePath})`;
    }
  );
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      return fs.statSync(fullPath).isDirectory();
    })
    .map((fileName) => {
      return {
        params: {
          id: fileName,
        },
      };
    });
}

export function getSortedPostsData(): Post[] {
  // posts 디렉토리에서 모든 폴더를 가져옵니다
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      return fs.statSync(fullPath).isDirectory();
    })
    .map((fileName) => {
      // 파일명에서 .md 확장자를 제거하여 id를 가져옵니다
      const id = fileName;

      // 마크다운 파일을 문자열로 읽습니다
      const fullPath = path.join(postsDirectory, fileName, `${fileName}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // gray-matter를 사용하여 포스트의 메타데이터 섹션을 파싱합니다
      const matterResult = matter(fileContents);

      // 포스트 데이터를 id와 결합합니다
      const postData = {
        id,
        slug: fileName,
        readingTime: getReadingTime(matterResult.content),
        ...(matterResult.data as PostMeta),
        content: matterResult.content,
      };

      // excerpt가 없으면 content에서 생성
      if (!postData.excerpt) {
        postData.excerpt = getPostExcerpt(matterResult.content);
      }

      return postData as Post;
    });

  // 날짜별로 정렬합니다
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(id: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, id, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matter를 사용하여 포스트의 메타데이터 섹션을 파싱합니다
  const matterResult = matter(fileContents);

  // 이미지 경로를 절대 경로로 변환
  const processedMarkdown = processImagePaths(matterResult.content, id);

  // remark를 사용하여 마크다운을 HTML 문자열로 변환합니다
  const processedContent = await remark()
    .use(gfm)
    .use(html)
    .process(processedMarkdown);
  const contentHtml = processedContent.toString();

  // excerpt가 없으면 content에서 생성
  const excerpt =
    (matterResult.data as PostMeta).excerpt ||
    getPostExcerpt(matterResult.content);

  // 포스트 데이터를 id와 결합합니다
  return {
    id,
    slug: id,
    content: contentHtml,
    excerpt,
    readingTime: getReadingTime(matterResult.content),
    ...(matterResult.data as PostMeta),
  };
}

// 원본 마크다운 내용을 반환하는 새로운 함수
export async function getPostMarkdown(id: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, id, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // gray-matter를 사용하여 포스트의 메타데이터 섹션을 파싱합니다
  const matterResult = matter(fileContents);

  // 이미지 경로를 절대 경로로 변환
  const processedMarkdown = processImagePaths(matterResult.content, id);

  // excerpt가 없으면 content에서 생성
  const excerpt =
    (matterResult.data as PostMeta).excerpt ||
    getPostExcerpt(matterResult.content);

  // 포스트 데이터를 id와 결합합니다 (원본 마크다운 반환)
  return {
    id,
    slug: id,
    content: processedMarkdown,
    excerpt,
    readingTime: getReadingTime(matterResult.content),
    ...(matterResult.data as PostMeta),
  };
}

export function getPostExcerpt(
  content: string,
  maxLength: number = 150
): string {
  // markdown-to-text를 사용하여 마크다운을 순수 텍스트로 변환
  const textContent = markdownToText(content);

  // 여러 공백을 하나로 정리
  const cleanText = textContent.replace(/\s+/g, " ").trim();

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  // 문장 단위로 자르기 (마침표, 느낌표, 물음표 기준)
  const sentences = cleanText.match(/[^.!?]+[.!?]+/g);
  if (sentences && sentences.length > 0) {
    let result = "";
    for (const sentence of sentences) {
      if ((result + sentence).length <= maxLength) {
        result += sentence;
      } else {
        break;
      }
    }
    return result.trim() || cleanText.substring(0, maxLength).trim() + "...";
  }

  return cleanText.substring(0, maxLength).trim() + "...";
}
