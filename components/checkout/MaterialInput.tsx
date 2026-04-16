"use client";

/**
 * Material Design text field — multi-style, dark theme
 *
 * Style driven by InputStyleContext, accent color driven by AccentColorContext.
 * All variants share the same UX: floating label, focus/blur, onEnter, autoFocus.
 */

import { useState, useRef, useEffect, type CSSProperties } from "react";
import { useInputStyle, useFillOpacity, useAccentColor, type InputStyle } from "./InputStyleContext";

const gilroy =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

// ── Fill helpers ─────────────────────────────────────────────────────────────

function filledBg(baseAlpha: number, fillOpacity: number): string {
  const a = baseAlpha * fillOpacity;
  return `rgba(255,255,255,${a.toFixed(3)})`;
}

function tonalBg(rgb: string, baseAlpha: number, fillOpacity: number): string {
  const a = baseAlpha * fillOpacity;
  return `rgba(${rgb},${a.toFixed(3)})`;
}

// ── Container ────────────────────────────────────────────────────────────────

function containerStyle(
  style: InputStyle,
  focused: boolean,
  large: boolean,
  disabled: boolean,
  fillOpacity: number,
  accent: string,
  accentRgb: string,
): CSSProperties {
  const h = large ? "68px" : "56px";
  const base: CSSProperties = {
    position: "relative",
    height: h,
    cursor: disabled ? "not-allowed" : "text",
  };

  switch (style) {
    case "filled":
      return {
        ...base,
        borderRadius: "8px 8px 0 0",
        background: focused ? filledBg(0.08, fillOpacity) : filledBg(0.05, fillOpacity),
        transition: `background 0.2s ${EASE}`,
      };
    case "filled-tonal":
      return {
        ...base,
        borderRadius: "12px",
        background: focused ? tonalBg(accentRgb, 0.1, fillOpacity) : tonalBg(accentRgb, 0.06, fillOpacity),
        transition: `background 0.2s ${EASE}`,
      };
    case "outlined":
      return {
        ...base,
        borderRadius: "12px",
        background: "transparent",
      };
    case "rounded":
      return {
        ...base,
        borderRadius: "28px",
        background: focused ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)",
        border: "1px solid transparent",
        transition: `background 0.2s ${EASE}`,
      };
    case "underline":
      return { ...base, height: large ? "60px" : "52px" };
    default:
      return base;
  }
}

// ── Label ────────────────────────────────────────────────────────────────────

function labelStyle(
  style: InputStyle,
  focused: boolean,
  floated: boolean,
  large: boolean,
  accent: string,
): CSSProperties {
  const restSize = large ? "18px" : "15px";
  const transition = `top 0.18s ${EASE}, font-size 0.18s ${EASE}, color 0.18s ${EASE}, transform 0.18s ${EASE}`;
  const base: CSSProperties = {
    position: "absolute", lineHeight: 1, fontFamily: gilroy,
    pointerEvents: "none", userSelect: "none", transition,
  };
  const restColor = "rgba(255,255,255,0.55)";
  const floatedColor = "rgba(255,255,255,0.65)";

  switch (style) {
    case "filled":
      return { ...base, left: "12px", top: floated ? "8px" : (large ? "24px" : "18px"),
        fontSize: floated ? "11px" : restSize, fontWeight: floated ? 500 : (large ? 500 : 600),
        color: focused ? accent : floatedColor, letterSpacing: floated ? "0.4px" : "0" };
    case "filled-tonal":
      return { ...base, left: "14px", top: floated ? "9px" : (large ? "24px" : "18px"),
        fontSize: floated ? "11px" : restSize, fontWeight: 500,
        color: focused ? accent : floatedColor, letterSpacing: floated ? "0.3px" : "0" };
    case "outlined": {
      return { ...base, left: "14px", top: floated ? "-6px" : "50%",
        transform: floated ? "scale(0.75)" : "translateY(-50%)",
        transformOrigin: "top left",
        fontSize: restSize, fontWeight: 500,
        color: focused ? accent : restColor,
        padding: floated ? "0 5px" : "0",
        background: "transparent", zIndex: 1,
        maxWidth: floated ? "calc(133% - 32px)" : "calc(100% - 28px)" };
    }
    case "rounded":
      return { ...base, left: "20px", top: floated ? "8px" : "50%",
        transform: floated ? "none" : "translateY(-50%)", fontSize: floated ? "10px" : restSize,
        fontWeight: 500, color: focused ? accent : restColor,
        letterSpacing: floated ? "0.5px" : "0", textTransform: floated ? "uppercase" : "none" };
    case "underline":
      return { ...base, left: "0", top: floated ? "2px" : "50%",
        transform: floated ? "none" : "translateY(-50%)",
        fontSize: floated ? "12px" : (large ? "18px" : "16px"),
        fontWeight: 400, color: focused ? accent : restColor };
    default:
      return base;
  }
}

