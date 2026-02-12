"use server";

import { prisma } from "@/lib/database";
import { getCurrentUser } from "@/lib/nextauth-client";

type RecentSaleItem = {
  id: string;
  title: string;
  value: number;
  createdAt: Date;
  customerName: string;
  userName: string;
};

type MonthlyRevenueItem = {
  month: string;
  revenue: number;
};

export async function getDashboardMetrics() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        totalRevenue: 0,
        totalCustomers: 0,
        totalOpportunities: 0,
        recentSales: [] as RecentSaleItem[],
        monthlyRevenue: [] as MonthlyRevenueItem[],
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
      }).then((columns): RecentSaleItem[] => {
        // Encontrar a última coluna (maior sortOrder)
        const lastColumn = columns[0];
        if (!lastColumn) return [];
        
        // Retornar oportunidades da última coluna como "vendas"
        return lastColumn.opportunities.map((opp): RecentSaleItem => ({
          id: opp.id,
          title: opp.title,
          value: Number(opp.value),
          createdAt: opp.createdAt,
          customerName: 'N/A', // Não temos customer no OpportunitySafe
          userName: 'N/A', // Não temos user no OpportunitySafe
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
      }).then((groups): MonthlyRevenueItem[] => {
        return groups.map((group): MonthlyRevenueItem => ({
          month: new Date(group.createdAt).toLocaleDateString("pt-BR", { month: "short" }),
          revenue: Number(group._sum.value || 0),
        }));
      }),
    ]);

    // Calcular receita total (soma de oportunidades na última coluna)
    const totalRevenue = recentSales.reduce((sum, sale) => sum + sale.value, 0);

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
      recentSales: [] as RecentSaleItem[],
      monthlyRevenue: [] as MonthlyRevenueItem[],
    };
  }
}
