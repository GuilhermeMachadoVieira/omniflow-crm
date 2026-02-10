"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface RecentSalesProps {
  sales: Array<{
    id: string;
    title: string;
    value: number;
    createdAt: Date;
    customerName: string;
    userName: string;
  }>;
}

export function RecentSales({ sales }: RecentSalesProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (sales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vendas Recentes</CardTitle>
          <CardDescription>Nenhuma venda registrada recentemente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">🏆</div>
            <p className="text-sm">Comece a mover oportunidades para o fechado!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
        <CardDescription>Últimas oportunidades fechadas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sales.map((sale, index) => (
            <div key={sale.id} className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-xs">
                  {getInitials(sale.userName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{sale.title}</p>
                  <Badge variant="secondary" className="text-xs">
                    {formatDate(sale.createdAt)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Cliente: {sale.customerName}</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(sale.value)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
