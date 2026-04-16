import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 1: "Premium Contained"
 * Card + Luma sidebar + Filled inputs + Contained picker (white border) + Brand blue
 *
 * WHY: The Luma sidebar is the cleanest event summary. Contained picker with the
 * white selection border gives a premium, intentional feel — the icon well separates
 * the visual from the text. Filled inputs are the most familiar pattern. Brand blue
 * is the strongest accent — confident, high-contrast against the dark theme.
 * This is the "safe best" — polished, professional, zero friction.
 */
export default function Flow1() {
  return (
    <CheckoutFixed config={{
      layout: "card",
      sidebarVariant: "v11",
      inputStyle: "filled",
      choiceVariant: "v2",
      accentId: "brand",
    }} />
  );
}
