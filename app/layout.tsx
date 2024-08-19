import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import "./vscode-code-styles.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Roboto({ 
  weight: "400",
 });

export const metadata: Metadata = {
  title: "JSON to YUP",
  description: "Convert JSON Schema to YUP",
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
