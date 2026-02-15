"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease";
  icon: React.ReactNode;
  description: string;
  formatAs?: "currency" | "number" | "percentage";
}

export function OverviewCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  description,
  formatAs = "currency" // Default como moeda para compatibilidade
}: OverviewCardProps) {
  const formatValue = (val: string | number, format: string) => {
    if (typeof val === 'number') {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(val);
        case 'number':
          return new Intl.NumberFormat('pt-BR').format(val);
        case 'percentage':
          return new Intl.NumberFormat('pt-BR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          }).format(val / 100);
        default:
          return new Intl.NumberFormat('pt-BR').format(val);
      }
    }
    return val;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {change !== undefined && (
            <div className={`flex items-center text-xs ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span className="font-medium">
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">{formatValue(value, formatAs)}</div>
          {icon}
        </div>
        <CardDescription className="text-xs">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
