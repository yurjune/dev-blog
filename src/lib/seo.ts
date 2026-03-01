export const MY_INFO = {
  name: "Jerry Park",
  email: "yurjune@naver.com",
  github: "https://github.com/yurjune",
} as const;

export const SITE_METADATA = {
  siteName: "Jerry's Dev Blog",
  baseUrl: "https://jerry-dev.com",
  title: "Jerry's Dev Blog - 제리의 개발 블로그",
  description:
    "프론트엔드 개발자 제리의 기술 블로그입니다. React, Next.js, TypeScript 등 웹 개발 관련 기술과 경험을 공유합니다.",
  author: "Jerry",
  locale: "ko_KR",
  image: "/avatar.jpg",
  ogImage: "/og_image.jpg",
  keywords: [
    "프론트엔드",
    "백엔드",
    "웹개발",
    "개발블로그",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Programming",
  ],
} as const;

export const TWITTER_CONFIG = {
  card: "summary_large_image" as const,
  creator: "@jerry_dev", // 실제 트위터 핸들로 변경하세요
  site: "@jerry_dev_blog", // 사이트 트위터 핸들로 변경하세요
} as const;
