"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/app/actions/password";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { getPasswordStrength } from "@/lib/password-policy";

export function PasswordChange() {
  const [isPending, startTransition] = useTransition();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordStrength = getPasswordStrength(formData.newPassword);

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function togglePasswordVisibility(field: "current" | "new" | "confirm") {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    startTransition(async () => {
      const form = new FormData();
      form.append("currentPassword", formData.currentPassword);
      form.append("newPassword", formData.newPassword);
      form.append("confirmPassword", formData.confirmPassword);

      const result = await changePassword(form);

      if (result.success) {
        toast.success("Senha alterada com sucesso!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.error || "Erro ao alterar senha");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alterar Senha</CardTitle>
        <CardDescription>
          Altere sua senha para manter sua conta segura.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                disabled={isPending}
                placeholder="Digite sua senha atual"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
                disabled={isPending}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                disabled={isPending}
                placeholder="Digite sua nova senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
                disabled={isPending}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {formData.newPassword && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Força da senha:</span>
                  <span className={passwordStrength.color}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color.replace('text-', ''),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                disabled={isPending}
                placeholder="Confirme sua nova senha"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={isPending}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>A senha deve conter:</p>
            <ul className="list-disc list-inside space-y-1">
              <li className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>
                Pelo menos 8 caracteres
              </li>
              <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                Uma letra maiúscula
              </li>
              <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>
                Uma letra minúscula
              </li>
              <li className={/\d/.test(formData.newPassword) ? "text-green-600" : ""}>
                Um número
              </li>
              <li className={/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(formData.newPassword) ? "text-green-600" : ""}>
                Um caractere especial (!@#$%^&*()_+-=[]{}|;:,.&lt;&gt;?)
              </li>
            </ul>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Alterando senha...
              </>
            ) : (
              "Alterar Senha"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
