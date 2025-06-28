export const SITE_CONFIG = {
  name: "Jerry Park",
  description: "Hello, I'm front-end developer",
  email: "yurjune@naver.com",
  github: "https://github.com/yurjune",
  domain: "https://jerry-dev.com",
} as const;

export const SITE_METADATA = {
  title: "Jerry's Dev Blog",
  description:
    "프론트엔드 개발자 Jerry의 기술 블로그입니다. React, Next.js, TypeScript 등 웹 개발 관련 기술과 경험을 공유합니다.",
  shortDescription: "프론트엔드 개발자 Jerry의 기술 블로그입니다.",
  keywords: [
    "프론트엔드",
    "웹개발",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "개발블로그",
  ],
  author: "Jerry",
  siteName: "Jerry's Dev Blog",
  locale: "ko_KR",
  type: "website",
  image: "/avatar.jpg",
  baseUrl: SITE_CONFIG.domain,
} as const;

export const TWITTER_CONFIG = {
  card: "summary_large_image" as const,
  creator: "@jerry_dev", // 실제 트위터 핸들로 변경하세요
  site: "@jerry_dev_blog", // 사이트 트위터 핸들로 변경하세요
} as const;

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  strict: string;
  reactionsEnabled: string;
  emitMetadata: string;
  inputPosition: string;
  theme: string;
  crossorigin: string;
  lang: string;
}
export const GISCUS_CONFIG: GiscusProps = {
  repo: "yurjune/dev-blog",
  repoId: process.env.GISCUS_REPO_ID || "",
  category: "Comments",
  categoryId: process.env.GISCUS_CATEGORY_ID || "",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom", // comments input position
  theme: "dark_tritanopia",
  crossorigin: "anonymous",
  lang: "ko",
} as const;
