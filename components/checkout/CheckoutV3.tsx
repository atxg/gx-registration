"use client";

/**
 * Checkout V3 — Solo-first with team invites
 *
 * Flow:
 *   1. Solo or Team?
 *   2. Name + Email
 *   3. Phone + OTP verification
 *   4. (Team only) Add teammates by email — up to 6
 *   5. Done
 *
 * Supports "card" and "immersive" layouts.
 * Proto state simulation: fresh / already-registered / already-in-team
 */

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, Plus, Trash2 } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput } from "./MaterialInput";
import { useAccentColor } from "./InputStyleContext";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

type JoinType = "solo" | "team" | null;
type StepId = "type" | "info" | "phone" | "otp" | "teammates";
type Layout = "card" | "immersive";
export type SimState = "fresh" | "registered-solo" | "added-as-teammate";
export type ChoiceVariant = "v1" | "v2" | "v3" | "v5" | "v6" | "v7" | "v12" | "v13";
export type IconShape = "circle" | "square";

/* ── Shared helpers ────────────────────────────────────────────────────── */

function StepTransition({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [displayKey, setDisplayKey] = useState(stepKey);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (stepKey !== displayKey) {
      setPhase("exit");
      const t = setTimeout(() => {
        setDisplayKey(stepKey);
        setDisplayChildren(children);
        setPhase("enter");
        requestAnimationFrame(() => requestAnimationFrame(() => setPhase("visible")));
      }, 150);
      return () => clearTimeout(t);
    } else {
      setDisplayChildren(children);
    }
  }, [stepKey, children, displayKey]);

  useEffect(() => {
    if (phase === "enter") {
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("visible")));
    }
  }, [phase]);

  return (
    <div style={{
      opacity: phase === "visible" ? 1 : 0,
      transform: phase === "exit" ? "translateY(-4px)" : phase === "enter" ? "translateY(8px)" : "translateY(0)",
      transition: phase === "exit"
        ? `opacity 150ms ${EASE_OUT_QUINT}, transform 150ms ${EASE_OUT_QUINT}`
        : `opacity 250ms ${EASE_OUT_QUINT}, transform 250ms ${EASE_OUT_QUINT}`,
      willChange: "transform, opacity",
    }}>{displayChildren}</div>
  );
}

function QLabel({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col gap-[6px] mb-[4px]">
      <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "18px", color: "#fff", lineHeight: "27px", margin: 0 }}>{children}</h3>
      {sub && <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

function ctaStyle(enabled: boolean): React.CSSProperties {
  if (!enabled) {
    return { background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)", border: "none" };
  }
  return {
    background: "linear-gradient(180deg, #1a75ff 0%, #0058e0 100%)",
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.24), 0 2px 3px 0 rgba(34,42,53,0.20), 0 1px 1px 0 rgba(255,255,255,0.07) inset, 0 0 0 1px #0064FF",
    border: "none",
  };
}

/* ── SVG icons ── */
function SoloSvg({ active, size = 24 }: { active: boolean; size?: number }) {
  const c = active ? "#fff" : "rgba(255,255,255,0.35)";
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="4.5" stroke={c} strokeWidth="1.5" style={{ transition: "stroke 0.2s ease" }} />
      <path d="M6 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.2s ease" }} />
    </svg>
  );
}

function TeamSvg({ active, size = 24 }: { active: boolean; size?: number }) {
  const c1 = active ? "#fff" : "rgba(255,255,255,0.35)";
  const c2 = active ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)";
  const w = Math.round(size * 34 / 28);
  return (
    <svg width={w} height={size} viewBox="0 0 34 28" fill="none">
      <circle cx="12" cy="9" r="4.5" stroke={c1} strokeWidth="1.5" style={{ transition: "stroke 0.2s ease" }} />
      <path d="M4 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={c1} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.2s ease" }} />
      <circle cx="22.5" cy="10.5" r="3.5" stroke={c2} strokeWidth="1.5" style={{ transition: "stroke 0.2s ease" }} />
      <path d="M22.5 16c3.31 0 6 2.69 6 6" stroke={c2} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.2s ease" }} />
    </svg>
  );
}

