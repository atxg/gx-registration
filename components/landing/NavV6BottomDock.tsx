"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Share2, Info, MapPin, User, HelpCircle, ArrowUp } from "lucide-react";

const mono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

const sections = [
  { id: "about", label: "About", icon: Info },
  { id: "location", label: "Location", icon: MapPin },
  { id: "host", label: "Host", icon: User },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

/**
 * V6 — Bottom Dock
 * macOS Dock–inspired bottom bar with section icons.
 * Frees the top for content. Feels native and touch-friendly.
 * Top bar is ultra-minimal (just back button).
 */
export default function NavV6BottomDock() {
  const [activeSection, setActiveSection] = useState("");
  const [showDock, setShowDock] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowDock(window.scrollY > 300);

      const ids = sections.map((s) => s.id);
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
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* Top: ultra-minimal back button only */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between py-4 px-[216px]"
        style={{ backdropFilter: "blur(6px)" }}
      >
        <button
          className="flex items-center justify-center size-[34px] rounded-[8px] press-scale"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onClick={() => history.back()}
          aria-label="Back"
        >
          <ChevronLeft className="size-[14px] text-white opacity-60" />
        </button>

        <button
          className="flex items-center justify-center size-[34px] rounded-[8px] press-scale"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          aria-label="Share"
        >
          <Share2 className="size-[13px] text-white opacity-60" />
        </button>
      </div>

      {/* Bottom dock */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none"
        style={{
          opacity: showDock ? 1 : 0,
          transform: showDock ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.45s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <nav
          className="flex items-center gap-1 rounded-[16px] px-2 py-2 pointer-events-auto"
          style={{
            background: "rgba(18,18,18,0.92)",
            backdropFilter: "blur(24px) saturate(1.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05)",
          }}
        >
          {sections.map((s) => {
            const isActive = activeSection === s.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="press-scale"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  background: isActive ? "rgba(0,100,255,0.15)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
                }}
              >
                <Icon
                  size={16}
                  style={{
                    color: isActive ? "#408cff" : "rgba(255,255,255,0.4)",
                    transition: "color 0.2s ease",
                  }}
                />
                <span
                  style={{
                    fontSize: "9px",
                    fontFamily: mono,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    color: isActive ? "#408cff" : "rgba(255,255,255,0.35)",
                    transition: "color 0.2s ease",
                  }}
                >
                  {s.label}
                </span>
              </button>
            );
          })}

          {/* Divider */}
          <div
            style={{
              width: "1px",
              height: "28px",
              background: "rgba(255,255,255,0.08)",
              margin: "0 4px",
            }}
          />

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="press-scale"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)",
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
          >
            <ArrowUp size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
        </nav>
      </div>
    </>
  );
}
