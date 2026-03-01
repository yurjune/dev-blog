import matter from "gray-matter";

export interface PostMeta {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  keywords?: string[];
  draft?: boolean;
  [key: string]: string | number | boolean | string[] | undefined;
}

export function parsePostMatter(fileContents: string) {
  const res = matter(fileContents);
  return {
    ...res,
    data: res.data as PostMeta,
  };
}
