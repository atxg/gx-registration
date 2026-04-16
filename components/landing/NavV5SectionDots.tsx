"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Share2 } from "lucide-react";

const mono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const sans =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const sections = [
  { id: "top", label: "Event" },
  { id: "about", label: "About" },
  { id: "location", label: "Location" },
  { id: "host", label: "Host" },
  { id: "faq", label: "FAQ" },
];

/**
 * V5 — Section Dots
 * Carousel-inspired dot indicators in the center that show your
 * position in the page. Hovering a dot reveals the section name.
 * Compact, precise, tactile.
 */
export default function NavV5SectionDots() {
  const [activeSection, setActiveSection] = useState("top");
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveSection("top");
        return;
      }
      const ids = sections.map((s) => s.id).filter((id) => id !== "top");
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection("top");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between py-5 px-[216px]"
      style={{ backdropFilter: "blur(8px)" }}
    >
      {/* Left: back button */}
      <button
        className="flex items-center justify-center size-[36px] rounded-[8px] border press-scale"
        style={{
          background: "rgba(0,0,0,0.2)",
          borderColor: "rgba(113,116,121,0.25)",
        }}
        onClick={() => history.back()}
        aria-label="Back"
      >
        <ChevronLeft className="size-4 text-white" />
      </button>

      {/* Center: dot indicators */}
      <nav className="flex items-center gap-3">
        {sections.map((s) => {
          const isActive = activeSection === s.id;
          const isHovered = hoveredDot === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              onMouseEnter={() => setHoveredDot(s.id)}
              onMouseLeave={() => setHoveredDot(null)}
              className="relative flex items-center justify-center press-scale"
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                padding: "8px 4px",
              }}
              aria-label={s.label}
            >
              {/* Dot */}
              <span
                style={{
                  width: isActive ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  background: isActive ? "#0064ff" : "rgba(255,255,255,0.25)",
                  transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
                  display: "block",
                }}
              />

              {/* Tooltip label on hover */}
              {(isHovered || isActive) && (
                <span
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: "9px",
                    fontFamily: mono,
                    letterSpacing: "1.2px",
                    textTransform: "uppercase",
                    color: isActive ? "#0064ff" : "rgba(255,255,255,0.5)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    opacity: isHovered ? 1 : isActive ? 0.7 : 0,
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {s.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: share */}
      <button
        className="flex items-center justify-center size-[36px] rounded-[8px] border press-scale"
        style={{
          background: "rgba(0,0,0,0.2)",
          borderColor: "rgba(113,116,121,0.25)",
        }}
        aria-label="Share"
      >
        <Share2 className="size-[14px] text-white" />
      </button>
    </div>
  );
}
