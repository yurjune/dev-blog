import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  href: string;
  text: string;
}

export const GoBackNavigator = ({ href, text }: Props) => {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      {text}
    </Link>
  );
};
