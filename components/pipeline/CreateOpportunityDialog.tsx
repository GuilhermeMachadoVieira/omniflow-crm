"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createOpportunity } from "@/app/actions/pipeline";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PipelineColumnSafe } from "@/lib/frontend-types";
import { getCustomers } from "@/app/actions/customers";
import { CustomerSafe } from "@/lib/frontend-types";

const opportunitySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.string().transform((val) => {
    const num = val.replace(/[^\d,]/g, "");
    return num === "" ? "0" : num;
  }).refine((val) => parseFloat(val) > 0, "Valor deve ser maior que 0"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  probability: z.number().min(0, "Probabilidade deve ser entre 0 e 100").max(100, "Probabilidade deve ser entre 0 e 100"),
  expectedCloseDate: z.string().transform(val => val || ""),
  customerId: z.string().min(1, "Selecione um cliente"),
  columnId: z.string().min(1, "Selecione uma coluna"),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface CreateOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  columns: PipelineColumnSafe[];
  organizationId: string;
  initialColumnId?: string;
}

export function CreateOpportunityDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  columns,
  organizationId,
  initialColumnId
}: CreateOpportunityDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [customers, setCustomers] = useState<CustomerSafe[]>([]);
  const router = useRouter();

  // Carregar clientes quando o dialog abrir
  useEffect(() => {
    if (open && organizationId) {
      getCustomers(organizationId).then(setCustomers);
    }
  }, [open, organizationId]);

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: "",
      value: "",
      priority: "MEDIUM",
      probability: 50,
      expectedCloseDate: "",
      customerId: "",
      columnId: initialColumnId || columns[0]?.id || "",
    },
  });

  // @ts-no-check
  async function onSubmit(data: OpportunityFormData) {
    startTransition(async () => {
      const result = await createOpportunity({
        title: data.title,
        value: parseFloat(data.value),
        priority: data.priority,
        probability: data.probability,
        expectedCloseDate: data.expectedCloseDate ? new Date(data.expectedCloseDate) : undefined,
        customerId: data.customerId,
        columnId: data.columnId,
      });

      if (result.success) {
        toast.success("Oportunidade criada com sucesso!");
        form.reset();
        onOpenChange(false);
        onSuccess();
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao criar oportunidade");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nova Oportunidade</DialogTitle>
            <DialogDescription>
              Adicione uma nova oportunidade ao seu pipeline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título *
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                className="col-span-3"
                disabled={isPending}
              />
              {form.formState.errors.title && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Valor (R$) *
              </Label>
              <Input
                id="value"
                {...form.register("value")}
                className="col-span-3"
                placeholder="0,00"
                disabled={isPending}
              />
              {form.formState.errors.value && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.value.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Prioridade *
              </Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(value) => form.setValue("priority", value as "LOW" | "MEDIUM" | "HIGH")}
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Baixa</SelectItem>
                  <SelectItem value="MEDIUM">Média</SelectItem>
                  <SelectItem value="HIGH">Alta</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.priority && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.priority.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="probability" className="text-right">
                Probabilidade (%) *
              </Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                {...form.register("probability")}
                className="col-span-3"
                placeholder="50"
                disabled={isPending}
              />
              {form.formState.errors.probability && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.probability.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expectedCloseDate" className="text-right">
                Data Prevista
              </Label>
              <Input
                id="expectedCloseDate"
                type="date"
                {...form.register("expectedCloseDate")}
                className="col-span-3"
                disabled={isPending}
              />
              {form.formState.errors.expectedCloseDate && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.expectedCloseDate.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customerId" className="text-right">
                Cliente *
              </Label>
              <Select
                value={form.watch("customerId")}
                onValueChange={(value) => form.setValue("customerId", value)}
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer: CustomerSafe) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.nome} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.customerId && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.customerId.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="columnId" className="text-right">
                Coluna Inicial *
              </Label>
              <Select
                value={form.watch("columnId")}
                onValueChange={(value) => form.setValue("columnId", value)}
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione uma coluna" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.columnId && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.columnId.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Oportunidade"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
