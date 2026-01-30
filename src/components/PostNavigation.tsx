import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface PostNavigationProps {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-4">
      {prev ? (
        <Container slug={prev.slug} align="left">
          <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
            <ArrowLeft className="h-4 w-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
            <span>Previous Post</span>
          </div>
          <div className="text-neutral-100 font-medium line-clamp-2">
            {prev.title}
          </div>
        </Container>
      ) : (
        <div />
      )}

      {next && (
        <Container slug={next.slug} align="right">
          <div className="flex items-center justify-end gap-2 text-sm text-neutral-400 mb-2">
            <span>Next Post</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="text-neutral-100 font-medium line-clamp-2">
            {next.title}
          </div>
        </Container>
      )}
    </div>
  );
}

interface ContainerProps {
  slug: string;
  children: ReactNode;
  align: "left" | "right";
}

const Container = ({ slug, children, align }: ContainerProps) => {
  return (
    <Link
      href={`/posts/${slug}`}
      className={`group bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-4 hover:bg-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </Link>
  );
};
