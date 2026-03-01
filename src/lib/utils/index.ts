import { clsx, type ClassValue } from "clsx";
import readingTime from "reading-time";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getReadingTime(content: string): number {
  const stats = readingTime(content);
  return Math.ceil(stats.minutes);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "yyyy년 MM월 dd일");
}
