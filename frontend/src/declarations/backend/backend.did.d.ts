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
export type AccountType = { 'Asset' : null } |
  { 'Liability' : null } |
  { 'Revenue' : null } |
  { 'Expense' : null } |
  { 'Equity' : null };
export interface ActivityLogEntry {
  'id' : bigint,
  'principal' : Principal,
  'signature' : string,
  'action' : string,
  'previous_hash' : string,
  'resource_type' : string,
  'timestamp' : bigint,
  'resource_id' : string,
  'data_hash' : string,
  'details' : string,
  'block_height' : bigint,
}
export interface AdjustingJournalEntry {
  'id' : bigint,
  'status' : AjeStatus,
  'trial_balance_id' : bigint,
  'blockchain_signature' : string,
  'approved_at' : [] | [bigint],
  'approved_by' : [] | [Principal],
  'reviewed_at' : [] | [bigint],
  'reviewed_by' : [] | [Principal],
  'description' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'blockchain_hash' : string,
  'engagement_id' : bigint,
  'amount' : bigint,
  'aje_number' : string,
}
export interface AjeBlockchainVerification {
  'status' : string,
  'aje_id' : bigint,
  'blockchain_signature' : string,
  'computed_hash' : string,
  'is_valid' : boolean,
  'approved_at' : [] | [bigint],
  'approved_by' : [] | [Principal],
  'created_at' : bigint,
  'created_by' : Principal,
  'blockchain_hash' : string,
  'verified_at' : bigint,
  'verified_by' : Principal,
}
export interface AjeLineItem {
  'id' : bigint,
  'account_id' : bigint,
  'aje_id' : bigint,
  'description' : string,
  'account_number' : string,
  'debit_amount' : bigint,
  'credit_amount' : bigint,
  'account_name' : string,
}
export type AjeStatus = { 'Posted' : null } |
  { 'Approved' : null } |
  { 'Draft' : null } |
  { 'Rejected' : null } |
  { 'Proposed' : null } |
  { 'Reviewed' : null };
export interface ApplyTemplateRequest {
  'name' : [] | [string],
  'template_id' : bigint,
  'engagement_id' : bigint,
}
export interface ApproveDocumentInput {
  'request_id' : bigint,
  'approved' : boolean,
  'rejection_reason' : [] | [string],
}
export interface AuditTemplate {
  'id' : bigint,
  'is_public' : boolean,
  'updated_at' : bigint,
  'name' : string,
  'description' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'checklist_items' : Array<ChecklistItem>,
  'template_type' : TemplateType,
  'is_default' : boolean,
  'firm_id' : [] | [bigint],
}
export interface BlockchainProof {
  'signature' : string,
  'previous_hash' : string,
  'timestamp' : bigint,
  'data_hash' : string,
  'entry_id' : bigint,
  'block_height' : bigint,
}
export interface ChecklistItem {
  'id' : string,
  'title' : string,
  'estimated_hours' : [] | [number],
  'order' : number,
  'is_required' : boolean,
  'reference' : [] | [string],
  'section' : string,
  'description' : string,
}
export interface ChecklistItemInstance {
  'status' : ChecklistItemStatus,
  'title' : string,
  'order' : number,
  'section' : string,
  'description' : string,
  'assigned_to' : [] | [Principal],
  'notes' : string,
  'actual_hours' : [] | [number],
  'completed_at' : [] | [bigint],
  'completed_by' : [] | [Principal],
  'item_id' : string,
}
export type ChecklistItemStatus = { 'NotApplicable' : null } |
  { 'InProgress' : null } |
  { 'Completed' : null } |
  { 'NotStarted' : null };
