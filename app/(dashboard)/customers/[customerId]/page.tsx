import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { CustomerSafe, sanitizeCustomer } from "@/lib/frontend-types";
import { CustomerDetailDashboard } from "@/components/customers/CustomerDetailDashboard";

export const dynamic = 'force-dynamic';

interface CustomerPageProps {
  params: Promise<{
    customerId: string;
  }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  // Verificar se DATABASE_URL está disponível (evita erro durante build)
  if (!process.env.DATABASE_URL) {
    redirect("/customers");
  }

  // Import dinâmico do prisma apenas quando DATABASE_URL está disponível
  try {
    const { prisma } = await import("@/lib/database");

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
  } catch (error) {
    console.error("Error loading customer:", error);
    redirect("/customers");
  }
}
