import CheckoutFixed from "@/components/checkout/CheckoutFixed";

/**
 * Flow 6: "3D White Squared"
 * Card + Clubbed sidebar + Filled inputs + 3D White icons (square) + White accent
 *
 * WHY: Square icon shape is a deliberate departure from the default circle — it
 * reads as more structured and intentional. White 3D icons on white accent create
 * a monochrome palette where the only color is the event image in the sidebar.
 * Clubbed sidebar organizes date/location/price into a compact, scannable format.
 * Filled inputs with white accent = subtle white glow on focus.
 * Best for: a clean, minimal, "Apple-esque" aesthetic.
 */
export default function Flow6() {
  return (
    <CheckoutFixed config={{
      layout: "card",
      sidebarVariant: "v9",
      inputStyle: "filled",
      choiceVariant: "v13",
      iconShape: "square",
      accentId: "white",
    }} />
  );
}
