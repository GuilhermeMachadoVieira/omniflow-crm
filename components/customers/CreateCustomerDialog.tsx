"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Plus } from "lucide-react";
import { createCustomer, type CreateCustomerData } from "@/app/actions/customers";
import { customerSchema, type CustomerFormData } from "@/lib/schemas/customer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/settings/ImageUpload";

export interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCustomerDialog({ open, onOpenChange, onSuccess }: CreateCustomerDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [customerImage, setCustomerImage] = useState<string | null>(null);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      nome: "",
      email: "",
      image: "",
      telefone: "",
      empresa: "",
      document: "",
      address: "",
      source: "",
      tags: [],
      notes: "",
    },
  });

  async function onSubmit(data: CustomerFormData) {
    startTransition(async () => {
      const customerData = {
        ...data,
        image: customerImage,
      };
      
      const result = await createCustomer(customerData);

      if (result.success) {
        toast.success("Cliente criado com sucesso!");
        form.reset();
        setCustomerImage(null);
        onOpenChange(false);
        onSuccess();
        // Atualizar a lista sem recarregar a página
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao criar cliente");
      }
    });
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    form.handleSubmit(onSubmit)(e);
  };

  const handleImageChange = (newUrl?: string) => {
    setCustomerImage(newUrl || null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleFormSubmit}>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Adicione um novo cliente à sua base de dados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <FormLabel>Foto do Cliente</FormLabel>
              <ImageUpload 
                currentImage={customerImage} 
                onImageChange={handleImageChange}
                type="user"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="nome" className="text-right">
                Nome *
              </FormLabel>
              <Input
                id="nome"
                {...form.register("nome", {
                  onChange: (e) => {
                    // Permitir apenas letras, espaços e caracteres especiais comuns em nomes
                    const value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, '');
                    e.target.value = value;
                  }
                })}
                className="col-span-3"
                disabled={isPending}
                placeholder="Nome completo"
                maxLength={100}
              />
              {form.formState.errors.nome && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.nome.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="email" className="text-right">
                E-mail *
              </FormLabel>
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
              <FormLabel htmlFor="telefone" className="text-right">
                Telefone
              </FormLabel>
              <div className="col-span-3">
                <MaskedInput
                  id="telefone"
                  mask="phone"
                  value={form.watch("telefone")}
                  onChange={(value) => form.setValue("telefone", value, { shouldValidate: true })}
                  disabled={isPending}
                  className="w-full"
                />
              </div>
              {form.formState.errors.telefone && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.telefone.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="empresa" className="text-right">
                Empresa
              </FormLabel>
              <Input
                id="empresa"
                {...form.register("empresa")}
                className="col-span-3"
                disabled={isPending}
                placeholder="Nome da empresa"
                maxLength={100}
              />
              {form.formState.errors.empresa && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.empresa.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="document" className="text-right">
                Documento
              </FormLabel>
              <div className="col-span-3">
                <MaskedInput
                  id="document"
                  mask="document"
                  value={form.watch("document")}
                  onChange={(value) => form.setValue("document", value, { shouldValidate: true })}
                  disabled={isPending}
                  className="w-full"
                  placeholder="CPF ou CNPJ"
                />
              </div>
              {form.formState.errors.document && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.document.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="address" className="text-right">
                Endereço
              </FormLabel>
              <Input
                id="address"
                {...form.register("address")}
                className="col-span-3"
                placeholder="Rua, número, bairro, cidade, estado"
                disabled={isPending}
                maxLength={255}
              />
              {form.formState.errors.address && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="source" className="text-right">
                Origem
              </FormLabel>
              <Input
                id="source"
                {...form.register("source")}
                className="col-span-3"
                placeholder="Google, Indicação, Instagram, etc"
                disabled={isPending}
                maxLength={50}
              />
              {form.formState.errors.source && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.source.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="notes" className="text-right">
                Observações
              </FormLabel>
              <Input
                id="notes"
                {...form.register("notes")}
                className="col-span-3"
                placeholder="Informações adicionais"
                disabled={isPending}
                maxLength={1000}
              />
              {form.formState.errors.notes && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.notes.message}
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
                  <LoadingSpinner className="mr-2 h-4 w-4" />
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
