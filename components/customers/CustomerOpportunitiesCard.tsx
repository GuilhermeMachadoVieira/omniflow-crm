"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CustomerOpportunitiesCardProps {
  opportunities: Array<{
    id: string;
    title: string;
    value: number;
    priority: string;
    createdAt: string;
    column: {
      title: string;
    };
  }>;
}

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border border-destructive/20",
  MEDIUM: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  LOW: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
};

const PRIORITY_LABELS: Record<string, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CustomerOpportunitiesCard({ opportunities }: CustomerOpportunitiesCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Negócios</CardTitle>
          <CardDescription>Oportunidades vinculadas a este cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">💼</div>
            <p className="text-sm">Nenhuma oportunidade registrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Negócios</CardTitle>
        <CardDescription>{opportunities.length} oportunidades encontradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{opportunity.title}</h4>
                  <Badge
                    className={PRIORITY_STYLES[opportunity.priority] || PRIORITY_STYLES.MEDIUM}
                  >
                    {PRIORITY_LABELS[opportunity.priority] || "Média"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{formatDate(opportunity.createdAt)}</span>
                  <span>{opportunity.column.title}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">
                  {formatCurrency(opportunity.value)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
