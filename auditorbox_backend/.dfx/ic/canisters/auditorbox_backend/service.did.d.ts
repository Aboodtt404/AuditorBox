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
export type ApiResult = { 'ok' : null } |
  { 'err' : string };
export type ApiResult_1 = { 'ok' : Adjustment } |
  { 'err' : string };
export type ApiResult_2 = { 'ok' : TrialBalance } |
  { 'err' : string };
export type ApiResult_3 = { 'ok' : Organization } |
  { 'err' : string };
export type ApiResult_4 = { 'ok' : FinancialStatement } |
  { 'err' : string };
export type ApiResult_5 = { 'ok' : Engagement } |
  { 'err' : string };
export type ApiResult_6 = { 'ok' : User } |
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
  'endDate' : bigint,
  'link' : EngagementLink,
  'name' : string,
  'description' : string,
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
  'status' : EngagementStatus,
  'endDate' : bigint,
  'link' : EngagementLink,
  'name' : string,
  'createdAt' : bigint,
  'createdBy' : Principal,
  'description' : string,
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
export interface Organization {
  'id' : bigint,
  'name' : string,
  'createdAt' : bigint,
  'createdBy' : Principal,
  'description' : string,
  'entityIds' : Array<bigint>,
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
export interface User {
  'languagePreference' : string,
  'principal' : Principal,
  'name' : string,
  'createdAt' : bigint,
  'role' : UserRole,
  'email' : string,
  'profileCompleted' : boolean,
}
export type UserRole = { 'Staff' : null } |
  { 'ClientUser' : null } |
  { 'Senior' : null } |
  { 'Admin' : null } |
  { 'Partner' : null } |
  { 'Manager' : null };
export type XBRLTaxonomy = { 'EAS' : null } |
  { 'GCC' : null } |
  { 'IFRS' : null } |
  { 'Custom' : string };
export interface _SERVICE {
  'completeProfile' : ActorMethod<[CompleteProfileRequest], ApiResult_6>,
  'createAdjustment' : ActorMethod<[CreateAjeRequest], ApiResult_1>,
  'createEngagement' : ActorMethod<[CreateEngagementRequest], ApiResult_5>,
  'createFinancialStatement' : ActorMethod<
    [bigint, bigint, XBRLTaxonomy, string],
    ApiResult_4
  >,
  'createOrganization' : ActorMethod<[string, string], ApiResult_3>,
  'createTrialBalance' : ActorMethod<[CreateTrialBalanceRequest], ApiResult_2>,
  'getAdjustment' : ActorMethod<[bigint], [] | [Adjustment]>,
  'getAuditTrail' : ActorMethod<[], Array<AuditTrailEntry>>,
  'getCurrentUser' : ActorMethod<[], [] | [User]>,
  'getEngagement' : ActorMethod<[bigint], [] | [Engagement]>,
  'getFinancialStatement' : ActorMethod<[bigint], [] | [FinancialStatement]>,
  'getOrganization' : ActorMethod<[bigint], [] | [Organization]>,
  'getTrialBalance' : ActorMethod<[bigint], [] | [TrialBalance]>,
  'listAdjustments' : ActorMethod<[], Array<[bigint, Adjustment]>>,
  'listEngagements' : ActorMethod<[], Array<[bigint, Engagement]>>,
  'listFinancialStatements' : ActorMethod<
    [],
    Array<[bigint, FinancialStatement]>
  >,
  'listOrganizations' : ActorMethod<[], Array<[bigint, Organization]>>,
  'listTrialBalances' : ActorMethod<[], Array<[bigint, TrialBalance]>>,
  'listUsers' : ActorMethod<[], Array<[Principal, User]>>,
  'updateAdjustmentStatus' : ActorMethod<[bigint, AjeStatus], ApiResult_1>,
  'updateUserRole' : ActorMethod<[Principal, UserRole], ApiResult>,
  'verifyAuditTrailIntegrity' : ActorMethod<[], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
