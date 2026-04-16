"use client";

import { Share2, ChevronLeft } from "lucide-react";

export default function Navbar() {
  return (
    <div
      className="sticky top-0 z-50 flex items-center justify-between py-5 px-[216px]"
      style={{ backdropFilter: "blur(6.25px)" }}
    >
      {/* Left: back + breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          className="flex items-center justify-center size-[38px] rounded-[8px] border"
          style={{
            background: "rgba(0,0,0,0.2)",
            borderColor: "rgba(113,116,121,0.3)",
          }}
          onClick={() => history.back()}
          aria-label="Back"
        >
          <ChevronLeft className="size-4 text-white" />
        </button>

        <nav className="flex items-center gap-0">
          <span
            className="text-[12.8px] tracking-[0.064px]"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Events
          </span>
          <span
            className="px-2 text-[16px]"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            /
          </span>
          <span
            className="text-[12.8px] tracking-[0.064px] text-white"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
          >
            AI + Hardware Buildathon
          </span>
        </nav>
      </div>

      {/* Right: share button */}
      <button
        className="flex items-center gap-2 h-[38px] px-[8.8px] rounded-[8px] border"
        style={{
          background: "rgba(0,0,0,0.2)",
          borderColor: "rgba(113,116,121,0.3)",
          minWidth: "150px",
          justifyContent: "center",
        }}
      >
        <Share2 className="size-[14px] text-white" />
        <span
          className="text-[14px] text-white tracking-[-0.28px]"
          style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 600,
          }}
        >
          Share
        </span>
      </button>
    </div>
  );
}
