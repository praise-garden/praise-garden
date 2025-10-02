import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
