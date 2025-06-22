import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: "#d1d5db",
            h1: {
              color: "#ffffff",
            },
            h2: {
              color: "#ffffff",
            },
            h3: {
              color: "#ffffff",
            },
            h4: {
              color: "#ffffff",
            },
            h5: {
              color: "#ffffff",
            },
            h6: {
              color: "#ffffff",
            },
            strong: {
              color: "#ffffff",
            },
            a: {
              color: "#3b82f6",
              "&:hover": {
                color: "#60a5fa",
              },
            },
            code: {
              color: "#fbbf24",
              backgroundColor: "#374151",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
            },
            pre: {
              backgroundColor: "#1f2937",
              color: "#d1d5db",
            },
            blockquote: {
              borderLeftColor: "#6b7280",
              color: "#9ca3af",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
