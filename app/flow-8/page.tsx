import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 8: "Bold Summary"
 * Card + Summary sidebar + Filled inputs + Contained picker + Brand blue
 *
 * WHY: The Summary sidebar (v1) is the most information-dense — image, host,
 * event details, price, timer all visible. Paired with the Card layout, it gives
 * the user full context while they fill the form. Contained picker with filled
 * inputs and brand blue creates a cohesive "contained" design language — every
 * element has a clear boundary. This is the most "complete information" combination.
 * Best for: users who want to see everything before committing.
 */
export default function Flow8() {
  return (
    <CheckoutFixed config={{
      layout: "card",
      sidebarVariant: "v1",
      inputStyle: "filled",
      choiceVariant: "v2",
      accentId: "brand",
    }} />
  );
}
