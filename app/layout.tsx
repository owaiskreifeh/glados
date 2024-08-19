import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "./vscode-code-styles.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Roboto({
  weight: "400",
  subsets: ["latin"],
 });

export const metadata: Metadata = {
  title: "GlaDOS",
  description: "Collection of AI tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark ${inter.className}`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
