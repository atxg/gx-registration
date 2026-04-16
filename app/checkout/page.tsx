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
import CheckoutV3, { type SimState, type ChoiceVariant, type IconShape } from "@/components/checkout/CheckoutV3";

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

const CHOICE_VARIANTS = [
  { id: "v1", label: "Bare" },
  { id: "v2", label: "Contained" },
  { id: "v3", label: "Radio" },
  { id: "v5", label: "3D" },
  { id: "v6", label: "3D Silver" },
  { id: "v7", label: "3D Blue" },
  { id: "v12", label: "3D Silver 2" },
  { id: "v13", label: "3D White" },
];

const ICON_SHAPE_CHOICES = [
  { id: "circle", label: "Circle" },
  { id: "square", label: "Square" },
];

const SIM_STATE_CHOICES = [
  { id: "fresh", label: "Fresh" },
  { id: "registered-solo", label: "Registered Solo" },
  { id: "added-as-teammate", label: "Added by Team" },
];

export default function Checkout() {
  const [layout, setLayout] = useState("card");
  const [sidebarVariant, setSidebarVariant] = useState("v11");
  const [inputStyle, setInputStyle] = useState<InputStyle>("filled");
  const [accentId, setAccentId] = useState("current");
  const [choiceVariant, setChoiceVariant] = useState("v1");
  const [iconShape, setIconShape] = useState("circle");
  const [simState, setSimState] = useState("fresh");

  const is3DVariant = ["v5", "v6", "v7", "v12", "v13"].includes(choiceVariant);

  const accentColor: AccentColor = ACCENT_PRESETS[accentId] || ACCENT_PRESETS.current;

  return (
    <>
      <AccentColorProvider value={accentColor}>
        <InputStyleProvider value={inputStyle}>
          <FillOpacityProvider value={1}>
            <div key={`${layout}-${sidebarVariant}-${inputStyle}-${accentId}-${choiceVariant}-${iconShape}-${simState}`}>
              <CheckoutV3
                layout={layout as any}
                sidebarVariant={sidebarVariant}
                choiceVariant={choiceVariant as ChoiceVariant}
                iconShape={iconShape as IconShape}
                simState={simState as SimState}
              />
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
            id: "choice",
            label: "Join Picker",
            choices: CHOICE_VARIANTS,
            activeId: choiceVariant,
            onChange: setChoiceVariant,
          },
          {
            id: "icon-shape",
            label: "Icon Shape",
            choices: ICON_SHAPE_CHOICES,
            activeId: iconShape,
            onChange: setIconShape,
            visible: is3DVariant,
          },
          {
            id: "accent",
            label: "Accent Color",
            choices: ACCENT_CHOICES,
            activeId: accentId,
            onChange: setAccentId,
          },
          {
            id: "sim-state",
            label: "Simulate State",
            choices: SIM_STATE_CHOICES,
            activeId: simState,
            onChange: setSimState,
          },
        ]}
      />
    </>
  );
}
