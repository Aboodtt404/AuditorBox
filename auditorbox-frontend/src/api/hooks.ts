// Auto-generated React Query hooks from .did file
// Generated: 2026-02-08T19:19:52.953497

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from './api-functions';

export function useCompleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.completeProfile>) => api.completeProfile(...args),
    onSuccess: () => qc.invalidateQueries(),
  });
}

export function useCreateAdjustment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.createAdjustment>) => api.createAdjustment(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listAdjustments'] }),
  });
}

export function useCreateEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.createEngagement>) => api.createEngagement(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listEngagements'] }),
  });
}

export function useCreateFinancialStatement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.createFinancialStatement>) => api.createFinancialStatement(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listFinancialStatements'] }),
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.createOrganization>) => api.createOrganization(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listOrganizations'] }),
  });
}

export function useCreateTrialBalance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.createTrialBalance>) => api.createTrialBalance(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listTrialBalances'] }),
  });
}

export function useGetAdjustment(id?: bigint) {
  return useQuery({
    queryKey: ['getAdjustment', id],
    queryFn: () => api.getAdjustment(id!),
    enabled: id !== undefined,
  });
}

export function useGetAuditTrail() {
  return useQuery({
    queryKey: ['getAuditTrail'],
    queryFn: () => api.getAuditTrail(),
  });
}

export function useGetCurrentUser() {
  return useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: () => api.getCurrentUser(),
  });
}

export function useGetEngagement(id?: bigint) {
  return useQuery({
    queryKey: ['getEngagement', id],
    queryFn: () => api.getEngagement(id!),
    enabled: id !== undefined,
  });
}

export function useGetFinancialStatement(id?: bigint) {
  return useQuery({
    queryKey: ['getFinancialStatement', id],
    queryFn: () => api.getFinancialStatement(id!),
    enabled: id !== undefined,
  });
}

export function useGetOrganization(id?: bigint) {
  return useQuery({
    queryKey: ['getOrganization', id],
    queryFn: () => api.getOrganization(id!),
    enabled: id !== undefined,
  });
}

export function useGetTrialBalance(id?: bigint) {
  return useQuery({
    queryKey: ['getTrialBalance', id],
    queryFn: () => api.getTrialBalance(id!),
    enabled: id !== undefined,
  });
}

export function useListAdjustments() {
  return useQuery({
    queryKey: ['listAdjustments'],
    queryFn: () => api.listAdjustments(),
  });
}

export function useListEngagements() {
  return useQuery({
    queryKey: ['listEngagements'],
    queryFn: () => api.listEngagements(),
  });
}

export function useListFinancialStatements() {
  return useQuery({
    queryKey: ['listFinancialStatements'],
    queryFn: () => api.listFinancialStatements(),
  });
}

export function useListOrganizations() {
  return useQuery({
    queryKey: ['listOrganizations'],
    queryFn: () => api.listOrganizations(),
  });
}

export function useListTrialBalances() {
  return useQuery({
    queryKey: ['listTrialBalances'],
    queryFn: () => api.listTrialBalances(),
  });
}

export function useListUsers() {
  return useQuery({
    queryKey: ['listUsers'],
    queryFn: () => api.listUsers(),
  });
}

export function useUpdateAdjustmentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.updateAdjustmentStatus>) => api.updateAdjustmentStatus(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listAdjustments'] }),
  });
}

export function useUpdateUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.updateUserRole>) => api.updateUserRole(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listUsers'] }),
  });
}

export function useVerifyAuditTrailIntegrity() {
  return useQuery({
    queryKey: ['verifyAuditTrailIntegrity'],
    queryFn: () => api.verifyAuditTrailIntegrity(),
  });
}

// =========================================================
// NEW HOOKS — Backend Migration
// =========================================================

export function useUpdateEngagement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.updateEngagement>) => api.updateEngagement(...args),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['listEngagements'] });
      qc.invalidateQueries({ queryKey: ['getEngagement'] });
    },
  });
}

export function useSaveFormData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.saveFormData>) => api.saveFormData(...args),
    onSuccess: (_data, args) => {
      qc.invalidateQueries({ queryKey: ['listFormData', args[0]] });
      qc.invalidateQueries({ queryKey: ['getFormData', args[0], args[1]] });
    },
  });
}

export function useGetFormData(engagementId?: bigint, formId?: string) {
  return useQuery({
    queryKey: ['getFormData', engagementId, formId],
    queryFn: () => api.getFormData(engagementId!, formId!),
    enabled: engagementId !== undefined && formId !== undefined,
  });
}

export function useListFormData(engagementId?: bigint) {
  return useQuery({
    queryKey: ['listFormData', engagementId],
    queryFn: () => api.listFormData(engagementId!),
    enabled: engagementId !== undefined,
  });
}

export function useUpdateFormStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.updateFormStatus>) => api.updateFormStatus(...args),
    onSuccess: (_data, args) => {
      qc.invalidateQueries({ queryKey: ['listFormData', args[0]] });
      qc.invalidateQueries({ queryKey: ['getFormData', args[0], args[1]] });
    },
  });
}

export function useBatchSaveFormData() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.batchSaveFormData>) => api.batchSaveFormData(...args),
    onSuccess: (_data, args) => {
      qc.invalidateQueries({ queryKey: ['listFormData', args[0]] });
    },
  });
}

export function useGetUserPreferences() {
  return useQuery({
    queryKey: ['getUserPreferences'],
    queryFn: () => api.getUserPreferences(),
  });
}

export function useUpdateUserPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.updateUserPreferences>) => api.updateUserPreferences(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['getUserPreferences'] }),
  });
}

export function useUpdateTrialBalanceAccounts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.updateTrialBalanceAccounts>) => api.updateTrialBalanceAccounts(...args),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['listTrialBalances'] });
      qc.invalidateQueries({ queryKey: ['getTrialBalance'] });
    },
  });
}
