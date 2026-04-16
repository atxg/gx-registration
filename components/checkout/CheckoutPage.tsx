"use client";

import { useState } from "react";
import ProtoController from "@/components/register/ProtoController";
import { InputStyleProvider, FillOpacityProvider, AccentColorProvider, OutlinedLabelYProvider, ACCENT_PRESETS, type InputStyle, type AccentColor } from "./InputStyleContext";
import CheckoutV1Card from "./CheckoutV1Card";
import CheckoutV2Immersive from "./CheckoutV2Immersive";
import CheckoutV3Scroll from "./CheckoutV3Scroll";
import CheckoutV4Split from "./CheckoutV4Split";

const VERSIONS = [
  {
    id: "v1",
    label: "Card Flow",
    description: "Figma-faithful sidebar + step-by-step right column",
    tag: "SIDEBAR",
  },
  {
    id: "v2",
    label: "Immersive",
    description: "One question at a time, full-screen Typeform feel",
    tag: "TYPEFORM",
  },
];

const SIDEBAR_CHOICES = [
  { id: "v1", label: "Summary" },
  { id: "v3", label: "Glass" },
  { id: "v4", label: "Ticket" },
  { id: "v7", label: "Clean" },
  { id: "v8", label: "Toggle" },
  { id: "v10", label: "No Timer" },
  { id: "v9", label: "Clubbed" },
  { id: "v11", label: "Simple" },
];

const NAV_CHOICES = [
  { id: "v1", label: "Top Back" },
  { id: "v2", label: "Inline Pair" },
  { id: "v3", label: "Breadcrumb" },
  { id: "v4", label: "Dock Bar" },
  { id: "v5", label: "Contextual" },
  { id: "v6", label: "Keyboard" },
  { id: "v7", label: "Split" },
];

const INPUT_STYLE_CHOICES = [
  { id: "filled", label: "Filled" },
  { id: "filled-tonal", label: "Tonal" },
  { id: "outlined", label: "Outlined" },
  { id: "rounded", label: "Rounded" },
  { id: "underline", label: "Underline" },
];

const CHOICE_VARIANTS = [
  { id: "v1", label: "Bare" },
  { id: "v2", label: "Contained" },
  { id: "v3", label: "Generous" },
  { id: "v4", label: "Grounded" },
  { id: "v5", label: "3D" },
  { id: "v6", label: "3D Silver" },
  { id: "v12", label: "3D Silver 2" },
  { id: "v13", label: "3D White" },
  { id: "v9", label: "Radio" },
  { id: "v11", label: "Immersive" },
];

const ACCENT_CHOICES = [
  { id: "current", label: "Current", color: "#408cff" },
  { id: "proposed", label: "Proposed", color: "#5b9eff" },
  { id: "brand", label: "Brand", color: "#0064ff" },
  { id: "white", label: "White", color: "#ffffff" },
];

const CTA_VARIANTS = [
  { id: "v1", label: "Raised" },
  { id: "v2", label: "Beveled" },
  { id: "v3", label: "Soft" },
  { id: "v4", label: "Glass" },
  { id: "v5", label: "Key" },
  { id: "v6", label: "Solid" },
];

const ICON_SHAPE_CHOICES = [
  { id: "circle", label: "Circle" },
  { id: "square", label: "Square" },
];

export default function CheckoutPage() {
  const [active, setActive] = useState("v1");
  const [sidebarVariant, setSidebarVariant] = useState("v1");
  const [navStyle, setNavStyle] = useState("v1");
  const [inputStyle, setInputStyle] = useState<InputStyle>("filled");
  const [fillOpacity, setFillOpacity] = useState(1);
  const [choiceVariant, setChoiceVariant] = useState("v1");
  const [ctaVariant, setCtaVariant] = useState("v1");
  const [iconShape, setIconShape] = useState("circle");
  const [accentId, setAccentId] = useState("current");
  const [scrollHeader, setScrollHeader] = useState("v1");
  const [outlinedLabelY, setOutlinedLabelY] = useState(-11);

  const isFilledVariant = inputStyle === "filled" || inputStyle === "filled-tonal";
  const is3DVariant = choiceVariant === "v5" || choiceVariant === "v6" || choiceVariant === "v7" || choiceVariant === "v12" || choiceVariant === "v13";
  const accentColor: AccentColor = ACCENT_PRESETS[accentId] || ACCENT_PRESETS.current;

  return (
    <>
      <AccentColorProvider value={accentColor}>
        <InputStyleProvider value={inputStyle}>
          <FillOpacityProvider value={fillOpacity}>
            <OutlinedLabelYProvider value={outlinedLabelY}>
              <div key={`${active}-${sidebarVariant}-${navStyle}-${inputStyle}-${choiceVariant}-${ctaVariant}-${iconShape}-${accentId}-${scrollHeader}`}>
              {active === "v1" && <CheckoutV1Card sidebarVariant={sidebarVariant} navStyle={navStyle} choiceVariant={choiceVariant as any} ctaVariant={ctaVariant as any} iconShape={iconShape as any} />}
              {active === "v2" && <CheckoutV2Immersive sidebarVariant={sidebarVariant} />}
              {active === "v3" && <CheckoutV3Scroll sidebarVariant={sidebarVariant} headerStyle={scrollHeader} />}
              {active === "v4" && <CheckoutV4Split sidebarVariant={sidebarVariant} />}
              </div>
            </OutlinedLabelYProvider>
          </FillOpacityProvider>
        </InputStyleProvider>
      </AccentColorProvider>

      <ProtoController
        versions={VERSIONS}
        activeVersion={active}
        onVersionChange={setActive}
        options={[
          {
            id: "sidebar",
            label: "Sidebar Style",
            choices: SIDEBAR_CHOICES,
            activeId: sidebarVariant,
            onChange: setSidebarVariant,
          },
          {
            id: "nav",
            label: "Navigation",
            choices: NAV_CHOICES,
            activeId: navStyle,
            onChange: setNavStyle,
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
            id: "cta",
            label: "CTA Style",
            choices: CTA_VARIANTS,
            activeId: ctaVariant,
            onChange: setCtaVariant,
          },
          {
            id: "scroll-header",
            label: "Scroll Header",
            choices: [
              { id: "v1", label: "Minimal" },
              { id: "v2", label: "Progress" },
            ],
            activeId: scrollHeader,
            onChange: setScrollHeader,
            visible: active === "v3",
          },
        ]}
        rangeOptions={[
          {
            id: "fill-opacity",
            label: "Fill Opacity",
            min: 0,
            max: 1,
            step: 0.05,
            value: fillOpacity,
            onChange: setFillOpacity,
            visible: isFilledVariant,
            format: (v) => `${Math.round(v * 100)}%`,
          },
          {
            id: "outlined-label-y",
            label: "Label Y Position",
            min: -20,
            max: 0,
            step: 0.5,
            value: outlinedLabelY,
            onChange: setOutlinedLabelY,
            visible: inputStyle === "outlined",
            format: (v) => `${v}px`,
          },
        ]}
      />
    </>
  );
}
