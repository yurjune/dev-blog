import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Github, Mail } from "lucide-react";

export default function Home() {
  const posts = [
    {
      id: 1,
      title: "Next.js 15 새로운 기능들",
      description:
        "Next.js 15에서 추가된 새로운 기능들과 개선사항을 살펴봅니다.",
      date: "2024.01.15",
      tags: ["Next.js", "React"],
    },
    {
      id: 2,
      title: "TypeScript 고급 타입 활용법",
      description:
        "TypeScript의 고급 타입 기능들을 실제 프로젝트에서 어떻게 활용하는지 알아봅니다.",
      date: "2024.01.12",
      tags: ["TypeScript", "JavaScript"],
    },
    {
      id: 3,
      title: "Tailwind CSS 커스터마이징",
      description:
        "Tailwind CSS를 프로젝트에 맞게 커스터마이징하는 방법을 소개합니다.",
      date: "2024.01.10",
      tags: ["CSS", "Tailwind"],
    },
    {
      id: 4,
      title: "React 상태 관리 패턴",
      description: "React에서 효율적인 상태 관리 패턴들을 정리해봅니다.",
      date: "2024.01.08",
      tags: ["React", "State Management"],
    },
    {
      id: 5,
      title: "웹 성능 최적화 기법",
      description:
        "웹 애플리케이션의 성능을 최적화하는 다양한 기법들을 소개합니다.",
      date: "2024.01.05",
      tags: ["Performance", "Web"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="space-y-6 sm:space-y-12">
        {/* 프로필 섹션 */}
        <section className="py-4">
          <div className="flex flex-row items-center gap-6">
            {/* 아바타 */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-white">
                  J
                </span>
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="flex flex-col items-start text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Jerry Park
              </h1>
              <p className="text-base sm:text-lg text-gray-300 mb-4 max-w-2xl">
                Hello, I&apos;m front-end developer
              </p>

              {/* 소셜 링크 */}
              <div className="flex gap-4">
                <a
                  href="https://github.com/jerrykim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="mailto:jerry@example.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 최근 포스트 섹션 */}
        <section className="space-y-6">
          <div className="flex justify-between items-center border-b border-gray-800 pb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              최근 포스트
            </h2>
            <span className="text-gray-400">총 {posts.length}개의 게시글</span>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardDescription className="text-gray-400 mb-2">
                        {post.date}
                      </CardDescription>
                      <CardTitle className="text-white text-xl mb-3">
                        {post.title}
                      </CardTitle>
                      <p className="text-gray-300 text-base">
                        {post.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
