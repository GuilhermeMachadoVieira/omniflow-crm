import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { CustomersPageClient } from "@/components/customers/CustomersPageClient";

export const dynamic = 'force-dynamic';

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

  return <CustomersPageClient initialSearchQuery={searchQuery} />;
}
