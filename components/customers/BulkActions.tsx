"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Download } from "lucide-react";
import { deleteCustomer } from "@/app/actions/customers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  organizationId: string;
}

export function BulkActions({ selectedIds, onClearSelection, organizationId }: BulkActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      // Deletar clientes em paralelo
      await Promise.all(selectedIds.map(id => deleteCustomer(id)));
      
      toast.success(`${selectedIds.length} cliente(s) excluído(s) com sucesso!`);
      onClearSelection();
      router.refresh();
    } catch (error) {
      toast.error("Erro ao excluir clientes");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBulkExport = () => {
    // Implementar exportação dos selecionados
    const selectedCustomersData = selectedIds.join(",");
    const url = `/api/customers/export?ids=${selectedCustomersData}`;
    window.open(url, '_blank');
  };

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
        <span className="text-sm font-medium">
          {selectedIds.length} cliente{selectedIds.length !== 1 ? "s" : ""} selecionado{selectedIds.length !== 1 ? "s" : ""}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar Selecionados
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir Selecionados
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          Limpar Seleção
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão em Lote</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedIds.length} cliente{selectedIds.length !== 1 ? "s" : ""}?
              Esta ação não pode ser desfeita e excluirá todos os dados relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : `Excluir ${selectedIds.length} Cliente${selectedIds.length !== 1 ? "s" : ""}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
