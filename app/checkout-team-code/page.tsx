"use client";

import {
  AccentColorProvider,
  InputStyleProvider,
  FillOpacityProvider,
  ACCENT_PRESETS,
} from "@/components/checkout/InputStyleContext";
import CheckoutTeamCode from "@/components/checkout/CheckoutTeamCode";

/**
 * Checkout Team Code — Standalone flow
 *
 * Team members join via a shareable 6-character code.
 * Team leader registers first, gets a code, shares it with teammates.
 * Teammates enter the code during their own registration to join the team.
 */
export default function CheckoutTeamCodePage() {
  return (
    <AccentColorProvider value={ACCENT_PRESETS.white}>
      <InputStyleProvider value="outlined">
        <FillOpacityProvider value={1}>
          <CheckoutTeamCode sidebarVariant="v11" />
        </FillOpacityProvider>
      </InputStyleProvider>
    </AccentColorProvider>
  );
}
