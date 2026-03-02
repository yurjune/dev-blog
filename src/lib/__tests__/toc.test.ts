import { describe, expect, it } from "vitest";

import { extractHeadings } from "../toc";

describe("extractHeadings", () => {
  it("extracts markdown headings with level and id", () => {
    const markdown = `
# Hello World
## About Me
### API & SDK
`;

    expect(extractHeadings(markdown)).toEqual([
      { id: "hello-world", text: "Hello World", level: 1 },
      { id: "about-me", text: "About Me", level: 2 },
      { id: "api-sdk", text: "API & SDK", level: 3 },
    ]);
  });

  it("ignores headings inside fenced code blocks", () => {
    const markdown = `
# Visible
\`\`\`ts
## Hidden
\`\`\`
## Also Visible
`;

    expect(extractHeadings(markdown)).toEqual([
      { id: "visible", text: "Visible", level: 1 },
      { id: "also-visible", text: "Also Visible", level: 2 },
    ]);
  });
});
