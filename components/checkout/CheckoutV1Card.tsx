"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

import { useCheckoutCountdown } from "@/lib/hooks";
import SidebarSwitch from "./SidebarSwitch";
import { MaterialInput, MaterialTextarea } from "./MaterialInput";
import { useAccentColor } from "./InputStyleContext";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const serifFont = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

const ROLES = ["Builder", "Designer", "PM", "Marketer", "Investor", "Other"];
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

type JoinType = "solo" | "team" | null;
type StepId = "type" | "team" | "personal" | "project";

interface Teammate {
  id: string;
  email: string;
  role: string;
}

/* #1-A: Step transition with exit animation — staggered fade */
function StepTransition({ children, stepKey }: { children: React.ReactNode; stepKey: string }) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [displayKey, setDisplayKey] = useState(stepKey);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    if (stepKey !== displayKey) {
      setPhase("exit");
      const exitTimer = setTimeout(() => {
        setDisplayKey(stepKey);
        setDisplayChildren(children);
        setPhase("enter");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setPhase("visible"));
        });
      }, 150); // exit duration
      return () => clearTimeout(exitTimer);
    } else {
      setDisplayChildren(children);
    }
  }, [stepKey, children, displayKey]);

  useEffect(() => {
    if (phase === "enter") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("visible"));
      });
    }
  }, [phase]);

  const style: React.CSSProperties = {
    opacity: phase === "visible" ? 1 : 0,
    transform:
      phase === "exit" ? "translateY(-4px)" :
      phase === "enter" ? "translateY(8px)" :
      "translateY(0)",
    transition: phase === "exit"
      ? `opacity 150ms ${EASE_OUT_QUINT}, transform 150ms ${EASE_OUT_QUINT}`
      : `opacity 250ms ${EASE_OUT_QUINT}, transform 250ms ${EASE_OUT_QUINT}`,
    willChange: "transform, opacity",
  };

  return <div style={style}>{displayChildren}</div>;
}

function QLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <h3 className="text-[18px] text-white leading-[27px] w-full" style={{ fontFamily: gilroy, fontWeight: 700, textWrap: "balance" }}>
      {children}
      {required && <span className="text-[16px] ml-1" style={{ fontFamily: monoFont, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>*</span>}
    </h3>
  );
}

function RolePills({ selected, onSelect, small }: { selected: string; onSelect: (r: string) => void; small?: boolean }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const [justSelected, setJustSelected] = useState<string | null>(null);

  const handleSelect = (r: string) => {
    onSelect(r);
    setJustSelected(r);
    setTimeout(() => setJustSelected(null), 200);
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: small ? "6px" : "8px" }}>
      {ROLES.map((r) => {
        const active = r === selected;
        const popping = r === justSelected;
        return (
          <button key={r} onClick={() => handleSelect(r)}
            className="press-scale"
            style={{
              padding: small ? "4px 12px" : "6px 16px", borderRadius: "100px",
              border: "none",
              boxShadow: active
                ? `0 0 0 1px rgba(${BLUE_RGB},0.5), 0 1px 3px rgba(0,0,0,0.2)`
                : "inset 0 0 0 1px rgba(255,255,255,0.12)",
              background: active ? `rgba(${BLUE_RGB},0.15)` : "transparent",
              color: active ? BLUE : "rgba(255,255,255,0.65)",
              fontSize: small ? "12px" : "13px", fontFamily: gilroy, fontWeight: active ? 600 : 400,
              cursor: "pointer",
              transition: "background 0.12s ease, box-shadow 0.12s ease, color 0.12s ease, transform 200ms cubic-bezier(0.23, 1, 0.32, 1)",
              transform: popping ? "scale(1.04)" : "scale(1)",
              minHeight: "40px",
          }}>{r}</button>
        );
      })}
    </div>
  );
}

/* ── Join Type Choice — shared SVGs ──────────────────────────────────── */

type ChoiceVariant = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7" | "v8" | "v9" | "v10" | "v11" | "v12" | "v13";

function SoloSvg({ active, size = 28 }: { active: boolean; size?: number }) {
  const c = active ? "#fff" : "rgba(255,255,255,0.35)";
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="9" r="4.5" stroke={c} strokeWidth="1.5" style={{ transition: "stroke 0.2s ease" }} />
      <path d="M6 24c0-4.42 3.58-8 8-8s8 3.58 8 8" stroke={c} strokeWidth="1.5" strokeLinecap="round" style={{ transition: "stroke 0.2s ease" }} />
    </svg>
  );
}

