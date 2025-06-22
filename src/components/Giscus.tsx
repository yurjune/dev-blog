"use client";

import { useEffect } from "react";

interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: string;
  strict: boolean;
  reactionsEnabled: boolean;
  emitMetadata: boolean;
  inputPosition: string;
  theme: string;
  lang: string;
}

declare global {
  interface Window {
    giscus: unknown;
  }
}

export default function Giscus({
  repo,
  repoId,
  category,
  categoryId,
  mapping,
  strict,
  reactionsEnabled,
  emitMetadata,
  inputPosition,
  theme,
  lang,
}: GiscusProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-strict", strict ? "1" : "0");
    script.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0");
    script.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0");
    script.setAttribute("data-input-position", inputPosition);
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", lang);
    script.crossOrigin = "anonymous";
    script.async = true;

    const giscusContainer = document.getElementById("giscus-container");
    if (giscusContainer) {
      giscusContainer.appendChild(script);
    }

    return () => {
      if (giscusContainer) {
        giscusContainer.innerHTML = "";
      }
    };
  }, [
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    theme,
    lang,
  ]);

  return <div id="giscus-container" className="mt-8" />;
}
