<div align="center">
  <img src="public/assets/images/rizmec-icon.png" alt="Rizmec Logo" width="80" />
  <h1>Rizmec — From Algorithms to Engineered Intelligence</h1>
  <p><strong>Software Engineering & Intelligent Automation</strong></p>
  <p>
    Custom business software · AI & workflow automation · Education technology platforms
  </p>

  <br />

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
  ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## Table of Contents

- [Overview](#overview)
- [Brand](#brand)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [SEO & Structured Data](#seo--structured-data)
- [Security & RBAC](#security--rbac)
- [Scripts](#scripts)
- [License & Authors](#license--authors)

---

## Overview

**Rizmec** is a founder-led software engineering company based in Dhaka, Bangladesh, serving international businesses across the UK, Australia, UAE, and other global markets.

This repository powers the complete Rizmec digital platform — the public-facing corporate website, industry-specific landing pages, product pages, client portals (invoices & quotations), and a comprehensive admin dashboard with CMS, CRM, and RBAC capabilities.

Built with Next.js 16 (App Router), React 19, TypeScript 6, and MongoDB.

### Core Positioning

> Rizmec engineers digital infrastructure that helps businesses operate, automate, and scale.

### Service Categories

| Category | Description |
| :--- | :--- |
| **Custom Software Engineering** | Web applications, business management systems, CRM/ERP, SaaS, APIs, dashboards |
| **AI & Intelligent Automation** | AI integration, workflow automation, document processing, intelligent data systems |
| **Education Technology** | School management, LMS, student portals, agent management, admission workflows |

---

## Brand

| | |
| :--- | :--- |
| **Name** | Rizmec (RIZ-mek) |
| **Concept** | Inspired by al-Khwarizmi and algorithms |
| **Philosophy** | From algorithms to engineered intelligence |
| **Founder** | N.I. Nazmul — Founder & Chief Architect |
| **Origin** | Dhaka, Bangladesh |
| **Markets** | UK, Australia, UAE, US, and global |
| **Website** | [rizmec.com](https://www.rizmec.com/) |
| **Contact** | [hello@rizmec.com](mailto:hello@rizmec.com) |

---

## Features

### 🌐 Public Website

- **Homepage** — Hero with clear value proposition, trust indicators, 3 core service categories, featured case studies, engineering process, differentiators, testimonials, and conversion CTAs
- **Services** — Three commercial categories (Custom Software, AI & Automation, Education Technology) with individual detail pages
- **Industries** — Industry-specific landing pages, including a flagship Education Technology page targeting recruitment agencies
- **Products** — Product catalog featuring Rizmec PartnerOS (modular solution architecture for education businesses)
- **Case Studies** — Verified project portfolio with business problem, solution, and technologies
- **About** — Company origin, brand philosophy, 4-stage business evolution, engineering principles, founder-led leadership
- **Team** — Founder and team profiles
- **Contact** — Public inquiry form with 9 commercial qualification fields (no sign-in required), anti-spam honeypot, and Nodemailer SMTP integration
- **Legal Pages** — Privacy policy, terms of service, and security policy

### 🔗 Client Portals

- **Invoice Portal** — Tokenized public invoice view with PDF export (jsPDF + html2canvas)
- **Quotation Portal** — Tokenized public quote view with acceptance workflow

### ⚙️ Admin Dashboard

- **Content Management (CMS)** — Dynamic page builder, TipTap rich text editor, custom slug routing
- **Project Management** — Create, edit, and publish engineering case studies
- **Services & Products** — Full CRUD with image uploads via UploadThing
- **Team Management** — Add and manage team member profiles
- **Client & Lead CRM** — Track clients, leads, and business pipeline
- **Invoicing & Quotations** — Generate, send, and track invoices and quotes
- **Contact Messages** — View and manage contact form submissions and leads
- **Email Campaigns** — Mailing system with template management
- **Media Library** — Centralized asset management powered by UploadThing
- **User & Role Management** — Granular RBAC permission matrix
- **Testimonials** — Manage client testimonials
- **Audit Logs** — Activity tracking for admin actions
- **System Settings** — Company settings, maintenance mode toggle

### 📈 SEO & Marketing

- **Structured Data** — JSON-LD schemas (Organization, WebSite, ProfessionalService) with founder and service catalog
- **Dynamic Sitemap** — Auto-generated XML sitemap covering all static and dynamic routes
- **Open Graph & Twitter Cards** — Full social sharing metadata
- **Industry Landing Pages** — Conversion-optimized pages for targeted verticals

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [TypeScript 6](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [Clerk](https://clerk.com/) (`@clerk/nextjs`) |
| **Rich Text Editor** | [TipTap](https://tiptap.dev/) (blockquotes, code blocks, images, links, highlights) |
| **File Uploads** | [UploadThing](https://uploadthing.com/) |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) |
| **Email** | [Nodemailer](https://nodemailer.com/) |
| **Validation** | [Zod](https://zod.dev/) + [React Hook Form](https://react-hook-form.com/) |

---

## Project Structure

```
rizmec/
├── app/
│   ├── (root)/                    # Public pages
│   │   ├── page.tsx               # Homepage
│   │   ├── services/              # Service categories & detail pages
│   │   ├── industries/            # Industry landing pages
│   │   │   └── education-technology/  # Flagship EdTech landing page
│   │   ├── products/              # Product catalog
│   │   │   └── partneros/         # Rizmec PartnerOS product page
│   │   ├── work/                  # Case studies & project portfolio
│   │   ├── about/                 # Company story & philosophy
│   │   ├── team/                  # Team profiles
│   │   ├── contact/               # Public inquiry form
│   │   ├── privacy/               # Privacy policy
│   │   ├── terms/                 # Terms of service
│   │   ├── security/              # Security policy
│   │   └── ads/                   # Advertising & campaign landing pages
│   ├── api/                       # API routes (contact, uploadthing, email, seed)
│   ├── dashboard/                 # Admin dashboard
│   │   ├── clients/               # Client management
│   │   ├── contact-messages/      # Contact form submissions
│   │   ├── invoices/              # Invoice management
│   │   ├── leads/                 # Lead tracking
│   │   ├── mailing/               # Email campaigns
│   │   ├── media/                 # Media library
│   │   ├── pages/                 # CMS page builder
│   │   ├── products/              # Product management
│   │   ├── projects/              # Project/case study management
│   │   ├── quotations/            # Quote management
│   │   ├── services/              # Service management
│   │   ├── settings/              # System settings
│   │   ├── team/                  # Team member management
│   │   ├── testimonials/          # Testimonial management
│   │   └── users/                 # User & RBAC management
│   ├── robots.ts                  # Dynamic robots.txt generation
│   ├── sitemap.ts                 # Dynamic XML sitemap generation
│   ├── favicon.ico                # Site favicon
│   ├── globals.css                # Global styles
│   └── layout.tsx                 # Root layout with SEO metadata
├── components/
│   ├── dashboard/                 # Dashboard-specific components
│   ├── invoice/                   # Public invoice view
│   ├── quote/                     # Public quote view
│   ├── seo/                       # JSON-LD structured data components
│   ├── shared/                    # Shared components (Header, Footer, Logo)
│   └── ui/                        # Radix UI primitives & design system
├── constants/                     # Navigation, permissions, brand constants
├── hooks/                         # Custom React hooks
├── lib/
│   ├── actions/                   # Server actions (CRUD, RBAC, email, contact)
│   ├── auth/                      # RBAC rules & middleware
│   ├── database/                  # Mongoose connection & models
│   └── utils.ts                   # Utility helpers
├── public/
│   └── assets/images/             # Brand assets (logos, icons, favicon)
├── scripts/                       # Database seed scripts
├── types/                         # TypeScript type definitions
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS theme
└── package.json                   # Dependencies & scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### Installation

```bash
git clone https://github.com/ninazmul/rizmec.git
cd rizmec
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Populate `.env.local` with your credentials (see [Environment Variables](#environment-variables)).

### Run Development Server

```bash
npm run dev
```

- **Public site**: [http://localhost:3000](http://localhost:3000)
- **Admin dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### Seed Database

```bash
npx tsx scripts/seed-rizmec.ts
npx tsx scripts/seed_admins.ts
```

---

## Environment Variables

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend public key |
| `CLERK_SECRET_KEY` | Clerk backend secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in route (`/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up route (`/sign-up`) |
| `MONGODB_URI` | MongoDB connection string |
| `UPLOADTHING_TOKEN` | UploadThing API token |
| `SUPER_ADMIN_EMAILS` | Comma-separated Super Admin emails |
| `NEXT_PUBLIC_APP_URL` | Production & Server App URL (e.g., `https://rizmec.com`) |
| `CONTACT_RECEIVER` | Email for contact form submissions (`hello@rizmec.com`) |
| `SMTP_USER` / `SMTP_PASS` | SMTP authentication credentials |
| `SMTP_HOST` / `SMTP_PORT` | SMTP server config (`smtp.gmail.com`, `465`) |
| `MAINTENANCE_MODE` | `true` / `false` — toggles maintenance page |

---

## SEO & Structured Data

Rizmec implements comprehensive SEO and structured data:

| Feature | Implementation |
| :--- | :--- |
| **JSON-LD** | `components/seo/JsonLd.tsx` — Organization, WebSite, and ProfessionalService schemas with founder, origin, and service catalog |
| **Robots.txt** | `app/robots.ts` — Dynamic generation, blocks `/dashboard/`, `/api/`, `/sign-in/`, `/sign-up/`, `/invoice/`, `/quote/`, `/maintenance/`, `/onboarding/` |
| **XML Sitemap** | `app/sitemap.ts` — Auto-generates from all static pages + dynamic projects, services, products, industries, team members, and CMS pages |
| **Meta Tags** | `app/layout.tsx` — Title template, description, keywords, Open Graph, Twitter Cards |
| **Open Graph** | Site-wide OG tags with images for social sharing |
| **Twitter Cards** | `summary_large_image` cards for Twitter/X |
| **Canonical URLs** | `metadataBase` configured for proper canonical resolution |

---

## Security & RBAC

Rizmec implements a multi-layer security architecture:

- **Authentication** — Clerk middleware protects `/dashboard` and API routes
- **Role-Based Access Control** — Roles: `super_admin`, `admin`, `moderator`, `worker`
- **Granular Permissions** — Per-module permission matrix (`constants/permissions.ts`)
- **Super Admin Protection** — Protected emails cannot be suspended, deleted, or have permissions modified
- **Input Validation** — Zod schemas + sanitized rich text rendering (XSS prevention)
- **Route Protection** — Middleware-level auth checks on all sensitive routes
- **Public Contact Form** — Anti-spam honeypot field; no authentication required for inquiries

---

## Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start dev server (Webpack) |
| `npm run build` | Production build (Webpack) |
| `npm run start` | Start production server |
| `npm run lint` | ESLint checks |
| `npx tsx scripts/seed-rizmec.ts` | Seed database with initial data |
| `npx tsx scripts/seed_admins.ts` | Seed super admin users |

---

## License & Authors

- **Founder**: [N.I. Nazmul](https://github.com/ninazmul) — Founder & Chief Architect
- **Organization**: [Rizmec](https://rizmec.com) — Software Engineering & Intelligent Automation
- **Contact**: [hello@rizmec.com](mailto:hello@rizmec.com)
- **Origin**: Dhaka, Bangladesh
- **License**: MIT

---

<div align="center">
  <sub>Built with precision by <strong>Rizmec Engineering</strong> · Dhaka, Bangladesh</sub>
</div>
