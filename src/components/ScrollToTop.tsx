"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopBtn() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 rounded-full bg-neutral-500/50 p-2.5 text-white shadow-lg transition-opacity hover:bg-slate-600/70 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      } cursor-pointer`}
    >
      <ArrowUp className="h-5.5 w-5.5" />
    </button>
  );
}