/* ── Join type pickers ── */

function ChoiceBare({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "20px", minHeight: "160px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.5)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "24px", width: "100%" }}>
      <button onClick={() => onSelect("solo")} className="press-scale" style={card(s)}>
        <div style={{ marginBottom: "20px" }}><SoloSvg active={s} /></div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", marginTop: "5px" }}>Just you.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", color: s ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" style={card(t)}>
        <div style={{ marginBottom: "20px" }}><TeamSvg active={t} /></div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", marginTop: "5px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", color: t ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)" }}> / person</span></span>
      </button>
    </div>
  );
}

function ChoiceContained({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "20px", minHeight: "190px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.5)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  const well = (a: boolean): React.CSSProperties => ({
    width: "48px", height: "48px", borderRadius: "12px",
    background: a ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "24px", width: "100%" }}>
      <button onClick={() => onSelect("solo")} className="press-scale" style={card(s)}>
        <div style={well(s)}><SoloSvg active={s} /></div>
        <div style={{ width: "100%", height: "1px", background: s ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", margin: "16px 0 14px" }} />
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", lineHeight: 1.5, marginTop: "5px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", color: s ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" style={card(t)}>
        <div style={well(t)}><TeamSvg active={t} /></div>
        <div style={{ width: "100%", height: "1px", background: t ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", margin: "16px 0 14px" }} />
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", lineHeight: 1.5, marginTop: "5px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", color: t ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)" }}> / person</span></span>
      </button>
    </div>
  );
}

function ChoiceRadio({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      {([["solo", "Join solo", "₹974"], ["team", "Join as a team", "₹974 per person"]] as const).map(([id, label, sub]) => {
        const active = selected === id;
        return (
          <button key={id} onClick={() => onSelect(id)} className="press-scale"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderRadius: "14px", textAlign: "left", border: "none",
              boxShadow: active ? `inset 0 0 0 1.5px rgba(255,255,255,0.5)` : "inset 0 0 0 1px rgba(255,255,255,0.07)",
              background: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
              cursor: "pointer", transition: "background 0.15s ease, box-shadow 0.15s ease",
            }}>
            <div>
              <div style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: active ? "#fff" : "rgba(255,255,255,0.85)", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontFamily: monoFont, fontSize: "12px", color: active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)" }}>{sub}</div>
            </div>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%",
              border: `2px solid ${active ? "#fff" : "rgba(255,255,255,0.15)"}`,
              background: active ? "#fff" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s ease", flexShrink: 0 }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#000",
                transform: active ? "scale(1)" : "scale(0)", transition: `transform 200ms ${EASE_OUT_QUINT}` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── 3D variant helpers ── */
const ICON_BG_SZ = 64;
const SQ_R = 12;
function iconBg(a: boolean, shape: IconShape, bg: [string, string], ring: [string, string]): React.CSSProperties {
  return { width: ICON_BG_SZ, height: ICON_BG_SZ, borderRadius: shape === "circle" ? "50%" : `${SQ_R}px`, overflow: "hidden", background: a ? bg[0] : bg[1], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px", boxShadow: a ? `0 0 0 1px ${ring[0]}` : `0 0 0 1px ${ring[1]}`, transition: "background 0.2s ease, box-shadow 0.2s ease, border-radius 0.25s ease" };
}
function imgClip(shape: IconShape): string | undefined { return shape === "circle" ? "50%" : undefined; }

function Choice3DCard(a: boolean): React.CSSProperties {
  return {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "200px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  };
}

function Choice3D({ selected, onSelect, shape = "circle", soloImg, teamImg, bg, ring, soloSize = 38, teamSize = 44 }: {
  selected: JoinType; onSelect: (t: JoinType) => void; shape?: IconShape;
  soloImg: string; teamImg: string; bg: [string, string]; ring: [string, string];
  soloSize?: number; teamSize?: number;
}) {
  const s = selected === "solo", t = selected === "team";
  return (
    <div style={{ display: "flex", gap: "24px", width: "100%" }}>
      <button onClick={() => onSelect("solo")} className="press-scale" style={Choice3DCard(s)}>
        <div style={iconBg(s, shape, bg, ring)}>
          <Image src={soloImg} alt="" width={soloSize} height={soloSize} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" style={Choice3DCard(t)}>
        <div style={iconBg(t, shape, bg, ring)}>
          <Image src={teamImg} alt="" width={teamSize} height={teamSize} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── Confetti ── */
function ConfettiCanvas({ active }: { active: boolean }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const c = ref.current, ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const ps = Array.from({ length: 80 }, () => ({
      x: c.width / 2, y: c.height / 2, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 4,
      size: Math.random() * 6 + 2, color: ["#408cff", "#5b9eff", "#fff", "#a78bfa", "#34d399"][Math.floor(Math.random() * 5)], life: 1,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      let alive = false;
      for (const p of ps) { if (p.life <= 0) continue; alive = true; p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.012; ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.size, p.size); }
      if (alive) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  if (!active) return null;
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none z-20" />;
}

function CompletionScreen() {
  const [v, setV] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setV(true))); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "60px 20px", textAlign: "center", opacity: v ? 1 : 0, transform: v ? "scale(1)" : "scale(0.98)", transition: `opacity 300ms ${EASE_OUT_QUINT}, transform 300ms ${EASE_OUT_QUINT}` }}>
      <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
      <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "24px", color: "#fff", margin: 0 }}>You&apos;re in!</h2>
      <p style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: "320px" }}>Registration complete. Check your email for confirmation details.</p>
    </div>
  );
}

