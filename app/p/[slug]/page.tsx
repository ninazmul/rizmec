import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTeamMemberBySlug } from "@/lib/actions/team.actions";
import { getProjects } from "@/lib/actions/project.actions";
import { PortfolioPublicView } from "@/components/portfolio/PortfolioPublicView";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getTeamMemberBySlug(slug);

  if (!res.success || !res.data) {
    return {
      title: { absolute: "Engineer Portfolio Not Found" },
    };
  }

  const member = res.data;
  const customTitle =
    member.seo?.customTitle || `${member.name} — ${member.title} | Portfolio & Resume`;
  const description =
    member.seo?.customDescription ||
    member.tagline ||
    member.bio ||
    `Professional technical portfolio and verified engineering credentials of ${member.name}.`;

  return {
    title: {
      absolute: customTitle,
    },
    description,
    authors: [{ name: member.name }],
    openGraph: {
      title: customTitle,
      description,
      type: "profile",
      images: [
        {
          url: member.avatar || "/assets/images/placeholder.webp",
          width: 800,
          height: 800,
          alt: member.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: customTitle,
      description,
      images: [member.avatar || "/assets/images/placeholder.webp"],
    },
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const res = await getTeamMemberBySlug(slug);

  if (!res.success || !res.data || !res.data.published) {
    notFound();
  }

  const member = res.data;

  // Fetch any projects where member is credited
  const projectsRes = await getProjects({ published: true });
  const allProjects = projectsRes.success ? projectsRes.data : [];
  const assignedProjects = allProjects.filter((p: any) =>
    (p.teamMemberIds || []).some((m: any) => m.slug === slug || m._id === member._id),
  );

  return <PortfolioPublicView member={member} assignedProjects={assignedProjects} />;
}
