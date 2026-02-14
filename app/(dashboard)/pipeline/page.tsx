import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { PipelinePageClient } from "@/components/pipeline/PipelinePageClient";

export const dynamic = 'force-dynamic';

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; priority?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Extrair termo de busca e filtro de prioridade dos searchParams
  const { q: searchQuery, priority: priorityFilter } = await searchParams;

  return (
    <PipelinePageClient 
      organizationId={user.organizationId}
      initialSearchQuery={searchQuery}
      initialPriorityFilter={priorityFilter}
    />
  );
}
