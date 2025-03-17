import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Cat or Dog?",
  description: "Site for figuring out what your creature is",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${outfit.className} antialiased`}>{children}</body>
    </html>
  );
}
