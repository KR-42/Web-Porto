import { describe, expect, it } from "vitest";
import { getProject, projects } from "./projects";

describe("project data", () => {
  it("contains exactly the four projects in the required order", () => {
    expect(projects.map((project) => project.slug)).toEqual(["ashaway", "lumina-skin", "wecwater", "smart-attendance"]);
    expect(getProject(["in", "signia"].join(""))).toBeUndefined();
  });
  it.each([
    ["ashaway", "Fa5IfYu4Abw", "portrait"],
    ["wecwater", "Xaow55qdBoQ", "landscape"],
    ["smart-attendance", "qfoiWEonvJM", "landscape"],
  ])("provides correct video data for %s", (slug, videoId, orientation) => {
    expect(getProject(slug)?.video).toMatchObject({ videoId, orientation, provider: "youtube" });
  });
  it("does not attach a YouTube video to Lumina Skin", () => { expect(getProject("lumina-skin")?.video).toBeUndefined(); });
  it("has unique resolvable slugs and complete case-study data", () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(4);
    for (const project of projects) { expect(getProject(project.slug)).toEqual(project); expect(project.images.length).toBeGreaterThan(0); expect(project.link.href).toMatch(/^https:\/\//); }
  });
});
