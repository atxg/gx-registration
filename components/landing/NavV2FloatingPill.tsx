"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Share2 } from "lucide-react";

const mono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const sans =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const sections = [
  { id: "about", label: "About" },
  { id: "location", label: "Location" },
  { id: "host", label: "Host" },
  { id: "faq", label: "FAQ" },
];

/**
 * V2 — Floating Pill
 * Centered pill with anchor links to page sections.
 * Appears after scrolling past the hero. Clean, app-like feel.
 */
export default function NavV2FloatingPill() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      // Determine which section is in view
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section.id);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between py-4 px-[216px]"
      style={{
        backdropFilter: "blur(16px)",
        background: scrolled ? "rgba(6,6,6,0.8)" : "transparent",
        transition: "background 0.4s cubic-bezier(0.23,1,0.32,1)",
      }}
    >
      {/* Left: back */}
      <button
        className="flex items-center justify-center size-[36px] rounded-full border press-scale"
        style={{
          background: "rgba(255,255,255,0.06)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
        onClick={() => history.back()}
        aria-label="Back"
      >
        <ChevronLeft className="size-4 text-white" />
      </button>

      {/* Center: section pill */}
      <nav
        className="flex items-center gap-1 rounded-full px-1.5 py-1.5"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {sections.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="press-scale"
              style={{
                padding: "6px 16px",
                borderRadius: "100px",
                fontSize: "12px",
                fontFamily: mono,
                letterSpacing: "0.5px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* Right: share */}
      <button
        className="flex items-center gap-2 h-[36px] px-4 rounded-full border press-scale"
        style={{
          background: "rgba(255,255,255,0.06)",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Share2 className="size-[13px] text-white" />
        <span
          className="text-[12px] text-white tracking-[0.5px] uppercase"
          style={{ fontFamily: mono, fontWeight: 500 }}
        >
          Share
        </span>
      </button>
    </div>
  );
}
