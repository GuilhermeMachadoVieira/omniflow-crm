"use server";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function getDashboardMetrics() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        totalRevenue: 0,
        totalCustomers: 0,
        totalOpportunities: 0,
        recentSales: [],
      };
    }

    // Buscar dados da organização
    const [
      totalCustomers,
      totalOpportunities,
      recentSales,
      monthlyRevenue
    ] = await Promise.all([
      // Total de clientes ativos
      prisma.customer.count({
        where: {
          organizationId: currentUser.organizationId,
          status: "ACTIVE",
        },
      }),
      
      // Total de oportunidades
      prisma.opportunity.count({
        where: {
          organizationId: currentUser.organizationId,
        },
      }),
      
      // Últimas vendas (oportunidades na última coluna)
      prisma.pipelineColumn.findMany({
        where: {
          organizationId: currentUser.organizationId,
        },
        include: {
          opportunities: {
            where: {
              organizationId: currentUser.organizationId,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
        },
        orderBy: {
          sortOrder: "desc",
        },
      }).then((columns: any) => {
        // Encontrar a última coluna (maior sortOrder)
        const lastColumn = columns[0];
        if (!lastColumn) return [];
        
        // Retornar oportunidades da última coluna como "vendas"
        return lastColumn.opportunities.map((opp: any) => ({
          id: opp.id,
          title: opp.title,
          value: Number(opp.value),
          createdAt: opp.createdAt,
          customerName: "Cliente não identificado", // TODO: Adicionar relacionamento
          userName: "Vendedor não identificado", // TODO: Adicionar relacionamento
        }));
      }),
      
      // Receita mensal dos últimos 6 meses
      prisma.opportunity.groupBy({
        by: ['createdAt'],
        where: {
          organizationId: currentUser.organizationId,
          createdAt: {
            gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 1000), // 6 meses atrás
          },
        },
        _sum: {
          value: true,
        },
      }).then((groups: any) => {
        // Agrupar por mês e calcular totais
        const monthlyData = groups.map((group: any) => ({
          month: new Date(group.createdAt).toLocaleDateString('pt-BR', { month: 'short' }),
          revenue: Number(group._sum.value || 0),
        }));
        
        return monthlyData;
      }),
    ]);

    // Calcular receita total (soma de oportunidades na última coluna)
    const totalRevenue = recentSales.reduce((sum: any, sale: any) => sum + sale.value, 0);

    return {
      totalRevenue,
      totalCustomers,
      totalOpportunities,
      recentSales,
      monthlyRevenue,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      totalRevenue: 0,
      totalCustomers: 0,
      totalOpportunities: 0,
      recentSales: [],
      monthlyRevenue: [],
    };
  }
}
