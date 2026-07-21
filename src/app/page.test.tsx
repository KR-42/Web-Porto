import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import Home from "./page";

describe("homepage", () => {
  it("renders organization logos, current location, CV, and text-only brand", () => {
    const { container } = render(<Home />);
    const brand = screen.getByRole("link", { name: "Rafly Portofolio home" });
    expect(brand).toHaveTextContent("Rafly Portofolio");
    expect(brand.querySelector("span, i")).toBeNull();
    expect(container.querySelector(".footer-mark")).toBeNull();
    expect(screen.getByAltText("PT Asuransi BRI Life logo")).toHaveAttribute("src", expect.stringContaining("bri-life-logo.png"));
    expect(screen.getByAltText("PT Asuransi BRI Life logo")).toHaveClass("organization-logo", "experience-logo");
    expect(screen.getByAltText("BINUS University logo")).toHaveAttribute("src", expect.stringContaining("binus-university-logo.png"));
    expect(container.querySelector(".education-icon")).toBeNull();
    expect(screen.getByText(profile.basedIn)).toHaveTextContent("East Jakarta, Indonesia");
    expect(screen.getByText(new RegExp(education.location))).toHaveTextContent("Kemanggisan, West Jakarta, Indonesia");
    expect(screen.getByRole("link", { name: /download cv/i })).toHaveAttribute("href", "/documents/Rafly-Athallah-CV-2026-v2.pdf");
    expect(container.innerHTML).not.toContain('href="/documents/Rafly-Athallah-CV-2026.pdf"');
    expect(screen.getAllByRole("link", { name: /view case study/i })).toHaveLength(4);
    expect(profile.portrait).toBe("/images/profile/rafly-profile-2026.webp");
  });
});
