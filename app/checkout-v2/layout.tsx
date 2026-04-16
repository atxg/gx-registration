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
      <style>{`body { background: #000 !important; }`}</style>
      {children}
    </>
  );
}
