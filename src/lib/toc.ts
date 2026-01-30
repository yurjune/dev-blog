export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(markdown: string): TocItem[] {
  // Remove code blocks first
  const withoutCodeBlocks = markdown.replace(/```[\s\S]*?```/g, "");

  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];

  for (const match of withoutCodeBlocks.matchAll(headingRegex)) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, "")
      .replace(/\s+/g, "-");

    headings.push({ id, text, level });
  }

  return headings;
}
