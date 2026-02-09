import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPipelineData } from "@/app/actions/pipeline";
import { getCustomers } from "@/app/actions/customers";
import { PipelineColumnSafe } from "@/lib/frontend-types";
import { CustomerSafe } from "@/lib/frontend-types";
import { PipelineClient } from "@/components/pipeline/PipelineClient";

export default async function PipelinePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Buscar dados no servidor (já sanitizados)
  const [columns, customers] = await Promise.all([
    getPipelineData(),
    getCustomers(),
  ]);

  return <PipelineClient initialColumns={columns} initialCustomers={customers} />;
}
