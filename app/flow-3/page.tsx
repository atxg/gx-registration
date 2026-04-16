import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 3: "3D Silver Premium"
 * Card + Glass sidebar + Filled inputs + 3D Silver icons (circle) + White accent
 *
 * WHY: The chrome/silver 3D icons on a glass sidebar create a cohesive premium
 * metallic aesthetic. White accent makes the entire interface monochrome-elegant —
 * no color competes with the silver icons. Glass sidebar's frosted blur pairs
 * naturally with the metallic icon language. Filled inputs ground the form against
 * the ethereal glass elements. Circle icon shape is the natural default.
 * Best for: high-end event positioning, design-conscious audience.
 */
export default function Flow3() {
  return (
    <CheckoutFixed config={{
      layout: "card",
      sidebarVariant: "v3",
      inputStyle: "filled",
      choiceVariant: "v6",
      iconShape: "circle",
      accentId: "white",
    }} />
  );
}
