"use client";

import { useState, lazy } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const CreateCustomerDialogLazy = lazy(() =>
  import("./CreateCustomerDialog").then((m) => ({
    default: m.CreateCustomerDialog,
  }))
);

export interface LazyCreateCustomerDialogProps {
  children: React.ReactNode;
  onCreateComplete?: () => void;
}

export function LazyCreateCustomerDialog({ children, onCreateComplete }: LazyCreateCustomerDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onCreateComplete?.();
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      <CreateCustomerDialogLazy
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
      />
    </>
  );
}
