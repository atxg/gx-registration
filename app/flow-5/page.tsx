import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 5: "Ticket Experience"
 * Card + Ticket sidebar + Outlined inputs + Bare picker + Proposed blue
 *
 * WHY: The ticket sidebar mimics a physical event ticket — perforated edge, admits
 * count, expiry. This is the most "event-specific" combination. Bare picker is
 * the simplest — just icons and text, no wells or containers to add visual weight.
 * Outlined inputs echo the ticket's border language. Proposed blue (#5b9eff) is
 * the lightest accent — doesn't overpower the playful ticket sidebar.
 * Best for: creating a tangible "I'm getting a ticket" feeling.
 */
export default function Flow5() {
  return (
    <CheckoutFixed config={{
      layout: "card",
      sidebarVariant: "v4",
      inputStyle: "outlined",
      choiceVariant: "v1",
      accentId: "proposed",
    }} />
  );
}
