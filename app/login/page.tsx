"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  console.log('=== LOGIN PAGE LOADED ===');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setError("");
    console.log('=== LOGIN SUBMIT ===');
    console.log('Form data:', data);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.ok) {
        console.log('Login successful, redirecting...');
        router.push("/");
        router.refresh();
        return;
      }

      console.log('Login failed:', result?.error);
      setError("E-mail ou senha incorretos");
    } catch (error) {
      console.error('Login error:', error);
      setError("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log('=== FORM SUBMIT INTERCEPTED ===');
    e.preventDefault();
    console.log('Default prevented');
    handleSubmit(onSubmit)(e);
  };

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
            &ldquo;Vendas não são sobre falar. São sobre escutar, entender e
            entregar valor no momento certo.&rdquo;
          </blockquote>
        </div>
        <p className="relative z-10 text-sm text-zinc-500">
          OmniFlow CRM · Gestão de relacionamento e vendas complexas
        </p>
      </div>

      {/* Lado direito: formulário */}
      <div className="flex w-full flex-col items-center justify-center bg-background p-6 md:w-1/2">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Acesse sua conta
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Use seu e-mail e senha para entrar.
            </p>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
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
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={() => {
                console.log('=== BUTTON CLICKED ===');
                handleSubmit(onSubmit)();
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Não tem conta?{" "}
              <a 
                href="/register" 
                className="font-medium text-primary hover:underline"
              >
                Crie sua empresa agora
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
