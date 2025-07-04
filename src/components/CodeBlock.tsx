"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-vim";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export default function CodeBlock({ children, className }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (preRef.current) {
      try {
        Prism.highlightElement(preRef.current);
      } catch (error) {
        console.warn("Prism highlighting failed:", error);
      }
    }
  }, [children]);

  // className에서 언어 추출 (예: "language-javascript" -> "javascript")
  const language = className?.replace("language-", "") || "text";

  return (
    <div className="relative">
      {language !== "text" && (
        <div className="absolute top-0 right-0 bg-neutral-900/80 text-neutral-400 text-xs px-3 py-1.5 rounded-bl-lg font-mono font-medium backdrop-blur-sm">
          {language}
        </div>
      )}
      <pre
        ref={preRef}
        className={`${className} !mt-0 !mb-4 !text-sm !bg-neutral-800`}
        suppressHydrationWarning
      >
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
