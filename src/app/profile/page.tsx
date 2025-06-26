import { getProfileData } from "@/lib/profile";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Metadata } from "next";
import { SITE_METADATA, TWITTER_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Profile - ${SITE_METADATA.title}`,
  description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
  keywords: [...SITE_METADATA.keywords, "프로필", "경력", "소개"],
  openGraph: {
    title: `Profile - ${SITE_METADATA.title}`,
    description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
    type: "profile",
    url: `${SITE_METADATA.baseUrl}/profile`,
    images: [SITE_METADATA.image],
  },
  twitter: {
    card: TWITTER_CONFIG.card,
    title: `Profile - ${SITE_METADATA.title}`,
    description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
    images: [SITE_METADATA.image],
  },
};

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