function TeamSvg({ active, size = 28 }: { active: boolean; size?: number }) {
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

/*
 * All four variants share the same skeleton:
 *   side-by-side · icon top · everything left-aligned · tall
 *
 * What changes between them:
 *   v1 "Bare"       — naked icon, open space, minimal surface
 *   v2 "Contained"  — icon in a tinted well, hairline divides icon zone from text
 *   v3 "Generous"   — larger icon, bigger type, more padding, no description
 *   v4 "Grounded"   — icon + label share a row, description below, price in a footer strip
 */

/* ── V1 Bare — naked icon, clean space ───────────────────────────────── */
function ChoiceV1({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "180px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? `inset 0 0 0 1.5px rgba(${BLUE_RGB},0.3)` : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={{ marginBottom: "20px" }}><SoloSvg active={s} /></div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={{ marginBottom: "20px" }}><TeamSvg active={t} /></div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── V2 Contained — icon in tinted well, hairline separates zones ────── */
function ChoiceV2({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "20px", minHeight: "190px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(255,255,255,0.06)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? `inset 0 0 0 1.5px rgba(255,255,255,0.5)` : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  const well = (a: boolean): React.CSSProperties => ({
    width: "48px", height: "48px", borderRadius: "12px",
    background: a ? `rgba(255,255,255,0.1)` : "rgba(255,255,255,0.04)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={well(s)}><SoloSvg active={s} size={24} /></div>
        <div style={{ width: "100%", height: "1px", background: s ? `rgba(255,255,255,0.1)` : "rgba(255,255,255,0.05)", margin: "16px 0 14px", transition: "background 0.2s ease" }} />
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", lineHeight: 1.5, marginTop: "5px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={well(t)}><TeamSvg active={t} size={24} /></div>
        <div style={{ width: "100%", height: "1px", background: t ? `rgba(255,255,255,0.1)` : "rgba(255,255,255,0.05)", margin: "16px 0 14px", transition: "background 0.2s ease" }} />
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", lineHeight: 1.5, marginTop: "5px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "14px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── V3 Generous — bigger icon, bigger type, no description, more air ── */
function ChoiceV3({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "28px 24px 24px", minHeight: "200px", borderRadius: "16px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? `inset 0 0 0 1.5px rgba(${BLUE_RGB},0.3)` : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "12px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={{ marginBottom: "28px" }}><SoloSvg active={s} size={34} /></div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "20px", color: s ? "#fff" : "rgba(255,255,255,0.85)", letterSpacing: "-0.3px" }}>Solo</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "20px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={{ marginBottom: "28px" }}><TeamSvg active={t} size={34} /></div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "20px", color: t ? "#fff" : "rgba(255,255,255,0.85)", letterSpacing: "-0.3px" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)", marginTop: "4px" }}>up to 6</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", marginTop: "auto", paddingTop: "20px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)" }}> ea</span></span>
      </button>
    </div>
  );
}

/* ── V4 Grounded — icon + label share top row, desc below, footer strip  */
function ChoiceV4({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    borderRadius: "14px", border: "none", cursor: "pointer", textAlign: "left",
    overflow: "hidden",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? `inset 0 0 0 1.5px rgba(${BLUE_RGB},0.3)` : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={{ padding: "22px 20px 0", width: "100%" }}>
          <div style={{ marginBottom: "14px" }}><SoloSvg active={s} /></div>
          <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)", display: "block" }}>Solo</span>
          <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", lineHeight: 1.5, marginTop: "5px", display: "block", paddingBottom: "18px" }}>Just you and your project.</span>
        </div>
        <div style={{ width: "100%", padding: "12px 20px", background: s ? `rgba(${BLUE_RGB},0.04)` : "rgba(255,255,255,0.015)", boxShadow: "0 -1px 0 " + (s ? `rgba(${BLUE_RGB},0.08)` : "rgba(255,255,255,0.04)"), transition: "background 0.2s ease, box-shadow 0.2s ease" }}>
          <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)" }}>₹974</span>
        </div>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={{ padding: "22px 20px 0", width: "100%" }}>
          <div style={{ marginBottom: "14px" }}><TeamSvg active={t} /></div>
          <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)", display: "block" }}>Team</span>
          <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.42)", lineHeight: 1.5, marginTop: "5px", display: "block", paddingBottom: "18px" }}>Up to 6 people.</span>
        </div>
        <div style={{ width: "100%", padding: "12px 20px", background: t ? `rgba(${BLUE_RGB},0.04)` : "rgba(255,255,255,0.015)", boxShadow: "0 -1px 0 " + (t ? `rgba(${BLUE_RGB},0.08)` : "rgba(255,255,255,0.04)"), transition: "background 0.2s ease, box-shadow 0.2s ease" }}>
          <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.22)" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)" }}> / person</span></span>
        </div>
      </button>
    </div>
  );
}

/*
 * Icon background shape for 3D variants.
 * Square radius = 12px on a 64px container.
 * The card itself is 14px radius — 12px reads as intentionally nested.
 * overflow:hidden on the container clips the image to the shape,
 * so no separate image border-radius needed for square.
 */
