"use client";

import {
  approvalsStorageKey,
  auditStorageKey,
  useWorkflowStore,
} from "@/hooks/use-workflow-store";

export { approvalsStorageKey, auditStorageKey };

export function useApprovalWorkflow() {
  const workflow = useWorkflowStore();

  return {
    ...workflow,
    recordDecision: workflow.updateApprovalStatus,
  };
}
