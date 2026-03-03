import { Mail, User } from "lucide-react";
import { MY_INFO } from "@/lib/seo";
import Link from "next/link";
import { Github } from "./icons/Github";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900/50 border-t border-neutral-800/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* 소셜 링크 */}
          <div className="flex gap-6">
            <a
              href={MY_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href={`mailto:${MY_INFO.email}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm">Email</span>
            </a>
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
              <span className="text-sm">Profile</span>
            </Link>
          </div>

          {/* 저작권 정보 */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {MY_INFO.name}. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-2 flex items-center justify-center gap-1">
              Made with Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
