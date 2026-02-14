"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";

interface PipelineFiltersProps {
  filters: {
    query: string;
    priority: string;
  };
  onFilterChange: (filters: { query: string; priority: string }) => void;
}

export function PipelineFilters({ filters, onFilterChange }: PipelineFiltersProps) {
  const handleQueryChange = (value: string) => {
    onFilterChange({ ...filters, query: value });
  };

  const handlePriorityChange = (value: string) => {
    onFilterChange({ ...filters, priority: value === "all" ? "" : value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filtros do Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca por Título */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium">
              Buscar Oportunidade
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Digite o título da oportunidade..."
                value={filters.query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtro por Prioridade */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Prioridade
            </Label>
            <Select
              value={filters.priority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="HIGH">Alta</SelectItem>
                <SelectItem value="MEDIUM">Média</SelectItem>
                <SelectItem value="LOW">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resumo dos Filtros Ativos */}
        {(filters.query || filters.priority) && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filters.query && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                Busca: &quot;{filters.query}&quot;
              </span>
            )}
            {filters.priority && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                Prioridade: {filters.priority === "HIGH" ? "Alta" : filters.priority === "MEDIUM" ? "Média" : "Baixa"}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
