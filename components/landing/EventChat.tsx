import Image from "next/image";

const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const segoe = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function EventChat() {
  return (
    <div
      className="relative rounded-[12px] overflow-hidden flex-shrink-0"
      style={{
        width: "100%",
        height: "700px",
        border: "1px solid rgba(255,255,255,0.22)",
      }}
    >
      {/* Chat content underneath blur */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ background: "#121212" }}
      >
        {/* Chat header */}
        <div
          className="flex items-center px-8 shrink-0"
          style={{
            height: "62px",
            backdropFilter: "blur(6.25px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span
            className="text-[20px] text-white tracking-[-0.13px] leading-[20px]"
            style={{ fontFamily: gilroy, fontWeight: 700 }}
          >
            Event Chat
          </span>
        </div>

        {/* Single chat message */}
        <div className="flex flex-col flex-1 px-8 pt-6 overflow-hidden">
          <div className="flex items-start gap-[9px]">
            {/* Avatar */}
            <div className="relative size-[40px] rounded-full overflow-hidden shrink-0">
              <Image
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop"
                alt="Aarshi"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              {/* Name + time */}
              <div className="flex items-center gap-[6px] mb-[2px]">
                <span
                  className="text-[15px] text-white tracking-[-0.14px] leading-[22.5px] font-bold"
                  style={{ fontFamily: segoe }}
                >
                  Aarshi
                </span>
                <span
                  className="text-[13px] leading-[19.5px]"
                  style={{ fontFamily: segoe, color: "rgba(255,255,255,0.6)" }}
                >
                  2 days ago
                </span>
              </div>

              {/* Message */}
              <p
                className="text-[15px] text-white leading-[22.5px]"
                style={{ fontFamily: segoe }}
              >
                Will this session add value or just convince me to rename
                everything to ai?
              </p>

              {/* Reaction */}
              <div className="mt-[6px]">
                <button
                  className="flex items-center gap-[5px] h-[32px] px-[10px] rounded-[24px]"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <span className="text-[15px]">💀</span>
                  <span
                    className="text-[13px] text-white tracking-[-0.14px] font-semibold"
                    style={{ fontFamily: segoe }}
                  >
                    10
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progressive blur overlay — simulates the locked chat effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(18,18,18,0.6) 50%, rgba(18,18,18,0.92) 65%, rgba(18,18,18,0.98) 80%)",
          backdropFilter: "blur(0px)",
        }}
      />

      {/* CTA overlay — bottom 60% */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[80px] gap-[21px]">
        <p
          className="text-[14px] text-white text-center leading-[16.8px]"
          style={{ fontFamily: gilroy, fontWeight: 600 }}
        >
          Register to see what&apos;s cooking.
        </p>
        <button
          className="flex items-center justify-center h-[45px] px-[50px] rounded-[10px] text-[14px] tracking-[-0.28px] font-bold transition-opacity hover:opacity-90"
          style={{
            background: "#ffffff",
            color: "#0a0a0a",
            fontFamily: gilroy,
            fontWeight: 700,
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}
