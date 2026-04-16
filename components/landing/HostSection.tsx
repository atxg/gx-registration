import Image from "next/image";

const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const interests = [
  "🤖 AI Trends",
  "🤝 Collaboration",
  "🛠️ Practical Applications",
  "🔮 Future of AI",
];

export default function HostSection() {
  return (
    <div
      className="grid gap-[20px] w-full"
      style={{ gridTemplateColumns: "6fr 4fr" }}
    >
      {/* Left: Meet your host */}
      <div className="flex flex-col gap-[24px]">
        <span
          className="text-[16px] text-white leading-[24px]"
          style={{ fontFamily: monoFont }}
        >
          Meet your host
        </span>

        {/* Host card */}
        <div
          className="flex flex-col gap-[12px] p-[14px] rounded-[12px] w-[296px]"
          style={{
            background: "#1d1d1d",
            boxShadow: "0px 8px 25px 0px rgba(0,0,0,0.35)",
          }}
        >
          {/* Avatar + name row */}
          <div className="flex items-center gap-[12px]">
            <div className="relative size-[56px] rounded-[28px] overflow-hidden shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=112&h=112&fit=crop"
                alt="Ishaan Bansal"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span
                className="text-[14px] text-white leading-[21px]"
                style={{ fontFamily: gilroy, fontWeight: 700 }}
              >
                Ishaan Bansal
              </span>
              <span
                className="text-[11px] leading-[16.5px]"
                style={{ fontFamily: gilroy, fontWeight: 600, color: "#8bc68a" }}
              >
                Member since 2025
              </span>
            </div>
          </div>

          {/* Company row */}
          <div
            className="flex items-center justify-between p-[12px] rounded-[10px]"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="flex flex-col gap-[2px]">
              <span
                className="text-[12px] text-white leading-[18px]"
                style={{ fontFamily: gilroy, fontWeight: 600 }}
              >
                Founder
              </span>
              <span
                className="text-[10.2px] leading-[15px]"
                style={{ fontFamily: gilroy, fontWeight: 600, color: "#a2a6ad" }}
              >
                EndlessRiver
              </span>
            </div>

            {/* Company logo placeholder */}
            <div
              className="size-[44px] rounded-[22px] overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: "#2a2a2a" }}
            >
              <span
                className="text-[10px] text-white font-bold"
                style={{ fontFamily: gilroy }}
              >
                ER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Interests & Activities */}
      <div className="flex flex-col gap-[40px]">
        <span
          className="text-[12px] tracking-[2.4px] uppercase leading-[18px]"
          style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.7)" }}
        >
          Interests &amp; Activities
        </span>

        <div className="flex flex-col gap-[12px]">
          {interests.map((interest) => (
            <div
              key={interest}
              className="flex items-center h-[32px] px-[11px] rounded-[8px] border w-fit"
              style={{ borderColor: "rgba(113,116,121,0.2)" }}
            >
              <span
                className="text-[13px] text-white leading-[19.5px]"
                style={{ fontFamily: monoFont }}
              >
                {interest}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
