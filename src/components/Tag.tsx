import Link from "next/link";
import { cn } from "@/lib/utils";

type TagSize = "small" | "large";

interface TagProps {
  href?: string;
  size?: TagSize;
  isSelected?: boolean;
  children: React.ReactNode;
}

export function Tag({
  href,
  size = "large",
  isSelected = false,
  children,
}: TagProps) {
  const className = cn(
    "inline-flex items-center rounded-full font-medium transition-all border border-neutral-700/50",
    size === "large" && "px-4 py-2 text-sm",
    size === "small" && "px-3 py-1 text-sm",
    isSelected
      ? "bg-neutral-700 text-white border-neutral-600 shadow-[0_0_0_1px_rgb(82,82,82)]"
      : "bg-neutral-800/50 text-gray-400 hover:text-white hover:border-neutral-600 hover:shadow-[0_0_0_1px_rgb(82,82,82)]",
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
