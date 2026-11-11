import { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
import JsonLd from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://rizmec.com",
  ),
  title: {
    default: "Rizmec — Software Engineering & Intelligent Automation",
    template: "%s | Rizmec",
  },
  description:
    "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale. From custom web platforms to AI workflow automation and specialized education technology solutions.",
  keywords: [
    // Brand — primary
    "Rizmec",
    "rizmec",
    "rizmec.com",
    "Rizmec Engineering",
    "Rizmec Software",
    "Rizmec Intelligent Automation",
    // Software engineering & automation
    "custom software development",
    "software engineering company",
    "intelligent automation",
    "AI workflow automation",
    "business management systems",
    "custom ERP development",
    "custom CRM development",
    "education technology solutions",
    "education partner portal",
    "student management platform",
    "SaaS development company",
    "full stack development",
    "Next.js development company",
    // Cloud / Systems
    "cloud solutions provider",
    "cloud infrastructure company",
    "API development company",
    "React development company",
    "Node.js development agency",
    "TypeScript development",
    "Python development company",
    "startup software development",
    "digital transformation agency",
    "technology consulting firm",
    "mission critical software",
    "high performance web applications",
  ],
  authors: [{ name: "RIZMEC Engineering" }],
  creator: "RIZMEC",
  publisher: "RIZMEC",
  alternates: {
    canonical: "https://rizmec.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/assets/images/rizmec-icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: "/assets/images/rizmec-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "RIZMEC",
    title: "RIZMEC — Web Development Agency | Software & AI Engineering Company",
    description:
      "RIZMEC is a leading web development agency and software engineering company. We build custom web apps, AI solutions, SaaS platforms, and cloud-native systems. Hire expert developers today.",
    url: "https://rizmec.com",
    images: [
      {
        url: "/assets/images/rizmec-icon.png",
        width: 512,
        height: 512,
        alt: "RIZMEC — Web Development Agency & Software Engineering Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RIZMEC — Web Development Agency | Software & AI Engineering Company",
    description:
      "RIZMEC is a leading web development agency and software engineering company. Custom web apps, AI solutions, SaaS platforms, and cloud-native systems.",
    images: ["/assets/images/rizmec-icon.png"],
    creator: "@rizmec",
    site: "@rizmec",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" />
        <JsonLd />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-foreground min-h-screen selection:bg-white selection:text-black antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ClerkProvider>
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
