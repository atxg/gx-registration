import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Registration — AI + Hardware Buildathon",
  description: "Secure your spot at the AI + Hardware Buildathon in Bengaluru.",
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Override root layout's #060606 body to pure black for this route */}
      <style>{`body { background: #000 !important; }`}</style>
      {children}
    </>
  );
}
