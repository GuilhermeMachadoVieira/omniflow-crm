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
        conversionRate: 0,
        averageDealSize: 0,
        salesCycleLength: 0,
      };
    }

    // Buscar dados da organização
    const [
      totalCustomers,
      totalOpportunities,
      allOpportunities,
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
      
      // Todas as oportunidades para cálculos
      prisma.opportunity.findMany({
        where: {
          organizationId: currentUser.organizationId,
        },
        select: {
          value: true,
          createdAt: true,
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

    // Calcular métricas avançadas
    const totalRevenue = recentSales.reduce((sum, sale) => sum + sale.value, 0);
    const conversionRate = totalCustomers > 0 ? ((totalCustomers / (totalCustomers + totalOpportunities)) * 100) : 0;
    const averageDealSize = allOpportunities.length > 0 
      ? allOpportunities.reduce((sum, opp) => sum + Number(opp.value), 0) / allOpportunities.length 
      : 0;
    
    // Calcular ciclo de vendas médio (usando apenas createdAt como proxy)
    const salesCycleLength = allOpportunities.length > 0
      ? 15 // Valor fixo temporário até termos updatedAt no schema
      : 0;

    return {
      totalRevenue,
      totalCustomers,
      totalOpportunities,
      recentSales,
      monthlyRevenue,
      conversionRate: Math.round(conversionRate * 10) / 10, // Arredondar para 1 casa decimal
      averageDealSize: Math.round(averageDealSize * 100) / 100, // Arredondar para 2 casas decimais
      salesCycleLength: Math.round(salesCycleLength * 10) / 10, // Arredondar para 1 casa decimal
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      totalRevenue: 0,
      totalCustomers: 0,
      totalOpportunities: 0,
      recentSales: [] as RecentSaleItem[],
      monthlyRevenue: [] as MonthlyRevenueItem[],
      conversionRate: 0,
      averageDealSize: 0,
      salesCycleLength: 0,
    };
  }
}