type IconShape = "circle" | "square";
const ICON_BG_SZ = 64;
const SQ_R = 12;
function iconBg(a: boolean, shape: IconShape, bg: [string, string], ring: [string, string]): React.CSSProperties {
  return { width: ICON_BG_SZ, height: ICON_BG_SZ, borderRadius: shape === "circle" ? "50%" : `${SQ_R}px`, overflow: "hidden", background: a ? bg[0] : bg[1], display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px", boxShadow: a ? `0 0 0 1px ${ring[0]}` : `0 0 0 1px ${ring[1]}`, transition: "background 0.2s ease, box-shadow 0.2s ease, border-radius 0.25s ease" };
}
function imgClip(shape: IconShape): string | undefined { return shape === "circle" ? "50%" : undefined; }

/* ── V5 3D Dark ── */
function ChoiceV5({ selected, onSelect, shape = "circle" }: { selected: JoinType; onSelect: (t: JoinType) => void; shape?: IconShape }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "200px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={iconBg(s, shape, ["rgba(255,255,255,0.28)", "rgba(255,255,255,0.18)"], ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"])}>
          <Image src="/images/icon-solo.png" alt="" width={38} height={38} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={iconBg(t, shape, ["rgba(255,255,255,0.28)", "rgba(255,255,255,0.18)"], ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.06)"])}>
          <Image src="/images/icon-team.png" alt="" width={42} height={42} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── V6 3D Silver — chrome icons on dark circle ──────────────────────── */
function ChoiceV6({ selected, onSelect, shape = "circle" }: { selected: JoinType; onSelect: (t: JoinType) => void; shape?: IconShape }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "200px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  const bg: [string, string] = ["rgba(180,190,200,0.22)", "rgba(180,190,200,0.12)"];
  const ring: [string, string] = ["rgba(200,210,220,0.18)", "rgba(200,210,220,0.08)"];
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={iconBg(s, shape, bg, ring)}>
          <Image src="/images/silver02.png" alt="" width={38} height={38} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={iconBg(t, shape, bg, ring)}>
          <Image src="/images/silver01.png" alt="" width={44} height={44} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── V7 3D Blue — blue 3D icons on light-blue circle ─────────────────── */
function ChoiceV7({ selected, onSelect, shape = "circle" }: { selected: JoinType; onSelect: (t: JoinType) => void; shape?: IconShape }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "200px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  const bg: [string, string] = ["rgba(100,160,255,0.2)", "rgba(100,160,255,0.1)"];
  const ring: [string, string] = ["rgba(100,160,255,0.15)", "rgba(100,160,255,0.06)"];
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={iconBg(s, shape, bg, ring)}>
          <Image src="/images/blue02.png" alt="" width={38} height={38} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={iconBg(t, shape, bg, ring)}>
          <Image src="/images/blue01.png" alt="" width={44} height={44} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── V12 3D Silver 2 — silver_user / silver_users icons ─────────────── */
function ChoiceV12({ selected, onSelect, shape = "circle" }: { selected: JoinType; onSelect: (t: JoinType) => void; shape?: IconShape }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "200px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  const bg: [string, string] = ["rgba(180,190,200,0.22)", "rgba(180,190,200,0.12)"];
  const ring: [string, string] = ["rgba(200,210,220,0.18)", "rgba(200,210,220,0.08)"];
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={iconBg(s, shape, bg, ring)}>
          <Image src="/images/silver_user.png" alt="" width={48} height={48} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={iconBg(t, shape, bg, ring)}>
          <Image src="/images/silver_users.png" alt="" width={54} height={54} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── V13 3D White — white_user / white_users icons on soft-white circle ── */
function ChoiceV13({ selected, onSelect, shape = "circle" }: { selected: JoinType; onSelect: (t: JoinType) => void; shape?: IconShape }) {
  const { rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const card = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start",
    padding: "22px", minHeight: "200px", borderRadius: "14px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.05)` : "rgba(255,255,255,0.02)",
    boxShadow: a ? "inset 0 0 0 1.5px rgba(255,255,255,0.85)" : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  const bg: [string, string] = ["rgba(255,255,255,0.16)", "rgba(255,255,255,0.08)"];
  const ring: [string, string] = ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.06)"];
  return (
    <div style={{ display: "flex", gap: "10px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={card(s)}>
        <div style={iconBg(s, shape, bg, ring)}>
          <Image src="/images/white_user.png" alt="" width={38} height={38} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: s ? "#fff" : "rgba(255,255,255,0.85)" }}>Solo</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: s ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Just you and your project.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={card(t)}>
        <div style={iconBg(t, shape, bg, ring)}>
          <Image src="/images/white_users.png" alt="" width={44} height={44} style={{ objectFit: "contain", borderRadius: imgClip(shape) }} />
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px", color: t ? "#fff" : "rgba(255,255,255,0.85)" }}>Team</span>
        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "13px", color: t ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)", lineHeight: 1.5, marginTop: "6px" }}>Up to 6 people.</span>
        <span style={{ fontFamily: monoFont, fontSize: "13px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)", marginTop: "auto", paddingTop: "16px" }}>₹974<span style={{ color: t ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}> / person</span></span>
      </button>
    </div>
  );
}

/* ── V8 Simple Pill — horizontal row, pill-shaped, no icon, no desc ──── */
function ChoiceV8({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const pill = (a: boolean): React.CSSProperties => ({
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    padding: "14px 20px", borderRadius: "100px", border: "none",
    cursor: "pointer",
    background: a ? `rgba(${BLUE_RGB},0.12)` : "rgba(255,255,255,0.03)",
    boxShadow: a ? `inset 0 0 0 1.5px ${BLUE}` : "inset 0 0 0 1px rgba(255,255,255,0.08)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  return (
    <div style={{ display: "flex", gap: "8px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={pill(s)}>
        <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "15px", color: s ? "#fff" : "rgba(255,255,255,0.7)" }}>Solo</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={pill(t)}>
        <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "15px", color: t ? "#fff" : "rgba(255,255,255,0.7)" }}>Team</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>₹974/ea</span>
      </button>
    </div>
  );
}

/* ── V9 Simple Radio — stacked rows with radio dot, label + price ────── */
function ChoiceV9({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  const row = (a: boolean): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: "14px", width: "100%",
    padding: "16px 18px", borderRadius: "12px", border: "none",
    cursor: "pointer", textAlign: "left",
    background: a ? `rgba(${BLUE_RGB},0.06)` : "transparent",
    boxShadow: a ? `inset 0 0 0 1.5px rgba(${BLUE_RGB},0.3)` : "inset 0 0 0 1px rgba(255,255,255,0.07)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
  });
  const dot = (a: boolean): React.CSSProperties => ({
    width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
    background: a ? BLUE : "transparent",
    boxShadow: a ? "none" : "inset 0 0 0 1.5px rgba(255,255,255,0.2)",
    transition: "background 0.2s ease, box-shadow 0.2s ease",
    display: "flex", alignItems: "center", justifyContent: "center",
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }} role="radiogroup">
      <button onClick={() => onSelect("solo")} className="press-scale" aria-pressed={s} role="radio" style={row(s)}>
        <div style={dot(s)}>
          {s && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
        </div>
        <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "15px", color: s ? "#fff" : "rgba(255,255,255,0.75)", flex: 1 }}>Solo</span>
        <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: s ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>₹974</span>
      </button>
      <button onClick={() => onSelect("team")} className="press-scale" aria-pressed={t} role="radio" style={row(t)}>
        <div style={dot(t)}>
          {t && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "15px", color: t ? "#fff" : "rgba(255,255,255,0.75)" }}>Team</span>
          <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "12px", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)" }}>Up to 6 people</span>
        </div>
        <span style={{ fontFamily: monoFont, fontSize: "12px", fontVariantNumeric: "tabular-nums", color: t ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>₹974/ea</span>
      </button>
    </div>
  );
}

/* ── V10 Simple Toggle — single segmented control ────────────────────── */
function ChoiceV10({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const s = selected === "solo", t = selected === "team";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      <div style={{
        display: "flex", width: "100%", padding: "4px", borderRadius: "12px",
        background: "rgba(255,255,255,0.04)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
      }} role="radiogroup">
        {(["solo", "team"] as JoinType[]).map((type) => {
          const a = selected === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              aria-pressed={a}
              role="radio"
              style={{
                flex: 1, padding: "12px 16px", borderRadius: "9px", border: "none",
                cursor: "pointer",
                background: a ? `rgba(${BLUE_RGB},0.15)` : "transparent",
                boxShadow: a ? `inset 0 0 0 1px rgba(${BLUE_RGB},0.3), 0 1px 3px rgba(0,0,0,0.2)` : "none",
                transition: "background 0.2s ease, box-shadow 0.2s ease",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              }}
            >
              <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "15px", color: a ? "#fff" : "rgba(255,255,255,0.6)" }}>
                {type === "solo" ? "Solo" : "Team"}
              </span>
              <span style={{ fontFamily: monoFont, fontSize: "11px", fontVariantNumeric: "tabular-nums", color: a ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>
                {type === "solo" ? "₹974" : "₹974/ea"}
              </span>
            </button>
          );
        })}
      </div>
      {/* Contextual detail below the toggle */}
      <p style={{
        fontFamily: gilroy, fontWeight: 400, fontSize: "13px",
        color: "rgba(255,255,255,0.45)", lineHeight: 1.5, margin: 0,
        textAlign: "center",
      }}>
        {selected === "solo" ? "Just you and your project." : "Up to 6 people. ₹974 per person."}
      </p>
    </div>
  );
}

