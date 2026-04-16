import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 10: "Checkout Typeform"
 * Immersive + Simple sidebar + Outlined inputs + 3D Silver picker + White accent
 *
 * One question at a time with the minimal Simple sidebar, outlined inputs,
 * 3D Silver icons, and white accent. Same settings as Flow 9 but in the
 * immersive Typeform-style layout for a focused, distraction-free experience.
 */
export default function Flow10() {
  return (
    <CheckoutFixed config={{
      layout: "immersive",
      sidebarVariant: "v11",
      inputStyle: "outlined",
      choiceVariant: "v6",
      accentId: "white",
    }} />
  );
}
