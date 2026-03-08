import React, { isValidElement, ReactNode } from "react";
import { Link } from "lucide-react";
import { createHeadingId } from "@/lib/toc";

function extractTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractTextContent(node.props.children);
  }

  return "";
}

interface HeadingWithAnchorProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  className: string;
  level: "h1" | "h2" | "h3";
}

export default function HeadingWithAnchor({
  children,
  className,
  level,
  ...props
}: HeadingWithAnchorProps) {
  const text = extractTextContent(children);
  const id = createHeadingId(text);
  const Tag = level;

  return (
    <Tag id={id} className={`${className} group`} {...props}>
      <a
        href={`#${id}`}
        className="inline-flex items-center gap-2 no-underline"
        aria-label={`${text} section link`}
      >
        <span>{children}</span>

        <span
          aria-hidden="true"
          className="text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <Link className="h-4 w-4" strokeWidth={1.8} />
        </span>
      </a>
    </Tag>
  );
}
