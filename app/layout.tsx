import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WebVitals } from "@/components/WebVitals";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "OmniFlow CRM",
  description: "Plataforma SaaS B2B Enterprise para gestão de relacionamento e vendas complexas",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.classList.add(theme);
                  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <WebVitals />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
