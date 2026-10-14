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
    default: "RIZMEC — Web Development Agency | Software & AI Engineering Company",
    template: "%s | RIZMEC",
  },
  description:
    "RIZMEC is a leading web development agency and software engineering company specializing in custom web apps, AI solutions, SaaS platforms, mobile apps, cloud infrastructure, and full-stack development. Hire expert developers for your next project.",
  keywords: [
    // Brand — primary
    "RIZMEC",
    "rizmec",
    "rizmec.com",
    "RIZMEC Engineering",
    "RIZMEC agency",
    "RIZMEC software",
    "RIZMEC web development",
    // Web development agency
    "web development agency",
    "web development company",
    "website development agency",
    "web design agency",
    "custom web development",
    "web app development company",
    "frontend development agency",
    "backend development agency",
    "full stack development agency",
    // Software development
    "software development agency",
    "software development company",
    "custom software development",
    "software engineering company",
    "software engineering agency",
    "enterprise software development",
    "bespoke software development",
    // AI / ML
    "AI agency",
    "AI development company",
    "artificial intelligence agency",
    "AI solutions company",
    "machine learning development",
    "AI automation agency",
    "AI engineering company",
    "generative AI development",
    "AI chatbot development",
    // SaaS
    "SaaS development company",
    "SaaS platform development",
    "SaaS application development",
    // Mobile
    "mobile app development agency",
    "app development company",
    "React Native development",
    "cross-platform app development",
    // Cloud / DevOps
    "cloud solutions provider",
    "cloud infrastructure company",
    "DevOps agency",
    "AWS development company",
    // Individual developer / freelance
    "hire developers",
    "hire web developers",
    "hire software engineers",
    "freelance web developer",
    "individual developer",
    "full stack developer",
    "hire full stack developer",
    // Tech stack
    "Next.js development agency",
    "React development company",
    "Node.js development agency",
    "TypeScript development",
    "MERN stack development",
    "Python development company",
    // Service types
    "startup software development",
    "MVP development agency",
    "ecommerce development company",
    "API development company",
    "UI UX design agency",
    "digital transformation agency",
    "technology consulting firm",
    // General
    "best web development agency",
    "top software development company",
    "global technology company",
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
