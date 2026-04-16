"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Share2 } from "lucide-react";

const mono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const sans =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const sectionLabels: Record<string, string> = {
  "": "AI + Hardware Buildathon",
  about: "About the Event",
  location: "Location",
  host: "Meet the Host",
  faq: "FAQ",
};

const sectionOrder = ["about", "location", "host", "faq"];

/**
 * V3 — Contextual Scroll
 * The nav label morphs to show which section the user is currently reading.
 * Extremely minimal — no links, just awareness.
 */
export default function NavV3Contextual() {
  const [currentSection, setCurrentSection] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? window.scrollY / docHeight : 0);

      // Active section
      for (const id of [...sectionOrder].reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160) {
            setCurrentSection(id);
            return;
          }
        }
      }
      setCurrentSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const label = sectionLabels[currentSection] || sectionLabels[""];

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between py-4 px-[216px]"
      style={{ backdropFilter: "blur(12px)" }}
    >
      {/* Left: back + contextual label */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center justify-center size-[34px] rounded-[8px] press-scale"
          style={{ background: "rgba(255,255,255,0.06)" }}
          onClick={() => history.back()}
          aria-label="Back"
        >
          <ArrowLeft className="size-[14px] text-white opacity-70" />
        </button>

        <div className="flex flex-col gap-0.5">
          <span
            className="text-[13px] text-white tracking-[-0.2px]"
            style={{
              fontFamily: sans,
              fontWeight: 600,
              transition: "opacity 0.3s ease",
            }}
          >
            {label}
          </span>
          {currentSection && (
            <span
              className="text-[10px] tracking-[1.5px] uppercase"
              style={{
                fontFamily: mono,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              AI + Hardware Buildathon
            </span>
          )}
        </div>
      </div>

      {/* Right: share icon only */}
      <button
        className="flex items-center justify-center size-[34px] rounded-[8px] press-scale"
        style={{ background: "rgba(255,255,255,0.06)" }}
        aria-label="Share"
      >
        <Share2 className="size-[13px] text-white opacity-70" />
      </button>

      {/* Bottom progress line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: "1px",
          width: `${scrollProgress * 100}%`,
          background: "linear-gradient(90deg, rgba(0,100,255,0.6), rgba(0,100,255,0.2))",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}
