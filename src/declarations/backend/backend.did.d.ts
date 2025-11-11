import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AcceptanceDecision = { 'Rejected' : null } |
  { 'Accepted' : null } |
  { 'RequiresPartnerReview' : null } |
  { 'Pending' : null };
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
  'snapshot' : [] | [Uint8Array | number[]],
  'previous_hash' : string,
  'resource_type' : string,
  'timestamp' : bigint,
  'resource_id' : string,
  'data_hash' : string,
  'details' : string,
  'block_height' : bigint,
}
export interface AddFSNoteRequest {
  'fs_id' : bigint,
  'title' : string,
  'content' : string,
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
  'commercial_registration' : [] | [string],
  'name' : string,
  'contact_email' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'industry_code' : [] | [string],
  'address' : string,
  'contact_phone' : string,
  'tax_registration_number' : [] | [string],
  'name_ar' : [] | [string],
  'entity_id' : [] | [bigint],
  'organization_id' : [] | [bigint],
}
export interface ClientAcceptance {
  'id' : bigint,
  'decision' : AcceptanceDecision,
  'overall_risk' : RiskLevel,
  'reviewed_at' : bigint,
  'reviewed_by' : Principal,
  'partner_approved_at' : [] | [bigint],
  'partner_approved_by' : [] | [Principal],
  'created_at' : bigint,
  'created_by' : Principal,
  'questionnaire' : ClientAcceptanceQuestionnaire,
  'client_id' : bigint,
  'decision_rationale' : string,
}
export interface ClientAcceptanceQuestionnaire {
  'management_integrity_risk' : RiskLevel,
  'resources_available' : boolean,
  'independence_threats' : boolean,
  'fee_collection_risk' : RiskLevel,
  'regulatory_complexity_risk' : RiskLevel,
  'conflicts_of_interest' : boolean,
  'notes' : string,
  'financial_stability_risk' : RiskLevel,
  'industry_risk' : RiskLevel,
  'technical_expertise_available' : boolean,
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
export interface CompleteProfileRequest {
  'requested_role' : UserRole,
  'name' : string,
  'email' : string,
}
export interface ConflictCheck {
  'id' : bigint,
  'related_parties' : Array<string>,
  'created_at' : bigint,
  'created_by' : Principal,
  'conflict_details' : Array<string>,
  'conflicts_found' : boolean,
  'cleared' : boolean,
  'cleared_at' : [] | [bigint],
  'cleared_by' : [] | [Principal],
  'resolution_notes' : string,
  'client_id' : bigint,
}
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
export interface CreateBudgetRequest {
  'total_budgeted_hours' : number,
  'partner_rate' : number,
  'manager_rate' : number,
  'senior_rate' : number,
  'staff_hours' : number,
  'engagement_id' : bigint,
  'partner_hours' : number,
  'manager_hours' : number,
  'staff_rate' : number,
  'senior_hours' : number,
}
export interface CreateClientAcceptanceRequest {
  'questionnaire' : ClientAcceptanceQuestionnaire,
  'client_id' : bigint,
  'decision_rationale' : string,
}
export interface CreateClientRequest {
  'commercial_registration' : [] | [string],
  'name' : string,
  'contact_email' : string,
  'industry_code' : [] | [string],
  'address' : string,
  'contact_phone' : string,
  'tax_registration_number' : [] | [string],
  'name_ar' : [] | [string],
  'entity_id' : [] | [bigint],
  'organization_id' : [] | [bigint],
}
export interface CreateConflictCheckRequest {
  'potential_conflicts' : Array<string>,
  'related_parties' : Array<string>,
  'resolution_notes' : string,
  'client_id' : bigint,
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
export interface CreateEngagementFromTemplateRequest {
  'manager_in_charge' : [] | [Principal],
  'client_acceptance_id' : [] | [bigint],
  'engagement_letter_id' : [] | [bigint],
  'partner_in_charge' : [] | [Principal],
  'link' : EngagementLink,
  'name' : string,
  'description' : string,
  'end_date' : bigint,
  'template_id' : bigint,
  'start_date' : bigint,
  'prior_year_engagement_id' : [] | [bigint],
}
export interface CreateEngagementLetterRequest {
  'special_terms' : [] | [string],
  'fee_structure' : string,
  'scope_of_services' : string,
  'estimated_completion_date' : string,
  'engagement_type' : EngagementType,
  'client_id' : bigint,
}
export interface CreateEngagementRequest {
  'status' : string,
  'link' : EngagementLink,
  'name' : string,
  'description' : string,
  'end_date' : bigint,
  'start_date' : bigint,
}
export interface CreateEngagementSetupTemplateRequest {
  'estimated_hours' : number,
  'name' : string,
  'description' : string,
  'required_documents' : Array<string>,
  'default_milestones' : Array<MilestoneTemplate>,
  'engagement_type' : EngagementType,
  'default_procedures' : Array<string>,
}
export interface CreateEntityRequest {
  'name' : string,
  'taxonomy_config' : string,
  'description' : string,
  'organization_id' : bigint,
  'taxonomy' : [] | [XBRLTaxonomy],
}
export interface CreateMilestoneRequest {
  'estimated_hours' : number,
  'name' : string,
  'description' : string,
  'assigned_to' : [] | [Principal],
  'engagement_id' : bigint,
  'due_date' : bigint,
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
export interface CreateTimeEntryRequest {
  'hours' : number,
  'date' : bigint,
  'description' : string,
  'billable' : boolean,
  'engagement_id' : bigint,
  'milestone_id' : [] | [bigint],
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
export interface EngagementBudget {
  'id' : bigint,
  'total_budgeted_hours' : number,
  'partner_rate' : number,
  'manager_rate' : number,
  'created_at' : bigint,
  'created_by' : Principal,
  'senior_rate' : number,
  'staff_hours' : number,
  'total_actual_hours' : number,
  'total_budgeted_fee' : number,
  'last_updated_at' : bigint,
  'total_actual_fee' : number,
  'engagement_id' : bigint,
  'partner_hours' : number,
  'manager_hours' : number,
  'staff_rate' : number,
  'senior_hours' : number,
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
export interface EngagementDashboard {
  'at_risk_milestones' : Array<EngagementMilestone>,
  'budget_utilization' : number,
  'completion_percentage' : number,
  'recent_time_entries' : Array<TimeEntry>,
  'on_schedule' : boolean,
  'budget' : [] | [EngagementBudget],
  'engagement' : Engagement,
  'milestones' : Array<EngagementMilestone>,
}
export interface EngagementLetter {
  'id' : bigint,
  'last_modified_at' : bigint,
  'status' : EngagementLetterStatus,
  'special_terms' : string,
  'signed_by_client_name' : [] | [string],
  'fee_structure' : string,
  'scope_of_services' : string,
  'estimated_completion_date' : string,
  'auditor_responsibilities' : string,
  'management_responsibilities' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'sent_date' : [] | [bigint],
  'signed_date' : [] | [bigint],
  'engagement_id' : [] | [bigint],
  'engagement_type' : EngagementType,
  'client_id' : bigint,
  'limitations_of_engagement' : string,
}
export type EngagementLetterStatus = { 'SentToClient' : null } |
  { 'Draft' : null } |
  { 'Declined' : null } |
  { 'Signed' : null };
export type EngagementLink = { 'Entity' : bigint } |
  { 'Client' : bigint } |
  { 'Organization' : bigint };
export interface EngagementMilestone {
  'id' : bigint,
  'status' : MilestoneStatus,
  'estimated_hours' : number,
  'name' : string,
  'description' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'completed_date' : [] | [bigint],
  'assigned_to' : [] | [Principal],
  'engagement_id' : bigint,
  'actual_hours' : number,
  'dependencies' : BigUint64Array | bigint[],
  'due_date' : bigint,
  'completed_by' : [] | [Principal],
}
export interface EngagementSetupTemplate {
  'id' : bigint,
  'estimated_hours' : number,
  'name' : string,
  'description' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'is_default' : boolean,
  'required_documents' : Array<string>,
  'default_milestones' : Array<MilestoneTemplate>,
  'engagement_type' : EngagementType,
  'default_procedures' : Array<string>,
}
export type EngagementType = { 'Review' : null } |
  { 'Consulting' : null } |
  { 'Compilation' : null } |
  { 'Audit' : null } |
  { 'TaxPreparation' : null } |
  { 'Other' : string };
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
export type FSCategory = { 'Asset' : null } |
  { 'Liability' : null } |
  { 'Revenue' : null } |
  { 'Expense' : null } |
  { 'Equity' : null };
export interface FSLine {
  'mapped_accounts' : BigUint64Array | bigint[],
  'line_item' : FSLineItem,
  'amount' : bigint,
}
export interface FSLineItem {
  'subcategory' : string,
  'order' : bigint,
  'code' : string,
  'name' : string,
  'is_subtotal' : boolean,
  'category' : FSCategory,
  'parent' : [] | [string],
}
export interface FSNote {
  'title' : string,
  'content' : string,
  'created_at' : bigint,
  'created_by' : Principal,
  'note_number' : bigint,
}
export interface FinancialRatio {
  'value' : number,
  'name' : string,
  'formula' : string,
}
export interface FinancialStatement {
  'id' : bigint,
  'trial_balance_id' : bigint,
  'created_at' : bigint,
  'created_by' : Principal,
  'lines' : Array<FSLine>,
  'notes' : Array<FSNote>,
  'engagement_id' : bigint,
  'period_end_date' : string,
  'last_modified' : bigint,
  'taxonomy' : XBRLTaxonomy,
}
export interface FulfillDocumentRequestInput {
  'request_id' : bigint,
  'document_name' : string,
  'file_data' : Uint8Array | number[],
  'file_type' : string,
  'category' : string,
}
export interface GenerateFSRequest {
  'trial_balance_id' : bigint,
  'taxonomy' : XBRLTaxonomy,
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
export type MilestoneStatus = { 'Blocked' : null } |
  { 'Cancelled' : null } |
  { 'InProgress' : null } |
  { 'Completed' : null } |
  { 'NotStarted' : null };
export interface MilestoneTemplate {
  'estimated_hours' : number,
  'name' : string,
  'description' : string,
  'days_from_start' : bigint,
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
export type Result = { 'Ok' : null } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : TrialBalanceAccount } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : Engagement } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : [Engagement, Array<EngagementMilestone>] } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : EngagementLetter } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : EngagementSetupTemplate } |
  { 'Err' : string };
export type Result_14 = { 'Ok' : Entity } |
  { 'Err' : string };
export type Result_15 = { 'Ok' : EngagementMilestone } |
  { 'Err' : string };
export type Result_16 = { 'Ok' : Organization } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : AuditTemplate } |
  { 'Err' : string };
export type Result_18 = { 'Ok' : TimeEntry } |
  { 'Err' : string };
export type Result_19 = { 'Ok' : TrialBalance } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : EngagementChecklist } |
  { 'Err' : string };
