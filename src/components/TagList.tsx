import { Tag } from "./Tag";

interface TagListProps {
  tags: string[];
  selectedTag?: string | null;
  tagCounts?: Record<string, number>;
  totalCount?: number;
}

export function TagList({
  tags,
  selectedTag,
  tagCounts,
  totalCount,
}: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag href="/tags" isSelected={!selectedTag}>
        All{totalCount !== undefined && ` (${totalCount})`}
      </Tag>

      {tags.map((tag) => (
        <Tag
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          isSelected={selectedTag === tag}
        >
          {tag}
          {tagCounts?.[tag] !== undefined && ` (${tagCounts[tag]})`}
        </Tag>
      ))}
    </div>
  );
}
