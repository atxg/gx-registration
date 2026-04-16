"use client";

/**
 * Wrapper that renders CheckoutV3 with fixed design settings — no proto controller.
 * Used by the /flow-N routes to create standalone permutations.
 */

import {
  AccentColorProvider,
  InputStyleProvider,
  FillOpacityProvider,
  ACCENT_PRESETS,
  type InputStyle,
  type AccentColor,
} from "./InputStyleContext";
import CheckoutV3, { type ChoiceVariant, type IconShape, type SimState } from "./CheckoutV3";

export interface FlowConfig {
  layout: "card" | "immersive";
  sidebarVariant: string;
  inputStyle: InputStyle;
  choiceVariant: ChoiceVariant;
  iconShape?: IconShape;
  accentId: string;
}

export default function CheckoutFixed({ config }: { config: FlowConfig }) {
  const accentColor: AccentColor = ACCENT_PRESETS[config.accentId] || ACCENT_PRESETS.current;

  return (
    <AccentColorProvider value={accentColor}>
      <InputStyleProvider value={config.inputStyle}>
        <FillOpacityProvider value={1}>
          <CheckoutV3
            layout={config.layout}
            sidebarVariant={config.sidebarVariant}
            choiceVariant={config.choiceVariant}
            iconShape={config.iconShape || "circle"}
            simState="fresh"
          />
        </FillOpacityProvider>
      </InputStyleProvider>
    </AccentColorProvider>
  );
}
