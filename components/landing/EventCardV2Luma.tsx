"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const mono =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const sans =
  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const serif =
  "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";

/* Fake attendee avatars — colours from the reference */
const attendees = [
  { bg: "#2d2d3d", initials: "N" },
  { bg: "#3d2d4d", initials: "K" },
  { bg: "#4d3d5d", initials: "W" },
  { bg: "#5d4d3d", initials: "D" },
  { bg: "#c9b8a8", initials: "A" },
  { bg: "#e8d8c8", initials: "+" },
];

/**
 * V2 — Luma-style light sidebar
 * Clean, light-themed card with soft shadows.
 * Matches the reference: hero image → hosted by → attendees → actions → tag.
 */
export default function EventCardV2Luma() {
  return (
    <div
      className="flex flex-col w-full rounded-[16px] overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Hero image */}
      <div className="relative w-full" style={{ height: "320px" }}>
        <Image
          src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=400&fit=crop"
          alt="AI + Hardware Buildathon"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="flex flex-col px-[20px] py-[20px] gap-[16px]">
        {/* Hosted By */}
        <div className="flex flex-col gap-[10px]">
          <span
            style={{
              fontSize: "13px",
              fontFamily: sans,
              color: "#888",
              fontWeight: 400,
            }}
          >
            Hosted By
          </span>

          <div
            className="flex items-center justify-between py-[12px]"
            style={{
              borderTop: "1px solid #f0f0f0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div className="flex items-center gap-[10px]">
              {/* Host avatar */}
              <div
                className="relative size-[32px] rounded-full overflow-hidden shrink-0"
                style={{
                  background: "#e8e0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
                }}
              >
                Ishaan Bansal
              </span>
            </div>

            {/* X / Twitter icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#999"
              style={{ flexShrink: 0 }}
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </div>

        {/* Going section */}
        <div className="flex flex-col gap-[10px]">
          <span
            style={{
              fontSize: "14px",
              fontFamily: sans,
              color: "#1a1a1a",
              fontWeight: 500,
            }}
          >
            19 Going
          </span>

          {/* Attendee avatar stack */}
          <div className="flex items-center">
            {attendees.map((a, i) => (
              <div
                key={i}
                className="relative size-[30px] rounded-full border-2 border-white flex items-center justify-center"
                style={{
                  background: a.bg,
                  marginLeft: i === 0 ? 0 : "-8px",
                  zIndex: attendees.length - i,
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: mono,
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  {a.initials}
                </span>
              </div>
            ))}
          </div>

          <span
            style={{
              fontSize: "13px",
              fontFamily: sans,
              color: "#666",
              lineHeight: 1.4,
            }}
          >
            Nimisha, Kevin William David and 17 others
          </span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#f0f0f0" }} />

        {/* Action links */}
        <div className="flex flex-col gap-[8px]">
          <button
            className="text-left press-scale"
            style={{
              fontSize: "13px",
              fontFamily: sans,
              color: "#7c6caa",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Contact the Host
          </button>
          <button
            className="text-left press-scale"
            style={{
              fontSize: "13px",
              fontFamily: sans,
              color: "#7c6caa",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Report Event
          </button>
        </div>

        {/* Tag */}
        <div>
          <span
            className="inline-flex items-center rounded-full px-[12px] py-[5px]"
            style={{
              fontSize: "12px",
              fontFamily: sans,
              color: "#555",
              fontWeight: 500,
              background: "#f5f5f5",
              border: "1px solid #eee",
            }}
          >
            # Tech
          </span>
        </div>

        {/* Register CTA */}
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 w-full rounded-[12px] transition-opacity hover:opacity-90 press-scale"
          style={{
            height: "50px",
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
