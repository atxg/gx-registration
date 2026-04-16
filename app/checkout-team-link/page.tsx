"use client";

import {
  AccentColorProvider,
  InputStyleProvider,
  FillOpacityProvider,
  ACCENT_PRESETS,
} from "@/components/checkout/InputStyleContext";
import CheckoutTeamLink from "@/components/checkout/CheckoutTeamLink";

/**
 * Checkout Team Link — Standalone flow
 *
 * Team leader registers, gets a unique invite link with 48h expiry.
 * Teammates open the link to register and auto-join the team.
 */
export default function CheckoutTeamLinkPage() {
  return (
    <AccentColorProvider value={ACCENT_PRESETS.white}>
      <InputStyleProvider value="outlined">
        <FillOpacityProvider value={1}>
          <CheckoutTeamLink sidebarVariant="v11" />
        </FillOpacityProvider>
      </InputStyleProvider>
    </AccentColorProvider>
  );
}
