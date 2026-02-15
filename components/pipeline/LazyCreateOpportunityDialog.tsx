"use client";

import { useState, lazy } from "react";
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
  organizationId: string;
  customers: CustomerSafe[];
  columns: PipelineColumnSafe[] | Array<{ id: string; title: string }>;
}

export function LazyCreateOpportunityDialog({ children, onCreateComplete, initialColumnId, organizationId, customers, columns }: LazyCreateOpportunityDialogProps) {
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
      <CreateOpportunityDialogLazy
        open={open}
        onOpenChange={setOpen}
        onSuccess={handleSuccess}
        initialColumnId={initialColumnId}
        organizationId={organizationId}
        columns={Array.isArray(columns) && columns.length > 0 && 'id' in columns[0] ? columns as PipelineColumnSafe[] : columns.map(col => ({ id: col.id, title: col.title, sortOrder: 0, opportunities: [], organizationId: '', createdAt: new Date() }))}
      />
    </>
  );
}
