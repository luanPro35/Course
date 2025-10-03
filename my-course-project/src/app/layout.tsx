"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fontClass, setFontClass] = useState(
    `${geistSans.variable} ${geistMono.variable} antialiased`
  );

  useEffect(() => {
    // No need to set the fontClass again here, as it's already initialized
  }, []);

  return (
    <html lang="en">
      <body className={fontClass} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
