import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { HighlightedText } from "./HighlightedText";
import { Post } from "@/lib/posts";

interface PostCardProps {
  post: Post;
  searchTerm?: string;
}

export function PostCard({ post, searchTerm = "" }: PostCardProps) {
  return (
    <Link key={post.id} className="block" href={`/posts/${post.slug}`}>
      <Card className="bg-neutral-800/50 border-neutral-700/50 hover:bg-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm">
        <CardHeader style={{ gap: 0 }}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardDescription className="text-neutral-400 mb-2 text-sm font-medium">
                {formatDate(post.date)} • {post.readingTime}분 읽기
              </CardDescription>
              <CardTitle className="text-neutral-100 text-2xl mb-3 font-semibold leading-tight line-clamp-2">
                <HighlightedText text={post.title} searchTerm={searchTerm} />
              </CardTitle>
              <p className="text-neutral-300 text-base leading-relaxed line-clamp-4">
                <HighlightedText text={post.excerpt} searchTerm={searchTerm} />
              </p>
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-700/50 text-neutral-300 border border-neutral-600/50"
                    >
                      <HighlightedText
                        text={category}
                        searchTerm={searchTerm}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
