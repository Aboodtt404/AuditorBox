import { useState, useCallback, useMemo } from 'react';
import { PHASES } from '../data/phases';

export type FormStatus = 'not_started' | 'in_progress' | 'prepared' | 'reviewed' | 'signed_off';

export interface FormCompletion {
  formId: string;
  status: FormStatus;
  values: Record<string, unknown>;
  preparedBy?: string;
  reviewedBy?: string;
  lastUpdated?: string;
}

export function useFormCompletion() {
  const [completions, setCompletions] = useState<Record<string, FormCompletion>>({});

  const completedFormIds = useMemo(
    () => Object.keys(completions).filter(id => completions[id].status !== 'not_started'),
    [completions]
  );

  const getFormStatus = useCallback(
    (formId: string): FormStatus => completions[formId]?.status ?? 'not_started',
    [completions]
  );

  const updateForm = useCallback((formId: string, values: Record<string, unknown>) => {
    setCompletions(prev => ({
      ...prev,
      [formId]: {
        ...prev[formId],
        formId,
        status: prev[formId]?.status || 'in_progress',
        values: { ...prev[formId]?.values, ...values },
        lastUpdated: new Date().toISOString(),
      },
    }));
  }, []);

  const setFormStatus = useCallback((formId: string, status: FormStatus) => {
    setCompletions(prev => ({
      ...prev,
      [formId]: { ...prev[formId], formId, status, values: prev[formId]?.values ?? {}, lastUpdated: new Date().toISOString() },
    }));
  }, []);

  const phaseProgress = useMemo(() => {
    const progress: Record<string, { completed: number; total: number }> = {};
    for (const phase of PHASES) {
      let total = 0;
      let completed = 0;
      for (const cat of phase.categories) {
        total += cat.formCount;
        for (const f of cat.forms) {
          if (completedFormIds.includes(f.formId)) completed++;
        }
      }
      progress[phase.id] = { completed, total };
    }
    return progress;
  }, [completedFormIds]);

  return { completions, completedFormIds, getFormStatus, updateForm, setFormStatus, phaseProgress };
}
