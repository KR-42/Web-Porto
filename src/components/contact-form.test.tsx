import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./contact-form";

const fillForm = () => {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Visitor" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "visitor@example.com" } });
  fireEvent.change(screen.getByLabelText("Subject"), { target: { value: "Project discussion" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "I would like to discuss a technology project with you." } });
  fireEvent.click(screen.getByRole("checkbox"));
};

describe("ContactForm", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("submits to the API, reports success, and resets fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", fetchMock); render(<ContactForm />); fillForm(); fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await screen.findByText("Your message has been sent successfully.");
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }));
    expect(screen.getByLabelText("Name")).toHaveValue(""); expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
  it("preserves values on server failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, code: "DELIVERY_ERROR" }), { status: 502 })));
    render(<ContactForm />); fillForm(); fireEvent.click(screen.getByRole("button", { name: /send message/i }));
    await screen.findByText("Your message could not be sent. Please try again.");
    expect(screen.getByLabelText("Name")).toHaveValue("Test Visitor");
  });
  it("shows accessible client validation errors", async () => { render(<ContactForm />); fireEvent.click(screen.getByRole("button", { name: /send message/i })); await waitFor(() => expect(screen.getAllByRole("alert").length).toBeGreaterThan(3)); });
});
