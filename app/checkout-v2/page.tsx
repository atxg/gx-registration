"use client";

import { useState } from "react";
import ProtoController from "@/components/register/ProtoController";
import {
  InputStyleProvider,
  FillOpacityProvider,
  AccentColorProvider,
  ACCENT_PRESETS,
  type InputStyle,
  type AccentColor,
} from "@/components/checkout/InputStyleContext";
import CheckoutNew from "@/components/checkout/CheckoutNew";

const VERSIONS = [
  { id: "card", label: "Card Flow", description: "Sidebar + step-by-step form", tag: "SIDEBAR" },
  { id: "immersive", label: "Immersive", description: "Full-screen, one question at a time", tag: "TYPEFORM" },
];

const SIDEBAR_CHOICES = [
  { id: "v1", label: "Summary" },
  { id: "v3", label: "Glass" },
  { id: "v4", label: "Ticket" },
  { id: "v7", label: "Clean" },
  { id: "v8", label: "Toggle" },
  { id: "v10", label: "No Timer" },
  { id: "v9", label: "Clubbed" },
  { id: "v11", label: "Luma" },
];

const INPUT_STYLE_CHOICES = [
  { id: "filled", label: "Filled" },
  { id: "outlined", label: "Outlined" },
  { id: "underline", label: "Underline" },
];

const ACCENT_CHOICES = [
  { id: "current", label: "Current", color: "#408cff" },
  { id: "proposed", label: "Proposed", color: "#5b9eff" },
  { id: "brand", label: "Brand", color: "#0064ff" },
  { id: "white", label: "White", color: "#ffffff" },
];

export default function Checkout() {
  const [layout, setLayout] = useState("card");
  const [sidebarVariant, setSidebarVariant] = useState("v11");
  const [inputStyle, setInputStyle] = useState<InputStyle>("filled");
  const [accentId, setAccentId] = useState("current");

  const accentColor: AccentColor = ACCENT_PRESETS[accentId] || ACCENT_PRESETS.current;

  return (
    <>
      <AccentColorProvider value={accentColor}>
        <InputStyleProvider value={inputStyle}>
          <FillOpacityProvider value={1}>
            <div key={`${layout}-${sidebarVariant}-${inputStyle}-${accentId}`}>
              <CheckoutNew layout={layout as any} sidebarVariant={sidebarVariant} />
            </div>
          </FillOpacityProvider>
        </InputStyleProvider>
      </AccentColorProvider>
      <ProtoController
        versions={VERSIONS}
        activeVersion={layout}
        onVersionChange={setLayout}
        options={[
          {
            id: "sidebar",
            label: "Sidebar Style",
            choices: SIDEBAR_CHOICES,
            activeId: sidebarVariant,
            onChange: setSidebarVariant,
          },
          {
            id: "input",
            label: "Input Style",
            choices: INPUT_STYLE_CHOICES,
            activeId: inputStyle,
            onChange: (id) => setInputStyle(id as InputStyle),
          },
          {
            id: "accent",
            label: "Accent Color",
            choices: ACCENT_CHOICES,
            activeId: accentId,
            onChange: setAccentId,
          },
        ]}
      />
    </>
  );
}
