// Auto-generated API functions from .did file
// Generated: 2026-02-08T19:19:52.953027
// Do not edit manually — regenerate with: python3 frontend_agent.py generate-api

import { getBackend } from './backend';
import type { Principal } from '@dfinity/principal';
import type {
  CompleteProfileRequest,
  CreateAjeRequest,
  CreateEngagementRequest,
  CreateTrialBalanceRequest,
  UpdateEngagementRequest,
  SaveFormDataRequest,
  UserPreferences,
  TrialBalanceAccount,
  XBRLTaxonomy,
  AjeStatus,
  FormStatus,
  UserRole,
} from '../declarations/auditorbox_backend/auditorbox_backend.did';

/** ACTION — update */
export async function completeProfile(req: CompleteProfileRequest) {
  const backend = getBackend();
  return await backend.completeProfile(req);
}

/** CREATE — update */
export async function createAdjustment(req: CreateAjeRequest) {
  const backend = getBackend();
  return await backend.createAdjustment(req);
}

/** CREATE — update */
export async function createEngagement(req: CreateEngagementRequest) {
  const backend = getBackend();
  return await backend.createEngagement(req);
}

/** CREATE — update */
export async function createFinancialStatement(engagementId: bigint, trialBalanceId: bigint, taxonomy: XBRLTaxonomy, title: string) {
  const backend = getBackend();
  return await backend.createFinancialStatement(engagementId, trialBalanceId, taxonomy, title);
}

/** CREATE — update */
export async function createOrganization(name: string, description: string) {
  const backend = getBackend();
  return await backend.createOrganization(name, description);
}

/** CREATE — update */
export async function createTrialBalance(req: CreateTrialBalanceRequest) {
  const backend = getBackend();
  return await backend.createTrialBalance(req);
}

/** READ — query */
export async function getAdjustment(id: bigint) {
  const backend = getBackend();
  return await backend.getAdjustment(id);
}

/** READ — query */
export async function getAuditTrail() {
  const backend = getBackend();
  return await backend.getAuditTrail();
}

/** READ — update */
export async function getCurrentUser() {
  const backend = getBackend();
  return await backend.getCurrentUser();
}

/** READ — query */
export async function getEngagement(id: bigint) {
  const backend = getBackend();
  return await backend.getEngagement(id);
}

/** READ — query */
export async function getFinancialStatement(id: bigint) {
  const backend = getBackend();
  return await backend.getFinancialStatement(id);
}

/** READ — query */
export async function getOrganization(id: bigint) {
  const backend = getBackend();
  return await backend.getOrganization(id);
}

/** READ — query */
export async function getTrialBalance(id: bigint) {
  const backend = getBackend();
  return await backend.getTrialBalance(id);
}

/** LIST — query */
export async function listAdjustments() {
  const backend = getBackend();
  return await backend.listAdjustments();
}

/** LIST — query */
export async function listEngagements() {
  const backend = getBackend();
  return await backend.listEngagements();
}

/** LIST — query */
export async function listFinancialStatements() {
  const backend = getBackend();
  return await backend.listFinancialStatements();
}

/** LIST — query */
export async function listOrganizations() {
  const backend = getBackend();
  return await backend.listOrganizations();
}

/** LIST — query */
export async function listTrialBalances() {
  const backend = getBackend();
  return await backend.listTrialBalances();
}

/** LIST — query */
export async function listUsers() {
  const backend = getBackend();
  return await backend.listUsers();
}

/** UPDATE — update */
export async function updateAdjustmentStatus(adjId: bigint, newStatus: AjeStatus) {
  const backend = getBackend();
  return await backend.updateAdjustmentStatus(adjId, newStatus);
}

/** UPDATE — update */
export async function updateUserRole(target: Principal, newRole: UserRole) {
  const backend = getBackend();
  return await backend.updateUserRole(target, newRole);
}

/** QUERY — query */
export async function verifyAuditTrailIntegrity() {
  const backend = getBackend();
  return await backend.verifyAuditTrailIntegrity();
}

// =========================================================
// NEW METHODS — Backend Migration
// =========================================================

/** UPDATE — update engagement config */
export async function updateEngagement(id: bigint, req: UpdateEngagementRequest) {
  const backend = getBackend();
  return await backend.updateEngagement(id, req);
}

/** SAVE — save form field values */
export async function saveFormData(engagementId: bigint, formId: string, values: string, status: FormStatus) {
  const backend = getBackend();
  return await backend.saveFormData(engagementId, formId, values, status);
}

/** READ — get single form data */
export async function getFormData(engagementId: bigint, formId: string) {
  const backend = getBackend();
  return await backend.getFormData(engagementId, formId);
}

/** LIST — all form data for engagement */
export async function listFormData(engagementId: bigint) {
  const backend = getBackend();
  return await backend.listFormData(engagementId);
}

/** UPDATE — update form status only */
export async function updateFormStatus(engagementId: bigint, formId: string, status: FormStatus) {
  const backend = getBackend();
  return await backend.updateFormStatus(engagementId, formId, status);
}

/** BATCH — save multiple forms at once (max 20) */
export async function batchSaveFormData(engagementId: bigint, entries: SaveFormDataRequest[]) {
  const backend = getBackend();
  return await backend.batchSaveFormData(engagementId, entries);
}

/** READ — get user UI preferences */
export async function getUserPreferences() {
  const backend = getBackend();
  return await backend.getUserPreferences();
}

/** UPDATE — save user UI preferences */
export async function updateUserPreferences(prefs: UserPreferences) {
  const backend = getBackend();
  return await backend.updateUserPreferences(prefs);
}

/** UPDATE — update trial balance accounts */
export async function updateTrialBalanceAccounts(tbId: bigint, accounts: TrialBalanceAccount[]) {
  const backend = getBackend();
  return await backend.updateTrialBalanceAccounts(tbId, accounts);
}
// ... (existing code)
/** VALIDATE — check TB balance and issues */
export async function validateTrialBalance(id: bigint) {
  const backend = getBackend();
  return await backend.validateTrialBalance(id);
}
