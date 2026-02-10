import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewCard } from "@/components/dashboard/Overview";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentSales } from "@/components/dashboard/RecentSales";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import { User, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Buscar métricas do servidor
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visão geral do seu pipeline e desempenho de vendas.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
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

      {/* Cards de Métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Receita Total"
          value={metrics.totalRevenue}
          icon={<div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary">💰</span>
          </div>}
          description="Soma de todas as oportunidades fechadas"
        />
        <OverviewCard
          title="Clientes Ativos"
          value={metrics.totalCustomers}
          change={metrics.totalCustomers > 0 ? 12 : 0}
          changeType={metrics.totalCustomers > 0 ? "increase" : undefined}
          icon={<User className="h-8 w-8 text-primary" />}
          description="Total de clientes na base"
        />
        <OverviewCard
          title="Oportunidades"
          value={metrics.totalOpportunities}
          icon={<div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <span className="text-blue-600">📊</span>
          </div>}
          description="Total de oportunidades no pipeline"
        />
        <OverviewCard
          title="Vendas Recentes"
          value={metrics.recentSales.length}
          icon={<div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span className="text-green-600">🏆</span>
          </div>}
          description="Oportunidades fechadas recentemente"
        />
      </div>

      {/* Gráfico de Receita Mensal */}
      {metrics.monthlyRevenue && metrics.monthlyRevenue.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Receita Mensal</h2>
          <div className="rounded-lg border bg-card p-6">
            <RevenueChart data={metrics.monthlyRevenue} />
          </div>
        </div>
      )}

      {/* Vendas Recentes */}
      <div className="mt-8">
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
