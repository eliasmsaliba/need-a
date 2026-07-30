import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Need-A — Home services, sorted",
  description:
    "Book verified pros for plumbing, electrical, handyman, cleaning, appliance repair, and gardening.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text font-sans text-[15px] leading-[1.55]">
        {children}
      </body>
    </html>
  );
}
