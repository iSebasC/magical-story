import type { Metadata } from "next";
import { Luckiest_Guy, Quicksand } from "next/font/google";
import "./globals.css";

const luckiestGuy = Luckiest_Guy({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

const quicksand = Quicksand({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SEL Story Lessons — Building Wellbeing One Story at a Time",
  description:
    "An interactive reading platform that makes kids fall in love with stories again. Hundreds of illustrated tales, progress tracking, and rewards that spark joy.",
  keywords:
    "reading platform, educational technology, children's books, interactive stories, literacy",
  icons: {
    icon: '/images/icon.ico',
    apple: '/images/icon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${luckiestGuy.variable} ${quicksand.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
