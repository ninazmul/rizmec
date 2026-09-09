"use client";

import Image from "next/image";
import Link from "next/link";
import { IPageSection } from "@/lib/database/models/page.model";
import {
  Mail,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  User,
} from "lucide-react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useState } from "react";

interface Props {
  sections?: IPageSection[];
}

export default function PageSectionRenderer({ sections }: Props) {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return null;
  }

  // Sort active/enabled sections by order
  const activeSections = sections
    .filter((s) => s.enabled !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (activeSections.length === 0) return null;

  return (
    <div className="space-y-16 my-12">
      {activeSections.map((section) => {
        return (
          <div key={section.id || Math.random().toString()}>
            {renderSection(section)}
          </div>
        );
      })}
    </div>
  );
}

function renderSection(section: IPageSection) {
  switch (section.type) {
    case "founders":
      return <FoundersSection section={section} />;
    case "imageBanner":
      return <ImageBannerSection section={section} />;
    case "contentCards":
      return <ContentCardsSection section={section} />;
    case "ctaBox":
      return <CtaBoxSection section={section} />;
    case "statCards":
      return <StatCardsSection section={section} />;
    case "accordion":
      return <AccordionSection section={section} />;
    case "richText":
      return <RichTextSection section={section} />;
    default:
      return null;
  }
}

/* =========================================================================
   1. FOUNDERS / TEAM CARDS SECTION
   ========================================================================= */
