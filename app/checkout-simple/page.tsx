import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 9: "Checkout Simple"
 * Card + Simple sidebar + Outlined inputs + 3D Silver picker + White accent
 *
 * Clean card flow with the minimal Simple sidebar (just image + host),
 * outlined inputs for an airy feel, 3D Silver icons for premium touch,
 * and white accent for a monochrome, distraction-free checkout.
 */
export default function Flow9() {
  return (
    <CheckoutFixed config={{
      layout: "card",
      sidebarVariant: "v11",
      inputStyle: "outlined",
      choiceVariant: "v6",
      accentId: "white",
    }} />
  );
}