export interface Client {
  'id' : bigint,
  'name' : string,
  'contact_email' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'address' : string,
  'contact_phone' : string,
}
export interface ClientAccess {
  'principal' : Principal,
  'access_level' : ClientAccessLevel,
  'granted_at' : bigint,
  'granted_by' : Principal,
  'engagement_id' : bigint,
}
export type ClientAccessLevel = { 'Full' : null } |
  { 'UploadDocuments' : null } |
  { 'ViewOnly' : null };
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
export interface CreateAjeLineItemRequest {
  'account_id' : bigint,
  'description' : string,
  'debit_amount' : bigint,
  'credit_amount' : bigint,
}
export interface CreateAjeRequest {
  'trial_balance_id' : bigint,
  'line_items' : Array<CreateAjeLineItemRequest>,
  'description' : string,
  'engagement_id' : bigint,
  'aje_number' : string,
}
export interface CreateClientRequest {
  'name' : string,
  'contact_email' : string,
  'address' : string,
  'contact_phone' : string,
}
export interface CreateDocumentRequestInput {
  'title' : string,
  'is_required' : boolean,
  'requested_from_principal' : [] | [Principal],
  'description' : string,
  'engagement_id' : bigint,
  'category' : string,
  'due_date' : [] | [bigint],
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
export interface CreateTemplateRequest {
  'is_public' : boolean,
  'name' : string,
  'description' : string,
  'checklist_items' : Array<ChecklistItem>,
  'template_type' : TemplateType,
  'firm_id' : [] | [bigint],
}
export interface CreateTrialBalanceRequest {
  'description' : string,
  'currency' : [] | [string],
  'engagement_id' : bigint,
  'period_end_date' : string,
}
export interface CreateWorkingPaperRequest {
  'dataset_id' : bigint,
  'column_mapping' : ColumnMapping,
  'name' : string,
  'selected_accounts' : Array<string>,
  'engagement_id' : bigint,
}
export interface CsvAccountRow {
  'debit_balance' : bigint,
  'credit_balance' : bigint,
  'account_number' : string,
  'account_name' : string,
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
export interface DocumentRequest {
  'id' : bigint,
  'status' : DocumentRequestStatus,
  'title' : string,
  'is_required' : boolean,
  'fulfilled_document_id' : [] | [bigint],
  'requested_from_principal' : [] | [Principal],
  'description' : string,
  'created_at' : bigint,
  'requested_by' : Principal,
  'engagement_id' : bigint,
  'category' : string,
  'due_date' : [] | [bigint],
  'fulfilled_at' : [] | [bigint],
}
export type DocumentRequestStatus = { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Uploaded' : null } |
  { 'Cancelled' : null } |
  { 'Pending' : null };
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
export interface EngagementChecklist {
  'id' : bigint,
  'name' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'template_id' : bigint,
  'engagement_id' : bigint,
  'items' : Array<ChecklistItemInstance>,
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
export interface FulfillDocumentRequestInput {
  'request_id' : bigint,
  'document_name' : string,
  'file_data' : Uint8Array | number[],
  'file_type' : string,
  'category' : string,
}
export interface GrantClientAccessRequest {
  'access_level' : ClientAccessLevel,
  'client_principal' : Principal,
  'engagement_id' : bigint,
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
export type Result = { 'Ok' : TrialBalanceAccount } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : EngagementChecklist } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : WorkingPaper } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : Array<ActivityLogEntry> } |
  { 'Err' : string };
export type Result_14 = { 'Ok' : Array<AjeLineItem> } |
  { 'Err' : string };
export type Result_15 = { 'Ok' : BlockchainProof } |
  { 'Err' : string };
export type Result_16 = { 'Ok' : Array<ClientAccess> } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : User } |
  { 'Err' : string };
export type Result_18 = { 'Ok' : ImportedDataset } |
  { 'Err' : string };
export type Result_19 = { 'Ok' : Document } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : AdjustingJournalEntry } |
  { 'Err' : string };
export type Result_20 = { 'Ok' : Array<DocumentRequest> } |
  { 'Err' : string };
export type Result_21 = { 'Ok' : Array<EngagementChecklist> } |
  { 'Err' : string };
export type Result_22 = { 'Ok' : Array<TrialBalanceAccount> } |
  { 'Err' : string };
export type Result_23 = { 'Ok' : ClientAccess } |
  { 'Err' : string };
export type Result_24 = { 'Ok' : Array<AdjustingJournalEntry> } |
  { 'Err' : string };
export type Result_25 = { 'Ok' : Array<Client> } |
  { 'Err' : string };
export type Result_26 = { 'Ok' : Array<ImportedDataset> } |
  { 'Err' : string };
export type Result_27 = { 'Ok' : Array<Document> } |
  { 'Err' : string };
export type Result_28 = { 'Ok' : Array<Engagement> } |
  { 'Err' : string };
export type Result_29 = { 'Ok' : Array<Entity> } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : DocumentRequest } |
  { 'Err' : string };
export type Result_30 = { 'Ok' : Array<Organization> } |
  { 'Err' : string };
export type Result_31 = { 'Ok' : Array<AuditTemplate> } |
  { 'Err' : string };
export type Result_32 = { 'Ok' : Array<TrialBalance> } |
  { 'Err' : string };
export type Result_33 = { 'Ok' : Array<User> } |
  { 'Err' : string };
export type Result_34 = { 'Ok' : Array<WorkingPaper> } |
  { 'Err' : string };
export type Result_35 = { 'Ok' : TrialBalanceValidation } |
  { 'Err' : string };
export type Result_36 = { 'Ok' : VerificationResult } |
  { 'Err' : string };