export type Result_20 = { 'Ok' : WorkingPaper } |
  { 'Err' : string };
export type Result_21 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_22 = { 'Ok' : FinancialStatement } |
  { 'Err' : string };
export type Result_23 = { 'Ok' : Array<ActivityLogEntry> } |
  { 'Err' : string };
export type Result_24 = { 'Ok' : Array<AjeLineItem> } |
  { 'Err' : string };
export type Result_25 = { 'Ok' : BlockchainProof } |
  { 'Err' : string };
export type Result_26 = { 'Ok' : Array<ClientAccess> } |
  { 'Err' : string };
export type Result_27 = { 'Ok' : ImportedDataset } |
  { 'Err' : string };
export type Result_28 = { 'Ok' : Document } |
  { 'Err' : string };
export type Result_29 = { 'Ok' : Array<DocumentRequest> } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : AdjustingJournalEntry } |
  { 'Err' : string };
export type Result_30 = { 'Ok' : Array<EngagementChecklist> } |
  { 'Err' : string };
export type Result_31 = { 'Ok' : EngagementDashboard } |
  { 'Err' : string };
export type Result_32 = { 'Ok' : Array<TrialBalanceAccount> } |
  { 'Err' : string };
export type Result_33 = { 'Ok' : ClientAccess } |
  { 'Err' : string };
