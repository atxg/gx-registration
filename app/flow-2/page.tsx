import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 2: "Immersive Focus"
 * Immersive + Clean sidebar + Outlined inputs + Radio picker + Current blue
 *
 * WHY: Immersive layout eliminates all distraction — one question owns the viewport.
 * Clean sidebar shows only price + timer (the two things that matter during checkout).
 * Outlined inputs feel lighter and more airy in the spacious immersive layout.
 * Radio picker is the most immediately scannable — no cards to parse, just two clear
 * rows. Current blue (#408cff) is softer than brand — matches the relaxed, focused mood.
 * Best for: users who get overwhelmed by dense UIs.
 */
export default function Flow2() {
  return (
    <CheckoutFixed config={{
      layout: "immersive",
      sidebarVariant: "v7",
      inputStyle: "outlined",
      choiceVariant: "v3",
      accentId: "current",
    }} />
  );
}
