import { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster";
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
    default: "RIZMEC — Intelligence. Engineered.",
    template: "%s | RIZMEC",
  },
  description:
    "RIZMEC is a global technology engineering company delivering high-performance software systems, AI architectures, distributed platforms, and mission-critical cloud solutions.",
  keywords: [
    "RIZMEC",
    "Intelligence Engineered",
    "Software Engineering",
    "AI Systems",
    "Enterprise Software",
    "SaaS Architecture",
    "Cloud Infrastructure",
    "Automation",
    "Machine Learning",
    "DevOps",
    "Full Stack Development",
  ],
  authors: [{ name: "RIZMEC Engineering" }],
  creator: "RIZMEC",
  publisher: "RIZMEC",
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
    title: "RIZMEC — Intelligence. Engineered.",
    description:
      "Global technology engineering company delivering high-performance software systems, AI architectures, and mission-critical cloud solutions.",
    images: [
      {
        url: "/assets/images/rizmec-icon.png",
        width: 512,
        height: 512,
        alt: "RIZMEC Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RIZMEC — Intelligence. Engineered.",
    description:
      "Global technology engineering company delivering high-performance software systems, AI architectures, and mission-critical cloud solutions.",
    images: ["/assets/images/rizmec-icon.png"],
  },
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
