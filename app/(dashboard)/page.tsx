"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  kpiMock,
  salesEvolutionMock,
  recentActivitiesMock,
  getRelativeTime,
  type RecentActivity,
} from "@/lib/mock/dashboard";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  FileCheck,
  Calendar,
  UserPlus,
  Send,
  XCircle,
  UserPen,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function getActivityIcon(type: RecentActivity["type"]) {
  switch (type) {
    case "deal_won":
      return FileCheck;
    case "deal_lost":
      return XCircle;
    case "lead_created":
      return UserPlus;
    case "proposal_sent":
      return Send;
    case "meeting_scheduled":
      return Calendar;
    case "contact_updated":
      return UserPen;
    default:
      return FileCheck;
  }
}

function getActivityColor(type: RecentActivity["type"]) {
  switch (type) {
    case "deal_won":
      return "text-emerald-600 bg-emerald-100";
    case "deal_lost":
      return "text-red-600 bg-red-100";
    case "lead_created":
      return "text-blue-600 bg-blue-100";
    case "proposal_sent":
      return "text-amber-600 bg-amber-100";
    case "meeting_scheduled":
      return "text-violet-600 bg-violet-100";
    case "contact_updated":
      return "text-slate-600 bg-slate-100";
    default:
      return "text-muted-foreground bg-muted";
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral do seu pipeline e desempenho de vendas.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(kpiMock.totalRevenue.value)}
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {kpiMock.totalRevenue.change >= 0 ? (
                <TrendingUp className="h-3.5 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3.5 w-3 text-red-600" />
              )}
              <span
                className={
                  kpiMock.totalRevenue.change >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }
              >
                {Math.abs(kpiMock.totalRevenue.change)}%
              </span>
              {kpiMock.totalRevenue.period}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Novos Leads
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiMock.newLeads.value}</div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {kpiMock.newLeads.change >= 0 ? (
                <TrendingUp className="h-3.5 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3.5 w-3 text-red-600" />
              )}
              <span
                className={
                  kpiMock.newLeads.change >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }
              >
                {Math.abs(kpiMock.newLeads.change)}%
              </span>
              {kpiMock.newLeads.period}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Taxa de Conversão
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpiMock.conversionRate.value}%
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              {kpiMock.conversionRate.change >= 0 ? (
                <TrendingUp className="h-3.5 w-3 text-emerald-600" />
              ) : (
                <TrendingDown className="h-3.5 w-3 text-red-600" />
              )}
              <span
                className={
                  kpiMock.conversionRate.change >= 0
                    ? "text-emerald-600"
                    : "text-red-600"
                }
              >
                +{kpiMock.conversionRate.change} pp
              </span>
              {kpiMock.conversionRate.period}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de evolução */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Vendas</CardTitle>
          <CardDescription>
            Faturamento mensal (em R$ mil) nos últimos 7 meses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesEvolutionMock}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorValue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs text-muted-foreground"
                  tickFormatter={(v) => `R$ ${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value * 1000),
                    "Faturamento",
                  ]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Atividades recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Últimas ações registradas no pipeline (Audit Log).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Quando</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivitiesMock.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-md",
                          getActivityColor(activity.type)
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {activity.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.entity}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.user}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {getRelativeTime(activity)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
