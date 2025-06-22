export const GISCUS_CONFIG = {
  repo: process.env.GISCUS_REPO || "",
  repoId: process.env.GISCUS_REPO_ID || "",
  category: process.env.GISCUS_CATEGORY || "Comments",
  categoryId: process.env.GISCUS_CATEGORY_ID || "",
  mapping: process.env.GISCUS_MAPPING || "pathname",
  strict: process.env.GISCUS_STRICT === "true",
  reactionsEnabled: process.env.GISCUS_REACTIONS_ENABLED !== "false",
  emitMetadata: process.env.GISCUS_EMIT_METADATA === "true",
  inputPosition: process.env.GISCUS_INPUT_POSITION || "bottom",
  theme: process.env.GISCUS_THEME || "dark",
  lang: process.env.GISCUS_LANG || "ko",
} as const;
