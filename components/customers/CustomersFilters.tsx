"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Building, Tag, Users } from "lucide-react";

interface CustomersFiltersProps {
  filters: {
    query: string;
    status: string;
    source: string;
  };
  onFilterChange: (filters: { query: string; status: string; source: string }) => void;
}

export function CustomersFilters({ filters, onFilterChange }: CustomersFiltersProps) {
  const handleQueryChange = (value: string) => {
    onFilterChange({ ...filters, query: value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? "" : value });
  };

  const handleSourceChange = (value: string) => {
    onFilterChange({ ...filters, source: value === "all" ? "" : value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filtros de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Busca por Nome/Empresa */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Buscar Cliente
            </Label>
            <Input
              id="search"
              placeholder="Nome, email ou empresa..."
              value={filters.query}
              onChange={(e) => handleQueryChange(e.target.value)}
            />
          </div>

          {/* Filtro por Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Status
            </Label>
            <Select
              value={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="INACTIVE">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtro por Origem */}
          <div className="space-y-2">
            <Label htmlFor="source" className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Origem
            </Label>
            <Select
              value={filters.source}
              onValueChange={handleSourceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as origens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as origens</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
                <SelectItem value="Indicação">Indicação</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Email Marketing">Email Marketing</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resumo dos Filtros Ativos */}
        {(filters.query || filters.status || filters.source) && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {filters.query && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                Busca: &quot;{filters.query}&quot;
              </span>
            )}
            {filters.status && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                Status: {filters.status === "ACTIVE" ? "Ativo" : "Inativo"}
              </span>
            )}
            {filters.source && (
              <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                Origem: {filters.source}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
