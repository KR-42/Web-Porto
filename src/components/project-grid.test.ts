import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
describe("project grid styling", () => { it("uses a natural two-column grid without a special final-card span", () => { const css = readFileSync("src/app/globals.css", "utf8"); const projectCardRule = css.match(/\.project-card\s*\{([^}]*)\}/)?.[1] ?? ""; expect(css).toContain("grid-template-columns: 1fr 1fr"); expect(css).not.toContain(".project-card:last-child"); expect(projectCardRule).not.toContain("grid-column"); }); });
