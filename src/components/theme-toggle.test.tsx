import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";
describe("theme switching", () => { it("switches and persists the selected theme", async () => { window.localStorage.clear(); render(<ThemeProvider><ThemeToggle /></ThemeProvider>); const button = await screen.findByRole("button", { name: /switch to light theme/i }); fireEvent.click(button); await waitFor(() => expect(document.documentElement.dataset.theme).toBe("light")); expect(window.localStorage.getItem("theme")).toBe("light"); }); });
