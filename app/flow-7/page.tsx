import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 7: "3D Silver Immersive"
 * Immersive + Glass sidebar + Underline inputs + 3D Silver 2 icons (circle) + Current blue
 *
 * WHY: Silver 2 icons are the most detailed/realistic 3D renders. Glass sidebar
 * creates a frosted surface that complements the metallic icons. Immersive layout
 * gives the 3D icons maximum visual real estate — they're the hero of the first
 * screen. Underline inputs keep the subsequent steps feeling light. Current blue
 * is warm enough not to clash with the cool silver tones.
 * Best for: maximum visual impact on the join type screen.
 */
export default function Flow7() {
  return (
    <CheckoutFixed config={{
      layout: "immersive",
      sidebarVariant: "v3",
      inputStyle: "underline",
      choiceVariant: "v12",
      iconShape: "circle",
      accentId: "current",
    }} />
  );
}
