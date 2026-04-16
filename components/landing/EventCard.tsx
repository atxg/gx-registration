"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function EventCard() {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      {/* Hero image */}
      <div
        className="relative w-full rounded-[8px] overflow-hidden"
        style={{ height: "331px" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600&h=400&fit=crop"
          alt="AI + Hardware Buildathon"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Host section */}
      <div className="flex flex-col gap-[12px] pt-[2px] pb-[8px]">
        <p
          className="text-[12px] tracking-[2.4px] uppercase"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
            color: "#969ba5",
          }}
        >
          HOSTED BY
        </p>

        <div
          className="flex items-center px-[12.8px] py-[10.8px] rounded-[8px] border"
          style={{
            borderColor: "rgba(113,116,121,0.25)",
          }}
        >
          <div className="relative size-[40px] rounded-full overflow-hidden mr-4 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop"
              alt="Ishaan Bansal"
              fill
              className="object-cover"
            />
          </div>
          <span
            className="text-[14px] text-white tracking-[1.68px] uppercase"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
          >
            Ishaan Bansal
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full shrink-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Price + Register */}
      <div className="flex flex-col gap-[10px]" data-section="register">
        {/* Private event label */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10.5px] text-white tracking-[1.05px] uppercase"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              fontWeight: 500,
            }}
          >
            This is a private event.
          </span>
          <button
            className="flex items-center justify-center p-2 rounded-full"
            aria-label="Private event info"
          >
            <Lock className="size-[15px] text-white opacity-70" />
          </button>
        </div>

        {/* Price + CTA row */}
        <div className="flex items-center gap-[16px]">
          {/* Price */}
          <div className="flex flex-col shrink-0">
            <span
              className="text-[9px] tracking-[1.8px] uppercase mb-1"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              Price
            </span>
            <span
              className="text-[16px] text-white tracking-[-0.16px]"
              style={{
                fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              ₹974
            </span>
          </div>

          {/* Register button */}
          <Link
            href="/checkout"
            className="flex flex-1 items-center justify-center gap-2 h-[55px] rounded-[10px] transition-opacity hover:opacity-90"
            style={{
              background: "#0064ff",
              boxShadow: "0px 0px 25px 0px rgba(255,255,255,0.25)",
            }}
          >
            <span
              className="text-[12px] text-white tracking-[1.05px] uppercase"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                fontWeight: 500,
              }}
            >
              Register
            </span>
            <ArrowRight className="size-[14px] text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
