"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewCard } from "@/components/dashboard/Overview";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { DateFilters } from "@/components/dashboard/DateFilters";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import { User, Plus, TrendingUp, DollarSign, BarChart3, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DashboardMetrics {
  totalRevenue: number;
  totalCustomers: number;
  totalOpportunities: number;
  recentSales: any[];
  monthlyRevenue?: any[];
  conversionRate?: number;
  averageDealSize?: number;
  salesCycleLength?: number;
}

export function DashboardClient() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [datePreset, setDatePreset] = useState<string>("thisMonth");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>();

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const handleRefresh = async () => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Failed to load dashboard metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    await loadMetrics();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-lg">
        <div className="space-y-sm">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Visão geral do seu pipeline e desempenho de vendas.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-sm">
          <Link href="/customers">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
          <Link href="/pipeline">
            <Button>
              <TrendingUp className="mr-2 h-4 w-4" />
              Nova Oportunidade
            </Button>
          </Link>
        </div>
      </div>

      {/* Date Filters */}
      <DateFilters 
        onDateRangeChange={setDateRange}
        onPresetChange={setDatePreset}
        currentPreset={datePreset}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Cards de Métricas */}
      <div className="grid gap-xl md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Receita Total"
          value={metrics.totalRevenue}
          icon={<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>}
          description="Soma de todas as oportunidades fechadas"
        />
        <OverviewCard
          title="Clientes Ativos"
          value={metrics.totalCustomers}
          formatAs="number"
          change={metrics.totalCustomers > 0 ? 12 : 0}
          changeType={metrics.totalCustomers > 0 ? "increase" : undefined}
          icon={<User className="h-8 w-8 text-primary" />}
          description="Total de clientes na base"
          drillDownHref="/customers"
        />
        <OverviewCard
          title="Taxa de Conversão"
          value={metrics.conversionRate || 0}
          formatAs="percentage"
          change={metrics.conversionRate && metrics.conversionRate > 20 ? 5 : -3}
          changeType={metrics.conversionRate && metrics.conversionRate > 20 ? "increase" : "decrease"}
          icon={<div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>}
          description="Leads convertidos em clientes"
        />
        <OverviewCard
          title="Ticket Médio"
          value={metrics.averageDealSize || 0}
          formatAs="currency"
          change={metrics.averageDealSize && metrics.averageDealSize > 5000 ? 8 : 0}
          changeType={metrics.averageDealSize && metrics.averageDealSize > 5000 ? "increase" : undefined}
          icon={<div className="h-8 w-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>}
          description="Valor médio por negócio"
          drillDownHref="/pipeline"
        />
      </div>

      {/* Segunda linha de métricas */}
      <div className="grid gap-xl md:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Oportunidades"
          value={metrics.totalOpportunities}
          formatAs="number"
          icon={<div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>}
          description="Total de oportunidades no pipeline"
        />
        <OverviewCard
          title="Ciclo de Vendas"
          value={metrics.salesCycleLength || 0}
          formatAs="number"
          change={metrics.salesCycleLength && metrics.salesCycleLength < 30 ? -5 : 0}
          changeType={metrics.salesCycleLength && metrics.salesCycleLength < 30 ? "increase" : "decrease"}
          icon={<div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>}
          description="Dias médios para fechamento"
        />
        <OverviewCard
          title="Vendas Recentes"
          value={metrics.recentSales.length}
          formatAs="number"
          icon={<div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-green-600" />
          </div>}
          description="Oportunidades fechadas recentemente"
        />
      </div>

      {/* Gráfico de Receita Mensal */}
      {metrics.monthlyRevenue && metrics.monthlyRevenue.length > 0 && (
        <div className="space-y-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Receita Mensal</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Comparativo vs mês anterior</span>
              <span className="font-medium text-green-600">+{metrics.monthlyRevenue.length > 1 ? ((metrics.monthlyRevenue[metrics.monthlyRevenue.length - 1].revenue - metrics.monthlyRevenue[0].revenue) / metrics.monthlyRevenue[0].revenue * 100).toFixed(1) : '0'}%</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-xl">
            <RevenueChart data={metrics.monthlyRevenue} />
          </div>
        </div>
      )}

      {/* Vendas Recentes */}
      <div className="space-y-lg">
        <RecentSales sales={metrics.recentSales} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao OmniFlow CRM!</CardTitle>
          <CardDescription>
            Sua organização foi configurada com sucesso. Comece adicionando oportunidades ao seu pipeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Dashboard funcional com dados reais em desenvolvimento...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
