"use client";

import { Suspense } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LazyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LazyDialog({ 
  isOpen, 
  onOpenChange, 
  title, 
  description, 
  children,
  fallback = <LoadingSpinner text="Carregando..." />
}: LazyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
