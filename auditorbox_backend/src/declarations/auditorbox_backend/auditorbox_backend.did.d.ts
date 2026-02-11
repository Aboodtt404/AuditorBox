import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AccountType = { 'Asset' : null } |
  { 'Liability' : null } |
  { 'Other' : null } |
  { 'Revenue' : null } |
  { 'Expense' : null } |
  { 'Equity' : null };
export interface Adjustment {
  'id' : bigint,
  'status' : AjeStatus,
  'lineItems' : Array<AjeLineItem>,
  'engagementId' : bigint,
  'trialBalanceId' : bigint,
  'approvedBy' : [] | [Principal],
  'createdAt' : bigint,
  'createdBy' : Principal,
  'description' : string,
  'reviewedBy' : [] | [Principal],
  'blockchainHash' : string,
}
export interface AjeLineItem {
  'description' : string,
  'credit' : number,
  'accountName' : string,
  'accountNumber' : string,
  'debit' : number,
}
export type AjeStatus = { 'Posted' : null } |
  { 'Approved' : null } |
  { 'Draft' : null } |
  { 'Rejected' : null } |
  { 'Proposed' : null } |
  { 'Reviewed' : null };
export type ApiResult = { 'ok' : ValidationResult } |
  { 'err' : string };
export type ApiResult_1 = { 'ok' : null } |
  { 'err' : string };
export type ApiResult_10 = { 'ok' : bigint } |
  { 'err' : string };
export type ApiResult_2 = { 'ok' : UserPreferences } |
  { 'err' : string };
export type ApiResult_3 = { 'ok' : TrialBalance } |
  { 'err' : string };
export type ApiResult_4 = { 'ok' : FormData } |
  { 'err' : string };
export type ApiResult_5 = { 'ok' : Engagement } |
  { 'err' : string };
export type ApiResult_6 = { 'ok' : Adjustment } |
  { 'err' : string };
export type ApiResult_7 = { 'ok' : Organization } |
  { 'err' : string };
export type ApiResult_8 = { 'ok' : FinancialStatement } |
  { 'err' : string };
export type ApiResult_9 = { 'ok' : User } |
  { 'err' : string };
export interface AuditTrailEntry {
  'id' : bigint,
  'principal' : Principal,
  'action' : string,
  'resourceId' : bigint,
  'hash' : string,
  'resourceType' : string,
  'timestamp' : bigint,
  'details' : string,
  'previousHash' : string,
}
export interface CompleteProfileRequest {
  'name' : string,
  'email' : string,
  'requestedRole' : UserRole,
}
export interface CreateAjeRequest {
  'lineItems' : Array<AjeLineItem>,
  'engagementId' : bigint,
  'trialBalanceId' : bigint,
  'description' : string,
}
export interface CreateEngagementRequest {
  'materialityOverall' : number,
  'industrySector' : string,
  'endDate' : bigint,
  'yearEnd' : string,
  'clientName' : string,
  'link' : EngagementLink,
  'name' : string,
  'description' : string,
  'isGroupAudit' : boolean,
  'materialityPerformance' : number,
  'materialityTrivial' : number,
  'reportingFramework' : string,
  'currency' : string,
  'riskProfile' : string,
  'entityType' : string,
  'isFirstYear' : boolean,
  'startDate' : bigint,
}
export interface CreateTrialBalanceRequest {
  'engagementId' : bigint,
  'description' : string,
  'periodEndDate' : string,
  'currency' : string,
}
export interface Engagement {
  'id' : bigint,
  'materialityOverall' : number,
  'status' : EngagementStatus,
  'industrySector' : string,
  'endDate' : bigint,
  'yearEnd' : string,
  'clientName' : string,
  'link' : EngagementLink,
  'name' : string,
  'createdAt' : bigint,
  'createdBy' : Principal,
  'description' : string,
  'isGroupAudit' : boolean,
  'materialityPerformance' : number,
  'materialityTrivial' : number,
  'reportingFramework' : string,
  'currency' : string,
  'riskProfile' : string,
  'entityType' : string,
  'isFirstYear' : boolean,
  'startDate' : bigint,
}
export type EngagementLink = { 'Entity' : bigint } |
  { 'Client' : bigint } |
  { 'Organization' : bigint };
export type EngagementStatus = { 'Review' : null } |
  { 'Archived' : null } |
  { 'Planning' : null } |
  { 'InProgress' : null } |
  { 'Completed' : null };
export interface FSLineItem {
  'nameAr' : [] | [string],
  'code' : string,
  'name' : string,
  'category' : string,
  'amount' : number,
}
export interface FinancialStatement {
  'id' : bigint,
  'lineItems' : Array<FSLineItem>,
  'engagementId' : bigint,
  'title' : string,
  'trialBalanceId' : bigint,
  'generatedAt' : bigint,
  'generatedBy' : Principal,
  'taxonomy' : XBRLTaxonomy,
}
export interface FormData {
  'status' : FormStatus,
  'engagementId' : bigint,
  'values' : string,
  'lastUpdated' : bigint,
  'reviewedBy' : [] | [Principal],
  'preparedBy' : [] | [Principal],
  'updatedBy' : Principal,
  'formId' : string,
}
export type FormStatus = { 'Prepared' : null } |
  { 'Reviewed' : null } |
  { 'InProgress' : null } |
  { 'SignedOff' : null } |
  { 'NotStarted' : null };
