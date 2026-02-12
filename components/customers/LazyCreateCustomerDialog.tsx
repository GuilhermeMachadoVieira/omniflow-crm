"use client";

import { lazy } from "react";

const CreateCustomerDialogLazy = lazy(() =>
  import("./CreateCustomerDialog").then((m) => ({
    default: m.CreateCustomerDialog,
  }))
);

export interface LazyCreateCustomerDialogProps {
  children: React.ReactNode;
  onCreateComplete?: () => void;
}

export function LazyCreateCustomerDialog(props: LazyCreateCustomerDialogProps) {
  return (
    <CreateCustomerDialogLazy {...props} />
  );
}
