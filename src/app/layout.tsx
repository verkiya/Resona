import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
    template: "%s | Resona",
  },
  description: "Generate studio-quality AI voices in seconds",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground scrollbar-premium">
        <ClerkProvider>
          <TRPCReactProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster closeButton />
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
