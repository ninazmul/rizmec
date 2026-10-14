import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Contact RIZMEC — Hire Web Developers & Software Engineers | Get a Quote",
  description:
    "Get in touch with RIZMEC to discuss your web development, software engineering, or AI project. Initiate project scoping, request a quote, or hire individual developers.",
  keywords: [
    "contact RIZMEC",
    "hire web developers",
    "hire software developers",
    "hire individual developer",
    "hire AI developers",
    "web development quote",
    "software development agency contact",
  ],
  alternates: {
    canonical: "https://rizmec.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
