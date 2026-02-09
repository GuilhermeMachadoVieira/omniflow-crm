"use client";

import { useState, useTransition } from "react";
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

const opportunitySchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.string().transform((val) => {
    const num = val.replace(/[^\d,]/g, "");
    return num === "" ? "0" : num;
  }).refine((val) => parseFloat(val) > 0, "Valor deve ser maior que 0"),
  customerId: z.string().min(1, "Selecione um cliente"),
  columnId: z.string().min(1, "Selecione uma coluna"),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface CreateOpportunityDialogProps {
  children: React.ReactNode;
  onCreateComplete?: () => void;
  initialColumnId?: string;
  customers: Array<{ id: string; nome: string; email: string }>;
  columns: Array<{ id: string; title: string }>;
}

export function CreateOpportunityDialog({ 
  children, 
  onCreateComplete, 
  initialColumnId,
  customers,
  columns 
}: CreateOpportunityDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: "",
      value: "",
      customerId: "",
      columnId: initialColumnId || columns[0]?.id || "",
    },
  });

  async function onSubmit(data: OpportunityFormData) {
    startTransition(async () => {
      const result = await createOpportunity({
        title: data.title,
        value: parseFloat(data.value),
        customerId: data.customerId,
        columnId: data.columnId,
      });

      if (result.success) {
        toast.success("Oportunidade criada com sucesso!");
        form.reset();
        setOpen(false);
        onCreateComplete?.();
        // Atualizar o pipeline sem recarregar a página
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao criar oportunidade");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
                  {customers.map((customer) => (
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
              onClick={() => setOpen(false)}
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
