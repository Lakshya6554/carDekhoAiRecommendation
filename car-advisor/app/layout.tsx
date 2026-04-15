import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Car Advisor — Find Your Perfect Car in 2 Minutes",
  description: "AI-powered car recommendation engine. Tell us your priorities and we'll shortlist exactly 3 cars for you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col font-sans transition-colors duration-200 bg-[#FAFAF8] dark:bg-[#0d1117] text-[#1a2234] dark:text-gray-100">
        <Header />
        {children}
      </body>
    </html>
  );
}
