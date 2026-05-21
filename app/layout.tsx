import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Studio POC",
  description: "Interior design portfolio proof of concept",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body className="bg-[#FAFAF8] text-[#2C2C2C]">
        <Navbar />
        <main>{children}</main>
        <footer className="py-8 text-center text-sm text-[#9B9690] font-[family-name:var(--font-jost)]">
          © 2025 Studio POC
        </footer>
      </body>
    </html>
  );
}
