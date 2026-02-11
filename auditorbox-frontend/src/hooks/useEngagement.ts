// useEngagement.ts — Engagement configuration with backend persistence
// Keeps the EngagementConfig interface + context for backward compatibility,
// but adds conversion helpers and a backend-aware hook.

import { createContext, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/api-functions';
import type {
  Engagement,
  UpdateEngagementRequest,
} from '../declarations/auditorbox_backend/auditorbox_backend.did';

// ===== Frontend interface (unchanged for backward compat) =====
export interface EngagementConfig {
  clientName: string;
  yearEnd: string;
  reportingFramework: string;
  entityType: string;
  currency: string;
  industrySector: string;
  materiality: {
    overall: number;
    performance: number;
    trivial: number;
  };
  riskProfile: 'low' | 'medium' | 'high';
  isGroupAudit: boolean;
  isFirstYear: boolean;
}

export const DEFAULT_ENGAGEMENT: EngagementConfig = {
  clientName: 'Demo Corporation Ltd',
  yearEnd: '2025-12-31',
  reportingFramework: 'IFRS',
  entityType: 'private',
  currency: 'USD',
  industrySector: 'manufacturing',
  materiality: { overall: 500000, performance: 375000, trivial: 25000 },
  riskProfile: 'medium',
  isGroupAudit: false,
  isFirstYear: false,
};

// ===== Conversion helpers =====

/** Convert a backend Engagement to the frontend EngagementConfig */
export function engagementToConfig(eng: Engagement): EngagementConfig {
  return {
    clientName: eng.clientName,
    yearEnd: eng.yearEnd,
    reportingFramework: eng.reportingFramework,
    entityType: eng.entityType,
    currency: eng.currency,
    industrySector: eng.industrySector,
    materiality: {
      overall: Number(eng.materialityOverall),
      performance: Number(eng.materialityPerformance),
      trivial: Number(eng.materialityTrivial),
    },
    riskProfile: eng.riskProfile as 'low' | 'medium' | 'high',
    isGroupAudit: eng.isGroupAudit,
    isFirstYear: eng.isFirstYear,
  };
}

/** Convert a frontend EngagementConfig to an UpdateEngagementRequest (all optional fields set) */
export function configToUpdateRequest(config: Partial<EngagementConfig>): UpdateEngagementRequest {
  return {
    name: [],
    description: [],
    status: [],
    endDate: [],
    clientName: config.clientName !== undefined ? [config.clientName] : [],
    yearEnd: config.yearEnd !== undefined ? [config.yearEnd] : [],
    reportingFramework: config.reportingFramework !== undefined ? [config.reportingFramework] : [],
    entityType: config.entityType !== undefined ? [config.entityType] : [],
    currency: config.currency !== undefined ? [config.currency] : [],
    industrySector: config.industrySector !== undefined ? [config.industrySector] : [],
    materialityOverall: config.materiality?.overall !== undefined ? [config.materiality.overall] : [],
    materialityPerformance: config.materiality?.performance !== undefined ? [config.materiality.performance] : [],
    materialityTrivial: config.materiality?.trivial !== undefined ? [config.materiality.trivial] : [],
    riskProfile: config.riskProfile !== undefined ? [config.riskProfile] : [],
    isGroupAudit: config.isGroupAudit !== undefined ? [config.isGroupAudit] : [],
    isFirstYear: config.isFirstYear !== undefined ? [config.isFirstYear] : [],
  };
}

// ===== Context (kept for backward compat) =====
export const EngagementContext = createContext<{
  config: EngagementConfig;
  setConfig: (c: EngagementConfig) => void;
  engagementId: bigint | undefined;
}>({ config: DEFAULT_ENGAGEMENT, setConfig: () => { }, engagementId: undefined });

export function useEngagement() {
  return useContext(EngagementContext);
}

// ===== Backend-aware hook =====

/** Hook that loads engagement config from backend and provides a save function */
export function useBackendEngagement(engagementId: bigint | undefined) {
  const queryClient = useQueryClient();

  const { data: engagement, isLoading } = useQuery({
    queryKey: ['getEngagement', engagementId?.toString()],
    queryFn: () => api.getEngagement(engagementId!),
    enabled: engagementId !== undefined,
    staleTime: 60_000,
  });

  const config: EngagementConfig = engagement && engagement.length > 0
    ? engagementToConfig(engagement[0]!)
    : DEFAULT_ENGAGEMENT;

  const updateMutation = useMutation({
    mutationFn: (newConfig: EngagementConfig) =>
      api.updateEngagement(engagementId!, configToUpdateRequest(newConfig)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEngagement', engagementId?.toString()] });
      queryClient.invalidateQueries({ queryKey: ['listEngagements'] });
    },
  });

  const setConfig = useCallback(
    (newConfig: EngagementConfig) => {
      if (engagementId !== undefined) {
        updateMutation.mutate(newConfig);
      }
    },
    [engagementId, updateMutation]
  );

  return {
    config,
    setConfig,
    isLoading,
    isSaving: updateMutation.isPending,
  };
}
