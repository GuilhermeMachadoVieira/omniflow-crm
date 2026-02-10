"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OpportunitySafe } from "@/lib/frontend-types";
import { deleteOpportunity } from "@/app/actions/pipeline";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface OpportunityCardMenuProps {
  opportunity: OpportunitySafe;
}

export function OpportunityCardMenu({ opportunity }: OpportunityCardMenuProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteOpportunity(opportunity.id);
      if (result.success) {
        toast.success("Oportunidade excluída com sucesso!");
        // Força refresh da página para atualizar o pipeline
        window.location.reload();
      } else {
        toast.error(result.error || "Erro ao excluir oportunidade");
      }
    } catch (error) {
      toast.error("Erro ao excluir oportunidade");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-destructive focus:text-destructive"
        >
          {isDeleting ? "Excluindo..." : "Excluir"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
