import { execFileSync } from "child_process";

const gitLastCommitCache = new Map<string, string | null>();

export function getGitLastCommitIsoDate(
  relativeFilePath: string,
): string | null {
  if (gitLastCommitCache.has(relativeFilePath)) {
    return gitLastCommitCache.get(relativeFilePath) || null;
  }

  try {
    const lastCommitIso = execFileSync(
      "git",
      ["log", "-1", "--follow", "--format=%cI", "--", relativeFilePath],
      { cwd: process.cwd(), stdio: ["ignore", "pipe", "ignore"] },
    )
      .toString()
      .trim();

    const value = lastCommitIso || null;
    gitLastCommitCache.set(relativeFilePath, value);
    return value;
  } catch {
    gitLastCommitCache.set(relativeFilePath, null);
    return null;
  }
}
