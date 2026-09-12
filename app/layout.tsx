import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Listing Revival — Operations", description: "Compliant AI real estate lead and virtual-tour operations" };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
