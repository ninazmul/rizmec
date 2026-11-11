import React from "react";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://rizmec.com";

/**
 * Organization + WebSite + ProfessionalService JSON-LD structured data.
 * Accurate, truthful structured data without fabricated certifications, fake reviews, or unverified ratings.
 */
export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${baseUrl}/#organization`,
    name: "Rizmec",
    alternateName: [
      "Rizmec Software",
      "Rizmec Engineering",
      "RIZMEC",
      "rizmec.com",
    ],
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/assets/images/rizmec-icon.png`,
      width: 512,
      height: 512,
    },
    image: `${baseUrl}/assets/images/rizmec-icon.png`,
    description:
      "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale. Specializing in custom software development, AI and intelligent automation, and education technology platforms.",
    slogan: "From algorithms to engineered intelligence.",
    email: "hello@rizmec.com",
    founder: {
      "@type": "Person",
      name: "N.I. Nazmul",
      jobTitle: "Founder & Chief Architect",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer inquiries",
        email: "hello@rizmec.com",
        url: `${baseUrl}/contact`,
        availableLanguage: ["English", "Bengali"],
      },
    ],
    sameAs: [
      "https://github.com/ninazmul",
      "https://www.linkedin.com/company/rizmec",
      "https://x.com/rizmec_tech",
    ],
    knowsAbout: [
      "Custom Software Engineering",
      "AI & Intelligent Automation",
      "Education Technology Platforms",
      "Student Management Systems",
      "Partner & Agent Portals",
      "Business ERP & CRM Development",
      "Workflow Automation",
      "Full Stack Web Development",
      "Next.js",
      "TypeScript",
      "Cloud Infrastructure",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Rizmec Engineering Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Software Engineering",
            description:
              "Bespoke web applications, SaaS platforms, client portals, and custom ERP/CRM business systems.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI & Intelligent Automation",
            description:
              "Applied AI integration, document processing, workflow automation, and intelligent data systems.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Education Technology Solutions",
            description:
              "Education partner portals, agent management systems, student admission tracking, and education business platforms.",
          },
        },
      ],
    },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "United Arab Emirates" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Worldwide" },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Rizmec",
    alternateName: "Rizmec Software Engineering & Intelligent Automation",
    url: baseUrl,
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://www.google.com/search?q=site:rizmec.com+{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