function FoundersSection({ section }: { section: IPageSection }) {
  const founders = section.founders || [];
  if (founders.length === 0) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 md:p-12 text-white shadow-xl border border-slate-800">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      {(section.title || section.subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-12">
          {section.subtitle && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/50 uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {section.subtitle}
            </span>
          )}
          {section.title && (
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {section.title}
            </h2>
          )}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {founders.map((founder, idx) => (
          <div
            key={idx}
            className="group relative bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/60 overflow-hidden hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition duration-300 flex flex-col"
          >
            {/* Image Container - Optimized for 3:4 & 9:16 Portrait Headshots */}
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] max-h-96 bg-slate-950 overflow-hidden">
              {founder.image ? (
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-500">
                  <User className="w-16 h-16 stroke-1" />
                </div>
              )}
              {/* Bottom Gradient Overlay (Leaves top 70% clear for face) */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent pointer-events-none" />
            </div>

            {/* Founder Content */}
            <div className="p-6 flex-1 flex flex-col justify-between relative">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-emerald-300 bg-emerald-900/40 border border-emerald-700/40 mb-2">
                  {founder.title || "Founder"}
                </span>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                  {founder.name}
                </h3>
                {founder.bio && (
                  <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-4">
                    {founder.bio}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-slate-700/50 flex items-center gap-3">
                {founder.linkedin && (
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-700/50 text-slate-300 hover:text-white hover:bg-blue-600 transition"
                    title="LinkedIn Profile"
                  >
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                )}
                {founder.twitter && (
                  <a
                    href={founder.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-700/50 text-slate-300 hover:text-white hover:bg-sky-500 transition"
                    title="Twitter / X Profile"
                  >
                    <FaXTwitter className="w-4 h-4" />
                  </a>
                )}
                {founder.email && (
                  <a
                    href={`mailto:${founder.email}`}
                    className="p-2 rounded-full bg-slate-700/50 text-slate-300 hover:text-white hover:bg-emerald-600 transition"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   2. IMAGE BANNER & GALLERY SECTION
   ========================================================================= */
function ImageBannerSection({ section }: { section: IPageSection }) {
  const images = section.images || [];
  if (images.length === 0) return null;

  const layout = section.imageLayout || "banner";

  return (
    <section className="my-8">
      {(section.title || section.subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-8">
          {section.subtitle && (
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-1">
              {section.subtitle}
            </p>
          )}
          {section.title && (
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {section.title}
            </h2>
          )}
        </div>
      )}

      {layout === "banner" && (
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-slate-900 text-white min-h-[300px] md:min-h-[400px] flex items-center">
          <Image
            src={images[0].url}
            alt={images[0].alt || section.title || "Banner Image"}
            fill
            className="object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />
          {(images[0].caption || images[0].link) && (
            <div className="relative z-10 p-8 md:p-12 max-w-xl">
              {images[0].caption && (
                <p className="text-lg md:text-xl font-medium text-white/90 mb-4 drop-shadow-sm">
                  {images[0].caption}
                </p>
              )}
              {images[0].link && (
                <Link
                  href={images[0].link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-emerald-700 transition"
                >
                  Explore <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {layout === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 aspect-video shadow-sm hover:shadow-md transition"
            >
              <Image
                src={img.url}
                alt={img.alt || `Gallery Image ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-950/75 backdrop-blur-sm p-3 text-white text-xs font-medium">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {layout === "sideBySide" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm">
          <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow">
            <Image
              src={images[0].url}
              alt={images[0].alt || section.title || "Feature Image"}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            {section.subtitle && (
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {section.subtitle}
              </span>
            )}
            {section.title && (
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                {section.title}
              </h3>
            )}
            {images[0].caption && (
              <p className="text-slate-600 leading-relaxed">
                {images[0].caption}
              </p>
            )}
            {images[0].link && (
              <Link
                href={images[0].link}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Learn More <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   3. CONTENT CARDS SECTION
   ========================================================================= */
function ContentCardsSection({ section }: { section: IPageSection }) {
  const cards = section.cards || [];
  if (cards.length === 0) return null;

  const cols = section.cardColumns || 3;
  const gridColClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="my-10">
      {(section.title || section.subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {section.subtitle && (
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
              {section.subtitle}
            </p>
          )}
          {section.title && (
            <h2 className="text-3xl font-extrabold text-slate-900">
              {section.title}
            </h2>
          )}
        </div>
      )}

      <div className={`grid grid-cols-1 ${gridColClass} gap-6`}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-primary/40 shadow-sm hover:shadow-lg transition duration-300 flex flex-col justify-between"
          >
            <div>
              {card.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-5 bg-slate-100">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              {card.subtitle && (
                <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
                  {card.subtitle}
                </span>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition">
                {card.title}
              </h3>
              {card.description && (
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {card.description}
                </p>
              )}
            </div>

            {card.linkUrl && (
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={card.linkUrl}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-emerald-700 transition"
                >
                  {card.linkText || "Learn More"}{" "}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   4. CALL TO ACTION BOX
   ========================================================================= */
function CtaBoxSection({ section }: { section: IPageSection }) {
  const cta = section.cta;
  if (!cta) return null;

  const variant = cta.variant || "primary";

  const bgClasses =
    variant === "dark"
      ? "bg-slate-900 text-white border-slate-800"
      : variant === "outline"
        ? "bg-white text-slate-900 border-slate-200 shadow-md"
        : "bg-gradient-to-r from-emerald-800 via-primary to-emerald-900 text-white border-emerald-700 shadow-xl";

  return (
    <section className={`relative rounded-3xl p-8 md:p-12 border ${bgClasses} overflow-hidden my-8`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
        <div className={cta.image ? "md:col-span-2 space-y-4" : "md:col-span-3 text-center space-y-4"}>
          {cta.title && (
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {cta.title}
            </h2>
          )}
          {cta.description && (
            <p className={variant === "outline" ? "text-slate-600 max-w-2xl" : "text-white/90 max-w-2xl text-base md:text-lg"}>
              {cta.description}
            </p>
          )}

          <div className={`flex flex-wrap gap-4 pt-2 ${cta.image ? "" : "justify-center"}`}>
            {cta.buttonText && cta.buttonUrl && (
              <Link
                href={cta.buttonUrl}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-bold hover:bg-slate-100 transition shadow-sm"
              >
                {cta.buttonText} <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {cta.secondaryButtonText && cta.secondaryButtonUrl && (
              <Link
                href={cta.secondaryButtonUrl}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition ${variant === "outline"
                    ? "border-slate-300 text-slate-700 hover:bg-slate-50"
                    : "border-white/30 text-white hover:bg-white/10"
                  }`}
              >
                {cta.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>

        {cta.image && (
          <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-lg border border-white/20">
            <Image src={cta.image} alt={cta.title || "CTA Image"} fill className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================================
   5. STAT / METRIC CARDS SECTION
   ========================================================================= */
function StatCardsSection({ section }: { section: IPageSection }) {
  const stats = section.stats || [];
  if (stats.length === 0) return null;

  return (
    <section className="my-10 bg-slate-900 rounded-3xl p-8 md:p-12 text-white border border-slate-800 shadow-xl">
      {(section.title || section.subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {section.subtitle && (
            <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-2">
              {section.subtitle}
            </p>
          )}
          {section.title && (
            <h2 className="text-3xl font-extrabold text-white">
              {section.title}
            </h2>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/70 shadow-sm flex flex-col justify-center"
          >
            <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-2">
              {stat.value}
            </div>
            <div className="text-lg font-bold text-white mb-1">
              {stat.label}
            </div>
            {stat.description && (
              <p className="text-slate-400 text-xs">
                {stat.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   6. ACCORDION / FAQ SECTION
   ========================================================================= */
function AccordionSection({ section }: { section: IPageSection }) {
  const items = section.accordion || [];
  if (items.length === 0) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="my-10 max-w-4xl mx-auto">
      {(section.title || section.subtitle) && (
        <div className="text-center mb-8">
          {section.subtitle && (
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">
              {section.subtitle}
            </p>
          )}
          {section.title && (
            <h2 className="text-3xl font-extrabold text-slate-900">
              {section.title}
            </h2>
          )}
        </div>
      )}

      <div className="space-y-4">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center hover:bg-slate-50 transition"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""
                    }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================================
   7. RICH TEXT SECTION
   ========================================================================= */
function RichTextSection({ section }: { section: IPageSection }) {
  if (!section.richText) return null;

  return (
    <section className="my-8 bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-sm">
      {(section.title || section.subtitle) && (
        <div className="mb-6">
          {section.subtitle && (
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
              {section.subtitle}
            </p>
          )}
          {section.title && (
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {section.title}
            </h2>
          )}
        </div>
      )}
      <div
        className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary hover:prose-a:underline leading-relaxed"
        dangerouslySetInnerHTML={{ __html: section.richText }}
      />
    </section>
  );
}
