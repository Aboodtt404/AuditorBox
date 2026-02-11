// useBackendFormData.ts — Bridge between frontend form state and backend persistence
// Provides a unified interface for loading, saving, and querying form data
// that mirrors the old in-memory useFormCompletion API but persists to the backend.

import { useCallback, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/api-functions';
import type { FormData as BackendFormData, FormStatus } from '../declarations/auditorbox_backend/auditorbox_backend.did';

// Re-export for convenience
export type { FormStatus };

export interface FormCompletion {
    formId: string;
    status: 'not_started' | 'in_progress' | 'prepared' | 'reviewed' | 'signed_off';
    values: Record<string, unknown>;
    preparedBy?: string;
    reviewedBy?: string;
    lastUpdated?: string;
}

// Convert backend FormStatus variant to frontend string
function fromBackendStatus(status: FormStatus): FormCompletion['status'] {
    if ('NotStarted' in status) return 'not_started';
    if ('InProgress' in status) return 'in_progress';
    if ('Prepared' in status) return 'prepared';
    if ('Reviewed' in status) return 'reviewed';
    if ('SignedOff' in status) return 'signed_off';
    return 'not_started';
}

// Convert frontend string to backend FormStatus variant
function toBackendStatus(status: FormCompletion['status']): FormStatus {
    switch (status) {
        case 'not_started': return { NotStarted: null };
        case 'in_progress': return { InProgress: null };
        case 'prepared': return { Prepared: null };
        case 'reviewed': return { Reviewed: null };
        case 'signed_off': return { SignedOff: null };
        default: return { NotStarted: null };
    }
}

// Convert backend FormData to frontend FormCompletion
function toFormCompletion(fd: BackendFormData): FormCompletion {
    let values: Record<string, unknown> = {};
    try {
        values = JSON.parse(fd.values);
    } catch {
        values = {};
    }
    return {
        formId: fd.formId,
        status: fromBackendStatus(fd.status),
        values,
        preparedBy: fd.preparedBy.length > 0 ? fd.preparedBy[0]?.toText() : undefined,
        reviewedBy: fd.reviewedBy.length > 0 ? fd.reviewedBy[0]?.toText() : undefined,
        lastUpdated: new Date(Number(fd.lastUpdated) / 1_000_000).toISOString(),
    };
}

export function useBackendFormData(engagementId: bigint | undefined) {
    const queryClient = useQueryClient();
    const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    // Fetch all form data for this engagement
    const { data: rawFormData, isLoading } = useQuery({
        queryKey: ['listFormData', engagementId?.toString()],
        queryFn: () => api.listFormData(engagementId!),
        enabled: engagementId !== undefined,
        staleTime: 30_000, // 30s — avoid refetching constantly
    });

    // Convert to a lookup map
    const formDataMap = useMemo(() => {
        const map: Record<string, FormCompletion> = {};
        if (rawFormData) {
            for (const fd of rawFormData) {
                map[fd.formId] = toFormCompletion(fd);
            }
        }
        return map;
    }, [rawFormData]);

    // List of completed form IDs (prepared, reviewed, or signed off)
    const completedFormIds = useMemo(() => {
        return Object.values(formDataMap)
            .filter((fc) => fc.status === 'prepared' || fc.status === 'reviewed' || fc.status === 'signed_off')
            .map((fc) => fc.formId);
    }, [formDataMap]);

    // Save mutation
    const saveMutation = useMutation({
        mutationFn: (args: { formId: string; values: string; status: FormStatus }) =>
            api.saveFormData(engagementId!, args.formId, args.values, args.status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['listFormData', engagementId?.toString()] });
        },
    });

    // Get form values
    const getFormValues = useCallback(
        (formId: string): Record<string, unknown> => {
            return formDataMap[formId]?.values ?? {};
        },
        [formDataMap]
    );

    // Get form status
    const getFormStatus = useCallback(
        (formId: string): FormCompletion['status'] => {
            return formDataMap[formId]?.status ?? 'not_started';
        },
        [formDataMap]
    );

    // Save form (debounced — waits 2s before actually saving)
    const saveForm = useCallback(
        (formId: string, values: Record<string, unknown>, status: FormCompletion['status'] = 'in_progress') => {
            // Clear previous timer for this form
            if (debounceTimers.current[formId]) {
                clearTimeout(debounceTimers.current[formId]);
            }

            // Optimistically update the local cache
            queryClient.setQueryData(['listFormData', engagementId?.toString()], (old: BackendFormData[] | undefined) => {
                if (!old) return old;
                const valuesJson = JSON.stringify(values);
                const existing = old.find((fd) => fd.formId === formId);
                if (existing) {
                    return old.map((fd) =>
                        fd.formId === formId
                            ? { ...fd, values: valuesJson, status: toBackendStatus(status), lastUpdated: BigInt(Date.now() * 1_000_000) }
                            : fd
                    );
                }
                return [
                    ...old,
                    {
                        engagementId: engagementId!,
                        formId,
                        status: toBackendStatus(status),
                        values: valuesJson,
                        preparedBy: [],
                        reviewedBy: [],
                        lastUpdated: BigInt(Date.now() * 1_000_000),
                        updatedBy: {} as any, // Will be set by backend
                    } as BackendFormData,
                ];
            });

            // Debounce the actual backend call
            debounceTimers.current[formId] = setTimeout(() => {
                saveMutation.mutate({
                    formId,
                    values: JSON.stringify(values),
                    status: toBackendStatus(status),
                });
            }, 2000);
        },
        [engagementId, queryClient, saveMutation]
    );

    // Update form status immediately (no debounce — status changes are intentional)
    const updateStatus = useCallback(
        (formId: string, status: FormCompletion['status']) => {
            const currentValues = getFormValues(formId);
            saveMutation.mutate({
                formId,
                values: JSON.stringify(currentValues),
                status: toBackendStatus(status),
            });
        },
        [getFormValues, saveMutation]
    );

    return {
        formDataMap,
        completedFormIds,
        isLoading,
        isSaving: saveMutation.isPending,
        getFormValues,
        getFormStatus,
        saveForm,
        updateStatus,
    };
}
