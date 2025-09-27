import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Praise Garden",
  description: "Grow your praise garden",
  icons: {
    icon: [
      { url: "/Praise_logo.png", type: "image/png", sizes: "32x32" },
      { url: "/Praise_logo.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/Praise_logo.png",
    apple: "/Praise_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <Image src="/Praise_logo.png" alt="Praise Garden" width={28} height={28} className="rounded-full object-cover" />
              <span className="font-semibold tracking-tight">Praise Garden</span>
            </a>
            <nav className="flex items-center gap-3">
              <a
                href="/login"
                className="h-9 px-4 rounded-md text-sm font-medium transition-colors border border-white/10 hover:border-white/20"
                aria-label="Login"
              >
                Login
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
