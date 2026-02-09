"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => `R$ ${value / 1000}k`}
        />
        <Tooltip 
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Bar 
          dataKey="revenue" 
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 4]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
