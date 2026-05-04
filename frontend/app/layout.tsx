import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoverMe – AI Excuse Generator | Your AI Cover Story Assistant",
  description:
    "Generate realistic, natural-sounding excuses instantly with CoverMe AI. Choose your tone, lie strength, and get 3 tailored excuses with a pro delivery tip.",
  keywords: "excuse generator, AI excuses, cover story, CoverMe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
