"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const mono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

/**
 * V4 — Minimal Progress
 * Ultra-stripped: back button + event name that fades in on scroll
 * + a full-width progress bar. Content-first philosophy — the nav
 * gets out of the way and lets the page breathe.
 */
export default function NavV4MinimalProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);
      setShowTitle(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* Nav content */}
      <div
        className="flex items-center gap-4 py-4 px-[216px]"
        style={{
          backdropFilter: showTitle ? "blur(16px)" : "none",
          background: showTitle ? "rgba(6,6,6,0.7)" : "transparent",
          transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <button
          className="flex items-center justify-center size-[32px] rounded-[6px] press-scale"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onClick={() => history.back()}
          aria-label="Back"
        >
          <ArrowLeft className="size-[13px] text-white opacity-60" />
        </button>

        <span
          className="text-[12px] tracking-[1.2px] uppercase"
          style={{
            fontFamily: mono,
            color: "rgba(255,255,255,0.6)",
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? "translateY(0)" : "translateY(4px)",
            transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          AI + Hardware Buildathon
        </span>
      </div>

      {/* Full-width progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${scrollProgress * 100}%`,
            background: "#0064ff",
            borderRadius: "0 1px 1px 0",
            transition: "width 0.08s linear",
          }}
        />
      </div>
    </div>
  );
}
