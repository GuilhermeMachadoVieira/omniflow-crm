import * as z from "zod";

// Validadores brasileiros
export const isValidCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += Number(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += Number(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== Number(cpf.substring(10, 11))) return false;
  
  return true;
};

export const isValidCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  let length = cnpj.length - 2;
  let numbers = cnpj.substring(0, length);
  let digits = cnpj.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(0))) return false;
  
  length = length + 1;
  numbers = cnpj.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += Number(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number(digits.charAt(1))) return false;
  
  return true;
};

export const isValidCPFOrCNPJ = (document: string): boolean => {
  const cleanDoc = document.replace(/\D/g, '');
  return cleanDoc.length <= 11 ? isValidCPF(cleanDoc) : isValidCNPJ(cleanDoc);
};

export const isValidPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone.length === 10 || cleanPhone.length === 11;
};

// Schema principal do cliente
export const customerSchema = z.object({
  nome: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .transform(val => val.trim()),
  
  email: z.string()
    .email("E-mail inválido")
    .max(255, "E-mail deve ter no máximo 255 caracteres")
    .transform(val => val.toLowerCase().trim()),
  
  image: z.string()
    .url("URL da imagem inválida")
    .optional()
    .nullable(),
  
  telefone: z.string()
    .optional()
    .refine((val) => !val || isValidPhone(val), {
      message: "Telefone deve ter 10 ou 11 dígitos (com DDD)"
    })
    .transform(val => val?.trim() || ""),
  
  empresa: z.string()
    .max(100, "Empresa deve ter no máximo 100 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
  
  document: z.string()
    .optional()
    .refine((val) => !val || isValidCPFOrCNPJ(val), {
      message: "CPF/CNPJ inválido"
    })
    .transform(val => val?.replace(/\D/g, '') || ""),
  
  address: z.string()
    .max(255, "Endereço deve ter no máximo 255 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
  
  source: z.string()
    .max(50, "Origem deve ter no máximo 50 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
  
  tags: z.array(z.string().max(30, "Tag deve ter no máximo 30 caracteres"))
    .optional()
    .default([])
    .transform((val: string[] | undefined) => val?.map((tag: string) => tag.trim()).filter(Boolean) || []),
  
  notes: z.string()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
});

// Schema para criação (campos obrigatórios)
export const createCustomerSchema = customerSchema.pick({
  nome: true,
  email: true,
  image: true,
  telefone: true,
  empresa: true,
  document: true,
  address: true,
  source: true,
  tags: true,
  notes: true,
});

// Schema para atualização (todos opcionais)
export const updateCustomerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  email: z.string().email("E-mail inválido").optional(),
  image: z.string().url("URL da imagem inválida").optional().nullable(),
  telefone: z.string()
    .optional()
    .refine((val) => !val || isValidPhone(val), {
      message: "Telefone deve ter 10 ou 11 dígitos (com DDD)"
    })
    .transform(val => val?.trim() || ""),
  empresa: z.string()
    .max(100, "Empresa deve ter no máximo 100 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
  document: z.string()
    .optional()
    .refine((val) => !val || isValidCPFOrCNPJ(val), {
      message: "CPF/CNPJ inválido"
    })
    .transform(val => val?.replace(/\D/g, '') || ""),
  address: z.string()
    .max(255, "Endereço deve ter no máximo 255 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
  source: z.string()
    .max(50, "Origem deve ter no máximo 50 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
  tags: z.array(z.string().max(30, "Tag deve ter no máximo 30 caracteres"))
    .optional()
    .default([])
    .transform((val: string[] | undefined) => val?.map((tag: string) => tag.trim()).filter(Boolean) || []),
  notes: z.string()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .optional()
    .transform(val => val?.trim() || ""),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
