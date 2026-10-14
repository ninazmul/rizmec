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
      "RIZMEC is a leading web development agency and software engineering company specializing in custom web apps, AI solutions, SaaS platforms, mobile apps, cloud infrastructure, and full-stack development.",
    slogan: "Intelligence. Engineered.",
    foundingDate: "2024",
    email: "hello@rizmec.com",
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
      "https://www.linkedin.com/company/rizmec",
    ],
    knowsAbout: [
      "Web Development",
      "Software Engineering",
      "Artificial Intelligence",
      "Machine Learning",
      "SaaS Development",
      "Cloud Computing",
      "Mobile App Development",
      "Full Stack Development",
      "UI/UX Design",
      "DevOps",
      "Next.js",
      "React",
      "Node.js",
      "TypeScript",
      "Python",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "RIZMEC Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web Application Development",
            description:
              "Custom web application development using React, Next.js, and modern frameworks.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI & Machine Learning Solutions",
            description:
              "Custom AI systems, machine learning models, autonomous agents, and intelligent automation.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "SaaS Platform Development",
            description:
              "End-to-end SaaS product development from MVP to enterprise scale.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Mobile App Development",
            description:
              "Cross-platform and native mobile application development.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Cloud Infrastructure & DevOps",
            description:
              "Cloud architecture, deployment pipelines, and infrastructure automation.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "UI/UX Design",
            description:
              "User interface design, user experience research, and design systems.",
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