/* ── V11 Immersive — stacked rows, radio dot right, amber price ──────── */
function ChoiceV11({ selected, onSelect }: { selected: JoinType; onSelect: (t: JoinType) => void }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const opts: [JoinType, string, string][] = [
    ["solo", "Going solo", "₹974 — just you"],
    ["team", "Building a team", "₹974 per member"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }} role="radiogroup">
      {opts.map(([id, label, sub]) => {
        const a = selected === id;
        return (
          <button key={id} onClick={() => onSelect(id)}
            className="press-scale" aria-pressed={a} role="radio"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "22px 28px", borderRadius: "14px", textAlign: "left",
              border: "none",
              boxShadow: a
                ? `0 0 0 1.5px ${BLUE}, 0 2px 8px rgba(0,0,0,0.2)`
                : "inset 0 0 0 1.5px rgba(255,255,255,0.1)",
              background: a ? `rgba(${BLUE_RGB},0.1)` : "rgba(255,255,255,0.03)",
              cursor: "pointer",
              transition: "background 0.15s ease, box-shadow 0.15s ease",
            }}>
            <div>
              <div style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "18px", color: a ? "#fff" : "rgba(255,255,255,0.9)", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontFamily: monoFont, fontSize: "12px", color: a ? "#ffbc35" : "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>{sub}</div>
            </div>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%",
              border: `2px solid ${a ? BLUE : "rgba(255,255,255,0.2)"}`,
              background: a ? BLUE : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.15s ease, background 0.15s ease",
            }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%", background: "#fff",
                transform: a ? "scale(1)" : "scale(0)",
                transition: `transform 200ms ${EASE_OUT_QUINT}`,
              }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── StepType — dispatches to variant ────────────────────────────────── */
function StepType({ selected, onSelect, choiceVariant = "v1", iconShape = "circle" as IconShape }: { selected: JoinType; onSelect: (t: JoinType) => void; choiceVariant?: ChoiceVariant; iconShape?: IconShape }) {
  const is3D = choiceVariant === "v5" || choiceVariant === "v6" || choiceVariant === "v7" || choiceVariant === "v12" || choiceVariant === "v13";
  const C = { v1: ChoiceV1, v2: ChoiceV2, v3: ChoiceV3, v4: ChoiceV4, v5: ChoiceV5, v6: ChoiceV6, v7: ChoiceV7, v8: ChoiceV8, v9: ChoiceV9, v10: ChoiceV10, v11: ChoiceV11, v12: ChoiceV12, v13: ChoiceV13 }[choiceVariant] || ChoiceV1;
  const props: any = { selected, onSelect };
  if (is3D) props.shape = iconShape;
  return (
    <div className="flex flex-col gap-[24px] w-full">
      <QLabel>How are you joining?</QLabel>
      <C {...props} />
    </div>
  );
}

/* #2-A: Animated teammate chip */
function TeammateChip({ email, onRemove }: { email: string; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(onRemove, 150);
  };

  return (
    <div style={{
      padding: "6px 12px", borderRadius: "100px",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.08)",
      display: "flex", alignItems: "center", gap: "8px",
      opacity: visible && !removing ? 1 : 0,
      transform: visible && !removing ? "scale(1)" : "scale(0.9)",
      transition: removing
        ? `opacity 150ms ${EASE_OUT_QUINT}, transform 150ms ${EASE_OUT_QUINT}`
        : `opacity 200ms ${EASE_OUT_QUINT}, transform 200ms ${EASE_OUT_QUINT}`,
    }}>
      <span style={{ fontFamily: gilroy, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.9)" }}>
        {email}
      </span>
      <button
        onClick={handleRemove}
        className="hover-bright"
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "8px", margin: "-6px", borderRadius: "50%", position: "relative" }}
      >
        <X size={14} color="rgba(255,255,255,0.6)" />
      </button>
    </div>
  );
}