export type Result_34 = { 'Ok' : Array<AdjustingJournalEntry> } |
  { 'Err' : string };
export type Result_35 = { 'Ok' : Array<ClientAcceptance> } |
  { 'Err' : string };
export type Result_36 = { 'Ok' : Array<Client> } |
  { 'Err' : string };
export type Result_37 = { 'Ok' : Array<ConflictCheck> } |
  { 'Err' : string };
export type Result_38 = { 'Ok' : Array<ImportedDataset> } |
  { 'Err' : string };
export type Result_39 = { 'Ok' : Array<Document> } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : ClientAcceptance } |
  { 'Err' : string };
export type Result_40 = { 'Ok' : Array<EngagementLetter> } |
  { 'Err' : string };
export type Result_41 = { 'Ok' : Array<EngagementSetupTemplate> } |
  { 'Err' : string };
export type Result_42 = { 'Ok' : Array<Engagement> } |
  { 'Err' : string };
export type Result_43 = { 'Ok' : Array<Entity> } |
  { 'Err' : string };
export type Result_44 = { 'Ok' : Array<FinancialStatement> } |
  { 'Err' : string };
export type Result_45 = { 'Ok' : Array<EngagementMilestone> } |
  { 'Err' : string };
export type Result_46 = { 'Ok' : Array<Organization> } |
  { 'Err' : string };
