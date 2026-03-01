import { SITE_METADATA } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_METADATA.title,
    short_name: SITE_METADATA.siteName,
    description: SITE_METADATA.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: SITE_METADATA.manifestIcon192,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: SITE_METADATA.manifestIcon512,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
