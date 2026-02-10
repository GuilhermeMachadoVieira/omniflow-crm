"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerSafe } from "@/lib/frontend-types";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { CustomerOpportunitiesCard } from "./CustomerOpportunitiesCard";
import { AddActivityForm } from "../activities/AddActivityForm";
import { ActivityFeed } from "../activities/ActivityFeed";
import { EditCustomerDialog } from "./EditCustomerDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteCustomer } from "@/app/actions/customers";
import { toast } from "sonner";

interface CustomerDetailDashboardProps {
  customer: CustomerSafe & {
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
    activities: Array<{
      id: string;
      type: "NOTE" | "CALL" | "EMAIL" | "MEETING";
      content: string;
      createdAt: string;
      user: {
        nome: string;
      };
    }>;
  };
}

export function CustomerDetailDashboard({ customer }: CustomerDetailDashboardProps) {
  const router = useRouter();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleUpdateComplete = () => {
    router.refresh();
  };

  const handleDeleteCustomer = async () => {
    const result = await deleteCustomer(customer.id);
    if (result.success) {
      toast.success("Cliente excluído com sucesso!");
      router.push("/customers");
    } else {
      toast.error(result.error || "Erro ao excluir cliente");
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl">
              {getInitials(customer.nome)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{customer.nome}</h1>
            {customer.empresa && (
              <p className="text-lg text-muted-foreground">{customer.empresa}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {customer.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <EditCustomerDialog customer={customer} onUpdateComplete={handleUpdateComplete}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </EditCustomerDialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir o cliente &quot;{customer.nome}&quot;? 
                Esta ação não pode ser desfeita e excluirá todos os dados relacionados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCustomer}>
                Excluir Cliente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Grid Principal */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Coluna Esquerda - Informações */}
        <div className="space-y-6">
          <CustomerInfoCard
            title="Dados de Contato"
            data={[
              { label: "E-mail", value: customer.email },
              { label: "Telefone", value: customer.telefone || "Não informado" },
            ]}
          />
          
          <CustomerInfoCard
            title="Detalhes"
            data={[
              { label: "Documento", value: customer.document || "Não informado" },
              { label: "Endereço", value: customer.address || "Não informado" },
              { label: "Origem", value: customer.source || "Não informado" },
            ]}
          />
          
          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {customer.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna Direita - Atividades e Oportunidades */}
        <div className="space-y-6">
          {/* Formulário de Nova Atividade */}
          <AddActivityForm customerId={customer.id} />
          
          {/* Feed de Atividades */}
          <ActivityFeed activities={customer.activities} />
          
          {/* Histórico de Oportunidades */}
          <CustomerOpportunitiesCard opportunities={customer.opportunities} />
        </div>
      </div>
    </div>
  );
}
