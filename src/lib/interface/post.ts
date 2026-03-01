export interface Post {
  title: string;
  date: string;
  content: string;
  excerpt: string;
  slug: string;
  readingTime: number;
  tags?: string[];
  keywords?: string[];
  draft?: boolean;
}

export interface AdjacentPosts {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}