export type Result_47 = { 'Ok' : Array<AuditTemplate> } |
  { 'Err' : string };
export type Result_48 = { 'Ok' : Array<TimeEntry> } |
  { 'Err' : string };
export type Result_49 = { 'Ok' : Array<TrialBalance> } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : DocumentRequest } |
  { 'Err' : string };
export type Result_50 = { 'Ok' : Array<User> } |
  { 'Err' : string };
export type Result_51 = { 'Ok' : Array<WorkingPaper> } |
  { 'Err' : string };
export type Result_52 = { 'Ok' : TrialBalanceValidation } |
  { 'Err' : string };
export type Result_53 = { 'Ok' : VerificationResult } |
  { 'Err' : string };
export type Result_54 = { 'Ok' : AjeBlockchainVerification } |
  { 'Err' : string };
export type Result_55 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : User } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : EngagementBudget } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : Client } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : ConflictCheck } |
  { 'Err' : string };
export type RiskLevel = { 'Low' : null } |
  { 'High' : null } |
  { 'Medium' : null } |
  { 'Unacceptable' : null };
export interface SheetData {
  'data' : Array<Array<string>>,
  'name' : string,
  'row_count' : bigint,
  'columns' : Array<ColumnMetadata>,
}
export interface SignEngagementLetterRequest {
  'letter_id' : bigint,
  'client_name' : string,
}
export type TemplateType = { 'Review' : null } |
  { 'Compilation' : null } |
  { 'Custom' : null } |
  { 'Audit' : null } |
  { 'TaxPreparation' : null };
