import Image from "next/image";
import { Users, ChevronRight } from "lucide-react";

export default function EventHeader() {
  return (
    <div className="flex flex-col items-start w-full">
      {/* Title */}
      <div className="pb-[12px] w-full">
        <h1
          className="text-[56px] text-white tracking-[-2px] leading-[70px]"
          style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
          }}
        >
          AI + Hardware Buildathon
        </h1>
      </div>

      {/* Metadata chips row */}
      <div className="grid grid-cols-2 gap-[10px] w-full">
        {/* Date chip */}
        <div
          className="flex items-center p-[10.4px] rounded-[10px] border col-span-1"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(113,116,121,0.25)",
          }}
        >
          {/* Calendar icon box */}
          <div className="flex flex-col overflow-clip rounded-[8px] shrink-0 mr-3" style={{ width: 50, height: 55 }}>
            <div
              className="flex items-center justify-center h-[21.6px] w-full rounded-tl-[8px] rounded-tr-[8px]"
              style={{ background: "#595959" }}
            >
              <span
                className="text-[10px] text-white tracking-[1.5px]"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
              >
                APR
              </span>
            </div>
            <div
              className="flex flex-1 items-center justify-center"
              style={{ background: "#2c2c2c" }}
            >
              <span
                className="text-[16px] text-white tracking-[3.6px]"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
              >
                18
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span
              className="text-[12px] text-white leading-[27px]"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
            >
              Saturday, April 18
            </span>
            <span
              className="text-[12px] text-white leading-[27px]"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
            >
              11:00 AM – 07:00 PM
            </span>
          </div>
        </div>

        {/* Location chip */}
        <div
          className="flex items-center gap-4 p-[10.4px] rounded-[10px] border"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(113,116,121,0.25)",
          }}
        >
          <div className="size-[50px] flex items-center justify-center shrink-0 opacity-50">
            <svg viewBox="0 0 50 50" fill="none" className="size-full">
              {/* simplified city silhouette */}
              <rect x="5" y="20" width="8" height="25" fill="#fff" rx="1" />
              <rect x="15" y="12" width="10" height="33" fill="#fff" rx="1" />
              <rect x="27" y="18" width="8" height="27" fill="#fff" rx="1" />
              <rect x="37" y="24" width="8" height="21" fill="#fff" rx="1" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span
              className="text-[10px] leading-[14px]"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                color: "#8e8e8e",
              }}
            >
              CITY
            </span>
            <span
              className="text-[12px] text-white leading-[22px]"
              style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
            >
              Bengaluru
            </span>
            <span
              className="text-[11px] leading-[20px]"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                color: "#8e8e8e",
              }}
            >
              Karnataka
            </span>
          </div>
        </div>

        {/* Attendees chip */}
        <div
          className="flex flex-col justify-between p-[10.4px] rounded-[10px] border"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(113,116,121,0.25)",
          }}
        >
          {/* Stacked avatars */}
          <div className="flex items-center blur-[1px]">
            {[
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop",
              "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop",
            ].map((src, i) => (
              <div
                key={i}
                className="relative size-[38px] rounded-full overflow-hidden border-2 border-white"
                style={{ marginLeft: i > 0 ? "-8px" : 0, zIndex: 4 - i }}
              >
                <Image src={src} alt={`Attendee ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span
              className="text-[9px] text-white tracking-[1.3px] uppercase"
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
                fontWeight: 500,
              }}
            >
              Guest list
            </span>
            <ChevronRight className="size-4 text-white opacity-70" />
          </div>
        </div>

        {/* Audience chip */}
        <div
          className="flex flex-col justify-center p-[10.4px] rounded-[10px] border"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(113,116,121,0.25)",
          }}
        >
          <span
            className="text-[10px] leading-[14px] mb-1"
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
              color: "#8e8e8e",
            }}
          >
            AUDIENCE
          </span>
          <span
            className="text-[12px] text-white leading-[22px]"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace" }}
          >
            Public
          </span>
        </div>
      </div>
    </div>
  );
}
