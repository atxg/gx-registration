"use client";
import { useState } from "react";
import ProtoController from "@/components/register/ProtoController";
import FormV1Google from "@/components/register/FormV1Google";
import FormV2Typeform from "@/components/register/FormV2Typeform";
import FormV3Conversational from "@/components/register/FormV3Conversational";
import FormV4Checkout from "@/components/register/FormV4Checkout";
import FormV5Cards from "@/components/register/FormV5Cards";
import FormV6Team from "@/components/register/FormV6Team";

const VERSIONS = [
  {
    id: "v1",
    label: "Minimal Scroll",
    description: "All fields visible, pills over dropdowns — low cognitive load",
    tag: "Google-inspired",
  },
  {
    id: "v2",
    label: "One at a Time",
    description: "Full-screen per question, animated transitions",
    tag: "Typeform-style",
  },
  {
    id: "v3",
    label: "Conversational",
    description: "Chat interface — feels like messaging",
    tag: "Chat UX",
  },
  {
    id: "v4",
    label: "Checkout Flow",
    description: "Event card sidebar + bold questions + live countdown — from Figma",
    tag: "Checkout UX",
  },
  {
    id: "v5",
    label: "Guided Steps",
    description: "Accordion cards, locked until previous is complete",
    tag: "Step-by-step",
  },
  {
    id: "v6",
    label: "Team-First",
    description: "Team builder hero, invite by email, price per seat",
    tag: "Team UX",
  },
];

const FORMS: Record<string, React.ReactNode> = {
  v1: <FormV1Google />,
  v2: <FormV2Typeform />,
  v3: <FormV3Conversational />,
  v4: <FormV4Checkout />,
  v5: <FormV5Cards />,
  v6: <FormV6Team />,
};

export default function RegisterPage() {
  const [active, setActive] = useState("v1");

  return (
    <div style={{ minHeight: "100vh", background: "#060606", color: "#fff", position: "relative" }}>
      {/* Render only the active form (key forces remount on switch) */}
      <div key={active} style={{ minHeight: "100vh" }}>
        {FORMS[active]}
      </div>

      {/* Proto controller — always on top */}
      <ProtoController
        versions={VERSIONS}
        activeVersion={active}
        onVersionChange={setActive}
      />
    </div>
  );
}
