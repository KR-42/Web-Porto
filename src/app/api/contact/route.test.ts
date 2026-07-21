import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ send: vi.fn(), constructor: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send: mocks.send }; constructor(key: string) { mocks.constructor(key); } } }));
import { POST } from "./route";

const payload = { name: "Test Visitor", email: "visitor@example.com", subject: "Project discussion", message: "I would like to discuss a technology project with you.", consent: true, website: "" };
const request = (body: unknown) => new Request("http://localhost/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

describe("POST /api/contact", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks(); });
  it("returns a controlled configuration error when Resend is unavailable", async () => { vi.stubEnv("RESEND_API_KEY", ""); vi.stubEnv("RESEND_FROM_EMAIL", ""); const response = await POST(request(payload)); expect(response.status).toBe(503); expect(await response.json()).toMatchObject({ code: "CONFIGURATION_ERROR" }); expect(mocks.send).not.toHaveBeenCalled(); });
  it("sends to Rafly and uses the visitor as replyTo", async () => { vi.stubEnv("RESEND_API_KEY", "test-key"); vi.stubEnv("RESEND_FROM_EMAIL", "Portfolio <contact@example.com>"); vi.stubEnv("CONTACT_TO_EMAIL", "rafly.athallah.putra@gmail.com"); mocks.send.mockResolvedValue({ data: { id: "test-message-id" }, error: null }); const response = await POST(request(payload)); expect(response.status).toBe(200); expect(mocks.send).toHaveBeenCalledWith(expect.objectContaining({ to: "rafly.athallah.putra@gmail.com", replyTo: "visitor@example.com", subject: "Portfolio message: Project discussion" })); });
  it("rejects honeypot and malformed input without sending", async () => { const response = await POST(request({ ...payload, website: "bot.example" })); expect(response.status).toBe(422); expect(mocks.send).not.toHaveBeenCalled(); });
});