function StepTeam({ teamName, setTeamName, myTeamRole, setMyTeamRole, teammates, setTeammates, buttonStyle }: {
  teamName: string; setTeamName: (v: string) => void;
  myTeamRole: string; setMyTeamRole: (v: string) => void;
  teammates: Teammate[]; setTeammates: React.Dispatch<React.SetStateAction<Teammate[]>>;
  buttonStyle: string;
}) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const [emailInput, setEmailInput] = useState("");
  const addTeammate = () => {
    const email = emailInput.trim();
    if (!email || !email.includes("@") || teammates.length >= 6) return;
    setTeammates((prev) => [...prev, { id: Date.now().toString(), email, role: "" }]);
    setEmailInput("");
  };

  const getButtonStyle = () => {
    if (buttonStyle === "secondary") {
      return { background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)", color: "#fff" };
    }
    if (buttonStyle === "ghost") {
      return { background: "transparent", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" };
    }
    return { background: `rgba(${BLUE_RGB},0.15)`, boxShadow: `inset 0 0 0 1px rgba(${BLUE_RGB},0.4)`, color: BLUE };
  };

  return (
    <div className="flex flex-col gap-[28px] w-full">
      <MaterialInput label="Team name" required value={teamName} onChange={setTeamName} />
      <div className="flex flex-col gap-[12px]"><QLabel required>Your role</QLabel>
        <RolePills selected={myTeamRole} onSelect={setMyTeamRole} /></div>
      <div className="flex flex-col gap-[12px]">
        <QLabel>Invite teammates</QLabel>
        <p style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.6)", fontWeight: 400, textWrap: "pretty" }}>
          Max 6 teammates allowed. ₹974 per person.
        </p>
        <div className="flex flex-col gap-[16px] w-full">
          {teammates.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
              {teammates.map((t) => (
                <TeammateChip key={t.id} email={t.email}
                  onRemove={() => setTeammates((prev) => prev.filter((x) => x.id !== t.id))} />
              ))}
            </div>
          )}

          <MaterialInput label="Teammate email" type="email" value={emailInput}
            onChange={setEmailInput} onEnter={addTeammate} disabled={teammates.length >= 6} />

          <button onClick={addTeammate}
            disabled={!emailInput.trim().includes("@") || teammates.length >= 6}
            className="press-scale"
            style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none",
              ...getButtonStyle(), fontFamily: gilroy, fontSize: "14px", fontWeight: 600,
              cursor: emailInput.trim().includes("@") && teammates.length < 6 ? "pointer" : "default",
              transition: "background 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              opacity: emailInput.trim().includes("@") && teammates.length < 6 ? 1 : 0.4,
            }}>
            <Plus size={16} />
            Add Teammate
          </button>
        </div>
        {teammates.length === 0 && (
          <div style={{ padding: "16px", borderRadius: "100px", border: "1px dashed rgba(255,255,255,0.1)", textAlign: "center" }}>
            <span style={{ fontFamily: gilroy, fontSize: "13px", color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>No teammates added yet</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StepPersonal({ name, setName, email, setEmail, phone, setPhone, role, setRole }: {
  name: string; setName: (v: string) => void; email: string; setEmail: (v: string) => void;
  phone: string; setPhone: (v: string) => void; role: string; setRole: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[28px] w-full">
      <MaterialInput label="Your name" required value={name} onChange={setName} />
      <MaterialInput label="Email address" required type="email" value={email} onChange={setEmail} />
      <MaterialInput label="Phone number" required type="tel" value={phone} onChange={setPhone} />
      <div className="flex flex-col gap-[12px]"><QLabel required>What best describes you?</QLabel><RolePills selected={role} onSelect={setRole} /></div>
    </div>
  );
}

const PROJECT_QS = [
  { id: "q1", label: "Any side project or buildathon you've worked on? What did you build?", sublabel: "Share link.", required: true },
  { id: "q2", label: "What's one problem you think should have already been solved using AI – but still hasn't?", sublabel: "", required: true },
];

function StepProject({ answers, setAnswers }: { answers: Record<string, string>; setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>> }) {
  return (
    <div className="flex flex-col gap-[30px] w-full">
      {PROJECT_QS.map((q) => (
        <MaterialTextarea
          key={q.id}
          label={q.label}
          required={q.required}
          helper={q.sublabel}
          value={answers[q.id] ?? ""}
          onChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
        />
      ))}
    </div>
  );
}

/* ── CTA Button Variants ─────────────────────────────────────────────────
   Each variant: subtle gradient, inner top-light shadow, bottom edge.
   All keep the accent brand color as base.
   ────────────────────────────────────────────────────────────────────── */
/*
 * CTA button surface treatments.
 *
 * Light source is always top-center. Key principles from
 * nikolailehbr.ink/blog/realistic-button-design-css and
 * sitepoint.com/creating-directionally-lit-3d-buttons-with-css:
 *
 *  1. Top of the surface catches light → inset white shadow, top only
 *  2. Bottom edge is in shadow → hard 0-blur dark line below
 *  3. The button "sits on" the page → soft drop shadow underneath
 *  4. Gradient runs lighter at top, darker at bottom (follows light)
 *  5. Active/pressed state: remove drop shadow, add inset bottom shadow
 *     (button sinks into the surface)
 */

type CTAVariant = "v1" | "v2" | "v3" | "v4" | "v5" | "v6";

function getCtaStyles(variant: CTAVariant, enabled: boolean, BLUE?: string, BLUE_RGB?: string): React.CSSProperties {
  if (!enabled) {
    return {
      background: "rgba(255,255,255,0.06)",
      boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.04)",
      border: "none",
    };
  }

  switch (variant) {
    /*
     * V1 "Raised" — The physically correct one.
     * Top-lit gradient. White inset at top only (light catch).
     * Hard 1px dark line at bottom (the underside in shadow).
     * Soft colored glow below (light bouncing off the page).
     */
    case "v1":
      return {
        background: "linear-gradient(180deg, #5198ff 0%, #3272d9 100%)",
        boxShadow: [
          "inset 0 1px 0 0 rgba(255,255,255,0.18)",          // top-edge light catch
          "0 1px 0 0 rgba(0,20,60,0.62)",                      // hard dark underside
          "0 2px 4px 0 rgba(0,10,40,0.25)",                   // close contact shadow
          "0 4px 16px -2px rgba(50,114,217,0.3)",             // colored ambient glow
        ].join(", "),
        border: "none",
      };

    /*
     * V2 "Beveled" — Pronounced sculpted edges.
     * Stronger top highlight (1px spread for slight bleed).
     * Bottom inner darkening simulates the beveled undercut.
     * The outer shadow is tighter and darker — sits heavier.
     */
    case "v2":
      return {
        background: "linear-gradient(180deg, #569eff 0%, #2d6bcf 100%)",
        boxShadow: [
          "inset 0 1px 1px 0 rgba(255,255,255,0.22)",        // strong top bevel highlight
          "inset 0 -1px 0 0 rgba(0,0,0,0.2)",                // bottom inner darken (undercut)
          "0 1px 0 0 rgba(0,15,50,0.55)",                     // hard dark bottom lip
          "0 3px 8px -1px rgba(0,10,40,0.35)",                // contact shadow, slightly spread
          "0 6px 20px -4px rgba(45,107,207,0.25)",            // deep colored glow
        ].join(", "),
        border: "none",
      };

    /*
     * V3 "Soft" — Apple-style minimal depth.
     * Very subtle gradient (almost flat to the eye).
     * Single faint top-light. No hard bottom edge.
     * Just a gentle drop shadow — feels like it's floating 1px up.
     */
    case "v3":
      return {
        background: "linear-gradient(180deg, #4a94ff 0%, #4088f5 100%)",
        boxShadow: [
          "inset 0 1px 0 0 rgba(255,255,255,0.1)",           // soft top catch
          "0 1px 3px 0 rgba(0,10,40,0.2)",                    // gentle drop shadow
          "0 0 0 0.5px rgba(0,20,60,0.15)",                   // hairline ring for definition
        ].join(", "),
        border: "none",
      };

    /*
     * V4 "Glass" — Translucent surface catching light.
     * Three-stop gradient (lighter → mid → slightly lighter at bottom
     * to simulate light passing through a curved glass surface).
     * Top highlight is wider (2px blur). Faint inner ring for the edge.
     * Floating with a layered shadow.
     */
    case "v4":
      return {
        background: "linear-gradient(180deg, #5a9eff 0%, #3678df 55%, #3d80e8 100%)",
        boxShadow: [
          "inset 0 1px 2px 0 rgba(255,255,255,0.15)",        // wide top-light (glass catch)
          "inset 0 0 0 0.5px rgba(255,255,255,0.08)",        // inner edge ring
          "0 1px 2px 0 rgba(0,10,40,0.25)",                   // tight shadow
          "0 4px 12px -2px rgba(0,10,40,0.2)",                // mid-depth shadow
          "0 8px 24px -4px rgba(54,120,223,0.2)",             // far ambient glow
        ].join(", "),
        border: "none",
      };

    /*
     * V5 "Pressed surface" — The button IS the surface.
     * Steeper gradient. Strong top-light with slight spread
     * so it bleeds 1px down (like a rounded top edge catching sun).
     * Outer shadow has two layers: a crisp 1px ring + a diffuse glow.
     * Feels like a physical key on a keyboard.
     */
    case "v5":
      return {
        background: "linear-gradient(180deg, #5da2ff 0%, #2c65c7 100%)",
        boxShadow: [
          "inset 0 1px 0 1px rgba(255,255,255,0.14)",        // top light with 1px spread
          "inset 0 -1px 1px 0 rgba(0,0,0,0.12)",             // bottom inner shadow
          "0 0 0 1px rgba(0,15,50,0.35)",                      // crisp outer ring
          "0 2px 4px 0 rgba(0,10,40,0.3)",                    // close shadow
          "0 4px 14px -2px rgba(44,101,199,0.28)",            // ambient glow
        ].join(", "),
        border: "none",
      };

    /*
     * V6 "Outlined Solid" — Exact spec from design.
     * Solid brand-color ring (0 0 0 1px #0064FF) provides a crisp border.
     * Two outer shadows: a tight rgba(0,0,0,0.24) + a softer rgba(34,42,53,0.20)
     * create realistic depth without blur bleed.
     * Single inner white highlight at 7% for top-light.
     * No gradient — clean solid fill lets the shadow work do the talking.
     */
    case "v6":
      return {
        background: "linear-gradient(180deg, #1a75ff 0%, #0058e0 100%)",
        boxShadow: [
          "0 1px 1px 0 rgba(0,0,0,0.24)",
          "0 2px 3px 0 rgba(34,42,53,0.20)",
          "0 1px 1px 0 rgba(255,255,255,0.07) inset",
          "0 0 0 1px #0064FF",
        ].join(", "),
        border: "none",
      };

    default:
      return {
        background: BLUE || "#408cff",
        boxShadow: `0 0 20px rgba(${BLUE_RGB || "64,140,255"},0.25)`,
        border: "none",
      };
  }
}

/* #9-C: Lightweight confetti burst */
function ConfettiCanvas({ active }: { active: boolean }) {
  const { hex: BLUE } = useAccentColor();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const colors = [BLUE, "#ffbc35", "#8bc68a", "#ff6b8a", "#a78bfa", "#fff"];
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; rotation: number; vr: number; opacity: number }[] = [];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: canvas.offsetWidth / 2,
        y: canvas.offsetHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 10,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.3; // gravity
        p.y += p.vy;
        p.vx *= 0.98; // drag
        p.rotation += p.vr;
        p.opacity -= 0.008;
        if (p.opacity <= 0) continue;
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (alive) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [active, BLUE]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 20,
    }} />
  );
}

