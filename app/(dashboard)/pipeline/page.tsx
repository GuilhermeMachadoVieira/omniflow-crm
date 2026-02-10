import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPipelineData } from "@/app/actions/pipeline";
import { getCustomers } from "@/app/actions/customers";
import { PipelineColumnSafe } from "@/lib/frontend-types";
import { CustomerSafe } from "@/lib/frontend-types";
import { PipelineClient } from "@/components/pipeline/PipelineClient";

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

  // Buscar dados no servidor (já sanitizados) com filtros
  const [columns, customers] = await Promise.all([
    getPipelineData(user.organizationId, searchQuery, priorityFilter),
    getCustomers(user.organizationId),
  ]);

  return (
    <PipelineClient 
      initialColumns={columns} 
      initialCustomers={customers} 
      searchQuery={searchQuery}
      priorityFilter={priorityFilter}
    />
  );
}
