"use client";

import { GISCUS_CONFIG } from "@/lib/constants";
import { useEffect } from "react";

declare global {
  interface Window {
    giscus: unknown;
  }
}

export default function Giscus() {
  const {
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
    crossorigin,
    lang,
  } = GISCUS_CONFIG;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
    script.setAttribute("data-strict", strict);
    script.setAttribute("data-reactions-enabled", reactionsEnabled);
    script.setAttribute("data-emit-metadata", emitMetadata);
    script.setAttribute("data-input-position", inputPosition);
    script.setAttribute("data-theme", theme);
    script.setAttribute("crossorigin", crossorigin);
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
    crossorigin,
    lang,
  ]);

  return <div id="giscus-container" className="mt-8" />;
}
