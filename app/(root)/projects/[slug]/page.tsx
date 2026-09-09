import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectSlugRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/work/${slug}`);
}
