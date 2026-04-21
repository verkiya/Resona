import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/client";
/* =========================
   Fonts
========================= */
const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/* =========================
   Metadata
========================= */
export const metadata: Metadata = {
  title: {
    default: "Resona",
    template: "Resona | %s",
  },
  description: "AI Voice Generation SaaS Platform",
  icons: {
    icon: "/resona.svg",
  },
};

/* =========================
   Root Layout
========================= */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html
          lang="en"
          className={`${outfit.variable} ${mono.variable} h-full antialiased`}
        >
          <body className="min-h-full flex flex-col bg-background text-foreground">
            {children}
            <Toaster />
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
