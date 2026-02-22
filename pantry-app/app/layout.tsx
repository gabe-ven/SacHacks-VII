import type { Metadata } from "next";
import localFont from "next/font/local";
import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "The Pantry at ASUCD — Recipe Finder",
  description:
    "Turn your Pantry picks into real meals. Select the ingredients you grabbed today and discover recipes made for UC Davis students.",
};

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-rubik",
});

const zingScript = localFont({
  src: "../public/fonts/zingscriptrustr_baseg.otf",
  variable: "--font-display",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${rubik.variable} ${zingScript.variable}`}
    >
      <body className={`${rubik.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
