import { getProfileData } from "@/lib/profile";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default async function ProfilePage() {
  const profile = await getProfileData();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="mb-4 sm:mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
        </Link>
      </div>

      <article className="prose prose-invert prose-lg max-w-none">
        <MarkdownRenderer content={profile.content} />
      </article>
    </div>
  );
}
