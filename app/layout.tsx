import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodBridge",
  description: "Redistribute surplus cafeteria food to charities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}