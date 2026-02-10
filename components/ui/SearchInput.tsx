"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder = "Buscar...", className }: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Estado local para controlar o debounce
  const [inputValue, setInputValue] = useState(searchParams.get("q") || "");
  const [debouncedValue, setDebouncedValue] = useState("");

  // Função de debounce
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Função para atualizar a URL
  const updateSearch = useCallback((query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  }, [searchParams, pathname, router]);

  // Debounce function
  const debouncedUpdateSearch = useCallback(
    debounce((query: string) => {
      setDebouncedValue(query);
      updateSearch(query);
    }, 300),
    [updateSearch]
  );

  // Atualizar valor local quando mudar na URL
  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    setInputValue(currentQuery);
  }, [searchParams]);

  // Aplicar debounce quando o input mudar
  useEffect(() => {
    debouncedUpdateSearch(inputValue);
  }, [inputValue, debouncedUpdateSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={`pl-10 ${className}`}
      />
    </div>
  );
}
