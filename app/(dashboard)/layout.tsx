import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import clsx from "clsx";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "AI4EDU - Dashboard",
  description: "AI4EDU - Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx("font-sans antialiased", fontSans.className)}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
