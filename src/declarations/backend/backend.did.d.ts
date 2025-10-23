import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AccountData {
  'entity' : string,
  'opening_debit' : number,
  'period_credit' : number,
  'account_number' : string,
  'currency' : string,
  'notes' : string,
  'period_debit' : number,
  'opening_credit' : number,
  'ytd_debit' : number,
  'ytd_credit' : number,
  'department' : string,
  'account_name' : string,
  'project' : string,
}
export interface ActivityLogEntry {
  'id' : bigint,
  'principal' : Principal,
  'action' : string,
  'resource_type' : string,
  'timestamp' : bigint,
  'resource_id' : string,
  'details' : string,
}
export interface Client {
  'id' : bigint,
  'name' : string,
  'contact_email' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'address' : string,
  'contact_phone' : string,
}
export interface ColumnMapping {
  'entity' : [] | [string],
  'opening_debit' : [] | [string],
  'period_credit' : [] | [string],
  'account_number' : [] | [string],
  'currency' : [] | [string],
  'notes' : [] | [string],
  'period_debit' : [] | [string],
  'opening_credit' : [] | [string],
  'ytd_debit' : [] | [string],
  'ytd_credit' : [] | [string],
  'department' : [] | [string],
  'account_name' : [] | [string],
  'project' : [] | [string],
}
export interface ColumnMetadata {
  'max_value' : string,
  'pii_detection' : PIIDetection,
  'unique_count' : bigint,
  'name' : string,
  'min_value' : string,
  'detected_type' : ColumnType,
  'sample_values' : Array<string>,
  'original_name' : string,
  'null_percent' : number,
}
export type ColumnType = { 'Date' : null } |
  { 'Text' : null } |
  { 'Boolean' : null } |
  { 'Currency' : null } |
  { 'Numeric' : null };
export interface CreateClientRequest {
  'name' : string,
  'contact_email' : string,
  'address' : string,
  'contact_phone' : string,
}
export interface CreateEngagementRequest {
  'status' : string,
  'link' : EngagementLink,
  'name' : string,
  'description' : string,
  'end_date' : bigint,
  'start_date' : bigint,
}
export interface CreateEntityRequest {
  'name' : string,
  'taxonomy_config' : string,
  'description' : string,
  'organization_id' : bigint,
  'taxonomy' : [] | [XBRLTaxonomy],
}
export interface CreateOrganizationRequest {
  'name' : string,
  'description' : string,
}
export interface CreateWorkingPaperRequest {
  'dataset_id' : bigint,
  'column_mapping' : ColumnMapping,
  'name' : string,
  'selected_accounts' : Array<string>,
  'engagement_id' : bigint,
}
export interface Document {
  'id' : bigint,
  'name' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'file_size' : bigint,
  'file_type' : string,
  'access_principals' : Array<Principal>,
  'data_chunks' : Array<Uint8Array | number[]>,
  'category' : string,
  'entity_id' : [] | [bigint],
  'organization_id' : [] | [bigint],
}
export interface Engagement {
  'id' : bigint,
  'status' : string,
  'link' : EngagementLink,
  'name' : string,
  'description' : string,
  'end_date' : bigint,
  'created_at' : bigint,
  'created_by' : Principal,
  'start_date' : bigint,
}
export type EngagementLink = { 'Entity' : bigint } |
  { 'Client' : bigint } |
  { 'Organization' : bigint };
export interface Entity {
  'id' : bigint,
  'name' : string,
  'taxonomy_config' : string,
  'description' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'organization_id' : bigint,
  'taxonomy' : [] | [XBRLTaxonomy],
}
export interface FinancialRatio {
  'value' : number,
  'name' : string,
  'formula' : string,
}
export interface ImportExcelRequest {
  'name' : string,
  'file_data' : Uint8Array | number[],
  'file_name' : string,
  'engagement_id' : [] | [bigint],
}
export interface ImportedDataset {
  'id' : bigint,
  'sheets' : Array<SheetData>,
  'name' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'file_name' : string,
  'file_size' : bigint,
  'version' : number,
  'engagement_id' : [] | [bigint],
}
export interface Leadsheet {
  'closing_balance' : number,
  'opening_balance' : number,
  'created_at' : bigint,
  'adjustments' : number,
  'accounts' : Array<AccountData>,
}
export interface Organization {
  'id' : bigint,
  'name' : string,
  'description' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'entity_ids' : BigUint64Array | bigint[],
}
export interface PIIDetection {
  'has_national_ids' : boolean,
  'has_emails' : boolean,
  'has_names' : boolean,
  'has_phone_numbers' : boolean,
}
export type Result = { 'Ok' : Client } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : Engagement } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : Document } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : Array<Client> } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : Array<ImportedDataset> } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : Array<Document> } |
  { 'Err' : string };
export type Result_14 = { 'Ok' : Array<Engagement> } |
  { 'Err' : string };
export type Result_15 = { 'Ok' : Array<Entity> } |
  { 'Err' : string };
export type Result_16 = { 'Ok' : Array<Organization> } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : Array<User> } |
  { 'Err' : string };
export type Result_18 = { 'Ok' : Array<WorkingPaper> } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : Entity } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : Organization } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : WorkingPaper } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Array<ActivityLogEntry> } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : User } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : ImportedDataset } |
  { 'Err' : string };