/* #9-C: Completion overlay */
function CompletionScreen() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: "16px", padding: "60px 20px", textAlign: "center",
      opacity: visible ? 1 : 0,
      transform: visible ? "scale(1)" : "scale(0.98)",
      transition: `opacity 300ms ${EASE_OUT_QUINT}, transform 300ms ${EASE_OUT_QUINT}`,
    }}>
      <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
      <h2 style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "24px", color: "#fff", margin: 0 }}>
        You&apos;re in!
      </h2>
      <p style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: "320px" }}>
        Registration complete. Check your email for confirmation details.
      </p>
    </div>
  );
}

export default function CheckoutV1Card({ teammateButtonStyle = "primary", sidebarVariant = "v1", navStyle = "v1", choiceVariant = "v1", ctaVariant = "v1", iconShape = "circle" }: { teammateButtonStyle?: string; sidebarVariant?: string; navStyle?: string; choiceVariant?: ChoiceVariant; ctaVariant?: CTAVariant; iconShape?: "circle" | "square" }) {
  const { hex: BLUE, rgb: BLUE_RGB } = useAccentColor();
  const countdown = useCheckoutCountdown();
  const [joinType, setJoinType] = useState<JoinType>(null);
  const [teamName, setTeamName] = useState("");
  const [myTeamRole, setMyTeamRole] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({ q1: "", q2: "" });
  const [completed, setCompleted] = useState(false);

  const steps: StepId[] = joinType === "team" ? ["type", "team", "personal", "project"] : ["type", "personal", "project"];
  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const isLastStep = stepIdx === steps.length - 1;
  const progress = steps.length <= 1 ? 5 : Math.max(5, (stepIdx / (steps.length - 1)) * 100);

  const memberCount = joinType === "team" ? teammates.length + 1 : 1;

  const canContinue = (() => {
    if (currentStep === "type") return joinType !== null;
    if (currentStep === "team") return teamName.trim().length > 0 && myTeamRole.length > 0;
    if (currentStep === "personal") return !!(name.trim() && email.trim() && phone.trim() && role);
    if (currentStep === "project") return PROJECT_QS.every((q) => answers[q.id]?.trim().length > 0);
    return false;
  })();

  const goBack = () => setStepIdx(prev => Math.max(0, prev - 1));
  const goForward = () => {
    if (isLastStep) {
      setCompleted(true); // #9-C
    } else {
      setStepIdx(prev => prev + 1);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex items-start justify-center">
      <style>{`input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.65)}`}</style>

      {/* Background Poster Blur */}
      <div className="absolute h-[450px] inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-[-675px_-3240px]" style={{ filter: "blur(90px)" }}>
          <Image src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1600&h=900&fit=crop"
            alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[180px]"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), black)" }} />
      </div>

      <div className="relative z-10 w-full max-w-[1000px] px-[40px]">
        <div className="relative flex items-start justify-between w-full overflow-hidden"
          style={{ minHeight: "450px", height: "720px", padding: "32px 16px 16px" }}>

          {/* #9-C: Confetti overlay */}
          <ConfettiCanvas active={completed} />

          {/* #5-A: Progress bar with ease-out-quint */}
          <div className="absolute left-0 right-0 flex items-center gap-[12px] px-[16px] pb-[32px] z-10" style={{ top: "40px" }}>
            <div className="relative h-[4px] flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="absolute inset-y-0 left-0 rounded-full bg-white"
                style={{ width: `${completed ? 100 : progress}%`, transition: `width 0.4s ${EASE_OUT_QUINT}` }} />
            </div>
            <Link href="/" className="flex items-center justify-center shrink-0"
              style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
              aria-label="Close">
              <span className="flex items-center justify-center size-[28px] rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", transition: "opacity 0.15s ease" }}>
                <X className="size-[14px] text-white" />
              </span>
            </Link>
          </div>

          <SidebarSwitch variant={sidebarVariant} countdown={countdown} memberCount={memberCount} className="mt-[80px]" />

          <div className="flex flex-col items-start shrink-0 overflow-auto pt-[80px] px-[8px]"
            style={{ width: "493px", height: "680px" }}>
            <div className="flex flex-col w-full h-full">

              {/* Nav V1: Top back link */}
              {navStyle === "v1" && stepIdx > 0 && !completed && (
                <button onClick={goBack}
                  className="flex items-center gap-1 mb-6 text-[12px] text-white/60 hover:text-white transition-colors"
                  style={{ fontFamily: monoFont, minHeight: "40px" }}>
                  <ChevronLeft size={14} />
                  <span>BACK</span>
                </button>
              )}

              {/* Nav V3: Breadcrumb trail */}
              {navStyle === "v3" && !completed && (
                <div className="flex items-center gap-[6px] mb-6">
                  {steps.map((s, i) => {
                    const labels: Record<string, string> = { type: "Type", team: "Team", personal: "Details", project: "Project" };
                    const isCurrent = i === stepIdx;
                    const isDone = i < stepIdx;
                    return (
                      <React.Fragment key={s}>
                        {i > 0 && <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>›</span>}
                        <button
                          onClick={() => i < stepIdx && setStepIdx(i)}
                          style={{
                            padding: "4px 10px", borderRadius: "6px", fontSize: "11px",
                            fontFamily: monoFont, fontWeight: isCurrent ? 600 : 400, border: "none",
                            background: isCurrent ? "rgba(0,100,255,0.12)" : "transparent",
                            color: isCurrent ? "#fff" : isDone ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
                            cursor: isDone ? "pointer" : "default",
                            transition: "background 0.15s ease, color 0.15s ease",
                            minHeight: "40px",
                          }}
                        >
                          {labels[s] || s}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* #9-C: Show completion or form */}
              {completed ? (
                <div className="flex flex-col gap-[30px] w-full flex-1 items-center justify-center">
                  <CompletionScreen />
                </div>
              ) : (
                <div className="flex flex-col gap-[30px] w-full flex-1">
                  {/* #1-A: StepTransition with exit animation */}
                  <StepTransition stepKey={currentStep}>
                    {currentStep === "type" && <StepType selected={joinType} onSelect={setJoinType} choiceVariant={choiceVariant} iconShape={iconShape} />}
                    {currentStep === "team" && <StepTeam teamName={teamName} setTeamName={setTeamName}
                      myTeamRole={myTeamRole} setMyTeamRole={setMyTeamRole} teammates={teammates} setTeammates={setTeammates}
                      buttonStyle={teammateButtonStyle} />}
                    {currentStep === "personal" && <StepPersonal name={name} setName={setName}
                      email={email} setEmail={setEmail} phone={phone} setPhone={setPhone} role={role} setRole={setRole} />}
                    {currentStep === "project" && <StepProject answers={answers} setAnswers={setAnswers} />}
                  </StepTransition>
                </div>
              )}

              {/* ── Nav V1: Full-width Continue, back is top link ── */}
              {navStyle === "v1" && !completed && (
                <div className="flex items-center gap-[12px] py-[32px] w-full sticky bottom-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center w-full py-[12px] rounded-[10px] min-w-[64px]"
                    style={{
                      ...getCtaStyles(ctaVariant, canContinue, BLUE, BLUE_RGB),
                      transition: "all 0.2s ease",
                    }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {isLastStep ? "Complete Registration" : "Continue"}
                    </span>
                  </button>
                </div>
              )}

              {/* ── Nav V2: Back + Continue side by side ── */}
              {navStyle === "v2" && !completed && (
                <div className="flex items-center gap-[10px] py-[32px] w-full sticky bottom-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  {stepIdx > 0 && (
                    <button onClick={goBack}
                      className="press-scale flex items-center justify-center py-[12px] px-[20px] rounded-[10px]"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
                        border: "none",
                        transition: "background 0.15s ease",
                      }}>
                      <ChevronLeft size={16} color="rgba(255,255,255,0.7)" />
                    </button>
                  )}
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center flex-1 py-[12px] rounded-[10px]"
                    style={{
                      ...getCtaStyles(ctaVariant, canContinue, BLUE, BLUE_RGB),
                      transition: "all 0.2s ease",
                    }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "16px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {isLastStep ? "Complete Registration" : "Continue"}
                    </span>
                  </button>
                </div>
              )}

              {/* ── Nav V3: Breadcrumb + bottom bar with step counter ── */}
              {navStyle === "v3" && !completed && (
                <div className="flex flex-col gap-[10px] py-[32px] w-full sticky bottom-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center gap-[8px] w-full py-[12px] rounded-[10px]"
                    style={{
                      ...getCtaStyles(ctaVariant, canContinue, BLUE, BLUE_RGB),
                      transition: "all 0.2s ease",
                    }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {isLastStep ? "Complete Registration" : "Next"}
                    </span>
                    {!isLastStep && <ChevronRight size={16} color={canContinue ? "#fff" : "rgba(255,255,255,0.4)"} />}
                  </button>
                  <div className="flex items-center justify-between">
                    {stepIdx > 0 ? (
                      <button onClick={goBack}
                        className="flex items-center gap-[6px] hover-bright"
                        style={{ background: "none", border: "none", cursor: "pointer", minHeight: "40px", transition: "opacity 0.15s ease" }}>
                        <ChevronLeft size={14} color="rgba(255,255,255,0.5)" />
                        <span style={{ fontFamily: gilroy, fontWeight: 500, fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>Back</span>
                      </button>
                    ) : <div />}
                    <span style={{ fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.25)", fontVariantNumeric: "tabular-nums" }}>
                      {stepIdx + 1}/{steps.length}
                    </span>
                  </div>
                </div>
              )}

              {/* ── Nav V4: Sticky bottom bar ── */}
              {navStyle === "v4" && !completed && (
                <div className="sticky bottom-0 w-full py-[24px]"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  <div className="flex items-center gap-[8px] w-full">
                    {stepIdx > 0 && (
                      <button onClick={goBack}
                        className="press-scale flex items-center justify-center size-[44px] rounded-[10px] shrink-0"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
                          border: "none",
                          transition: "background 0.15s ease",
                        }}>
                        <ChevronLeft size={18} color="rgba(255,255,255,0.6)" />
                      </button>
                    )}
                    <button onClick={() => canContinue && goForward()}
                      disabled={!canContinue}
                      className="press-scale flex items-center justify-center flex-1 h-[44px] rounded-[10px]"
                      style={{
                        ...getCtaStyles(ctaVariant, canContinue, BLUE, BLUE_RGB),
                        transition: "all 0.2s ease",
                      }}>
                      <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                        color: canContinue ? "#fff" : "rgba(255,255,255,0.35)" }}>
                        {isLastStep ? "Complete Registration" : "Next"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* ═══════════════════════════════════════════════════════
                  NEW NAVIGATION VARIANTS (V5–V10)
                  All bottom-anchored only. The top progress bar already
                  handles orientation — these variants only change the
                  bottom action area where the user's eye lands after
                  filling a field.
                  ═══════════════════════════════════════════════════════ */}

              {/* ── Nav V5: "Contextual" ──
                  Bottom bar tells you WHERE you are + WHAT to do in one line.
                  "Step 2 of 3 — Your Details" label above the CTA.
                  Anxious user: "I know exactly where I am and what's next."
                  Power user: ignores the label, hits Continue. */}
              {navStyle === "v5" && !completed && (
                <div className="flex flex-col gap-[12px] py-[32px] w-full sticky bottom-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  {/* Context line: back + step label + counter */}
                  <div className="flex items-center justify-between w-full">
                    {stepIdx > 0 ? (
                      <button onClick={goBack}
                        className="flex items-center gap-[4px] shrink-0 hover-bright"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                        <ChevronLeft size={14} color="rgba(255,255,255,0.4)" />
                        <span style={{ fontFamily: gilroy, fontWeight: 500, fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>Back</span>
                      </button>
                    ) : <div />}
                    <span style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
                      Step {stepIdx + 1} of {steps.length}
                      <span style={{ color: "rgba(255,255,255,0.15)", margin: "0 6px" }}>&middot;</span>
                      <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>
                        {{ type: "Join type", team: "Your team", personal: "Your details", project: "Your project" }[currentStep]}
                      </span>
                    </span>
                  </div>
                  {/* Full-width CTA */}
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center w-full py-[12px] rounded-[10px]"
                    style={{ ...getCtaStyles(ctaVariant, canContinue, BLUE, BLUE_RGB), transition: "all 0.2s ease" }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {isLastStep ? "Complete Registration" : "Continue"}
                    </span>
                  </button>
                </div>
              )}

              {/* ── Nav V6: "Keyboard-first" ──
                  Full-width CTA is the dominant element. A subtle "↵ Enter"
                  hint below it for power users in flow. Back link is small
                  and textual — present but not competing for attention.
                  Anxious user: big obvious button, nothing confusing.
                  Power user: hits Enter, never touches the mouse. */}
              {navStyle === "v6" && !completed && (
                <div className="flex flex-col gap-[8px] py-[32px] w-full sticky bottom-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center w-full py-[14px] rounded-[10px]"
                    style={{ ...getCtaStyles(ctaVariant, canContinue, BLUE, BLUE_RGB), transition: "all 0.2s ease" }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {isLastStep ? "Complete Registration" : "Continue"}
                    </span>
                  </button>
                  <div className="flex items-center justify-between px-[2px]">
                    {stepIdx > 0 ? (
                      <button onClick={goBack}
                        className="hover-bright"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 0" }}>
                        <span style={{ fontFamily: gilroy, fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                          &larr; Back
                        </span>
                      </button>
                    ) : <div />}
                    <span style={{
                      fontFamily: monoFont, fontSize: "11px", color: "rgba(255,255,255,0.15)",
                      display: "flex", alignItems: "center", gap: "4px",
                    }}>
                      press <kbd style={{
                        padding: "1px 5px", borderRadius: "4px", fontSize: "10px",
                        background: "rgba(255,255,255,0.06)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 1px 0 rgba(255,255,255,0.04)",
                      }}>Enter &crarr;</kbd>
                    </span>
                  </div>
                </div>
              )}

              {/* ── Nav V7: "Confident Split" ──
                  Back and Continue are equal-weight side-by-side buttons.
                  Back is a real button (not a ghost link) — both actions
                  feel equally safe and intentional.
                  Anxious user: "Going back is just as easy as going forward,
                  I'm not trapped." Both buttons are visible and clear.
                  Power user: clean spatial model — left=back, right=forward. */}
              {navStyle === "v7" && !completed && (
                <div className="flex items-center gap-[8px] py-[32px] w-full sticky bottom-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 30%)" }}>
                  {stepIdx > 0 ? (
                    <button onClick={goBack}
                      className="press-scale flex items-center justify-center gap-[6px] py-[12px] rounded-[10px]"
                      style={{
                        width: "120px", flexShrink: 0,
                        background: "rgba(255,255,255,0.06)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
                        border: "none", transition: "all 0.15s ease",
                      }}>
                      <ChevronLeft size={15} color="rgba(255,255,255,0.6)" />
                      <span style={{ fontFamily: gilroy, fontWeight: 600, fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Back</span>
                    </button>
                  ) : null}
                  <button onClick={() => canContinue && goForward()}
                    disabled={!canContinue}
                    className="press-scale flex items-center justify-center gap-[6px] flex-1 py-[12px] rounded-[10px]"
                    style={{ ...getCtaStyles(ctaVariant, canContinue, BLUE, BLUE_RGB), transition: "all 0.2s ease" }}>
                    <span style={{ fontFamily: gilroy, fontWeight: 700, fontSize: "15px",
                      color: canContinue ? "#fff" : "rgba(255,255,255,0.4)" }}>
                      {isLastStep ? "Complete Registration" : "Continue"}
                    </span>
                    {!isLastStep && <ChevronRight size={15} color={canContinue ? "#fff" : "rgba(255,255,255,0.4)"} />}
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