export interface Organization {
  'id' : bigint,
  'name' : string,
  'createdAt' : bigint,
  'createdBy' : Principal,
  'description' : string,
  'entityIds' : Array<bigint>,
}
export interface SaveFormDataRequest {
  'status' : FormStatus,
  'values' : string,
  'formId' : string,
}
export interface TrialBalance {
  'id' : bigint,
  'engagementId' : bigint,
  'createdAt' : bigint,
  'createdBy' : Principal,
  'description' : string,
  'periodEndDate' : string,
  'accounts' : Array<TrialBalanceAccount>,
  'currency' : string,
}
export interface TrialBalanceAccount {
  'beginningBalance' : number,
  'credit' : number,
  'accountName' : string,
  'accountType' : AccountType,
  'endingBalance' : number,
  'accountNumber' : string,
  'fsLineItem' : string,
  'debit' : number,
}
export interface UpdateEngagementRequest {
  'materialityOverall' : [] | [number],
  'status' : [] | [EngagementStatus],
  'industrySector' : [] | [string],
  'endDate' : [] | [bigint],
  'yearEnd' : [] | [string],
  'clientName' : [] | [string],
  'name' : [] | [string],
  'description' : [] | [string],
  'isGroupAudit' : [] | [boolean],
  'materialityPerformance' : [] | [number],
  'materialityTrivial' : [] | [number],
  'reportingFramework' : [] | [string],
  'currency' : [] | [string],
  'riskProfile' : [] | [string],
  'entityType' : [] | [string],
  'isFirstYear' : [] | [boolean],
}
export interface User {
  'languagePreference' : string,
  'principal' : Principal,
  'name' : string,
  'createdAt' : bigint,
  'role' : UserRole,
  'email' : string,
  'profileCompleted' : boolean,
}
export interface UserPreferences {
  'lastEngagementId' : [] | [bigint],
  'dismissedTooltips' : Array<string>,
  'seenPhaseIntros' : Array<string>,
}
export type UserRole = { 'Staff' : null } |
  { 'ClientUser' : null } |
  { 'Senior' : null } |
  { 'Admin' : null } |
  { 'Partner' : null } |
  { 'Manager' : null };
export interface ValidationResult {
  'totalDebits' : number,
  'difference' : number,
  'isBalanced' : boolean,
  'totalCredits' : number,
  'accountCount' : bigint,
}
export type XBRLTaxonomy = { 'EAS' : null } |
  { 'GCC' : null } |
  { 'IFRS' : null } |
  { 'Custom' : string };
export interface _SERVICE {
  'batchSaveFormData' : ActorMethod<
    [bigint, Array<SaveFormDataRequest>],
    ApiResult_10
  >,
  'completeProfile' : ActorMethod<[CompleteProfileRequest], ApiResult_9>,
  'createAdjustment' : ActorMethod<[CreateAjeRequest], ApiResult_6>,
  'createEngagement' : ActorMethod<[CreateEngagementRequest], ApiResult_5>,
  'createFinancialStatement' : ActorMethod<
    [bigint, bigint, XBRLTaxonomy, string],
    ApiResult_8
  >,
  'createOrganization' : ActorMethod<[string, string], ApiResult_7>,
  'createTrialBalance' : ActorMethod<[CreateTrialBalanceRequest], ApiResult_3>,
  'getAdjustment' : ActorMethod<[bigint], [] | [Adjustment]>,
  'getAuditTrail' : ActorMethod<[], Array<AuditTrailEntry>>,
  'getCurrentUser' : ActorMethod<[], [] | [User]>,
  'getEngagement' : ActorMethod<[bigint], [] | [Engagement]>,
  'getFinancialStatement' : ActorMethod<[bigint], [] | [FinancialStatement]>,
  'getFormData' : ActorMethod<[bigint, string], [] | [FormData]>,
  'getOrganization' : ActorMethod<[bigint], [] | [Organization]>,
  'getTrialBalance' : ActorMethod<[bigint], [] | [TrialBalance]>,
  'getUserPreferences' : ActorMethod<[], UserPreferences>,
  'listAdjustments' : ActorMethod<[], Array<[bigint, Adjustment]>>,
  'listEngagements' : ActorMethod<[], Array<[bigint, Engagement]>>,
  'listFinancialStatements' : ActorMethod<
    [],
    Array<[bigint, FinancialStatement]>
  >,
  'listFormData' : ActorMethod<[bigint], Array<FormData>>,
  'listOrganizations' : ActorMethod<[], Array<[bigint, Organization]>>,
  'listTrialBalances' : ActorMethod<[], Array<[bigint, TrialBalance]>>,
  'listUsers' : ActorMethod<[], Array<[Principal, User]>>,
  'saveFormData' : ActorMethod<
    [bigint, string, string, FormStatus],
    ApiResult_4
  >,
  'updateAdjustmentStatus' : ActorMethod<[bigint, AjeStatus], ApiResult_6>,
  'updateEngagement' : ActorMethod<
    [bigint, UpdateEngagementRequest],
    ApiResult_5
  >,
  'updateFormStatus' : ActorMethod<[bigint, string, FormStatus], ApiResult_4>,
  'updateTrialBalanceAccounts' : ActorMethod<
    [bigint, Array<TrialBalanceAccount>],
    ApiResult_3
  >,
  'updateUserPreferences' : ActorMethod<[UserPreferences], ApiResult_2>,
  'updateUserRole' : ActorMethod<[Principal, UserRole], ApiResult_1>,
  'validateTrialBalance' : ActorMethod<[bigint], ApiResult>,
  'verifyAuditTrailIntegrity' : ActorMethod<[], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
