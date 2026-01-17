import Link from "next/link";

interface TagListProps {
  tags: string[];
  selectedTag?: string | null;
}

export function TagList({ tags, selectedTag }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/tags"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          !selectedTag
            ? "bg-neutral-700 text-white border border-neutral-600"
            : "bg-neutral-800/50 text-gray-400 border border-neutral-700/50 hover:text-white hover:border-neutral-600"
        }`}
      >
        All
      </Link>

      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTag === tag
              ? "bg-neutral-700 text-white border border-neutral-600"
              : "bg-neutral-800/50 text-gray-400 border border-neutral-700/50 hover:text-white hover:border-neutral-600"
          }`}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
