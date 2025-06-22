import { Github, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900/50 border-t border-neutral-800/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* 소셜 링크 */}
          <div className="flex gap-6">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm">Email</span>
            </a>
          </div>

          {/* 저작권 정보 */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-2 flex items-center justify-center gap-1">
              Made with Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
