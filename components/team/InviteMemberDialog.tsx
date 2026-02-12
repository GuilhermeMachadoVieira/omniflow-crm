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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { inviteMember } from "@/app/actions/team";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const memberSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface InviteMemberDialogProps {
  children: React.ReactNode;
  onInviteComplete?: () => void;
}

export function InviteMemberDialog({ children, onInviteComplete }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      nome: "",
      email: "",
      role: "MEMBER",
    },
  });

  async function onSubmit(data: MemberFormData) {
    startTransition(async () => {
      // Convert data to FormData
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("email", data.email);
      formData.append("role", data.role);
      
      const result = await inviteMember(formData);

      if (result.success) {
        toast.success("Membro convidado com sucesso!");
        form.reset();
        setOpen(false);
        onInviteComplete?.();
        // Atualizar a lista sem recarregar a página
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao convidar membro");
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
            <DialogTitle>Convidar Membro</DialogTitle>
            <DialogDescription>
              Adicione um novo membro à sua equipe.
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
              <Label htmlFor="role" className="text-right">
                Cargo *
              </Label>
              <Select
                value={form.watch("role")}
                onValueChange={(value) => form.setValue("role", value as any)}
                disabled={isPending}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Membro</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="OWNER">Proprietário</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="col-span-4 text-sm text-red-600">
                  {form.formState.errors.role.message}
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
                  Convidando...
                </>
              ) : (
                "Convidar Membro"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
