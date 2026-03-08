import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import CodeBlock from "./CodeBlock";
import HeadingWithAnchor from "./HeadingWithAnchor";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const components: Components = {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;

      if (isInline) {
        return (
          <code
            className="bg-neutral-800 text-rose-400 px-1 py-0.5 rounded text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <CodeBlock className={className} {...props}>
          {String(children).replace(/\n$/, "")}
        </CodeBlock>
      );
    },
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    ),
    h1: ({ children, ...props }) => (
      <HeadingWithAnchor
        level="h1"
        className="text-3xl font-bold text-white mb-4 mt-8 scroll-mt-20"
        {...props}
      >
        {children}
      </HeadingWithAnchor>
    ),
    h2: ({ children, ...props }) => (
      <HeadingWithAnchor
        level="h2"
        className="text-2xl font-bold text-white mb-4 mt-6 scroll-mt-20"
        {...props}
      >
        {children}
      </HeadingWithAnchor>
    ),
    h3: ({ children, ...props }) => (
      <HeadingWithAnchor
        level="h3"
        className="text-xl font-semibold text-white mb-3 mt-5 scroll-mt-20"
        {...props}
      >
        {children}
      </HeadingWithAnchor>
    ),
    p: ({ children, ...props }) => (
      <p className="text-white leading-[1.72] mb-5 last:mb-0" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="list-disc pl-6 text-white mb-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="list-decimal pl-6 text-white mb-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-white mb-1" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-neutral-600 bg-neutral-800 p-4 italic text-gray-400 mb-4"
        {...props}
      >
        {children}
      </blockquote>
    ),
    img: ({ src, alt, ...props }) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-lg my-4"
        {...props}
      />
    ),
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table
          className="w-full border-collapse border border-gray-600"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-gray-600 px-4 py-2 bg-gray-800 text-white"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-gray-600 px-4 py-2 text-gray-300" {...props}>
        {children}
      </td>
    ),
    hr: () => <hr className="my-4" />,
  };

  return (
    <ReactMarkdown components={components} rehypePlugins={[rehypeRaw]}>
      {content}
    </ReactMarkdown>
  );
}
