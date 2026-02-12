import { z } from "zod";

export const passwordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  specialChars: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < passwordPolicy.minLength) {
    errors.push(`Senha deve ter pelo menos ${passwordPolicy.minLength} caracteres`);
  }

  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra maiúscula");
  }

  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra minúscula");
  }

  if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push("Senha deve conter pelo menos um número");
  }

  if (passwordPolicy.requireSpecialChars) {
    const specialCharRegex = new RegExp(`[${passwordPolicy.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
    if (!specialCharRegex.test(password)) {
      errors.push(`Senha deve conter pelo menos um caractere especial: ${passwordPolicy.specialChars}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const passwordSchema = z.string()
  .min(passwordPolicy.minLength, `Senha deve ter pelo menos ${passwordPolicy.minLength} caracteres`)
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/\d/, "Senha deve conter pelo menos um número")
  .regex(new RegExp(`[${passwordPolicy.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`), 
    `Senha deve conter pelo menos um caractere especial: ${passwordPolicy.specialChars}`);

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  // Comprimento
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Complexidade
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++;
  
  // Entropia (verificação de padrões comuns)
  if (!/(.)\1{2,}/.test(password)) score++; // Sem 3+ caracteres repetidos
  if (!/123|abc|qwe/i.test(password)) score++; // Sem sequências óbvias
  
  const strength = {
    score: Math.min(score, 5),
    label: '',
    color: '',
  };
  
  if (score <= 2) {
    strength.label = 'Fraca';
    strength.color = 'text-red-500';
  } else if (score <= 3) {
    strength.label = 'Média';
    strength.color = 'text-yellow-500';
  } else if (score <= 4) {
    strength.label = 'Forte';
    strength.color = 'text-blue-500';
  } else {
    strength.label = 'Muito Forte';
    strength.color = 'text-green-500';
  }
  
  return strength;
}
