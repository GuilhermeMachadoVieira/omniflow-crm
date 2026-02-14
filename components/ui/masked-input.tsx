"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "./input";

interface MaskedInputProps {
  value?: string;
  onChange?: (value: string) => void;
  mask: "phone" | "cpf" | "cnpj" | "document";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

export function MaskedInput({
  value = "",
  onChange,
  mask,
  placeholder,
  className,
  disabled,
  id,
}: MaskedInputProps) {
  const [displayValue, setDisplayValue] = useState(value);

  // Aplicar máscara de telefone
  const formatPhone = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  }, []);

  // Aplicar máscara de CPF
  const formatCPF = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9, 11)}`;
  }, []);

  // Aplicar máscara de CNPJ
  const formatCNPJ = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length === 0) return "";
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
    
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
  }, []);

  // Aplicar máscara automática (CPF ou CNPJ)
  const formatDocument = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    
    if (cleaned.length <= 11) {
      return formatCPF(value);
    } else {
      return formatCNPJ(value);
    }
  }, [formatCPF, formatCNPJ]);

  // Função para aplicar a máscara correta
  const applyMask = useCallback((value: string): string => {
    switch (mask) {
      case "phone":
        return formatPhone(value);
      case "cpf":
        return formatCPF(value);
      case "cnpj":
        return formatCNPJ(value);
      case "document":
        return formatDocument(value);
      default:
        return value;
    }
  }, [mask, formatPhone, formatCPF, formatCNPJ, formatDocument]);

  // Atualizar display quando o valor externo mudar
  useEffect(() => {
    setDisplayValue(applyMask(value));
  }, [value, applyMask]);

  // Manipular mudança no input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cleanedValue = newValue.replace(/\D/g, "");
    
    // Limitar tamanho máximo
    let maxLength = 20;
    switch (mask) {
      case "phone":
        maxLength = 11;
        break;
      case "cpf":
        maxLength = 11;
        break;
      case "cnpj":
        maxLength = 14;
        break;
      case "document":
        maxLength = 14;
        break;
    }
    
    if (cleanedValue.length > maxLength) {
      return;
    }
    
    const maskedValue = applyMask(newValue);
    setDisplayValue(maskedValue);
    
    // Retornar valor limpo (sem máscara) para o formulário
    if (onChange) {
      onChange(cleanedValue);
    }
  };

  // Placeholder padrão baseado na máscara
  const getDefaultPlaceholder = (): string => {
    switch (mask) {
      case "phone":
        return "(00) 00000-0000";
      case "cpf":
        return "000.000.000-00";
      case "cnpj":
        return "00.000.000/0000-00";
      case "document":
        return "CPF ou CNPJ";
      default:
        return "";
    }
  };

  return (
    <Input
      id={id}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder || getDefaultPlaceholder()}
      className={className}
      disabled={disabled}
      maxLength={mask === "phone" ? 15 : mask === "cpf" ? 14 : mask === "cnpj" ? 18 : 18}
    />
  );
}
