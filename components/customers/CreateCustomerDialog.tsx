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
import { Loader2 } from "lucide-react";
import { createCustomer } from "@/app/actions/customers";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const customerSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().transform(val => val || ""),
  empresa: z.string().transform(val => val || ""),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CreateCustomerDialogProps {
  children: React.ReactNode;
  onCreateComplete?: () => void;
}

export function CreateCustomerDialog({ children, onCreateComplete }: CreateCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      empresa: "",
    },
  });

  async function onSubmit(data: CustomerFormData) {
    startTransition(async () => {
      const result = await createCustomer(data);

      if (result.success) {
        toast.success("Cliente criado com sucesso!");
        form.reset();
        setOpen(false);
        onCreateComplete?.();
        // Atualizar a lista sem recarregar a página
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao criar cliente");
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
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente à sua base de dados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome *
              </Label>
              <Input
                id="nome"
                {...form.register("nome")}
                className="col-span-3"
                disabled={isPending}
              />
              {form.formState.errors.nome && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                E-mail *
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                className="col-span-3"
                disabled={isPending}
              />
              {form.formState.errors.email && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="telefone"
                {...form.register("telefone")}
                className="col-span-3"
                disabled={isPending}
              />
              {form.formState.errors.telefone && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.telefone.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="empresa" className="text-right">
                Empresa
              </Label>
              <Input
                id="empresa"
                {...form.register("empresa")}
                className="col-span-3"
                disabled={isPending}
              />
              {form.formState.errors.empresa && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.empresa.message}
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
                "Criar Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
