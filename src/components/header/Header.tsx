"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn-ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isVisible = useHeaderVisibility();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "Tags", href: "/tags" },
    { name: "Search", href: "/search" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={cn(
        "w-full backdrop-blur-lg bg-black/20 border-b border-gray-800 sticky top-0 z-50 transition-transform duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* 로고/블로그 제목 */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              Jerry&apos;s dev blog
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden sm:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex h-9 items-center justify-center rounded-md px-4 text-base text-gray-300 transition-colors hover:bg-neutral-800 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="sm:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-neutral-800 hover:text-white"
              aria-label="Toggle Mobile GNB"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && isVisible && (
          <div className="sm:hidden border-t border-gray-800 bg-black/95 backdrop-blur-lg absolute top-full left-0 right-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-4 space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white hover:bg-gray-800 block px-3 py-3 rounded-md text-base font-medium transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function useHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldHide =
        currentScrollY > lastScrollY.current && currentScrollY > 100;
      setIsVisible(!shouldHide);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isVisible;
}
