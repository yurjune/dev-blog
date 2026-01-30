import Link from "next/link";
import { cn } from "@/lib/utils";

interface PostCardTagProps {
  href?: string;
  children: React.ReactNode;
}

export function PostCardTag({ href, children }: PostCardTagProps) {
  const className = cn(
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
    "bg-neutral-700/50 text-neutral-300 border border-neutral-600/50",
    "transition-colors",
    href && "hover:bg-neutral-700 hover:text-white",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <span className={className}>{children}</span>;
}
