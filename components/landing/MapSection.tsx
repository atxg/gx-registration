const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const gilroy = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function MapSection() {
  return (
    <div className="flex flex-col gap-[20px] w-full">
      <div className="flex flex-col gap-[6px]">
        <h2
          className="text-[20px] text-white tracking-[-0.13px] leading-[30px]"
          style={{ fontFamily: gilroy, fontWeight: 700 }}
        >
          Where will you be?
        </h2>
        <p
          className="text-[14px] leading-[21px]"
          style={{ fontFamily: monoFont, color: "#9d9d9d" }}
        >
          This map is just an approximate location. Register to see the exact
          address.
        </p>
      </div>

      {/* Map placeholder */}
      <div
        className="relative w-full rounded-[16px] overflow-hidden"
        style={{ height: "200px", background: "#2e3033" }}
      >
        {/* Dark map grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            backgroundColor: "#1a1a2e",
          }}
        />

        {/* Road lines */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: 0,
            right: 0,
            height: "2px",
            background: "rgba(255,255,255,0.15)",
          }}
        />
        <div
          className="absolute"
          style={{
            left: "30%",
            top: 0,
            bottom: 0,
            width: "2px",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <div
          className="absolute"
          style={{
            left: "65%",
            top: 0,
            bottom: 0,
            width: "1px",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        {/* Center pin */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="size-3 rounded-full border-2 border-white"
            style={{ background: "#0064ff" }}
          />
        </div>

        {/* Bengaluru label */}
        <div
          className="absolute bottom-3 left-3 px-2 py-1 rounded text-[11px] text-white"
          style={{ background: "rgba(0,0,0,0.6)", fontFamily: monoFont }}
        >
          Bengaluru, Karnataka
        </div>

        {/* Maps credit */}
        <div
          className="absolute bottom-3 right-3 text-[10px]"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: monoFont }}
        >
          Register for exact location
        </div>
      </div>
    </div>
  );
}
