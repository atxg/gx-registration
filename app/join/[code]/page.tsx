"use client";

import { use } from "react";
import {
  AccentColorProvider,
  InputStyleProvider,
  FillOpacityProvider,
  ACCENT_PRESETS,
} from "@/components/checkout/InputStyleContext";
import JoinViaLink from "@/components/checkout/JoinViaLink";

/**
 * Join via Link — Dynamic route
 *
 * When a teammate opens the invite link shared by the team leader,
 * they land here. Shows team info, existing members, and a simple
 * registration form to join the team.
 */
export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);

  return (
    <AccentColorProvider value={ACCENT_PRESETS.white}>
      <InputStyleProvider value="outlined">
        <FillOpacityProvider value={1}>
          <JoinViaLink code={code} sidebarVariant="v11" />
        </FillOpacityProvider>
      </InputStyleProvider>
    </AccentColorProvider>
  );
}
