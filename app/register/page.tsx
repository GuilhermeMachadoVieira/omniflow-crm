"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { passwordSchema } from "@/lib/password-policy";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction } from "@/app/actions/register";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { PasswordStrength, PasswordRequirements } from "@/components/ui/PasswordStrength";
import { Eye, EyeOff } from "lucide-react";

const registerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  password: passwordSchema,
  empresa: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      nome: "", 
      email: "", 
      password: "", 
      empresa: "" 
    },
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await registerAction(data);
      if (result.success) {
        const signInResult = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (signInResult?.ok) {
          setSuccess("Conta criada com sucesso! Redirecionando...");
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 800);
        } else {
          setSuccess("Conta criada com sucesso! Faça login para continuar.");
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        }
      } else {
        setError(result.error || "Erro ao criar conta");
      }
    } catch (error) {
      setError("Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Lado esquerdo: branding */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-900 p-10 text-white md:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800/95 to-primary/10" />
        <div className="relative z-10 flex items-center gap-2">
          <Building2 className="h-9 w-9 text-primary" />
          <span className="text-xl font-semibold tracking-tight">OmniFlow</span>
        </div>
        <div className="relative z-10 flex flex-1 items-center">
          <blockquote className="text-lg leading-relaxed text-zinc-300 md:text-xl">
            &ldquo;Comece sua jornada de vendas hoje. Crie sua conta,
            monte sua equipe e transforme leads em clientes fiéis.&rdquo;
          </blockquote>
        </div>
        <p className="relative z-10 text-sm text-zinc-500">
          OmniFlow CRM · Sua plataforma de gestão completa
        </p>
      </div>

      {/* Lado direito: formulário */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-6 md:w-1/2">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar nova conta
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Crie sua conta e organização para começar a usar o OmniFlow.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="João Silva"
                disabled={isLoading}
                {...register("nome")}
                className={errors.nome ? "border-destructive" : ""}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@exemplo.com"
                autoComplete="email"
                disabled={isLoading}
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa">Nome da empresa</Label>
              <Input
                id="empresa"
                placeholder="Minha Startup Ltda"
                disabled={isLoading}
                {...register("empresa")}
                className={errors.empresa ? "border-destructive" : ""}
              />
              {errors.empresa && (
                <p className="text-sm text-destructive">
                  {errors.empresa.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("password")}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
              <PasswordStrength password={watch("password") || ""} />
              <PasswordRequirements password={watch("password") || ""} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar conta"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Já tem conta?{" "}
              <a 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Faça login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
