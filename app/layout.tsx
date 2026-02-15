import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WebVitals } from "@/components/WebVitals";
import { ThemeScript } from "@/components/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  title: "OmniFlow CRM",
  description: "Plataforma SaaS B2B Enterprise para gestão de relacionamento e vendas complexas",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OmniFlow CRM",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "OmniFlow CRM",
    title: "OmniFlow CRM",
    description: "Plataforma SaaS B2B Enterprise para gestão de relacionamento e vendas complexas",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniFlow CRM",
    description: "Plataforma SaaS B2B Enterprise para gestão de relacionamento e vendas complexas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeScript />
        <WebVitals />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