// ── Input field ──────────────────────────────────────────────────────────────

function inputFieldStyle(style: InputStyle, large: boolean, disabled: boolean, accent: string): CSSProperties {
  const textSz = large ? "clamp(20px, 2.5vw, 26px)" : "15px";
  const base: CSSProperties = {
    background: "transparent", border: "none", outline: "none",
    color: disabled ? "rgba(255,255,255,0.4)" : "white",
    fontSize: textSz, fontFamily: gilroy, fontWeight: 600, caretColor: accent, width: "100%",
  };
  switch (style) {
    case "filled":
      return { ...base, position: "absolute", bottom: 0, left: 0, right: 0, height: large ? "40px" : "32px", padding: "0 12px" };
    case "filled-tonal":
      return { ...base, position: "absolute", bottom: 0, left: 0, right: 0, height: large ? "40px" : "32px", padding: "0 14px", fontWeight: 500, borderRadius: "0 0 12px 12px" };
    case "outlined":
      return { ...base, position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: "8px 14px 0", fontWeight: 500, borderRadius: "12px" };
    case "rounded":
      return { ...base, position: "absolute", bottom: "6px", left: 0, right: 0, height: "28px", padding: "0 20px", borderRadius: "28px" };
    case "underline":
      return { ...base, position: "absolute", bottom: "8px", left: 0, right: 0, height: "24px", padding: 0, fontSize: large ? "clamp(20px, 2.5vw, 26px)" : "16px", fontWeight: 400 };
    default:
      return base;
  }
}

// ── Decorations ──────────────────────────────────────────────────────────────

function BottomIndicator({ style, focused, accent }: { style: InputStyle; focused: boolean; accent: string }) {
  if (style !== "filled" && style !== "underline") return null;
  return (
    <>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.18)" }} />
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        height: "2px", background: accent, width: focused ? "100%" : "0%", transition: `width 0.22s ${EASE}` }} />
    </>
  );
}

/* ── NotchedOutline — MUI-faithful fieldset+legend ──────────────────────── */
function NotchedOutline({ focused, notched, accent, label }: { focused: boolean; notched: boolean; accent: string; label: string }) {
  const borderColor = focused ? accent : "rgba(255,255,255,0.18)";
  return (
    <fieldset aria-hidden style={{
      textAlign: "left",
      position: "absolute",
      top: -5, right: 0, bottom: 0, left: 0,
      margin: 0,
      padding: "0 8px",
      pointerEvents: "none",
      borderRadius: "inherit",
      borderStyle: "solid",
      borderWidth: focused ? 2 : 1.5,
      borderColor,
      overflow: "hidden",
      minWidth: "0%",
      transition: `border-color 0.2s ${EASE}, border-width 0.1s ${EASE}`,
    }}>
      <legend style={{
        float: "unset",
        width: "auto",
        overflow: "hidden",
        display: "block",
        padding: 0,
        height: 11,
        fontSize: "0.75em",
        visibility: "hidden",
        maxWidth: notched ? "100%" : "0.01px",
        transition: notched
          ? `max-width 100ms ease-out 50ms`
          : `max-width 50ms ease-out`,
        whiteSpace: "nowrap",
      }}>
        <span style={{ paddingLeft: 5, paddingRight: 5, display: "inline-block", opacity: 0, visibility: "visible" }}>
          {label}
        </span>
      </legend>
    </fieldset>
  );
}

function FocusRing({ style, focused, accent }: { style: InputStyle; focused: boolean; accent: string }) {
  if (style !== "rounded") return null;
  return (
    <div style={{ position: "absolute", inset: "-3px", borderRadius: "31px",
      border: `2px solid ${accent}`, opacity: focused ? 0.35 : 0,
      transition: `opacity 0.2s ${EASE}`, pointerEvents: "none" }} />
  );
}

// ── MaterialInput ────────────────────────────────────────────────────────────
interface BaseProps { label: string; required?: boolean; large?: boolean; }

interface InputProps extends BaseProps {
  value: string; onChange: (v: string) => void; type?: string;
  onEnter?: () => void; autoFocus?: boolean; disabled?: boolean;
}

export function MaterialInput({
  label, required, large = false,
  value, onChange, type = "text", onEnter, autoFocus, disabled,
}: InputProps) {
  const style = useInputStyle();
  const fillOpacity = useFillOpacity();
  const { hex: accent, rgb: accentRgb } = useAccentColor();

  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (autoFocus) ref.current?.focus(); }, [autoFocus]);

  return (
    <div
      style={containerStyle(style, focused, large, !!disabled, fillOpacity, accent, accentRgb)}
      onClick={() => ref.current?.focus()}
    >
      <FocusRing style={style} focused={focused} accent={accent} />
      {style === "outlined" && (
        <NotchedOutline focused={focused} notched={floated} accent={accent}
          label={label + (required ? "\u00a0*" : "")} />
      )}
      <label style={labelStyle(style, focused, floated, large, accent)}>
        {label}
        {required && <span style={{ marginLeft: "2px", color: focused ? accent : "rgba(255,255,255,0.3)" }}>*</span>}
      </label>
      <input ref={ref} type={type} value={value} disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
        autoComplete="off" style={inputFieldStyle(style, large, !!disabled, accent)} />
      <BottomIndicator style={style} focused={focused} accent={accent} />
    </div>
  );
}

