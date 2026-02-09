import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCustomers } from "@/app/actions/customers";
import { CustomerSafe } from "@/lib/frontend-types";
import { CustomersClient } from "@/components/customers/CustomersClient";

export default async function CustomersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Buscar dados no servidor (já sanitizados)
  const customers = await getCustomers();

  return <CustomersClient initialCustomers={customers} />;
}