export type Result_37 = { 'Ok' : AjeBlockchainVerification } |
  { 'Err' : string };
export type Result_38 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : Client } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : Engagement } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : Entity } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Organization } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : AuditTemplate } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : TrialBalance } |
  { 'Err' : string };
export interface SheetData {
  'data' : Array<Array<string>>,
  'name' : string,
  'row_count' : bigint,
  'columns' : Array<ColumnMetadata>,
}
export type TemplateType = { 'Review' : null } |
  { 'Compilation' : null } |
  { 'Custom' : null } |
  { 'Audit' : null } |
  { 'TaxPreparation' : null };
export interface TrendAnalysis {
  'prior_value' : number,
  'change_percent' : number,
  'period_name' : string,
  'change' : number,
  'current_value' : number,
}
export interface TrialBalance {
  'id' : bigint,
  'last_modified_at' : bigint,
  'last_modified_by' : Principal,
  'description' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'is_adjusted' : boolean,
  'currency' : string,
  'engagement_id' : bigint,
  'period_end_date' : string,
}
export interface TrialBalanceAccount {
  'id' : bigint,
  'trial_balance_id' : bigint,
  'fs_line_item' : [] | [string],
  'is_reconciled' : boolean,
  'debit_balance' : bigint,
  'created_at' : bigint,
  'created_by' : Principal,
  'credit_balance' : bigint,
  'account_number' : string,
  'notes' : string,
  'account_name' : string,
  'account_type' : AccountType,
}
export interface TrialBalanceValidation {
  'trial_balance_id' : bigint,
  'account_count' : bigint,
  'difference' : bigint,
  'is_balanced' : boolean,
  'issues' : Array<string>,
  'total_credits' : bigint,
  'validated_at' : bigint,
  'validated_by' : Principal,
  'total_debits' : bigint,
}
export interface UpdateAccountRequest {
  'fs_line_item' : [] | [string],
  'debit_balance' : bigint,
  'credit_balance' : bigint,
  'account_number' : string,
  'notes' : [] | [string],
  'account_name' : string,
  'account_type' : AccountType,
}
export interface UpdateChecklistItemRequest {
  'status' : [] | [ChecklistItemStatus],
  'checklist_id' : bigint,
  'assigned_to' : [] | [Principal],
  'notes' : [] | [string],
  'actual_hours' : [] | [number],
  'item_id' : string,
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
export interface VerificationResult {
  'is_valid' : boolean,
  'message' : string,
  'timestamp' : bigint,
  'data_hash' : string,
  'chain_integrity' : boolean,
  'entry_id' : bigint,
  'block_height' : bigint,
  'verification_timestamp' : bigint,
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
  'add_trial_balance_account' : ActorMethod<
    [bigint, UpdateAccountRequest],
    Result
  >,
  'apply_template_to_engagement' : ActorMethod<
    [ApplyTemplateRequest],
    Result_1
  >,
  'approve_aje' : ActorMethod<[bigint], Result_2>,
  'approve_document_request' : ActorMethod<[ApproveDocumentInput], Result_3>,
  'create_aje' : ActorMethod<[CreateAjeRequest], Result_2>,
  'create_client' : ActorMethod<[CreateClientRequest], Result_4>,
  'create_document_request' : ActorMethod<
    [CreateDocumentRequestInput],
    Result_3
  >,
  'create_engagement' : ActorMethod<[CreateEngagementRequest], Result_5>,
  'create_entity' : ActorMethod<[CreateEntityRequest], Result_6>,
  'create_organization' : ActorMethod<[CreateOrganizationRequest], Result_7>,
  'create_template' : ActorMethod<[CreateTemplateRequest], Result_8>,
  'create_trial_balance' : ActorMethod<[CreateTrialBalanceRequest], Result_9>,
  'create_working_paper' : ActorMethod<[CreateWorkingPaperRequest], Result_10>,
  'delete_client' : ActorMethod<[bigint], Result_11>,
  'delete_document' : ActorMethod<[bigint], Result_11>,
  'delete_engagement' : ActorMethod<[bigint], Result_11>,
  'delete_entity' : ActorMethod<[bigint], Result_11>,
  'delete_organization' : ActorMethod<[bigint], Result_11>,
  'download_document' : ActorMethod<[bigint], Result_12>,
  'fulfill_document_request' : ActorMethod<
    [FulfillDocumentRequestInput],
    Result_3
  >,
  'get_activity_logs' : ActorMethod<[[] | [bigint]], Result_13>,
  'get_aje' : ActorMethod<[bigint], Result_2>,
  'get_aje_line_items' : ActorMethod<[bigint], Result_14>,
  'get_blockchain_proof' : ActorMethod<[bigint], Result_15>,
  'get_client' : ActorMethod<[bigint], Result_4>,
  'get_client_access_for_engagement' : ActorMethod<[bigint], Result_16>,
  'get_current_user' : ActorMethod<[], Result_17>,
  'get_dataset' : ActorMethod<[bigint], Result_18>,
  'get_document' : ActorMethod<[bigint], Result_19>,
  'get_document_requests_for_engagement' : ActorMethod<[bigint], Result_20>,
  'get_engagement' : ActorMethod<[bigint], Result_5>,
  'get_engagement_checklists' : ActorMethod<[bigint], Result_21>,
  'get_entity' : ActorMethod<[bigint], Result_6>,
  'get_my_document_requests' : ActorMethod<[], Result_20>,
  'get_organization' : ActorMethod<[bigint], Result_7>,
  'get_resource_activity_logs' : ActorMethod<
    [string, string, [] | [bigint]],
    Result_13
  >,
  'get_template' : ActorMethod<[bigint], Result_8>,
  'get_trial_balance' : ActorMethod<[bigint], Result_9>,
  'get_trial_balance_accounts' : ActorMethod<[bigint], Result_22>,
  'get_user_activity_logs' : ActorMethod<[Principal, [] | [bigint]], Result_13>,
  'get_working_paper' : ActorMethod<[bigint], Result_10>,
  'grant_client_access' : ActorMethod<[GrantClientAccessRequest], Result_23>,
  'grant_document_access' : ActorMethod<[bigint, Principal], Result_11>,
  'import_excel' : ActorMethod<[ImportExcelRequest], Result_18>,
  'import_trial_balance_csv' : ActorMethod<
    [bigint, string, Array<CsvAccountRow>],
    Result_9
  >,
  'link_document_to_working_paper' : ActorMethod<[bigint, bigint], Result_11>,
  'list_ajes_by_engagement' : ActorMethod<[bigint], Result_24>,
  'list_clients' : ActorMethod<[], Result_25>,
  'list_datasets' : ActorMethod<[], Result_26>,
  'list_datasets_by_engagement' : ActorMethod<[bigint], Result_26>,
  'list_documents' : ActorMethod<[], Result_27>,
  'list_documents_by_entity' : ActorMethod<[bigint], Result_27>,
  'list_documents_by_organization' : ActorMethod<[bigint], Result_27>,
  'list_engagements' : ActorMethod<[], Result_28>,
  'list_engagements_by_client' : ActorMethod<[bigint], Result_28>,
  'list_engagements_by_entity' : ActorMethod<[bigint], Result_28>,
  'list_engagements_by_organization' : ActorMethod<[bigint], Result_28>,
  'list_entities' : ActorMethod<[], Result_29>,
  'list_entities_by_organization' : ActorMethod<[bigint], Result_29>,
  'list_organizations' : ActorMethod<[], Result_30>,
  'list_templates' : ActorMethod<[], Result_31>,
  'list_trial_balances_by_engagement' : ActorMethod<[bigint], Result_32>,
  'list_users' : ActorMethod<[], Result_33>,
  'list_working_papers_by_engagement' : ActorMethod<[bigint], Result_34>,
  'map_account_to_fs_line' : ActorMethod<[bigint, string], Result>,
  'post_aje' : ActorMethod<[bigint], Result_2>,
  'review_aje' : ActorMethod<[bigint, boolean], Result_2>,
  'revoke_document_access' : ActorMethod<[bigint, Principal], Result_11>,
  'submit_aje' : ActorMethod<[bigint], Result_2>,
  'update_checklist_item' : ActorMethod<[UpdateChecklistItemRequest], Result_1>,
  'update_client' : ActorMethod<[UpdateClientRequest], Result_4>,
  'update_engagement' : ActorMethod<[UpdateEngagementRequest], Result_5>,
  'update_entity' : ActorMethod<[UpdateEntityRequest], Result_6>,
  'update_organization' : ActorMethod<[UpdateOrganizationRequest], Result_7>,
  'update_user_email' : ActorMethod<[string], Result_11>,
  'update_user_language' : ActorMethod<[string], Result_11>,
  'update_user_name' : ActorMethod<[string], Result_11>,
  'update_user_role' : ActorMethod<[Principal, UserRole], Result_11>,
  'upload_document' : ActorMethod<[UploadDocumentRequest], Result_19>,
  'validate_trial_balance' : ActorMethod<[bigint], Result_35>,
  'verify_activity_log' : ActorMethod<[bigint], Result_36>,
  'verify_aje_blockchain' : ActorMethod<[bigint], Result_37>,
  'verify_blockchain_chain' : ActorMethod<[], Result_38>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