export interface TimeEntry {
  'id' : bigint,
  'hours' : number,
  'date' : bigint,
  'user' : Principal,
  'description' : string,
  'created_at' : bigint,
  'billable' : boolean,
  'engagement_id' : bigint,
  'milestone_id' : [] | [bigint],
}
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
  'account_type' : FSCategory,
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
  'commercial_registration' : [] | [string],
  'name' : string,
  'contact_email' : string,
  'industry_code' : [] | [string],
  'address' : string,
  'contact_phone' : string,
  'tax_registration_number' : [] | [string],
  'name_ar' : [] | [string],
  'entity_id' : [] | [bigint],
  'organization_id' : [] | [bigint],
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
export interface UpdateFSLineMappingRequest {
  'account_id' : bigint,
  'fs_line_item_code' : string,
}
export interface UpdateMilestoneRequest {
  'status' : [] | [MilestoneStatus],
  'assigned_to' : [] | [Principal],
  'actual_hours' : [] | [number],
  'milestone_id' : bigint,
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
  'profile_completed' : boolean,
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
export type XBRLTaxonomy = { 'EAS' : null } |
  { 'GCC' : null } |
  { 'IFRS' : null } |
  { 'Custom' : string };
export interface _SERVICE {
  'add_fs_note' : ActorMethod<[AddFSNoteRequest], Result>,
  'add_trial_balance_account' : ActorMethod<
    [bigint, UpdateAccountRequest],
    Result_1
  >,
  'apply_template_to_engagement' : ActorMethod<
    [ApplyTemplateRequest],
    Result_2
  >,
  'approve_aje' : ActorMethod<[bigint], Result_3>,
  'approve_client_acceptance' : ActorMethod<[bigint], Result_4>,
  'approve_document_request' : ActorMethod<[ApproveDocumentInput], Result_5>,
  'complete_user_profile' : ActorMethod<[CompleteProfileRequest], Result_6>,
  'create_aje' : ActorMethod<[CreateAjeRequest], Result_3>,
  'create_budget' : ActorMethod<[CreateBudgetRequest], Result_7>,
  'create_client' : ActorMethod<[CreateClientRequest], Result_8>,
  'create_client_acceptance' : ActorMethod<
    [CreateClientAcceptanceRequest],
    Result_4
  >,
  'create_conflict_check' : ActorMethod<[CreateConflictCheckRequest], Result_9>,
  'create_document_request' : ActorMethod<
    [CreateDocumentRequestInput],
    Result_5
  >,
  'create_engagement' : ActorMethod<[CreateEngagementRequest], Result_10>,
  'create_engagement_from_template' : ActorMethod<
    [CreateEngagementFromTemplateRequest],
    Result_11
  >,
  'create_engagement_letter' : ActorMethod<
    [CreateEngagementLetterRequest],
    Result_12
  >,
  'create_engagement_setup_template' : ActorMethod<
    [CreateEngagementSetupTemplateRequest],
    Result_13
  >,
  'create_entity' : ActorMethod<[CreateEntityRequest], Result_14>,
  'create_milestone' : ActorMethod<[CreateMilestoneRequest], Result_15>,
  'create_organization' : ActorMethod<[CreateOrganizationRequest], Result_16>,
  'create_template' : ActorMethod<[CreateTemplateRequest], Result_17>,
  'create_time_entry' : ActorMethod<[CreateTimeEntryRequest], Result_18>,
  'create_trial_balance' : ActorMethod<[CreateTrialBalanceRequest], Result_19>,
  'create_working_paper' : ActorMethod<[CreateWorkingPaperRequest], Result_20>,
  'delete_client' : ActorMethod<[bigint], Result>,
  'delete_document' : ActorMethod<[bigint], Result>,
  'delete_engagement' : ActorMethod<[bigint], Result>,
  'delete_entity' : ActorMethod<[bigint], Result>,
  'delete_organization' : ActorMethod<[bigint], Result>,
  'download_document' : ActorMethod<[bigint], Result_21>,
  'fulfill_document_request' : ActorMethod<
    [FulfillDocumentRequestInput],
    Result_5
  >,
  'generate_financial_statements' : ActorMethod<[GenerateFSRequest], Result_22>,
  'get_activity_logs' : ActorMethod<[[] | [bigint]], Result_23>,
  'get_aje' : ActorMethod<[bigint], Result_3>,
  'get_aje_line_items' : ActorMethod<[bigint], Result_24>,
  'get_blockchain_proof' : ActorMethod<[bigint], Result_25>,
  'get_client' : ActorMethod<[bigint], Result_8>,
  'get_client_access_for_engagement' : ActorMethod<[bigint], Result_26>,
  'get_current_user' : ActorMethod<[], Result_6>,
  'get_dataset' : ActorMethod<[bigint], Result_27>,
  'get_document' : ActorMethod<[bigint], Result_28>,
  'get_document_requests_for_engagement' : ActorMethod<[bigint], Result_29>,
  'get_engagement' : ActorMethod<[bigint], Result_10>,
  'get_engagement_checklists' : ActorMethod<[bigint], Result_30>,
  'get_engagement_dashboard' : ActorMethod<[bigint], Result_31>,
  'get_entity' : ActorMethod<[bigint], Result_14>,
  'get_financial_statement' : ActorMethod<[bigint], Result_22>,
  'get_line_items_for_taxonomy' : ActorMethod<
    [XBRLTaxonomy],
    Array<FSLineItem>
  >,
  'get_my_document_requests' : ActorMethod<[], Result_29>,
  'get_organization' : ActorMethod<[bigint], Result_16>,
  'get_resource_activity_logs' : ActorMethod<
    [string, string, [] | [bigint]],
    Result_23
  >,
  'get_template' : ActorMethod<[bigint], Result_17>,
  'get_trial_balance' : ActorMethod<[bigint], Result_19>,
  'get_trial_balance_accounts' : ActorMethod<[bigint], Result_32>,
  'get_user_activity_logs' : ActorMethod<[Principal, [] | [bigint]], Result_23>,
  'get_working_paper' : ActorMethod<[bigint], Result_20>,
  'grant_client_access' : ActorMethod<[GrantClientAccessRequest], Result_33>,
  'grant_document_access' : ActorMethod<[bigint, Principal], Result>,
  'import_excel' : ActorMethod<[ImportExcelRequest], Result_27>,
  'import_trial_balance_csv' : ActorMethod<
    [bigint, string, Array<CsvAccountRow>],
    Result_19
  >,
  'link_document_to_working_paper' : ActorMethod<[bigint, bigint], Result>,
  'list_ajes_by_engagement' : ActorMethod<[bigint], Result_34>,
  'list_client_acceptances_by_client' : ActorMethod<[bigint], Result_35>,
  'list_clients' : ActorMethod<[], Result_36>,
  'list_clients_by_entity' : ActorMethod<[bigint], Result_36>,
  'list_clients_by_organization' : ActorMethod<[bigint], Result_36>,
  'list_conflict_checks_by_client' : ActorMethod<[bigint], Result_37>,
  'list_datasets' : ActorMethod<[], Result_38>,
  'list_datasets_by_engagement' : ActorMethod<[bigint], Result_38>,
  'list_documents' : ActorMethod<[], Result_39>,
  'list_documents_by_entity' : ActorMethod<[bigint], Result_39>,
  'list_documents_by_organization' : ActorMethod<[bigint], Result_39>,
  'list_engagement_letters_by_client' : ActorMethod<[bigint], Result_40>,
  'list_engagement_templates' : ActorMethod<[], Result_41>,
  'list_engagements' : ActorMethod<[], Result_42>,
  'list_engagements_by_client' : ActorMethod<[bigint], Result_42>,
  'list_engagements_by_entity' : ActorMethod<[bigint], Result_42>,
  'list_engagements_by_organization' : ActorMethod<[bigint], Result_42>,
  'list_entities' : ActorMethod<[], Result_43>,
  'list_entities_by_organization' : ActorMethod<[bigint], Result_43>,
  'list_financial_statements_by_engagement' : ActorMethod<[bigint], Result_44>,
  'list_milestones_by_engagement' : ActorMethod<[bigint], Result_45>,
  'list_organizations' : ActorMethod<[], Result_46>,
  'list_templates' : ActorMethod<[], Result_47>,
  'list_time_entries_by_engagement' : ActorMethod<[bigint], Result_48>,
  'list_trial_balances_by_engagement' : ActorMethod<[bigint], Result_49>,
  'list_users' : ActorMethod<[], Result_50>,
  'list_working_papers_by_engagement' : ActorMethod<[bigint], Result_51>,
  'map_account_to_fs_line' : ActorMethod<[bigint, string], Result_1>,
  'post_aje' : ActorMethod<[bigint], Result_3>,
  'revert_activity_entry' : ActorMethod<[bigint], Result>,
  'review_aje' : ActorMethod<[bigint, boolean], Result_3>,
  'revoke_document_access' : ActorMethod<[bigint, Principal], Result>,
  'send_engagement_letter' : ActorMethod<[bigint], Result_12>,
  'sign_engagement_letter' : ActorMethod<
    [SignEngagementLetterRequest],
    Result_12
  >,
  'submit_aje' : ActorMethod<[bigint], Result_3>,
  'update_checklist_item' : ActorMethod<[UpdateChecklistItemRequest], Result_2>,
  'update_client' : ActorMethod<[UpdateClientRequest], Result_8>,
  'update_engagement' : ActorMethod<[UpdateEngagementRequest], Result_10>,
  'update_entity' : ActorMethod<[UpdateEntityRequest], Result_14>,
  'update_fs_line_mapping' : ActorMethod<[UpdateFSLineMappingRequest], Result>,
  'update_milestone' : ActorMethod<[UpdateMilestoneRequest], Result_15>,
  'update_organization' : ActorMethod<[UpdateOrganizationRequest], Result_16>,
  'update_user_email' : ActorMethod<[string], Result>,
  'update_user_language' : ActorMethod<[string], Result>,
  'update_user_name' : ActorMethod<[string], Result>,
  'update_user_role' : ActorMethod<[Principal, UserRole], Result>,
  'upload_document' : ActorMethod<[UploadDocumentRequest], Result_28>,
  'validate_trial_balance' : ActorMethod<[bigint], Result_52>,
  'verify_activity_log' : ActorMethod<[bigint], Result_53>,
  'verify_aje_blockchain' : ActorMethod<[bigint], Result_54>,
  'verify_blockchain_chain' : ActorMethod<[], Result_55>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