/* ── Already-registered state screens ── */
function AlreadyRegisteredSolo() {
  return (
    <div className="flex flex-col gap-[20px] items-center text-center" style={{ padding: "60px 20px" }}>
      <div style={{ fontSize: "40px" }}>✅</div>
      <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "22px", color: "#fff", margin: 0 }}>You&apos;re already registered</h2>
      <p style={{ fontFamily: gilroy, fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: "320px", lineHeight: 1.6 }}>
        You registered as a solo attendee. Check your email for your ticket and event details.
      </p>
      <div className="flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] mt-[8px]"
        style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
        <span style={{ fontFamily: monoFont, fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>john@example.com</span>
      </div>
    </div>
  );
}

function AlreadyAddedAsTeammate() {
  return (
    <div className="flex flex-col gap-[20px] items-center text-center" style={{ padding: "60px 20px" }}>
      <div style={{ fontSize: "40px" }}>👋</div>
      <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "22px", color: "#fff", margin: 0 }}>You&apos;ve been added to a team</h2>
      <p style={{ fontFamily: gilroy, fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: "340px", lineHeight: 1.6 }}>
        A teammate added you. Complete your registration to confirm your spot.
      </p>
      <div className="flex flex-col gap-[6px] items-center mt-[8px]">
        <span style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>Team lead</span>
        <span style={{ fontFamily: gilroy, fontSize: "15px", fontWeight: 600, color: "#fff" }}>Aarshi Mehta</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   OTP Input Component
   ════════════════════════════════════════════════════════════════════════ */

