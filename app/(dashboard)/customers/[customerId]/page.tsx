import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CustomerSafe, sanitizeCustomer } from "@/lib/frontend-types";
import { CustomerDetailDashboard } from "@/components/customers/CustomerDetailDashboard";

interface CustomerPageProps {
  params: Promise<{
    customerId: string;
  }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  // Buscar cliente com validação de segurança
  const [customer, opportunities, activities] = await Promise.all([
    prisma.customer.findUnique({
      where: {
        id: (await params).customerId,
        organizationId: currentUser.organizationId,
      },
    }),
    prisma.opportunity.findMany({
      where: {
        organizationId: currentUser.organizationId,
        // Note: Não há relacionamento direto, então não podemos filtrar por cliente
      },
      include: {
        column: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.activity.findMany({
      where: {
        customerId: (await params).customerId,
        organizationId: currentUser.organizationId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  // Se não encontrar o cliente ou não pertencer à organização, retornar 404
  if (!customer) {
    redirect("/customers");
  }

  // Sanitizar dados para frontend
  const safeCustomer = sanitizeCustomer(customer);

  // Montar objeto completo para o componente
  const customerWithRelations = {
    ...safeCustomer,
    opportunities: opportunities.map((opp: any) => ({
      id: opp.id,
      title: opp.title,
      value: Number(opp.value),
      priority: opp.priority,
      createdAt: opp.createdAt.toISOString(),
      column: {
        title: opp.column.title,
      },
    })),
    activities: activities.map((activity: any) => ({
      id: activity.id,
      type: activity.type as "NOTE" | "CALL" | "EMAIL" | "MEETING",
      content: activity.content,
      createdAt: activity.createdAt.toISOString(),
      user: {
        nome: activity.user?.nome || "Usuário",
      },
    })),
  };

  return <CustomerDetailDashboard customer={customerWithRelations} />;
}
