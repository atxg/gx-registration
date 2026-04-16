"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const sans =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const mono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

const attendees = [
  { bg: "#2a2a3a" },
  { bg: "#3a2a4a" },
  { bg: "#4a3a5a" },
  { bg: "#5a4a3a" },
  { bg: "#c4b4a4" },
  { bg: "#e8ddd0" },
];

/**
 * V3 — Flat / Editorial
 * No card container — content lives directly on a warm light surface.
 * Image floats with padding and rounded corners. Generous whitespace.
 * Thin hairline dividers. Muted purple action links. Editorial feel.
 */
export default function EventCardV3Flat() {
  return (
    <div
      className="flex flex-col w-full rounded-[20px]"
      style={{
        background: "#f6f5f3",
        padding: "16px",
      }}
    >
      {/* Hero image — padded, rounded, floating */}
      <div
        className="relative w-full rounded-[14px] overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=600&fit=crop"
          alt="AI + Hardware Buildathon"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content area — generous spacing */}
      <div
        className="flex flex-col"
        style={{ padding: "20px 4px 4px" }}
      >
        {/* Hosted By */}
        <span
          style={{
            fontSize: "13.5px",
            fontFamily: sans,
            color: "#9a9a9a",
            fontWeight: 400,
            letterSpacing: "-0.1px",
            marginBottom: "14px",
          }}
        >
          Hosted By
        </span>

        {/* Host row — bordered top & bottom */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "14px 0",
            borderTop: "1px solid #e8e6e3",
            borderBottom: "1px solid #e8e6e3",
          }}
        >
          <div className="flex items-center gap-[10px]">
            <div className="relative size-[30px] rounded-full overflow-hidden shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
                alt="Ishaan Bansal"
                fill
                className="object-cover"
              />
            </div>
            <span
              style={{
                fontSize: "15px",
                fontFamily: sans,
                color: "#1a1a1a",
                fontWeight: 600,
                letterSpacing: "-0.2px",
              }}
            >
              Ishaan Bansal
            </span>
          </div>

          {/* X / Twitter */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#b0b0b0" style={{ flexShrink: 0 }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>

        {/* Going count */}
        <div
          className="flex flex-col gap-[12px]"
          style={{
            padding: "16px 0",
            borderBottom: "1px solid #e8e6e3",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontFamily: sans,
              color: "#4a4a4a",
              fontWeight: 500,
              letterSpacing: "-0.1px",
            }}
          >
            19 Going
          </span>

          {/* Avatar stack */}
          <div className="flex items-center">
            {attendees.map((a, i) => (
              <div
                key={i}
                className="relative size-[28px] rounded-full overflow-hidden"
                style={{
                  marginLeft: i === 0 ? 0 : "-7px",
                  zIndex: attendees.length - i,
                  border: "2px solid #f6f5f3",
                  background: a.bg,
                }}
              >
                <Image
                  src={`https://images.unsplash.com/photo-${
                    [
                      "1535713875002-d1d0cf377fde",
                      "1494790108377-be9c29b29330",
                      "1507003211169-0a1dd7228f2d",
                      "1438761681033-6461ffad8d80",
                      "1472099645785-5658abf4ff4e",
                      "1544005313-94ddf0286df2",
                    ][i]
                  }?w=60&h=60&fit=crop`}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <span
            style={{
              fontSize: "13px",
              fontFamily: sans,
              color: "#888",
              lineHeight: 1.45,
              letterSpacing: "-0.1px",
            }}
          >
            Nimisha, Kevin William David and 17 others
          </span>
        </div>

        {/* Action links */}
        <div
          className="flex flex-col gap-[6px]"
          style={{ padding: "16px 0" }}
        >
          <button
            className="text-left press-scale"
            style={{
              fontSize: "13.5px",
              fontFamily: sans,
              color: "#7b6ba5",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 0",
              letterSpacing: "-0.1px",
            }}
          >
            Contact the Host
          </button>
          <button
            className="text-left press-scale"
            style={{
              fontSize: "13.5px",
              fontFamily: sans,
              color: "#7b6ba5",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "2px 0",
              letterSpacing: "-0.1px",
            }}
          >
            Report Event
          </button>
        </div>

        {/* Tag */}
        <div style={{ paddingTop: "2px", paddingBottom: "8px" }}>
          <span
            className="inline-flex items-center rounded-full"
            style={{
              fontSize: "12.5px",
              fontFamily: sans,
              color: "#666",
              fontWeight: 500,
              background: "#eeecea",
              padding: "5px 14px",
              letterSpacing: "-0.1px",
            }}
          >
            # Tech
          </span>
        </div>

        {/* Register CTA — subtle, rounded */}
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 w-full rounded-[12px] transition-all hover:opacity-90 press-scale"
          style={{
            height: "48px",
            marginTop: "4px",
            background: "#1a1a1a",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontFamily: sans,
              color: "#fff",
              fontWeight: 600,
              letterSpacing: "-0.2px",
            }}
          >
            Register
          </span>
          <ArrowRight size={14} color="#fff" />
        </Link>
      </div>
    </div>
  );
}
