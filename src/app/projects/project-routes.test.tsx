import { describe, expect, it } from "vitest";
import { generateStaticParams } from "./[slug]/page";
describe("project static routes", () => { it("generates only the four valid project routes", () => { expect(generateStaticParams()).toEqual([{ slug: "ashaway" }, { slug: "lumina-skin" }, { slug: "wecwater" }, { slug: "smart-attendance" }]); expect(generateStaticParams()).not.toContainEqual({ slug: ["in", "signia"].join("") }); }); });
