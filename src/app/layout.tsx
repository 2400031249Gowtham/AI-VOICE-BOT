import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/theme.css"; // pastel premium theme
import "@/styles/motion.css"; // tiny utility animations
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VoxAI CRM — Telugu AI Voice CRM for Export Businesses",
  description:
    "Enterprise-grade AI-powered CRM with human-like Telugu voice calling, smart analytics, WhatsApp workflows, and automated lead engagement for export businesses.",
  keywords: ["AI CRM", "Telugu AI", "Voice Bot", "Export Business", "Lead Management"],
};

import { ModalProvider } from "@/context/ModalContext";
import { FetchInterceptor } from "@/components/FetchInterceptor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full bg-background text-foreground">
        <ThemeProvider>
          <ModalProvider>
            <FetchInterceptor />
            {children}
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
