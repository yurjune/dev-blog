import { Mail, User } from "lucide-react";
import { MY_INFO } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import { Github } from "./icons/Github";
import avatarImage from "../../public/avatar.jpg";

export function ProfileSection() {
  return (
    <section className="py-4">
      <div className="flex flex-row items-center gap-6">
        <div className="shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
            <Image
              src={avatarImage}
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
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              href={MY_INFO.github}
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              href={`mailto:${MY_INFO.email}`}
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <Link
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              href="/profile"
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
