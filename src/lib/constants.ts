export const SITE_CONFIG = {
  name: "Jerry Park",
  description: "Hello, I'm front-end developer",
  email: "yurjune@naver.com",
  github: "https://github.com/yurjune",
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
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://jerry-dev.com",
} as const;

export const TWITTER_CONFIG = {
  card: "summary_large_image" as const,
  creator: "@jerry_dev", // 실제 트위터 핸들로 변경하세요
  site: "@jerry_dev_blog", // 사이트 트위터 핸들로 변경하세요
} as const;