export interface SheetData {
  'data' : Array<Array<string>>,
  'name' : string,
  'row_count' : bigint,
  'columns' : Array<ColumnMetadata>,
}
export interface TrendAnalysis {
  'prior_value' : number,
  'change_percent' : number,
  'period_name' : string,
  'change' : number,
  'current_value' : number,
}
export interface UpdateClientRequest {
  'id' : bigint,
  'name' : string,
  'contact_email' : string,
  'address' : string,
  'contact_phone' : string,
}
export interface UpdateEngagementRequest {
  'id' : bigint,
  'status' : string,
  'name' : string,
  'description' : string,
  'end_date' : bigint,
  'start_date' : bigint,
}
export interface UpdateEntityRequest {
  'id' : bigint,
  'name' : string,
  'taxonomy_config' : string,
  'description' : string,
  'taxonomy' : [] | [XBRLTaxonomy],
}
export interface UpdateOrganizationRequest {
  'id' : bigint,
  'name' : string,
  'description' : string,
}
export interface UploadDocumentRequest {
  'name' : string,
  'file_data' : Uint8Array | number[],
  'file_type' : string,
  'category' : string,
  'entity_id' : [] | [bigint],
  'organization_id' : [] | [bigint],
}
export interface User {
  'principal' : Principal,
  'name' : string,
  'role' : UserRole,
  'created_at' : bigint,
  'email' : string,
  'language_preference' : string,
}
export type UserRole = { 'Staff' : null } |
  { 'ClientUser' : null } |
  { 'Senior' : null } |
  { 'Admin' : null } |
  { 'Partner' : null } |
  { 'Manager' : null };
export interface VarianceAnalysis {
  'actual' : number,
  'variance_percent' : number,
  'expected' : number,
  'item_name' : string,
  'variance' : number,
}
export interface WorkingPaper {
  'id' : bigint,
  'linked_document_ids' : BigUint64Array | bigint[],
  'dataset_id' : bigint,
  'column_mapping' : ColumnMapping,
  'name' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'variance_analysis' : Array<VarianceAnalysis>,
  'engagement_id' : bigint,
  'ratios' : Array<FinancialRatio>,
  'leadsheet' : [] | [Leadsheet],
  'trend_analysis' : Array<TrendAnalysis>,
}
export type XBRLTaxonomy = { 'IFRS' : null } |
  { 'Custom' : string } |
  { 'USGAAP' : null };
export interface _SERVICE {
  'create_client' : ActorMethod<[CreateClientRequest], Result>,
  'create_engagement' : ActorMethod<[CreateEngagementRequest], Result_1>,
  'create_entity' : ActorMethod<[CreateEntityRequest], Result_2>,
  'create_organization' : ActorMethod<[CreateOrganizationRequest], Result_3>,
  'create_working_paper' : ActorMethod<[CreateWorkingPaperRequest], Result_4>,
  'delete_client' : ActorMethod<[bigint], Result_5>,
  'delete_document' : ActorMethod<[bigint], Result_5>,
  'delete_engagement' : ActorMethod<[bigint], Result_5>,
  'delete_entity' : ActorMethod<[bigint], Result_5>,
  'delete_organization' : ActorMethod<[bigint], Result_5>,
  'download_document' : ActorMethod<[bigint], Result_6>,
  'get_activity_logs' : ActorMethod<[[] | [bigint]], Result_7>,
  'get_client' : ActorMethod<[bigint], Result>,
  'get_current_user' : ActorMethod<[], Result_8>,
  'get_dataset' : ActorMethod<[bigint], Result_9>,
  'get_document' : ActorMethod<[bigint], Result_10>,
  'get_engagement' : ActorMethod<[bigint], Result_1>,
  'get_entity' : ActorMethod<[bigint], Result_2>,
  'get_organization' : ActorMethod<[bigint], Result_3>,
  'get_resource_activity_logs' : ActorMethod<
    [string, string, [] | [bigint]],
    Result_7
  >,
  'get_user_activity_logs' : ActorMethod<[Principal, [] | [bigint]], Result_7>,
  'get_working_paper' : ActorMethod<[bigint], Result_4>,
  'grant_document_access' : ActorMethod<[bigint, Principal], Result_5>,
  'import_excel' : ActorMethod<[ImportExcelRequest], Result_9>,
  'link_document_to_working_paper' : ActorMethod<[bigint, bigint], Result_5>,
  'list_clients' : ActorMethod<[], Result_11>,
  'list_datasets' : ActorMethod<[], Result_12>,
  'list_datasets_by_engagement' : ActorMethod<[bigint], Result_12>,
  'list_documents' : ActorMethod<[], Result_13>,
  'list_documents_by_entity' : ActorMethod<[bigint], Result_13>,
  'list_documents_by_organization' : ActorMethod<[bigint], Result_13>,
  'list_engagements' : ActorMethod<[], Result_14>,
  'list_engagements_by_client' : ActorMethod<[bigint], Result_14>,
  'list_engagements_by_entity' : ActorMethod<[bigint], Result_14>,
  'list_engagements_by_organization' : ActorMethod<[bigint], Result_14>,
  'list_entities' : ActorMethod<[], Result_15>,
  'list_entities_by_organization' : ActorMethod<[bigint], Result_15>,
  'list_organizations' : ActorMethod<[], Result_16>,
  'list_users' : ActorMethod<[], Result_17>,
  'list_working_papers_by_engagement' : ActorMethod<[bigint], Result_18>,
  'revoke_document_access' : ActorMethod<[bigint, Principal], Result_5>,
  'update_client' : ActorMethod<[UpdateClientRequest], Result>,
  'update_engagement' : ActorMethod<[UpdateEngagementRequest], Result_1>,
  'update_entity' : ActorMethod<[UpdateEntityRequest], Result_2>,
  'update_organization' : ActorMethod<[UpdateOrganizationRequest], Result_3>,
  'update_user_language' : ActorMethod<[string], Result_5>,
  'update_user_role' : ActorMethod<[Principal, UserRole], Result_5>,
  'upload_document' : ActorMethod<[UploadDocumentRequest], Result_10>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
