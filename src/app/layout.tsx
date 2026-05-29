// Root Application Layout.
// Establishes the global HTML shell, loads primary fonts, and configures SEO metadata.
// Wraps all routes in core providers: Clerk (Auth), tRPC (Data Fetching), and Nuqs (URL State).
import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TRPCReactProvider } from "@/trpc/client";
import { Analytics } from "@vercel/analytics/next";

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

export const metadata: Metadata = {
  title: {
    default: "Resona",
    template: "%s | Resona",
  },
  description: "Generate studio-quality AI voices with custom cloning",
  icons: {
    icon: "/resona.svg",
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
      suppressHydrationWarning
      className={`${outfit.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground ">
        <ClerkProvider
          afterSignOutUrl="/sign-in"
          afterMultiSessionSingleSignOutUrl="/sign-in"
        >
          <TRPCReactProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
            <Toaster
              closeButton

              richColors
                duration={3000}

              position="bottom-right"
              theme="system"
            />
            <Analytics />
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
