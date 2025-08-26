import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🏈 College Football Betting Intelligence",
  description: "Sharp betting analysis and line movement tracking for college football",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