function OtpInput({ value, onChange, length = 6 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (idx: number, char: string) => {
    if (!/^\d?$/.test(char)) return;
    const arr = value.split("");
    arr[idx] = char;
    const next = arr.join("").slice(0, length);
    onChange(next);
    if (char && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-[8px]">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          autoFocus={i === 0}
          style={{
            width: "48px", height: "56px", textAlign: "center",
            fontFamily: monoFont, fontSize: "22px", fontWeight: 700, color: "#fff",
            background: "rgba(255,255,255,0.04)",
            boxShadow: value[i] ? "inset 0 0 0 1.5px rgba(255,255,255,0.3)" : "inset 0 0 0 1px rgba(255,255,255,0.08)",
            border: "none", borderRadius: "10px", outline: "none",
            transition: "box-shadow 0.15s ease",
          }}
          onFocus={(e) => { e.target.style.boxShadow = "inset 0 0 0 1.5px rgba(255,255,255,0.5)"; }}
          onBlur={(e) => { e.target.style.boxShadow = value[i] ? "inset 0 0 0 1.5px rgba(255,255,255,0.3)" : "inset 0 0 0 1px rgba(255,255,255,0.08)"; }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   Main Component
   ════════════════════════════════════════════════════════════════════════ */

export default function CheckoutV3({
  layout = "card",
  sidebarVariant = "v11",
  choiceVariant = "v1",
  iconShape = "circle",
  simState = "fresh",
}: {
  layout?: Layout;
  sidebarVariant?: string;
  choiceVariant?: ChoiceVariant;
  iconShape?: IconShape;
  simState?: SimState;
}) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const countdown = useCheckoutCountdown();

  const [joinType, setJoinType] = useState<JoinType>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [teammateEmails, setTeammateEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [typeStepRevisited, setTypeStepRevisited] = useState(false);

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = (() => {
    if (otpSent && !otpVerified && stepIdx >= 2) return "otp" as StepId;
    if (otpVerified && joinType === "team" && stepIdx >= 3) return "teammates" as StepId;
    return (["type", "info", "phone"] as StepId[])[Math.min(stepIdx, 2)];
  })();

  const totalSteps = joinType === "team" ? 4 : 3;
  const effectiveIdx = currentStep === "otp" ? 2 : currentStep === "teammates" ? 3 : stepIdx;
  const isLastStep = (currentStep === "otp" && joinType === "solo") || currentStep === "teammates";
  const progress = Math.max(5, (effectiveIdx / (totalSteps - 1)) * 100);
  const memberCount = joinType === "team" ? teammateEmails.length + 1 : 1;

  const canContinue = (() => {
    if (currentStep === "type") return joinType !== null;
    if (currentStep === "info") return name.trim().length > 0 && email.trim().length > 0 && email.includes("@");
    if (currentStep === "phone") return phone.trim().length >= 10;
    if (currentStep === "otp") return otp.length === 6;
    if (currentStep === "teammates") return true;
    return false;
  })();

  const goBack = () => {
    if (currentStep === "otp") { setOtpSent(false); setOtp(""); return; }
    if (currentStep === "teammates") { setStepIdx(2); return; }
    const next = Math.max(0, stepIdx - 1);
    if (next === 0) setTypeStepRevisited(true);
    setStepIdx(next);
  };

  const goForward = () => {
    if (currentStep === "phone" && !otpSent) {
      setOtpSent(true);
      return;
    }
    if (currentStep === "otp") {
      setOtpVerified(true);
      if (joinType === "team") { setStepIdx(3); return; }
      // Solo: OTP verified → show payment modal
      setShowPaymentModal(true);
      return;
    }
    if (currentStep === "teammates") {
      // Team: done adding teammates → show payment modal
      setShowPaymentModal(true);
      return;
    }
    setStepIdx(prev => prev + 1);
  };

  const addTeammate = () => {
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@") || teammateEmails.length >= 6 || teammateEmails.includes(trimmed)) return;
    setTeammateEmails(prev => [...prev, trimmed]);
    setNewEmail("");
  };

  const removeTeammate = (email: string) => {
    setTeammateEmails(prev => prev.filter(e => e !== email));
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Enter" && canContinue && !completed && !showPaymentModal && currentStep !== "otp") {
      e.preventDefault();
      goForward();
    }
  }, [canContinue, completed, showPaymentModal, currentStep, otpSent, otpVerified, joinType]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // CTA label
  const ctaLabel = (() => {
    if (currentStep === "phone" && !otpSent) return "Send OTP";
    if (currentStep === "otp") return "Verify & Continue";
    if (currentStep === "teammates") return "Continue";
    return "Continue";
  })();

  // Choice picker dispatch
  const is3D = ["v5", "v6", "v7", "v12", "v13"].includes(choiceVariant);
  const render3D = (selected: JoinType, onSelect: (t: JoinType) => void) => {
    const configs: Record<string, { soloImg: string; teamImg: string; bg: [string, string]; ring: [string, string]; soloSize?: number; teamSize?: number }> = {
      v5:  { soloImg: "/images/icon-solo.png", teamImg: "/images/icon-team.png", bg: ["rgba(255,255,255,0.28)", "rgba(255,255,255,0.18)"], ring: ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"] },
      v6:  { soloImg: "/images/silver02.png", teamImg: "/images/silver01.png", bg: ["rgba(180,190,200,0.22)", "rgba(180,190,200,0.12)"], ring: ["rgba(200,210,220,0.18)", "rgba(200,210,220,0.08)"], teamSize: 44 },
      v7:  { soloImg: "/images/blue02.png", teamImg: "/images/blue01.png", bg: ["rgba(100,160,255,0.2)", "rgba(100,160,255,0.1)"], ring: ["rgba(100,160,255,0.15)", "rgba(100,160,255,0.06)"], teamSize: 44 },
      v12: { soloImg: "/images/silver_user.png", teamImg: "/images/silver_users.png", bg: ["rgba(180,190,200,0.22)", "rgba(180,190,200,0.12)"], ring: ["rgba(200,210,220,0.18)", "rgba(200,210,220,0.08)"], soloSize: 48, teamSize: 54 },
      v13: { soloImg: "/images/white_user.png", teamImg: "/images/white_users.png", bg: ["rgba(255,255,255,0.16)", "rgba(255,255,255,0.08)"], ring: ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.06)"] },
    };
    const c = configs[choiceVariant] || configs.v5;
    return <Choice3D selected={selected} onSelect={onSelect} shape={iconShape} {...c} />;
  };

  /* ── Simulated states ── */
  if (simState === "registered-solo") {
    return renderShell(<AlreadyRegisteredSolo />, true);
  }
  if (simState === "added-as-teammate") {
    return renderShell(<AlreadyAddedAsTeammate />, true);
  }

  /* ── Step content ── */
  const formContent = completed ? (
    <div className="flex flex-col gap-[30px] w-full flex-1 items-center justify-center">
      <CompletionScreen />
    </div>
  ) : (
    <div className="flex flex-col gap-[30px] w-full flex-1">
      <StepTransition stepKey={currentStep}>
        {currentStep === "type" && (() => {
          const handleSelect = (t: JoinType) => {
            setJoinType(t);
            if (!typeStepRevisited) {
              setTimeout(() => setStepIdx(prev => prev + 1), 250);
            }
          };
          return (
            <div className="flex flex-col gap-[20px]">
              <QLabel>How are you joining?</QLabel>
              {is3D ? render3D(joinType, handleSelect) : (
                choiceVariant === "v2" ? <ChoiceContained selected={joinType} onSelect={handleSelect} /> :
                choiceVariant === "v3" ? <ChoiceRadio selected={joinType} onSelect={handleSelect} /> :
                <ChoiceBare selected={joinType} onSelect={handleSelect} />
              )}
            </div>
          );
        })()}

        {currentStep === "info" && (
          <div className="flex flex-col gap-[20px]">
            <QLabel>Let&apos;s get you registered</QLabel>
            <div className="flex flex-col gap-[20px]">
              <MaterialInput label="Full name" value={name} onChange={setName} autoFocus />
              <MaterialInput label="Email address" value={email} onChange={setEmail} type="email" />
            </div>
          </div>
        )}

        {currentStep === "phone" && (
          <div className="flex flex-col gap-[20px]">
            <QLabel sub="We'll send a verification code to this number.">Your mobile number</QLabel>
            <MaterialInput label="Phone number" value={phone} onChange={setPhone} type="tel" autoFocus />
          </div>
        )}

        {currentStep === "otp" && (
          <div className="flex flex-col gap-[20px]">
            <QLabel sub={`Code sent to ${phone}`}>Enter verification code</QLabel>
            <OtpInput value={otp} onChange={setOtp} />
            <button onClick={() => { setOtp(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0", alignSelf: "flex-start" }}>
              <span style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "underline", textUnderlineOffset: "3px" }}>Resend code</span>
            </button>
          </div>
        )}

        {currentStep === "teammates" && (
          <div className="flex flex-col gap-[20px]">
            <QLabel>Invite teammates</QLabel>
            <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>
              {teammateEmails.length >= 6
                ? "You've reached the maximum team size."
                : `Max 6 teammates allowed. ₹974 per person.`}
            </p>

            <div className="flex flex-col gap-[16px] w-full">
              {/* Teammate chips */}
              {teammateEmails.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                  {teammateEmails.map((em) => (
                    <div key={em} style={{
                      padding: "8px 16px", borderRadius: "100px",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", gap: "10px",
                    }}>
                      <span style={{ fontFamily: gilroy, fontWeight: 500, fontSize: "15px", color: "rgba(255,255,255,0.9)" }}>{em}</span>
                      <button onClick={() => removeTeammate(em)}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "8px", margin: "-6px", borderRadius: "50%" }}>
                        <X size={16} color="rgba(255,255,255,0.6)" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Email input + Add button — hidden when team is full */}
              {teammateEmails.length < 6 && (
                <>
                  <MaterialInput label="Teammate email" type="email" value={newEmail}
                    onChange={setNewEmail} onEnter={addTeammate} />

                  <button onClick={addTeammate}
                    disabled={!newEmail.trim().includes("@")}
                    className="press-scale"
                    style={{
                      width: "100%", padding: "12px", borderRadius: "10px", border: "none",
                      background: "rgba(255,255,255,0.08)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                      color: "#fff",
                      fontFamily: gilroy, fontSize: "14px", fontWeight: 600,
                      cursor: newEmail.trim().includes("@") ? "pointer" : "default",
                      transition: "background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      opacity: newEmail.trim().includes("@") ? 1 : 0.4,
                    }}>
                    <Plus size={16} />
                    Add Teammate
                  </button>
                </>
              )}

              {/* Team full confirmation */}
              {teammateEmails.length >= 6 && (
                <div style={{
                  padding: "14px 16px", borderRadius: "10px",
                  background: "rgba(139,198,138,0.08)",
                  boxShadow: "inset 0 0 0 1px rgba(139,198,138,0.2)",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <span style={{ fontSize: "16px" }}>✓</span>
                  <span style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                    Team full — 6 of 6 added. Remove a teammate to add someone else.
                  </span>
                </div>
              )}

              {/* Empty state */}
              {teammateEmails.length === 0 && (
                <div style={{ padding: "16px", borderRadius: "100px", border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
                  <span style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>No teammates added yet</span>
                </div>
              )}
            </div>
          </div>
        )}
      </StepTransition>
    </div>
  );

  /* ── Render ── */
  function renderShell(content: React.ReactNode, isStatic = false) {
    if (layout === "immersive") {
      return (
        <div style={{ position: "relative", minHeight: "100vh", width: "100%", background: "#000", overflow: "hidden" }}>
          <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.45)}`}</style>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "300px", background: "radial-gradient(ellipse at 30% 0%, rgba(0,60,200,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
              <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>
                {isStatic ? "—" : `${effectiveIdx + 1} / ${totalSteps}`}
              </span>
              <div style={{ flex: 1, height: "2px", borderRadius: "1px", background: "rgba(255,255,255,0.1)", position: "relative" }}>
                <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${isStatic ? 100 : completed ? 100 : Math.max(3, progress)}%`, background: BLUE, borderRadius: "1px", transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
              </div>
            </div>
            <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "32px", width: "44px", height: "44px", borderRadius: "50%" }} aria-label="Close">
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "50%", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "white" }}><X size={16} /></span>
            </Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "120px 48px", maxWidth: "1200px", margin: "0 auto", gap: "80px", position: "relative" }}>
            <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} />
            <div style={{ flex: 1, maxWidth: "520px" }}>
              {!isStatic && stepIdx > 0 && !completed && (
                <button onClick={goBack} className="flex items-center gap-1 mb-10 text-[12px] text-white/60 hover:text-white transition-colors"
                  style={{ fontFamily: monoFont, background: "none", border: "none", cursor: "pointer", minHeight: "40px" }}>
                  <ChevronLeft size={14} /><span>BACK</span>
                </button>
              )}
              {content}
              {!isStatic && !completed && !(currentStep === "type" && !typeStepRevisited) && (
                <div style={{ marginTop: "40px" }}>
                  <button onClick={() => canContinue && goForward()} disabled={!canContinue}
                    className="press-scale flex items-center justify-center w-full py-[14px] rounded-[12px]"
                    style={{ ...ctaStyle(canContinue), transition: "all 0.2s ease" }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px", color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>{ctaLabel}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Card layout
    return (
      <div className="relative min-h-screen w-full bg-black overflow-hidden flex items-start justify-center">
        <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.65)}`}</style>
        <div className="absolute h-[450px] inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-[-675px_-3240px]" style={{ filter: "blur(90px)" }}>
            <Image src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1600&h=900&fit=crop" alt="" fill className="object-cover" priority />
          </div>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[180px]" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), black)" }} />
        </div>
        <div className="relative z-10 w-full max-w-[1000px] px-[40px]">
          <div className="relative flex items-start justify-between w-full" style={{ minHeight: "450px", height: "720px", padding: "32px 16px 16px" }}>
            <div className="absolute left-0 right-0 flex items-center gap-[12px] px-[16px] pb-[32px] z-10" style={{ top: "40px" }}>
              <div className="relative h-[4px] flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${isStatic ? 100 : completed ? 100 : progress}%`, transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
              </div>
              <Link href="/" className="flex items-center justify-center shrink-0" style={{ width: "40px", height: "40px", borderRadius: "50%" }} aria-label="Close">
                <span className="flex items-center justify-center size-[28px] rounded-full" style={{ background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}><X className="size-[14px] text-white" /></span>
              </Link>
            </div>
            <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} className="mt-[80px]" />
            <div className="flex flex-col items-start shrink-0 overflow-auto pt-[80px] px-[8px]" style={{ width: "493px", height: "680px" }}>
              <div className="flex flex-col w-full h-full">
                {!isStatic && stepIdx > 0 && !completed && currentStep !== "otp" && (
                  <button onClick={goBack} className="flex items-center gap-1 mb-6 text-[12px] text-white/60 hover:text-white transition-colors"
                    style={{ fontFamily: monoFont, minHeight: "40px", background: "none", border: "none", cursor: "pointer" }}>
                    <ChevronLeft size={14} /><span>BACK</span>
                  </button>
                )}
                {currentStep === "otp" && !isStatic && (
                  <button onClick={goBack} className="flex items-center gap-1 mb-6 text-[12px] text-white/60 hover:text-white transition-colors"
                    style={{ fontFamily: monoFont, minHeight: "40px", background: "none", border: "none", cursor: "pointer" }}>
                    <ChevronLeft size={14} /><span>CHANGE NUMBER</span>
                  </button>
                )}
                {content}
                {!isStatic && !completed && !(currentStep === "type" && !typeStepRevisited) && (
                  <div className="flex items-center gap-[12px] py-[32px] w-full sticky bottom-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                    <button onClick={() => canContinue && goForward()} disabled={!canContinue}
                      className="press-scale flex items-center justify-center w-full py-[12px] rounded-[10px]"
                      style={{ ...ctaStyle(canContinue), transition: "all 0.2s ease" }}>
                      <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px", color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>{ctaLabel}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const shell = renderShell(formContent);

  return (
    <>
      {shell}

      {/* Payment modal */}
      {showPaymentModal && !completed && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          animation: "fadeIn 200ms ease",
        }}>
          <div style={{
            width: "100%", maxWidth: "400px", padding: "40px 32px",
            borderRadius: "20px",
            background: "rgba(20,20,20,0.95)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(0,0,0,0.6)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "24px", textAlign: "center",
          }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
            }}>
              💳
            </div>

            <div className="flex flex-col gap-[8px]">
              <h3 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "20px", color: "#fff", margin: 0 }}>
                Complete Payment
              </h3>
              <p style={{ fontFamily: gilroy, fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
                ₹{(memberCount * 974).toLocaleString("en-IN")} for {memberCount} {memberCount === 1 ? "attendee" : "attendees"}
              </p>
            </div>

            <button
              onClick={() => {
                setShowPaymentModal(false);
                setCompleted(true);
              }}
              className="press-scale flex items-center justify-center w-full py-[14px] rounded-[12px]"
              style={{ ...ctaStyle(true), transition: "all 0.2s ease", cursor: "pointer" }}>
              <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px", color: "#fff" }}>
                Payment Done &mdash; Continue
              </span>
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </>
  );
}
