import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNestedPageByPath } from "@/lib/actions/page.actions";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PageSectionRenderer from "@/components/shared/PageSectionRenderer";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}): Promise<Metadata> {
  const { slug, subSlug } = await params;
  const res = await getNestedPageByPath(slug, subSlug);
  if (!res.success || !res.data) return { title: "Page Not Found" };
  const page = res.data;
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.description || "",
  };
}

export default async function NestedDynamicPage({
  params,
}: {
  params: Promise<{ slug: string; subSlug: string }>;
}) {
  const { slug, subSlug } = await params;
  const res = await getNestedPageByPath(slug, subSlug);

  if (!res.success || !res.data || res.data.status !== "published") {
    notFound();
  }

  const page = res.data;
  const parent = res.parent;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Page Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {/* Breadcrumb */}
          {parent && (
            <nav className="flex items-center justify-center gap-1.5 text-white/70 text-sm mb-4">
              <Link href="/" className="hover:text-white transition">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/${parent.slug}`}
                className="hover:text-white transition"
              >
                {parent.title}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">{page.title}</span>
            </nav>
          )}
          <h1 className="text-4xl font-extrabold mb-3">{page.title}</h1>
          {page.description && (
            <p className="text-white/90 max-w-2xl mx-auto">{page.description}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
        {page.content && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-sm mb-8">
            <div
              className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-lead:text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        )}

        {/* Dynamic Page Sections (Founders, Banners, Cards, CTAs, Stats, Accordions) */}
        <PageSectionRenderer sections={page.sections} />
      </div>
    </div>
  );
}
