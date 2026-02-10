import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCustomers } from "@/app/actions/customers";
import { CustomerSafe } from "@/lib/frontend-types";
import { CustomersClient } from "@/components/customers/CustomersClient";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Extrair termo de busca dos searchParams
  const { q: searchQuery } = await searchParams;

  // Buscar dados no servidor (já sanitizados) com filtro de busca
  const customers = await getCustomers(user.organizationId, searchQuery);

  return <CustomersClient initialCustomers={customers} searchQuery={searchQuery} />;
}
