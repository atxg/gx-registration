"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const faqs = [
  {
    q: "What if I can't make it last minute?",
    a: "No refunds for cancellations or no-shows due to limited reserved spots. Late cancellations can be marked 'Opt-out' to release your spot for someone else.",
  },
  {
    q: "Will there be a recording?",
    a: "No recording will be provided. This is a live, in-person experience — the value is in the room.",
  },
  {
    q: "How long is the event?",
    a: "It's an 8-hour hands-on buildathon running from 11:00 AM to 7:00 PM on Saturday, April 18.",
  },
  {
    q: "What should I bring to the event?",
    a: "Bring your laptop with a coding setup (Cursor, Claude, Antigravity, etc.), and arrive with curiosity, excitement, and ideas.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-[20px] w-full">
      <span
        className="text-[16px] text-white leading-[24px]"
        style={{ fontFamily: monoFont }}
      >
        FAQs
      </span>

      <div className="flex flex-col gap-[8px]">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-[8px] px-[12.8px] overflow-hidden"
            style={{
              backdropFilter: "blur(5px)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(113,116,121,0.15)",
            }}
          >
            <button
              className="flex items-center justify-between w-full min-h-[48px] py-[3px] text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span
                className="text-[12px] text-white leading-[18px] flex-1"
                style={{ fontFamily: gilroy, fontWeight: 600 }}
              >
                {faq.q}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-white opacity-70 shrink-0 ml-3 transition-transform duration-200",
                  open === i && "rotate-180"
                )}
              />
            </button>

            {open === i && (
              <div className="pb-[14px]">
                <p
                  className="text-[12px] leading-[20px]"
                  style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.7)" }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
