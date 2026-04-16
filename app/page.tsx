import PageController, { NavSlot, SidebarSlot } from "@/components/landing/PageController";
import EventHeader from "@/components/landing/EventHeader";
import About from "@/components/landing/About";
import MapSection from "@/components/landing/MapSection";
import HostSection from "@/components/landing/HostSection";
import FaqSection from "@/components/landing/FaqSection";

export default function Home() {
  return (
    <div className="min-h-screen w-full" style={{ background: "#060606" }}>
      {/* Hero gradient band */}
      <div
        className="relative w-full"
        style={{
          background:
            "linear-gradient(to bottom, rgba(108,108,108,0.25) 0%, rgba(108,108,108,0) 100%)",
          minHeight: "900px",
        }}
      >
        <NavSlot />

        {/* 2-column layout: sticky card + scrollable content */}
        <div
          className="relative mx-auto flex gap-0 items-start pb-[80px]"
          style={{
            maxWidth: "1440px",
            paddingLeft: "216px",
            paddingRight: "216px",
          }}
        >
          {/* LEFT — sticky event card */}
          <div className="shrink-0 sticky top-[78px]" style={{ width: "353px" }}>
            <SidebarSlot />
          </div>

          {/* RIGHT — scrollable main content */}
          <div
            className="flex-1 flex flex-col gap-[20px]"
            style={{ paddingLeft: "33px", minWidth: 0 }}
          >
            <EventHeader />

            <Divider />
            <div id="about">
              <About />
            </div>

            <Divider />
            <div id="location">
              <MapSection />
            </div>

            <Divider />
            <div id="host">
              <HostSection />
            </div>

            <Divider />
            <div id="faq">
              <FaqSection />
            </div>
          </div>
        </div>
      </div>

      {/* Single unified ProtoController for nav + sidebar */}
      <PageController />
    </div>
  );
}

function Divider() {
  return (
    <div
      className="h-px w-full shrink-0"
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}
