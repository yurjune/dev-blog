import React from "react";

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  className?: string;
}

export function HighlightedText({
  text,
  searchTerm,
  className,
}: HighlightedTextProps) {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>;
  }

  try {
    const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedSearchTerm})`, "gi");
    const parts = text.split(regex);

    return (
      <span className={className}>
        {parts.map((part, index) => {
          if (regex.test(part)) {
            return (
              <mark
                key={index}
                className="bg-yellow-500/30 text-yellow-200 rounded-sm px-0.5 -mx-0.5 inline"
                style={{
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                }}
              >
                {part}
              </mark>
            );
          }
          return part;
        })}
      </span>
    );
  } catch {
    return <span className={className}>{text}</span>;
  }
}
