const monoFont = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const bodyFont = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export default function About() {
  return (
    <div className="flex flex-col w-full" data-section="about">
      <span
        className="text-[12px] tracking-[2.4px] uppercase mb-[10px]"
        style={{ fontFamily: monoFont, color: "rgba(255,255,255,0.7)" }}
      >
        About
      </span>

      <div
        className="flex flex-col gap-[24px] text-[16px] leading-[24px] tracking-[-0.1px]"
        style={{ fontFamily: bodyFont, color: "#dce2ec" }}
      >
        <div>
          <p className="mb-0">Most AI is still confined to screens.</p>
          <p>This is not.</p>
        </div>

        <p>
          At this buildathon, you&apos;ll work with Trace smart glasses by EndlessRiver
          — a wearable AI system that sees, hears, and responds in real time.
        </p>

        <div>
          <p className="mb-0">This isn&apos;t any ordinary hackathon.</p>
          <p>It&apos;s a focused room of builders, shipping something real.</p>
        </div>

        <div>
          <p className="mb-0">Bring a problem worth solving.</p>
          <p className="mb-0">
            By the end of the day, you&apos;ll have a working AI skill running on
            hardware. Not a prototype. Not a pitch.
          </p>
        </div>

        <div>
          <p className="mb-0">No embedded systems. No firmware.</p>
          <p>Just clarity of thought, and the ability to execute.</p>
        </div>

        <p className="font-bold">Who is this for?</p>

        <ul className="list-disc pl-[22px] flex flex-col gap-[4px]">
          <li>Developers, designers, operators, marketers, founders</li>
          <li>Anyone already building (or itching to) with AI</li>
          <li>
            People who care more about <em>shipping</em> than just talking
          </li>
        </ul>

        <p className="font-bold">What you&apos;ll walk away with:</p>

        <ul className="list-disc pl-[22px] flex flex-col gap-[4px]">
          <li>A real, working AI use case deployed on smart glasses</li>
          <li>Hands-on experience with real-world AI interfaces</li>
          <li>A room full of high-agency builders like you</li>
        </ul>

        <p className="font-bold">20 spots | One day</p>
      </div>
    </div>
  );
}
