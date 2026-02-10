"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Phone, Mail, MessageSquare, Calendar } from "lucide-react";
import { createActivityAction } from "@/app/actions/activity";
import { toast } from "sonner";

const activitySchema = z.object({
  type: z.enum(["NOTE", "CALL", "EMAIL", "MEETING"]),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface AddActivityFormProps {
  customerId: string;
}

const ACTIVITY_TYPES = [
  { value: "NOTE", label: "📝 Nota", icon: MessageSquare },
  { value: "CALL", label: "📞 Telefone", icon: Phone },
  { value: "EMAIL", label: "📧 E-mail", icon: Mail },
  { value: "MEETING", label: "📅 Reunião", icon: Calendar },
];

export function AddActivityForm({ customerId }: AddActivityFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: "NOTE",
      content: "",
    },
  });

  async function onSubmit(data: ActivityFormData) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("customerId", customerId);
      formData.append("type", data.type);
      formData.append("content", data.content);

      const result = await createActivityAction(formData);

      if (result.success) {
        toast.success("Atividade registrada com sucesso!");
        form.reset();
      } else {
        toast.error(result.error || "Erro ao registrar atividade");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nova Atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2">
            {ACTIVITY_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.value}
                  type="button"
                  variant={form.watch("type") === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => form.setValue("type", type.value as "NOTE" | "CALL" | "EMAIL" | "MEETING")}
                  className="flex-1"
                  disabled={isPending}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {type.label}
                </Button>
              );
            })}
          </div>
          
          <Textarea
            {...form.register("content")}
            placeholder="Descreva a atividade realizada..."
            className="min-h-[100px]"
            disabled={isPending}
          />
          
          {form.formState.errors.content && (
            <p className="text-sm text-red-600">
              {form.formState.errors.content.message}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrar Atividade"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
