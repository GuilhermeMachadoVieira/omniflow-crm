"use client";

import { lazy } from "react";

const InviteMemberDialogLazy = lazy(() =>
  import("./InviteMemberDialog").then((m) => ({
    default: m.InviteMemberDialog,
  }))
);

export interface LazyInviteMemberDialogProps {
  children: React.ReactNode;
  onInviteComplete?: () => void;
}

export function LazyInviteMemberDialog(props: LazyInviteMemberDialogProps) {
  return <InviteMemberDialogLazy {...props} />;
}
