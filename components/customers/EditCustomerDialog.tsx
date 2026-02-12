"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCustomerSchema, UpdateCustomerFormData } from "@/lib/schemas";
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
import { Textarea } from "@/components/ui/textarea";
import { CustomerSafe } from "@/lib/frontend-types";
import { updateCustomer } from "@/app/actions/customers";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/settings/ImageUpload";

interface EditCustomerDialogProps {
  customer: CustomerSafe;
  children: React.ReactNode;
  onUpdateComplete?: () => void;
}

export function EditCustomerDialog({ customer, children, onUpdateComplete }: EditCustomerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [customerImage, setCustomerImage] = useState<string | null>(customer.image || null);

  const form = useForm<UpdateCustomerFormData>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      nome: customer.nome,
      email: customer.email,
      image: customer.image || "",
      telefone: customer.telefone || "",
      empresa: customer.empresa || "",
      document: customer.document || "",
      address: customer.address || "",
      source: customer.source || "",
      tags: customer.tags || [],
      notes: customer.notes || "",
    },
  });

  async function onSubmit(data: UpdateCustomerFormData) {
    startTransition(async () => {
      // Garantir que campos obrigatórios tenham valores
      const submitData = {
        ...data,
        nome: data.nome || customer.nome,
        email: data.email || customer.email,
        image: customerImage,
        tags: data.tags || customer.tags || [],
      };

      const result = await updateCustomer(customer.id, submitData);

      if (result.success) {
        toast.success("Cliente atualizado com sucesso!");
        form.reset();
        setOpen(false);
        onUpdateComplete?.();
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao atualizar cliente");
      }
    });
  }

  const handleImageChange = (newUrl?: string) => {
    setCustomerImage(newUrl || null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Atualize as informações do cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <Label>Foto do Cliente</Label>
              <ImageUpload 
                currentImage={customerImage} 
                onImageChange={handleImageChange}
                type="user"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  {...form.register("nome")}
                  disabled={isPending}
                  required
                />
                {form.formState.errors.nome && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.nome.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  disabled={isPending}
                  required
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  {...form.register("telefone")}
                  disabled={isPending}
                  placeholder="(11) 99999-9999"
                />
                {form.formState.errors.telefone && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.telefone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa</Label>
                <Input
                  id="empresa"
                  {...form.register("empresa")}
                  disabled={isPending}
                />
                {form.formState.errors.empresa && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.empresa.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document">Documento</Label>
                <Input
                  id="document"
                  {...form.register("document")}
                  disabled={isPending}
                  placeholder="CPF/CNPJ"
                />
                {form.formState.errors.document && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.document.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Origem</Label>
                <Input
                  id="source"
                  {...form.register("source")}
                  disabled={isPending}
                  placeholder="Google, Indicação, Instagram..."
                />
                {form.formState.errors.source && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.source.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                {...form.register("address")}
                disabled={isPending}
                placeholder="Endereço completo"
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                {...form.register("tags")}
                disabled={isPending}
                placeholder="Tags separadas por vírgula"
              />
              {form.formState.errors.tags && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.tags.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                {...form.register("notes")}
                disabled={isPending}
                placeholder="Observações gerais sobre o cliente"
                rows={3}
              />
              {form.formState.errors.notes && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.notes.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
