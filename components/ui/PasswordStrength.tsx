"use client";

import { getPasswordStrength } from "@/lib/password-policy";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Força da senha:</span>
        <span className={strength.color}>
          {strength.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${(strength.score / 5) * 100}%`,
            backgroundColor: strength.color.replace('text-', '').replace('-500', '-500'),
          }}
        />
      </div>
    </div>
  );
}

interface PasswordRequirementsProps {
  password: string;
}

export function PasswordRequirements({ password }: PasswordRequirementsProps) {
  const requirements = [
    {
      label: "Pelo menos 8 caracteres",
      met: password.length >= 8,
    },
    {
      label: "Uma letra maiúscula",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Uma letra minúscula",
      met: /[a-z]/.test(password),
    },
    {
      label: "Um número",
      met: /\d/.test(password),
    },
    {
      label: "Um caractere especial",
      met: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    },
  ];

  return (
    <div className="space-y-2 text-sm">
      <p className="text-muted-foreground">A senha deve conter:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li
            key={index}
            className={req.met ? "text-green-600" : "text-muted-foreground"}
          >
            {req.met ? "✓" : "•"} {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
