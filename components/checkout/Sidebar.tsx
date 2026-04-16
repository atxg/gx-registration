"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, ChevronDown } from "lucide-react";
import { useCountdownRaw } from "@/lib/hooks";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const serifFont = "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
const EASE_OUT_QUINT = "cubic-bezier(0.23, 1, 0.32, 1)";

/* #6-B: Price scale pulse on value change */
function PricePulse({ value, children }: { value: number; children: React.ReactNode }) {
  const [pulsing, setPulsing] = useState(false);
  const prevValue = useRef(value);
  useEffect(() => {
    if (prevValue.current !== value && prevValue.current !== 0) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 200);
      prevValue.current = value;
      return () => clearTimeout(t);
    }
    prevValue.current = value;
  }, [value]);
  return (
    <span style={{
      display: "inline-block",
      transform: pulsing ? "scale(1.05)" : "scale(1)",
      transition: `transform 200ms ${EASE_OUT_QUINT}`,
    }}>{children}</span>
  );
}

export interface SidebarProps {
  countdown: string;
  memberCount: number;
  className?: string;
  style?: React.CSSProperties;
}

/* ── V1: Clean Summary ──────────────────────────────────────────────────────
   Compact image strip, all key details scannable, price at bottom. */
export default function Sidebar({ countdown, memberCount, className, style }: SidebarProps) {
  const totalPrice = memberCount * 974;

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="flex flex-col gap-0 items-start">
        {/* Compact image banner (16:9 instead of 1:1) */}
        <div className="relative w-full rounded-t-[10px] overflow-hidden"
          style={{ aspectRatio: "16/9", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <Image
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=690&h=388&fit=crop"
            alt="AI + Hardware Buildathon" fill className="object-cover"
            style={{ outline: "1px solid rgba(255,255,255,0.06)", outlineOffset: "-1px" }}
          />
          {/* Timer overlay on image */}
          <div className="absolute top-[10px] right-[10px] flex items-center gap-[6px] px-[10px] py-[5px] rounded-[6px]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
            <div className="size-[6px] rounded-full bg-[#ffbc35] animate-pulse" />
            <span className="text-[11px]" style={{ fontFamily: monoFont, color: "#ffbc35", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </span>
          </div>
        </div>

        {/* Info card below image — outer radius 10, padding 20, inner elements have no radius (concentric) */}
        <div className="flex flex-col gap-[16px] w-full rounded-b-[10px] p-[20px]"
          style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.15)" }}>

          {/* Event name */}
          <h2 className="text-[20px] text-white leading-[28px] tracking-[-0.3px]"
            style={{ fontFamily: serifFont, margin: 0, textWrap: "balance" }}>
            AI + Hardware Buildathon
          </h2>

          {/* Key details — scannable rows */}
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <Calendar size={14} color="rgba(255,255,255,0.45)" />
              <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                Saturday, April 18
              </span>
            </div>
            <div className="flex items-center gap-[10px]">
              <Clock size={14} color="rgba(255,255,255,0.45)" />
              <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                11:00 AM – 7:00 PM
              </span>
            </div>
            <div className="flex items-center gap-[10px]">
              <MapPin size={14} color="rgba(255,255,255,0.45)" />
              <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.8)" }}>
                Bengaluru, Karnataka
              </span>
            </div>
          </div>

          {/* Divider — shadow instead of border for depth */}
          <div style={{ height: "1px", boxShadow: "0 1px 0 rgba(255,255,255,0.08)" }} />

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>
              {memberCount > 1 ? `${memberCount} tickets × ₹974` : "1 ticket"}
            </span>
            <PricePulse value={totalPrice}>
              <span className="text-[18px] text-white" style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </PricePulse>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── V3: Glass Card ─────────────────────────────────────────────────────────
   Image as blurred background behind glass-morphism card. Overlay text. */
export function SidebarV3Glass({ countdown, memberCount, className, style }: SidebarProps) {
  const totalPrice = memberCount * 974;

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="relative w-full rounded-[14px] overflow-hidden" style={{ minHeight: "380px", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.3)" }}>
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=690&h=760&fit=crop"
          alt="" fill className="object-cover"
          style={{ outline: "1px solid rgba(255,255,255,0.06)", outlineOffset: "-1px" }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }} />

        {/* Content overlay */}
        <div className="relative flex flex-col justify-between h-full p-[24px]" style={{ minHeight: "380px" }}>
          {/* Timer chip */}
          <div className="flex items-center gap-[6px] self-start px-[10px] py-[5px] rounded-full"
            style={{ background: "rgba(0,0,0,0.5)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)" }}>
            <div className="size-[5px] rounded-full bg-[#ffbc35] animate-pulse" />
            <span className="text-[10px]" style={{ fontFamily: monoFont, color: "#ffbc35", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </span>
          </div>

          {/* Center — event info */}
          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[22px] text-white leading-[30px] tracking-[-0.3px]"
              style={{ fontFamily: serifFont, margin: 0, textWrap: "balance" }}>
              AI + Hardware<br />Buildathon
            </h2>
            <div className="flex flex-wrap items-center gap-[6px]">
              {["Apr 18", "11 AM–7 PM", "Bengaluru"].map((t) => (
                <span key={t} className="px-[8px] py-[3px] rounded-full text-[11px]"
                  style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.85)", background: "rgba(255,255,255,0.1)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom — price */}
          <div className="flex items-center justify-between pt-[12px]"
            style={{ boxShadow: "0 -1px 0 rgba(255,255,255,0.15)" }}>
            <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>
              {memberCount > 1 ? `${memberCount} × ₹974` : "1 ticket"}
            </span>
            <PricePulse value={totalPrice}>
              <span className="text-[22px] text-white" style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </PricePulse>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── V4: Ticket Stub ────────────────────────────────────────────────────────
   Physical ticket aesthetic with perforated tear line. */
export function SidebarV4Ticket({ countdown, memberCount, className, style }: SidebarProps) {
  const totalPrice = memberCount * 974;

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="flex flex-col w-full">
        {/* Image header */}
        <div className="relative w-full rounded-t-[12px] overflow-hidden"
          style={{ aspectRatio: "16/7", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <Image
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=690&h=300&fit=crop"
            alt="AI + Hardware Buildathon" fill className="object-cover"
            style={{ outline: "1px solid rgba(255,255,255,0.06)", outlineOffset: "-1px" }}
          />
          {/* Badge overlay */}
          <div className="absolute top-[10px] right-[10px] px-[8px] py-[3px] rounded-[4px] text-[9px] uppercase tracking-[1px]"
            style={{ fontFamily: monoFont, color: "#ffbc35", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", boxShadow: "inset 0 0 0 1px rgba(255,188,53,0.15)" }}>
            {memberCount > 1 ? "TEAM" : "SOLO"}
          </div>
        </div>

        {/* Main ticket body */}
        <div className="p-[24px] flex flex-col gap-[20px]"
          style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 1px 0 0 rgba(255,255,255,0.08), inset -1px 0 0 rgba(255,255,255,0.08)" }}>

          {/* Event name */}
          <h2 className="text-[20px] text-white leading-[26px] tracking-[-0.3px]"
            style={{ fontFamily: serifFont, margin: 0, textWrap: "balance" }}>
            AI + Hardware Buildathon
          </h2>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-y-[14px] gap-x-[16px]">
            {[
              ["DATE", "Apr 18, Sat"],
              ["TIME", "11 AM – 7 PM"],
              ["VENUE", "Bengaluru"],
              ["ADMIT", memberCount > 1 ? `${memberCount} people` : "1 person"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-[2px]">
                <span className="text-[9px] tracking-[1.5px] uppercase"
                  style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.35)" }}>{label}</span>
                <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Perforated tear line */}
        <div className="relative flex items-center" style={{ height: "20px" }}>
          <div className="absolute left-[-10px] size-[20px] rounded-full" style={{ background: "#000" }} />
          <div className="absolute right-[-10px] size-[20px] rounded-full" style={{ background: "#000" }} />
          <div className="w-full" style={{ borderTop: "2px dashed rgba(255,255,255,0.1)" }} />
        </div>

        {/* Stub — price + timer */}
        <div className="rounded-b-[12px] px-[24px] py-[16px] flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.05)", boxShadow: "inset 1px 0 0 rgba(255,255,255,0.08), inset -1px 0 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.08)" }}>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[9px] tracking-[1.5px] uppercase"
              style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.35)" }}>TOTAL</span>
            <PricePulse value={totalPrice}>
              <span className="text-[20px] text-white"
                style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>₹{totalPrice.toLocaleString("en-IN")}</span>
            </PricePulse>
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <span className="text-[9px] tracking-[1px] uppercase"
              style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.35)" }}>EXPIRES</span>
            <span className="text-[16px]" style={{ fontFamily: monoFont, color: "#ffbc35", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── V7: Clean ─────────────────────────────────────────────────────────────
   No event details — just price and timer. Assumes info is already on page. */
export function SidebarV7Clean({ countdown, memberCount, className, style }: SidebarProps) {
  const totalPrice = memberCount * 974;

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="flex flex-col items-start">

        {/* Square image — rounded, no overlay */}
        <div className="relative w-full rounded-[8px] overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
          <Image
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=700&h=700&fit=crop"
            alt="AI + Hardware Buildathon" fill className="object-cover"
          />
        </div>

        {/* Price block */}
        <div className="flex flex-col gap-[6px] pt-[24px] pb-[20px]">
          <span className="text-[10px] tracking-[2px] uppercase"
            style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.35)" }}>
            ORDER TOTAL
          </span>
          <div className="flex items-baseline gap-[8px]">
            <PricePulse value={totalPrice}>
              <span className="text-[32px] text-white tracking-[-1px]"
                style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </PricePulse>
            {memberCount > 1 && (
              <span className="text-[12px]" style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums" }}>
                {memberCount} × ₹974
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", width: "100%", boxShadow: "0 1px 0 rgba(255,255,255,0.08)" }} />

        {/* Ticket summary */}
        <div className="flex items-center justify-between w-full py-[16px]">
          <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>
            {memberCount > 1 ? `${memberCount} tickets` : "1 ticket"}
          </span>
          <span className="text-[13px]" style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
            ₹974 each
          </span>
        </div>

        {/* Timer footer */}
        <div className="flex items-center gap-[8px] py-[12px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="size-[5px] rounded-full bg-[#ffbc35] animate-pulse" />
          <span className="text-[11px]" style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.4)" }}>
            Expires in
          </span>
          <span className="text-[12px]" style={{ fontFamily: monoFont, color: "#ffbc35", fontVariantNumeric: "tabular-nums" }}>
            {countdown}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── V8: Collapsible ───────────────────────────────────────────────────────
   Price + timer visible. Event details behind a toggle. */
export function SidebarV8Collapsible({ countdown, memberCount, className, style }: SidebarProps) {
  const totalPrice = memberCount * 974;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="flex flex-col items-start">

        {/* Square image — rounded, no overlay */}
        <div className="relative w-full rounded-[8px] overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
          <Image
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=700&h=700&fit=crop"
            alt="AI + Hardware Buildathon" fill className="object-cover"
          />
        </div>

        {/* Price + Timer */}
        <div className="flex items-center justify-between w-full pt-[24px] pb-[20px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[10px] tracking-[2px] uppercase"
              style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.35)" }}>TOTAL</span>
            <PricePulse value={totalPrice}>
              <span className="text-[28px] text-white tracking-[-0.5px]"
                style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </PricePulse>
            {memberCount > 1 && (
              <span className="text-[11px]" style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums" }}>
                {memberCount} × ₹974
              </span>
            )}
          </div>
          <div className="flex items-center gap-[5px]">
            <div className="size-[5px] rounded-full bg-[#ffbc35] animate-pulse" />
            <span className="text-[11px]" style={{ fontFamily: monoFont, color: "#ffbc35", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </span>
          </div>
        </div>

        {/* Toggle for event details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0", width: "100%",
            background: "none",
            cursor: "pointer",
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: showDetails ? "1px solid rgba(255,255,255,0.06)" : "none",
            minHeight: "40px",
          }}
        >
          <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
            Event details
          </span>
          <ChevronDown
            size={14}
            color="rgba(255,255,255,0.4)"
            style={{ transform: showDetails ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
          />
        </button>

        {/* Collapsible event details */}
        <div style={{
          display: "grid",
          gridTemplateRows: showDetails ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s cubic-bezier(0.2, 0, 0, 1)",
          width: "100%",
        }}>
          <div style={{ overflow: "hidden" }}>
            <div className="flex flex-col gap-[10px] py-[16px]">
              <h3 className="text-[16px] text-white tracking-[-0.2px]"
                style={{ fontFamily: serifFont, margin: 0, textWrap: "balance" }}>
                AI + Hardware Buildathon
              </h3>
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center gap-[10px]">
                  <Calendar size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    Saturday, April 18
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <Clock size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    11:00 AM – 7:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <MapPin size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    Bengaluru, Karnataka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── V10: No Timer — Collapsible without countdown ────────────────────────
   Same as V8 but without timer. Price is the sole focus. */
export function SidebarV10NoTimer({ countdown, memberCount, className, style }: SidebarProps) {
  const totalPrice = memberCount * 974;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="flex flex-col items-start">

        {/* Square image — rounded, no overlay */}
        <div className="relative w-full rounded-[8px] overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
          <Image
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=700&h=700&fit=crop"
            alt="AI + Hardware Buildathon" fill className="object-cover"
          />
        </div>

        {/* Price only — no timer */}
        <div className="flex items-center justify-between w-full pt-[24px] pb-[20px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-[10px] tracking-[2px] uppercase"
              style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.35)" }}>TOTAL</span>
            <PricePulse value={totalPrice}>
              <span className="text-[28px] text-white tracking-[-0.5px]"
                style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </PricePulse>
            {memberCount > 1 && (
              <span className="text-[11px]" style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.4)", fontVariantNumeric: "tabular-nums" }}>
                {memberCount} × ₹974
              </span>
            )}
          </div>
        </div>

        {/* Toggle for event details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 0", width: "100%",
            background: "none",
            cursor: "pointer",
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: showDetails ? "1px solid rgba(255,255,255,0.06)" : "none",
            minHeight: "40px",
          }}
        >
          <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>
            Event details
          </span>
          <ChevronDown
            size={14}
            color="rgba(255,255,255,0.4)"
            style={{ transform: showDetails ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
          />
        </button>

        {/* Collapsible event details */}
        <div style={{
          display: "grid",
          gridTemplateRows: showDetails ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s cubic-bezier(0.2, 0, 0, 1)",
          width: "100%",
        }}>
          <div style={{ overflow: "hidden" }}>
            <div className="flex flex-col gap-[10px] py-[16px]">
              <h3 className="text-[16px] text-white tracking-[-0.2px]"
                style={{ fontFamily: serifFont, margin: 0, textWrap: "balance" }}>
                AI + Hardware Buildathon
              </h3>
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center gap-[10px]">
                  <Calendar size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    Saturday, April 18
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <Clock size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    11:00 AM – 7:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <MapPin size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    Bengaluru, Karnataka
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── V9: Clubbed Details ──────────────────────────────────────────────────
   Date+time combined into one row with a custom calendar icon showing
   month abbreviation on top and date number below.
   Location uses icon + title/subtext pattern (city / state). */

/* Custom calendar icon — month abbrev strip on top, date number below */
function CalendarDateIcon() {
  return (
    <div style={{
      width: "40px", height: "44px", borderRadius: "8px", flexShrink: 0, overflow: "hidden",
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
      background: "rgba(255,255,255,0.04)",
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <div style={{
        width: "100%", height: "16px",
        background: "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: monoFont, fontSize: "9px", fontWeight: 600,
          letterSpacing: "0.8px", textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)", lineHeight: 1,
        }}>APR</span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{
          fontFamily: gilroy, fontSize: "17px", fontWeight: 700,
          color: "rgba(255,255,255,0.85)", lineHeight: 1, fontVariantNumeric: "tabular-nums",
        }}>18</span>
      </div>
    </div>
  );
}

function DetailRow({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
      {icon}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{
          fontFamily: gilroy, fontWeight: 600, fontSize: "14px",
          color: "rgba(255,255,255,0.88)", lineHeight: 1.3,
        }}>{title}</span>
        <span style={{
          fontFamily: gilroy, fontWeight: 400, fontSize: "12px",
          color: "rgba(255,255,255,0.5)", lineHeight: 1.3,
        }}>{subtitle}</span>
      </div>
    </div>
  );
}

export function SidebarV9Clubbed({ countdown, memberCount, className, style }: SidebarProps) {
  const totalPrice = memberCount * 974;

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="flex flex-col gap-0 items-start">
        <div className="relative w-full rounded-t-[10px] overflow-hidden"
          style={{ aspectRatio: "16/9", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
          <Image
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=690&h=388&fit=crop"
            alt="AI + Hardware Buildathon" fill className="object-cover"
            style={{ outline: "1px solid rgba(255,255,255,0.06)", outlineOffset: "-1px" }}
          />
          <div className="absolute top-[10px] right-[10px] flex items-center gap-[6px] px-[10px] py-[5px] rounded-[6px]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
            <div className="size-[6px] rounded-full bg-[#ffbc35] animate-pulse" />
            <span className="text-[11px]" style={{ fontFamily: monoFont, color: "#ffbc35", fontVariantNumeric: "tabular-nums" }}>
              {countdown}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[18px] w-full rounded-b-[10px] p-[20px]"
          style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.15)" }}>

          <h2 className="text-[20px] text-white leading-[28px] tracking-[-0.3px]"
            style={{ fontFamily: serifFont, margin: 0, textWrap: "balance" }}>
            AI + Hardware Buildathon
          </h2>

          <div className="flex flex-col gap-[16px]">
            <DetailRow
              icon={<CalendarDateIcon />}
              title="Saturday, April 18"
              subtitle="11:00 AM – 7:00 PM  ·  8 hrs"
            />
            <DetailRow
              icon={
                <div style={{
                  width: "40px", height: "44px", borderRadius: "8px", flexShrink: 0,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.04)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin size={18} color="rgba(255,255,255,0.45)" />
                </div>
              }
              title="91springboard, Koramangala"
              subtitle="Bengaluru, Karnataka"
            />
          </div>

          <div style={{ height: "1px", boxShadow: "0 1px 0 rgba(255,255,255,0.08)" }} />

          <div className="flex items-center justify-between">
            <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>
              {memberCount > 1 ? `${memberCount} tickets × ₹974` : "1 ticket"}
            </span>
            <PricePulse value={totalPrice}>
              <span className="text-[18px] text-white" style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </PricePulse>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── V11: Simple ───────────────────────────────────────────────────────────
   Ultra-minimal. Large square image, "HOSTED BY" label, host card.
   Collapsible event details toggle at the bottom. */

export function SidebarV11Simple({ countdown, memberCount, className, style }: SidebarProps) {
  const [showDetails, setShowDetails] = useState(false);
  const totalPrice = memberCount * 974;
  const { seconds: rawSeconds, formatted: timerFormatted } = useCountdownRaw(10 * 60);

  // Color transitions: calm → warm → urgent
  // > 3 min: muted white (barely noticeable)
  // 1–3 min: amber warning
  // < 1 min: red urgent
  const timerColor = rawSeconds <= 60
    ? "#e85450"
    : rawSeconds <= 180
      ? "#e5a400"
      : "rgba(255,255,255,0.35)";

  const timerLabelColor = rawSeconds <= 60
    ? "rgba(232,84,80,0.6)"
    : rawSeconds <= 180
      ? "rgba(229,164,0,0.5)"
      : "rgba(255,255,255,0.25)";

  return (
    <div className={`relative shrink-0 ${className || ""}`} style={{ width: "345px", ...style }}>
      <div className="flex flex-col items-start">

        {/* Large square image — rounded corners */}
        <div className="relative w-full rounded-[8px] overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
          <Image
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=700&h=700&fit=crop"
            alt="AI + Hardware Buildathon" fill className="object-cover"
          />
        </div>

        {/* HOSTED BY label */}
        <span
          className="text-[12px] tracking-[3px] uppercase"
          style={{
            fontFamily: monoFont,
            color: "rgba(255,255,255,0.4)",
            fontWeight: 500,
            marginTop: "28px",
            marginBottom: "16px",
          }}
        >
          Hosted by
        </span>

        {/* Host card — bordered, with avatar + name */}
        <div
          className="flex items-center gap-[14px] w-full rounded-[10px]"
          style={{
            padding: "14px 16px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="relative size-[40px] rounded-full overflow-hidden" style={{ flexShrink: 0 }}>
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
              alt="Ishaan Bansal" fill className="object-cover"
            />
          </div>
          <span
            className="text-[14px] tracking-[2px] uppercase"
            style={{
              fontFamily: monoFont,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 500,
            }}
          >
            Ishaan Bansal
          </span>
        </div>

        {/* Registration timer — subtle, transitions to urgent */}
        {rawSeconds > 0 && (
          <div
            className="flex items-center gap-[8px] w-full"
            style={{ marginTop: "20px", transition: "opacity 0.3s ease" }}
          >
            <span
              className="text-[11px] tracking-[1.5px] uppercase"
              style={{
                fontFamily: monoFont,
                color: timerLabelColor,
                fontWeight: 500,
                transition: "color 1s ease",
              }}
            >
              Complete in
            </span>
            <span
              style={{
                fontFamily: monoFont,
                fontSize: "13px",
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
                color: timerColor,
                transition: "color 1s ease",
              }}
            >
              {timerFormatted}
            </span>
          </div>
        )}

        {rawSeconds <= 0 && (
          <div
            className="flex items-center gap-[8px] w-full"
            style={{ marginTop: "20px" }}
          >
            <span
              className="text-[11px] tracking-[1.5px] uppercase"
              style={{
                fontFamily: monoFont,
                color: "#e85450",
                fontWeight: 500,
              }}
            >
              Session expired
            </span>
          </div>
        )}

        {/* Event details toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            marginTop: "16px",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
        >
          <span
            className="text-[12px] tracking-[2px] uppercase"
            style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}
          >
            Event details
          </span>
          <ChevronDown
            size={14}
            color="rgba(255,255,255,0.4)"
            style={{
              transform: showDetails ? "rotate(180deg)" : "rotate(0deg)",
              transition: `transform 0.25s ${EASE_OUT_QUINT}`,
            }}
          />
        </button>

        {/* Collapsible details */}
        <div style={{
          display: "grid",
          gridTemplateRows: showDetails ? "1fr" : "0fr",
          transition: `grid-template-rows 0.35s ${EASE_OUT_QUINT}`,
          width: "100%",
        }}>
          <div style={{ overflow: "hidden" }}>
            <div className="flex flex-col gap-[16px]" style={{ paddingTop: "16px" }}>

              {/* Event name */}
              <h3 className="text-[16px] text-white tracking-[-0.2px]"
                style={{ fontFamily: serifFont, margin: 0 }}>
                AI + Hardware Buildathon
              </h3>

              {/* Date, time, location */}
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[10px]">
                  <Calendar size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    Saturday, April 18
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <Clock size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    11:00 AM – 7:00 PM
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <MapPin size={13} color="rgba(255,255,255,0.4)" />
                  <span className="text-[12px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>
                    Bengaluru, Karnataka
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", boxShadow: "0 1px 0 rgba(255,255,255,0.08)" }} />

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-[13px]" style={{ fontFamily: gilroy, fontWeight: 500, color: "rgba(255,255,255,0.5)", fontVariantNumeric: "tabular-nums" }}>
                  {memberCount > 1 ? `${memberCount} tickets × ₹974` : "1 ticket"}
                </span>
                <PricePulse value={totalPrice}>
                  <span className="text-[18px] text-white" style={{ fontFamily: gilroy, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </PricePulse>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
