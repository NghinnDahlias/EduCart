import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/src/components/Navbar";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduCart",
  description: "Student-to-student marketplace for smarter campus living",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
