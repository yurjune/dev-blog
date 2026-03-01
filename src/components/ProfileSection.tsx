import { Github, Mail, User } from "lucide-react";
import { MY_INFO } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

export function ProfileSection() {
  return (
    <section className="py-4">
      <div className="flex flex-row items-center gap-6">
        <div className="shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
            <Image
              src="/avatar.jpg"
              alt="Profile Avatar"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-start text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {MY_INFO.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-300 mb-2 max-w-2xl">
            Hello, I&apos;m front-end engineer
          </p>

          <div className="flex gap-4">
            <a
              href={MY_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${MY_INFO.email}`}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Mail className="h-5 w-5" />
            </a>
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
