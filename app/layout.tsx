import type { Metadata } from "next";
import "./globals.css";
import AgentationWrapper from "@/components/AgentationWrapper";

export const metadata: Metadata = {
  title: "AI + Hardware Buildathon — GrowthX",
  description:
    "Build a real, working AI use case deployed on smart glasses. A focused room of builders, shipping something real. Saturday, April 18 · Bengaluru.",
  openGraph: {
    title: "AI + Hardware Buildathon",
    description:
      "At this buildathon, you'll work with Trace smart glasses by EndlessRiver — a wearable AI system that sees, hears, and responds in real time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body
        className="min-h-full antialiased"
        style={{ backgroundColor: "#060606", color: "#ffffff", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
      >
        {children}
        <AgentationWrapper />
      </body>
    </html>
  );
}
