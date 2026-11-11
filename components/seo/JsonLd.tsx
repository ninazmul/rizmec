import React from "react";

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://rizmec.com";

/**
 * Organization + WebSite + ProfessionalService JSON-LD structured data.
 * Tells Google exactly what RIZMEC is, what it does, and how to display it
 * in Knowledge Panels, sitelinks, and rich results.
 */
export default function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${baseUrl}/#organization`,
    name: "RIZMEC",
    alternateName: [
      "RIZMEC Engineering",
      "RIZMEC Agency",
      "RIZMEC Software",
      "rizmec",
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
      "Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale. We build custom software, business platforms, and practical intelligent automation systems.",
    slogan: "From Algorithms to Engineered Intelligence.",
    foundingDate: "2024",
    email: "hello@rizmec.com",
    founder: {
      "@type": "Person",
      name: "N.I. Nazmul",
      jobTitle: "Founder & Chief Architect",
      url: `${baseUrl}/p/ninazmul`,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@rizmec.com",
        url: `${baseUrl}/contact`,
        availableLanguage: ["English"],
      },
    ],
    sameAs: [
      "https://github.com/ninazmul",
      "https://github.com/rizmec",
      "https://www.linkedin.com/company/rizmec",
    ],
    knowsAbout: [
      "Custom Software Engineering",
      "Business Web Applications",
      "ERP and CRM Systems",
      "Education Technology",
      "Workflow Automation",
      "Artificial Intelligence Integration",
      "API Development",
      "Next.js",
      "React",
      "Node.js",
      "TypeScript",
      "Python",
      "MongoDB",
      "PostgreSQL",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "RIZMEC Engineering Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Custom Software Engineering",
            description:
              "Bespoke web applications, client portals, and administrative software built for scale.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Business Platforms (ERP & CRM)",
            description:
              "Unified operations platforms, quotation engines, client management, and role-based access.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Education Technology & Portals",
            description:
              "Student admission tracking, agent management networks, and education consultancy portals.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI & Workflow Automation",
            description:
              "Document extraction, process automation, AI-powered customer support, and system integrations.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "API Development & System Integration",
            description:
              "Connecting ERPs, payment gateways, third-party APIs, and legacy databases.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Ongoing Software Maintenance",
            description:
              "Dedicated technical maintenance, security patches, backups, and iterative feature development.",
          },
        },
      ],
    },
    areaServed: {
      "@type": "GeoShape",
      name: "Worldwide",
    },
    priceRange: "$$",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "RIZMEC",
    alternateName: "RIZMEC Engineering",
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/#webpage`,
    url: baseUrl,
    name: "RIZMEC — Web Development Agency | Software & AI Engineering Company",
    description:
      "RIZMEC is a leading web development agency and software engineering company specializing in custom web apps, AI solutions, SaaS platforms, mobile apps, cloud infrastructure, and full-stack development.",
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@id": `${baseUrl}/#organization`,
    },
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "en-US",
    mainEntityOfPage: baseUrl,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
    </>
  );
}
