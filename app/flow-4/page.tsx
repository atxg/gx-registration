import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 4: "3D Blue Immersive"
 * Immersive + Luma sidebar + Underline inputs + 3D Blue icons (circle) + Brand blue
 *
 * WHY: The blue 3D icons match the brand blue accent — everything speaks the same
 * color language. Underline inputs are the most minimal style, which lets the
 * immersive layout breathe. Luma sidebar keeps full event context visible.
 * The combination of 3D blue icons + brand blue CTA + underline inputs creates
 * a typographic-forward, editorial feel. Circle icons for organic warmth.
 * Best for: tech/builder audience who appreciate design restraint.
 */
export default function Flow4() {
  return (
    <CheckoutFixed config={{
      layout: "immersive",
      sidebarVariant: "v11",
      inputStyle: "underline",
      choiceVariant: "v7",
      iconShape: "circle",
      accentId: "brand",
    }} />
  );
}
