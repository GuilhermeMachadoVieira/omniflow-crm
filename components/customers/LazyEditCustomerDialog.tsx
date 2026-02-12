"use client";

import { lazy } from "react";
import type { CustomerSafe } from "@/lib/frontend-types";

const EditCustomerDialogLazy = lazy(() =>
  import("./EditCustomerDialog").then((m) => ({
    default: m.EditCustomerDialog,
  }))
);

export interface LazyEditCustomerDialogProps {
  customer: CustomerSafe;
  children: React.ReactNode;
  onUpdateComplete?: () => void;
}

export function LazyEditCustomerDialog(props: LazyEditCustomerDialogProps) {
  return <EditCustomerDialogLazy {...props} />;
}
