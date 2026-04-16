"use client";
import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";

const mono = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const sans = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

interface Version {
  id: string;
  label: string;
  description: string;
  tag: string;
}

interface Option {
  id: string;
  label: string;
  choices: { id: string; label: string; color?: string }[];
  activeId: string;
  onChange: (id: string) => void;
  /** Only show this option when condition is true */
  visible?: boolean;
}

interface RangeOption {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  visible?: boolean;
  format?: (v: number) => string;
}

interface Props {
  versions: Version[];
  activeVersion: string;
  onVersionChange: (id: string) => void;
  options?: Option[];
  rangeOptions?: RangeOption[];
}

export default function ProtoController({ versions, activeVersion, onVersionChange, options, rangeOptions }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: 1-N to switch versions
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < versions.length && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          onVersionChange(versions[idx].id);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [versions, onVersionChange]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  const active = versions.find(v => v.id === activeVersion);
  const activeIdx = versions.findIndex(v => v.id === activeVersion);
  const visibleRanges = rangeOptions?.filter(r => r.visible !== false) || [];

  return (
    <>
      {/* Backdrop overlay — click to close */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9998,
            background: "rgba(0,0,0,0.15)",
            opacity: 1,
            animation: "protoFadeIn 0.2s ease",
          }}
        />
      )}

      {/* Toggle tab — right edge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close controls" : "Open controls"}
        style={{
          position: "fixed",
          right: isOpen ? "321px" : "0",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10000,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "36px", height: "72px",
          borderRadius: "10px 0 0 10px",
          background: "rgba(18,18,18,0.95)",
          backdropFilter: "blur(24px) saturate(1.5)",
          border: "none",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), -4px 0 20px rgba(0,0,0,0.4)",
          cursor: "pointer",
          transition: `right 0.35s ${EASE}`,
          color: "rgba(255,255,255,0.5)",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <Settings2 size={16} style={{ transition: "transform 0.3s ease", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
          {!isOpen && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {versions.map((v, i) => (
                <div key={v.id} style={{
                  width: i === activeIdx ? "10px" : "4px", height: "3px", borderRadius: "1.5px",
                  background: i === activeIdx ? "#408cff" : "rgba(255,255,255,0.2)",
                  transition: "width 0.2s ease, background 0.2s ease",
                  alignSelf: "center",
                }} />
              ))}
            </div>
          )}
        </div>
      </button>

      {/* Sidebar panel */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "320px",
          zIndex: 9999,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: `transform 0.35s ${EASE}`,
          display: "flex",
          flexDirection: "column",
          background: "rgba(14,14,14,0.97)",
          backdropFilter: "blur(40px) saturate(1.6)",
          boxShadow: isOpen
            ? "-8px 0 40px rgba(0,0,0,0.5), inset 1px 0 0 rgba(255,255,255,0.08)"
            : "none",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 20px 16px",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Settings2 size={14} color="rgba(255,255,255,0.6)" />
            <span style={{ fontSize: "11px", fontFamily: mono, color: "rgba(255,255,255,0.6)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Prototype
            </span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer",
              width: "28px", height: "28px", borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
          >
            <X size={14} color="rgba(255,255,255,0.5)" />
          </button>
        </div>

        {/* ── Scrollable content ── */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

          {/* ── Options sections (above versions for visibility) ── */}
          {options && options.filter(o => o.visible !== false).length > 0 && options.filter(o => o.visible !== false).map((opt) => (
            <div key={opt.id} style={{ padding: "16px 20px", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: "10px", fontFamily: mono, color: "rgba(255,255,255,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 10px" }}>
                {opt.label}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {opt.choices.map((choice) => {
                  const isChoiceActive = choice.id === opt.activeId;
                  return (
                    <button
                      key={choice.id}
                      onClick={() => opt.onChange(choice.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        padding: "6px 12px", borderRadius: "8px",
                        fontSize: "11px", fontFamily: sans, fontWeight: isChoiceActive ? 600 : 400,
                        background: isChoiceActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                        boxShadow: isChoiceActive
                          ? "inset 0 0 0 1px rgba(255,255,255,0.15)"
                          : "inset 0 0 0 1px rgba(255,255,255,0.06)",
                        border: "none",
                        color: isChoiceActive ? "#fff" : "rgba(255,255,255,0.65)",
                        cursor: "pointer",
                        transition: "background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease",
                      }}
                    >
                      {choice.color && (
                        <span style={{
                          width: "10px", height: "10px", borderRadius: "50%",
                          background: choice.color,
                          boxShadow: isChoiceActive ? `0 0 6px ${choice.color}50` : "none",
                          border: choice.color === "#ffffff" ? "1px solid rgba(255,255,255,0.3)" : "none",
                          flexShrink: 0,
                        }} />
                      )}
                      {choice.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* ── Range options (before versions for visibility) ── */}
          {visibleRanges.length > 0 && visibleRanges.map((opt) => (
            <div key={opt.id} style={{ padding: "16px 20px", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <p style={{ fontSize: "10px", fontFamily: mono, color: "rgba(255,255,255,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: 0 }}>
                  {opt.label}
                </p>
                <span style={{ fontSize: "11px", fontFamily: mono, color: "rgba(255,255,255,0.7)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                  {opt.format ? opt.format(opt.value) : opt.value}
                </span>
              </div>
              <input
                type="range"
                min={opt.min}
                max={opt.max}
                step={opt.step}
                value={opt.value}
                onChange={(e) => opt.onChange(parseFloat(e.target.value))}
                style={{
                  width: "100%", height: "4px",
                  appearance: "none", WebkitAppearance: "none",
                  background: `linear-gradient(to right, #408cff ${((opt.value - opt.min) / (opt.max - opt.min)) * 100}%, rgba(255,255,255,0.1) ${((opt.value - opt.min) / (opt.max - opt.min)) * 100}%)`,
                  borderRadius: "2px", outline: "none", cursor: "pointer",
                  accentColor: "#408cff",
                }}
              />
            </div>
          ))}

          {/* ── Versions section ── */}
          <div style={{ padding: "16px 20px" }}>
            <p style={{ fontSize: "10px", fontFamily: mono, color: "rgba(255,255,255,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", margin: "0 0 12px" }}>
              Layout
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {versions.map((v, i) => {
                const isActive = v.id === activeVersion;
                return (
                  <button
                    key={v.id}
                    onClick={() => onVersionChange(v.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 12px", borderRadius: "10px",
                      background: isActive ? "rgba(64,140,255,0.1)" : "transparent",
                      boxShadow: isActive ? "inset 0 0 0 1px rgba(64,140,255,0.25)" : "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "background 0.15s ease, box-shadow 0.15s ease",
                      width: "100%",
                      textAlign: "left",
                    }}
                    onMouseOver={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseOut={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Number badge */}
                    <span style={{
                      width: "22px", height: "22px", borderRadius: "6px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "10px", fontFamily: mono, fontWeight: 600,
                      background: isActive ? "rgba(64,140,255,0.2)" : "rgba(255,255,255,0.06)",
                      color: isActive ? "#408cff" : "rgba(255,255,255,0.55)",
                      flexShrink: 0,
                      transition: "background 0.15s ease, color 0.15s ease",
                    }}>
                      {i + 1}
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px", flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: "13px", fontFamily: sans,
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
                        transition: "color 0.15s ease",
                      }}>
                        {v.label}
                      </span>
                      <span style={{
                        fontSize: "10px", fontFamily: mono,
                        color: isActive ? "rgba(64,140,255,0.7)" : "rgba(255,255,255,0.5)",
                        letterSpacing: "0.5px", textTransform: "uppercase",
                      }}>
                        {v.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Description of active version */}
            {active && (
              <p style={{
                fontSize: "12px", fontFamily: sans, color: "rgba(255,255,255,0.65)",
                lineHeight: 1.5, margin: "12px 0 0", padding: "0 12px",
              }}>
                {active.description}
              </p>
            )}
          </div>

        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: "12px 20px",
          boxShadow: "0 -1px 0 rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: "10px", fontFamily: mono, color: "rgba(255,255,255,0.5)" }}>
            Press 1–{versions.length} to switch
          </span>
        </div>
      </div>

      <style>{`
        @keyframes protoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
