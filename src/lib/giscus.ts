interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  strict: string;
  reactionsEnabled: string;
  emitMetadata: string;
  inputPosition: string;
  theme: string;
  crossorigin: string;
  lang: string;
}

export const GISCUS_CONFIG: GiscusProps = {
  repo: "yurjune/dev-blog",
  repoId: "R_kgDOO_6t6Q",
  category: "Comments",
  categoryId: "DIC_kwDOO_6t6c4CsJRN",
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom", // comments input position
  theme: "dark_tritanopia",
  crossorigin: "anonymous",
  lang: "ko",
} as const;
