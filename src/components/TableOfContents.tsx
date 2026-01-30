"use client";

import { TocItem } from "@/lib/toc";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66% 0px",
      },
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleTeleport = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "instant",
      block: "start",
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-12rem)] w-full overflow-auto">
      <p className="text-xs font-semibold text-white mb-4">목차</p>

      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
          >
            <a
              href={`#${item.id}`}
              className={`block py-1 transition-colors hover:text-white ${
                activeId === item.id
                  ? "text-blue-400 font-medium"
                  : "text-gray-400"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleTeleport(item.id);
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
