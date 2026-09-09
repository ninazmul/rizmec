import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/actions/page.actions";
import PageSectionRenderer from "@/components/shared/PageSectionRenderer";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPageBySlug(slug);
  if (!res.success || !res.data) return { title: "Page Not Found" };
  const page = res.data;
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || "",
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getPageBySlug(slug);

  if (!res.success || !res.data || res.data.status !== "published") {
    notFound();
  }

  const page = res.data;

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      {/* Page Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-3">{page.title}</h1>
          <p className="text-white max-w-2xl mx-auto">
            {page.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-12">
        {page.content && (
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-10 shadow-sm mb-8">
            {/* Page Content */}
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
