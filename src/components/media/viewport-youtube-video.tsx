"use client";

import { ExternalLink, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectVideo } from "@/data/projects";

export const VIDEO_VISIBILITY_THRESHOLD = 0.6;
export const VIDEO_ROOT_MARGIN = "0px 0px -4% 0px";

type PlayerStateEvent = { data: number };
type PlayerEvent = { target: YouTubePlayer };
type YouTubePlayer = {
  destroy(): void; getIframe(): HTMLIFrameElement; mute(): void; pauseVideo(): void;
  playVideo(): void;
};
type YouTubeNamespace = {
  Player: new (element: HTMLElement, options: Record<string, unknown>) => YouTubePlayer;
  PlayerState: { PLAYING: number; PAUSED: number };
};

declare global { interface Window { YT?: YouTubeNamespace } }

let apiPromise: Promise<YouTubeNamespace> | undefined;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("youtube-iframe-api");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.onerror = () => reject(new Error("YouTube API failed to load"));
      document.head.appendChild(script);
    }
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (window.YT?.Player) { window.clearInterval(timer); resolve(window.YT); }
      else if (Date.now() - started > 15_000) { window.clearInterval(timer); reject(new Error("YouTube API timed out")); }
    }, 50);
  });
  return apiPromise;
}

export function ViewportYouTubeVideo({ videoId, title, url, orientation, linkLabel, className = "" }: ProjectVideo & { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const readyRef = useRef(false);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const manuallyPausedRef = useRef(false);
  const expectedStateRef = useRef<"play" | "pause" | null>(null);
  const lastCommandRef = useRef<"play" | "pause" | null>(null);
  const [shouldInitialize, setShouldInitialize] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const nearObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShouldInitialize(true); nearObserver.disconnect(); }
    }, { rootMargin: "320px 0px", threshold: 0 });
    nearObserver.observe(element);
    return () => nearObserver.disconnect();
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const applyPlayback = () => {
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      const mayPlay = visibleRef.current && !document.hidden && !reducedMotionRef.current && !manuallyPausedRef.current;
      if (mayPlay && lastCommandRef.current !== "play") { expectedStateRef.current = "play"; lastCommandRef.current = "play"; player.mute(); player.playVideo(); }
      else if (!mayPlay && lastCommandRef.current !== "pause") { expectedStateRef.current = "pause"; lastCommandRef.current = "pause"; player.pauseVideo(); }
    };
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = visibleRef.current;
      visibleRef.current = entry.isIntersecting && entry.intersectionRatio >= VIDEO_VISIBILITY_THRESHOLD;
      if (wasVisible && !visibleRef.current) manuallyPausedRef.current = false;
      applyPlayback();
    }, { threshold: [0, VIDEO_VISIBILITY_THRESHOLD, 1], rootMargin: VIDEO_ROOT_MARGIN });
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotionChange = () => { reducedMotionRef.current = media.matches; applyPlayback(); };
    const onVisibilityChange = () => applyPlayback();
    reducedMotionRef.current = media.matches;
    observer.observe(element);
    media.addEventListener("change", onMotionChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => { observer.disconnect(); media.removeEventListener("change", onMotionChange); document.removeEventListener("visibilitychange", onVisibilityChange); };
  }, []);

  useEffect(() => {
    if (!shouldInitialize || !mountRef.current) return;
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !mountRef.current) return;
      playerRef.current = new YT.Player(mountRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        playerVars: { autoplay: 0, controls: 1, enablejsapi: 1, playsinline: 1, rel: 0, origin: window.location.origin },
        events: {
          onReady: ({ target }: PlayerEvent) => {
            if (cancelled) return;
            readyRef.current = true;
            const iframe = target.getIframe();
            iframe.title = title;
            iframe.loading = "lazy";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            if (visibleRef.current && !document.hidden && !reducedMotionRef.current) {
              expectedStateRef.current = "play"; lastCommandRef.current = "play"; target.mute(); target.playVideo();
            }
          },
          onStateChange: ({ data }: PlayerStateEvent) => {
            const expected = expectedStateRef.current;
            if ((expected === "play" && data === YT.PlayerState.PLAYING) || (expected === "pause" && data === YT.PlayerState.PAUSED)) {
              expectedStateRef.current = null; return;
            }
            if (data === YT.PlayerState.PAUSED && visibleRef.current) { manuallyPausedRef.current = true; lastCommandRef.current = "pause"; }
            if (data === YT.PlayerState.PLAYING) lastCommandRef.current = "play";
          },
        },
      });
    }).catch(() => { /* Native link remains available if the API is blocked. */ });
    return () => { cancelled = true; readyRef.current = false; lastCommandRef.current = null; playerRef.current?.destroy(); playerRef.current = null; };
  }, [shouldInitialize, title, videoId]);

  return <div className={`demo-video ${orientation === "portrait" ? "portrait" : "landscape"} ${className}`} ref={containerRef}>
    <div className="video-frame">
      {!shouldInitialize && <div className="video-placeholder" aria-hidden="true"><Play /><span>Demo loads when nearby</span></div>}
      <div ref={mountRef} className="youtube-mount" />
    </div>
    <a className="text-link" href={url} target="_blank" rel="noopener noreferrer">{linkLabel}<ExternalLink /></a>
  </div>;
}