// ── MaterialTextarea ─────────────────────────────────────────────────────────
interface TextareaProps extends BaseProps {
  value: string; onChange: (v: string) => void; rows?: number; helper?: string;
}

export function MaterialTextarea({
  label, required, large = false, value, onChange, rows = 2, helper,
}: TextareaProps) {
  const style = useInputStyle();
  const fillOpacity = useFillOpacity();
  const { hex: accent, rgb: accentRgb } = useAccentColor();
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) { ref.current.style.height = "auto"; ref.current.style.height = `${ref.current.scrollHeight}px`; }
  }, [value]);

  const textareaContainer = (): CSSProperties => {
    const base: CSSProperties = { position: "relative", paddingTop: "28px", paddingBottom: "10px", transition: `background 0.2s ${EASE}` };
    switch (style) {
      case "filled":
        return { ...base, borderRadius: "8px 8px 0 0", background: focused ? filledBg(0.08, fillOpacity) : filledBg(0.05, fillOpacity), paddingLeft: "12px", paddingRight: "12px" };
      case "filled-tonal":
        return { ...base, borderRadius: "12px", background: focused ? tonalBg(accentRgb, 0.1, fillOpacity) : tonalBg(accentRgb, 0.06, fillOpacity), paddingLeft: "14px", paddingRight: "14px" };
      case "outlined":
        return { ...base, borderRadius: "12px", paddingLeft: "14px", paddingRight: "14px" };
      case "rounded":
        return { ...base, borderRadius: "20px", background: focused ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)", paddingLeft: "20px", paddingRight: "20px" };
      case "underline":
        return { ...base, paddingLeft: "0", paddingRight: "0" };
      default: return base;
    }
  };

  const labelPadLeft = style === "underline" ? "0" : style === "rounded" ? "20px" : style === "outlined" || style === "filled-tonal" ? "14px" : "12px";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={textareaContainer()}>
        <FocusRing style={style} focused={focused} accent={accent} />
        {style === "outlined" && (
          <NotchedOutline focused={focused} notched={false} accent={accent} label={label} />
        )}
        <label style={{ ...labelStyle(style, focused, floated, large, accent), top: floated ? "8px" : "18px", transform: "none", left: labelPadLeft }}>
          {label}
          {required && <span style={{ marginLeft: "2px", color: focused ? accent : "rgba(255,255,255,0.3)" }}>*</span>}
        </label>
        <textarea ref={ref} rows={rows} value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: "100%", background: "transparent", border: "none", outline: "none", resize: "none",
            color: "white", fontSize: "15px", fontFamily: gilroy,
            fontWeight: style === "underline" ? 400 : style === "filled" ? 600 : 500,
            caretColor: accent, lineHeight: 1.6, overflow: "hidden" }} />
        {(style === "filled" || style === "underline") && (
          <>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.18)" }} />
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
              height: "2px", background: accent, width: focused ? "100%" : "0%", transition: `width 0.22s ${EASE}` }} />
          </>
        )}
      </div>
      {helper && <span style={{ fontFamily: gilroy, fontSize: "12px", color: "rgba(255,255,255,0.55)", paddingLeft: labelPadLeft, fontWeight: 400 }}>{helper}</span>}
    </div>
  );
}

// ── MaterialEmailRow ─────────────────────────────────────────────────────────
interface EmailRowProps {
  value: string; onChange: (v: string) => void; onAdd: () => void;
  disabled?: boolean; trailing: React.ReactNode;
}

export function MaterialEmailRow({ value, onChange, onAdd, disabled, trailing }: EmailRowProps) {
  const style = useInputStyle();
  const fillOpacity = useFillOpacity();
  const { hex: accent, rgb: accentRgb } = useAccentColor();

  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
      <div style={{ flex: 1, ...containerStyle(style, focused, false, !!disabled, fillOpacity, accent, accentRgb) }}>
        <FocusRing style={style} focused={focused} accent={accent} />
        {style === "outlined" && (
          <NotchedOutline focused={focused} notched={floated} accent={accent} label="Teammate email" />
        )}
        <label style={labelStyle(style, focused, floated, false, accent)}>Teammate email</label>
        <input type="email" value={value} disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          style={inputFieldStyle(style, false, !!disabled, accent)} />
        <BottomIndicator style={style} focused={focused} accent={accent} />
      </div>
      {trailing}
    </div>
  );
}
