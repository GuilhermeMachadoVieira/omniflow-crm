"use client";

import { lazy } from "react";
import type { CustomerSafe, PipelineColumnSafe } from "@/lib/frontend-types";

const CreateOpportunityDialogLazy = lazy(() =>
  import("./CreateOpportunityDialog").then((m) => ({
    default: m.CreateOpportunityDialog,
  }))
);

export interface LazyCreateOpportunityDialogProps {
  children: React.ReactNode;
  onCreateComplete?: () => void;
  initialColumnId?: string;
  customers: CustomerSafe[];
  columns: PipelineColumnSafe[] | Array<{ id: string; title: string }>;
}

export function LazyCreateOpportunityDialog(props: LazyCreateOpportunityDialogProps) {
  return <CreateOpportunityDialogLazy {...props} />;
}
