import { Tag } from "./Tag";

interface TagListProps {
  tags: string[];
  selectedTag?: string | null;
}

export function TagList({ tags, selectedTag }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Tag href="/tags" isSelected={!selectedTag}>
        All
      </Tag>

      {tags.map((tag) => (
        <Tag
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          isSelected={selectedTag === tag}
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
}
