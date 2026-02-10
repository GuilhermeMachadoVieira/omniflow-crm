"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { exportCustomers } from "@/app/actions/customers";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";

interface ExportButtonProps {
  organizationId: string;
}

export function ExportButton({ organizationId }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useCurrentUser();

  const handleExport = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      const result = await exportCustomers(organizationId);
      
      if (result.success && result.data) {
        // Criar blob e fazer download
        const blob = new Blob([result.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Clientes exportados com sucesso!");
      } else {
        toast.error(result.error || "Erro ao exportar clientes");
      }
    } catch (error) {
      toast.error("Erro ao exportar clientes");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={isExporting}
      variant="outline"
      size="sm"
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </>
      )}
    </Button>
  );
}
