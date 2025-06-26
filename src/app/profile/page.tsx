import { getProfileData } from "@/lib/profile";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Metadata } from "next";
import { SITE_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Profile",
  description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
  keywords: [...SITE_METADATA.keywords, "프로필", "경력", "소개"],
  openGraph: {
    title: `Profile - ${SITE_METADATA.title}`,
    description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
    type: "profile",
    url: `${SITE_METADATA.baseUrl}/profile`,
  },
  twitter: {
    title: `Profile - ${SITE_METADATA.title}`,
    description: "프론트엔드 개발자 박용헌의 프로필과 경력 정보를 확인하세요.",
  },
};

export default async function ProfilePage() {
  const profile = await getProfileData();

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Profile</h2>
        </div>

        <article className="prose prose-invert prose-lg max-w-none">
          <MarkdownRenderer content={profile.content} />
        </article>
      </div>
    </div>
  );
}
