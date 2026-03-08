import { Tag } from "@/components/tag/Tag";
import { Post } from "@/lib/interface/post";
import { formatDate } from "@/lib/utils";

export const PostHeader = ({ post }: { post: Post }) => {
  return (
    <header>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        {post.title}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="text-gray-400 text-sm">
          {formatDate(post.date)} • {post.readingTime}분 읽기
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => {
              const href = `/tags/${encodeURIComponent(tag)}`;

              return (
                <Tag key={tag} href={href} size="small">
                  {tag}
                </Tag>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
