"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCw } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateFiltersProps {
  onDateRangeChange?: (range: DateRange | undefined) => void;
  onPresetChange?: (preset: string) => void;
  currentPreset?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function DateFilters({ 
  onDateRangeChange, 
  onPresetChange, 
  currentPreset,
  onRefresh,
  isLoading = false
}: DateFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handlePresetClick = (preset: string) => {
    const today = new Date();
    let range: DateRange | undefined;

    switch (preset) {
      case "thisMonth":
        range = {
          from: new Date(today.getFullYear(), today.getMonth(), 1),
          to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
        };
        break;
      case "lastMonth":
        range = {
          from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          to: new Date(today.getFullYear(), today.getMonth(), 0),
        };
        break;
      case "thisYear":
        range = {
          from: new Date(today.getFullYear(), 0, 1),
          to: new Date(today.getFullYear(), 11, 31),
        };
        break;
      case "lastYear":
        range = {
          from: new Date(today.getFullYear() - 1, 0, 1),
          to: new Date(today.getFullYear() - 1, 11, 31),
        };
        break;
      default:
        range = undefined;
    }

    setDateRange(range);
    onDateRangeChange?.(range);
    onPresetChange?.(preset);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    onDateRangeChange?.(range);
    onPresetChange?.("custom");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Período:</span>
        
        <Button
          variant={currentPreset === "thisMonth" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetClick("thisMonth")}
        >
          Este Mês
        </Button>
        
        <Button
          variant={currentPreset === "lastMonth" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetClick("lastMonth")}
        >
          Mês Anterior
        </Button>
        
        <Button
          variant={currentPreset === "thisYear" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetClick("thisYear")}
        >
          Este Ano
        </Button>
        
        <Button
          variant={currentPreset === "lastYear" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetClick("lastYear")}
        >
          Ano Anterior
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">ou</span>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          placeholder="Personalizado"
          className="w-64"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
    </div>
  );
}
