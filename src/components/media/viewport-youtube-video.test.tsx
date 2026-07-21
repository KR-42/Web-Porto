import { act, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ViewportYouTubeVideo } from "./viewport-youtube-video";

type ObserverCallback = IntersectionObserverCallback;
class TestObserver {
  static instances: TestObserver[] = [];
  constructor(private callback: ObserverCallback) { TestObserver.instances.push(this); }
  observe() {} disconnect() {} unobserve() {} takeRecords() { return []; }
  emit(ratio: number) { this.callback([{ isIntersecting: ratio > 0, intersectionRatio: ratio } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
}

const player = { destroy: vi.fn(), getIframe: vi.fn(() => document.createElement("iframe")), mute: vi.fn(), pauseVideo: vi.fn(), playVideo: vi.fn() };
const video = { provider: "youtube" as const, videoId: "Fa5IfYu4Abw", url: "https://www.youtube.com/watch?v=Fa5IfYu4Abw", orientation: "portrait" as const, title: "AshAway demo", linkLabel: "Watch on YouTube" };

describe("ViewportYouTubeVideo", () => {
  beforeEach(() => {
    TestObserver.instances = []; vi.clearAllMocks();
    globalThis.IntersectionObserver = TestObserver as unknown as typeof IntersectionObserver;
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })) });
    const Player = vi.fn(function (_element: HTMLElement, options: { events: { onReady: (event: { target: typeof player }) => void } }) { queueMicrotask(() => options.events.onReady({ target: player })); return player; });
    window.YT = { Player: Player as unknown as NonNullable<typeof window.YT>["Player"], PlayerState: { PLAYING: 1, PAUSED: 2 } };
  });

  it("starts muted at 60%, pauses outside, resumes without recreating, and pauses when hidden", async () => {
    render(<ViewportYouTubeVideo {...video} />);
    expect(screen.queryByText(/AshAway video description/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /watch on youtube/i })).toBeInTheDocument();
    act(() => TestObserver.instances[1].emit(0.6));
    act(() => TestObserver.instances[0].emit(1));
    await waitFor(() => expect(player.playVideo).toHaveBeenCalledTimes(1));
    expect(player.mute).toHaveBeenCalledBefore(player.playVideo);
    act(() => TestObserver.instances[1].emit(0.2));
    expect(player.pauseVideo).toHaveBeenCalled();
    act(() => TestObserver.instances[1].emit(0.6));
    expect(player.playVideo).toHaveBeenCalledTimes(2);
    expect(window.YT?.Player).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    act(() => document.dispatchEvent(new Event("visibilitychange")));
    expect(player.pauseVideo).toHaveBeenCalledTimes(2);
  });

  it("keeps the player manual when reduced motion is requested", async () => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })) });
    render(<ViewportYouTubeVideo {...video} />);
    act(() => TestObserver.instances[1].emit(0.8));
    act(() => TestObserver.instances[0].emit(1));
    await waitFor(() => expect(window.YT?.Player).toHaveBeenCalled());
    expect(player.playVideo).not.toHaveBeenCalled();
  });
});
