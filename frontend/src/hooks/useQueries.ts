import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Organization, Entity, Engagement, ActivityLogEntry, UserProfile, LanguagePreference, ImportedDataset, ColumnMetadata, WorkingPaper, AccountBalance, FinancialRatio, TrendAnalysis, VarianceAnalysis } from '../backend';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Organization Queries
export function useGetAllOrganizations() {
  const { actor, isFetching } = useActor();

  return useQuery<Organization[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrganizations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrganization(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Organization | null>({
    queryKey: ['organization', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrganization(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateOrganization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createOrganization(id, name, description);
      await actor.logActivity(`organization_create_${Date.now()}`, `Created organization: ${name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Organization created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create organization: ${error.message}`);
    },
  });
}

export function useUpdateOrganization() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: string; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateOrganization(id, name, description);
      await actor.logActivity(`organization_update_${Date.now()}`, `Updated organization: ${name}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Organization updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update organization: ${error.message}`);
    },
  });
}

// Entity Queries
export function useGetAllEntities() {
  const { actor, isFetching } = useActor();

  return useQuery<Entity[]>({
    queryKey: ['entities'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntities();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEntity(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Entity | null>({
    queryKey: ['entity', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEntity(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetEntitiesByOrganization(organizationId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Entity[]>({
    queryKey: ['entities', 'organization', organizationId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEntitiesByOrganization(organizationId);
    },
    enabled: !!actor && !isFetching && !!organizationId,
  });
}

export function useCreateEntity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, organizationId, name, description, taxonomy }: { id: string; organizationId: string; name: string; description: string; taxonomy: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createEntity(id, organizationId, name, description, taxonomy);
      await actor.logActivity(`entity_create_${Date.now()}`, `Created entity: ${name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Entity created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create entity: ${error.message}`);
    },
  });
}

export function useUpdateEntity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, organizationId, name, description, taxonomy }: { id: string; organizationId: string; name: string; description: string; taxonomy: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateEntity(id, organizationId, name, description, taxonomy);
      await actor.logActivity(`entity_update_${Date.now()}`, `Updated entity: ${name}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      queryClient.invalidateQueries({ queryKey: ['entity', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Entity updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update entity: ${error.message}`);
    },
  });
}

// Engagement Queries
export function useGetAllEngagements() {
  const { actor, isFetching } = useActor();

  return useQuery<Engagement[]>({
    queryKey: ['engagements'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEngagements();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEngagement(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Engagement | null>({
    queryKey: ['engagement', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getEngagement(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetEngagementsByOrganization(organizationId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Engagement[]>({
    queryKey: ['engagements', 'organization', organizationId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEngagementsByOrganization(organizationId);
    },
    enabled: !!actor && !isFetching && !!organizationId,
  });
}

export function useGetEngagementsByEntity(entityId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Engagement[]>({
    queryKey: ['engagements', 'entity', entityId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEngagementsByEntity(entityId);
    },
    enabled: !!actor && !isFetching && !!entityId,
  });
}

export function useCreateEngagement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      organizationId, 
      entityId, 
      name, 
      startDate, 
      endDate, 
      status 
    }: { 
      id: string; 
      organizationId: string; 
      entityId: string; 
      name: string; 
      startDate: bigint; 
      endDate: bigint; 
      status: string; 
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createEngagement(id, organizationId, entityId, name, startDate, endDate, status);
      await actor.logActivity(`engagement_create_${Date.now()}`, `Created engagement: ${name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['engagements'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Engagement created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create engagement: ${error.message}`);
    },
  });
}

export function useUpdateEngagement() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      organizationId, 
      entityId, 
      name, 
      startDate, 
      endDate, 
      status 
    }: { 
      id: string; 
      organizationId: string; 
      entityId: string; 
      name: string; 
      startDate: bigint; 
      endDate: bigint; 
      status: string; 
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateEngagement(id, organizationId, entityId, name, startDate, endDate, status);
      await actor.logActivity(`engagement_update_${Date.now()}`, `Updated engagement: ${name}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['engagements'] });
      queryClient.invalidateQueries({ queryKey: ['engagement', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Engagement updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update engagement: ${error.message}`);
    },
  });
}

// Activity Log Queries
export function useGetAllActivityLogs() {
  const { actor, isFetching } = useActor();

  return useQuery<ActivityLogEntry[]>({
    queryKey: ['activityLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllActivityLogs();
    },
    enabled: !!actor && !isFetching,
  });
}

// Language Preference Queries
export function useGetLanguagePreference() {
  const { actor, isFetching } = useActor();

  return useQuery<LanguagePreference | null>({
    queryKey: ['languagePreference'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLanguagePreference();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetLanguagePreference() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (language: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setLanguagePreference(language);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languagePreference'] });
    },
  });
}

// Data Import Queries
export function useGetAllImportedDatasets() {
  const { actor, isFetching } = useActor();

  return useQuery<ImportedDataset[]>({
    queryKey: ['importedDatasets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllImportedDatasets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetImportedDataset(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ImportedDataset | null>({
    queryKey: ['importedDataset', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getImportedDataset(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useSaveImportedDataset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, columns }: { id: string; name: string; columns: ColumnMetadata[] }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveImportedDataset(id, name, columns);
      await actor.logActivity(`dataset_import_${Date.now()}`, `Imported dataset: ${name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importedDatasets'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Dataset imported successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to import dataset: ${error.message}`);
    },
  });
}

// Working Paper Queries
export function useGetAllWorkingPapers() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkingPaper[]>({
    queryKey: ['workingPapers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkingPapers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetWorkingPaper(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkingPaper | null>({
    queryKey: ['workingPaper', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkingPaper(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetWorkingPapersByEngagement(engagementId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkingPaper[]>({
    queryKey: ['workingPapers', 'engagement', engagementId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkingPapersByEngagement(engagementId);
    },
    enabled: !!actor && !isFetching && !!engagementId,
  });
}

export function useCreateWorkingPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      engagementId,
      name,
      description,
      accountBalances,
      financialRatios,
      trendAnalysis,
      varianceAnalysis,
      supportingDocuments,
    }: {
      id: string;
      engagementId: string;
      name: string;
      description: string;
      accountBalances: AccountBalance[];
      financialRatios: FinancialRatio[];
      trendAnalysis: TrendAnalysis[];
      varianceAnalysis: VarianceAnalysis[];
      supportingDocuments: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createWorkingPaper(
        id,
        engagementId,
        name,
        description,
        accountBalances,
        financialRatios,
        trendAnalysis,
        varianceAnalysis,
        supportingDocuments
      );
      await actor.logActivity(`working_paper_create_${Date.now()}`, `Created working paper: ${name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workingPapers'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Working paper created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create working paper: ${error.message}`);
    },
  });
}

export function useGenerateWorkingPaperFromTrialBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      engagementId,
      name,
      description,
      trialBalanceData,
      priorPeriodData,
      expectedValues,
      supportingDocuments,
    }: {
      engagementId: string;
      name: string;
      description: string;
      trialBalanceData: AccountBalance[];
      priorPeriodData: AccountBalance[];
      expectedValues: AccountBalance[];
      supportingDocuments: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      const workingPaperId = await actor.generateWorkingPaperFromTrialBalance(
        engagementId,
        name,
        description,
        trialBalanceData,
        priorPeriodData,
        expectedValues,
        supportingDocuments
      );
      await actor.logActivity(`working_paper_generate_${Date.now()}`, `Generated working paper: ${name}`);
      return workingPaperId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workingPapers'] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Working paper generated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate working paper: ${error.message}`);
    },
  });
}

export function useUpdateWorkingPaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      engagementId,
      name,
      description,
      accountBalances,
      financialRatios,
      trendAnalysis,
      varianceAnalysis,
      supportingDocuments,
    }: {
      id: string;
      engagementId: string;
      name: string;
      description: string;
      accountBalances: AccountBalance[];
      financialRatios: FinancialRatio[];
      trendAnalysis: TrendAnalysis[];
      varianceAnalysis: VarianceAnalysis[];
      supportingDocuments: string[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateWorkingPaper(
        id,
        engagementId,
        name,
        description,
        accountBalances,
        financialRatios,
        trendAnalysis,
        varianceAnalysis,
        supportingDocuments
      );
      await actor.logActivity(`working_paper_update_${Date.now()}`, `Updated working paper: ${name}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workingPapers'] });
      queryClient.invalidateQueries({ queryKey: ['workingPaper', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['activityLogs'] });
      toast.success('Working paper updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update working paper: ${error.message}`);
    },
  });
}
