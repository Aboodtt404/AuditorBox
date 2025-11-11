use candid::{CandidType, Deserialize, Principal};
use serde::Serialize;

// User Roles
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum UserRole {
    Admin,
    Partner,
    Manager,
    Senior,
    Staff,
    ClientUser,
}

// User Profile
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct User {
    pub principal: Principal,
    pub role: UserRole,
    pub name: String,
    pub email: String,
    pub created_at: u64,
    pub language_preference: String, // "en" or "ar"
    pub profile_completed: bool, // Whether user has completed initial profile setup
}

// Complete Profile Request
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CompleteProfileRequest {
    pub name: String,
    pub email: String,
    pub requested_role: UserRole, // User's requested role (admin will approve)
}

// Organization
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Organization {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub created_at: u64,
    pub created_by: Principal,
    pub entity_ids: Vec<u64>,
}

// XBRL Taxonomy
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum XBRLTaxonomy {
    EAS,    // Egyptian Accounting Standards
    IFRS,   // International Financial Reporting Standards
    GCC,    // GCC Financial Reporting Standards
    Custom(String),
}

// Entity
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Entity {
    pub id: u64,
    pub organization_id: u64,
    pub name: String,
    pub description: String,
    pub taxonomy: Option<XBRLTaxonomy>,
    pub taxonomy_config: String, // JSON string for taxonomy-specific data
    pub created_at: u64,
    pub created_by: Principal,
}

// Client
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Client {
    pub id: u64,
    pub name: String,
    pub name_ar: Option<String>,
    pub contact_email: String,
    pub contact_phone: String,
    pub address: String,
    pub tax_registration_number: Option<String>,
    pub commercial_registration: Option<String>,
    pub industry_code: Option<String>,
    pub organization_id: Option<u64>,  // Optional link to Organization
    pub entity_id: Option<u64>,        // Optional link to Entity
    pub created_at: u64,
    pub created_by: Principal,
}

// Engagement Link Type
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum EngagementLink {
    Organization(u64),
    Entity(u64),
    Client(u64),
}

// Engagement
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Engagement {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub link: EngagementLink,
    pub start_date: u64,
    pub end_date: u64,
    pub status: String,
    pub created_at: u64,
    pub created_by: Principal,
}

// Column Data Type
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ColumnType {
    Numeric,
    Text,
    Date,
    Boolean,
    Currency,
}

// PII Detection Result
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PIIDetection {
    pub has_names: bool,
    pub has_emails: bool,
    pub has_phone_numbers: bool,
    pub has_national_ids: bool,
}

// Column Metadata
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ColumnMetadata {
    pub name: String,
    pub original_name: String,
    pub detected_type: ColumnType,
    pub null_percent: f64,
    pub unique_count: u64,
    pub min_value: String,
    pub max_value: String,
    pub sample_values: Vec<String>,
    pub pii_detection: PIIDetection,
}

// Sheet Data
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SheetData {
    pub name: String,
    pub columns: Vec<ColumnMetadata>,
    pub row_count: u64,
    pub data: Vec<Vec<String>>, // Simplified: row x column string data
}

// Imported Dataset
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ImportedDataset {
    pub id: u64,
    pub name: String,
    pub engagement_id: Option<u64>,
    pub file_name: String,
    pub file_size: u64,
    pub sheets: Vec<SheetData>,
    pub version: u32,
    pub created_at: u64,
    pub created_by: Principal,
}

// Working Paper Field Mapping
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ColumnMapping {
    pub account_number: Option<String>,
    pub account_name: Option<String>,
    pub currency: Option<String>,
    pub opening_debit: Option<String>,
    pub opening_credit: Option<String>,
    pub period_debit: Option<String>,
    pub period_credit: Option<String>,
    pub ytd_debit: Option<String>,
    pub ytd_credit: Option<String>,
    pub entity: Option<String>,
    pub department: Option<String>,
    pub project: Option<String>,
    pub notes: Option<String>,
}

// Account Data
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AccountData {
    pub account_number: String,
    pub account_name: String,
    pub currency: String,
    pub opening_debit: f64,
    pub opening_credit: f64,
    pub period_debit: f64,
    pub period_credit: f64,
    pub ytd_debit: f64,
    pub ytd_credit: f64,
    pub entity: String,
    pub department: String,
    pub project: String,
    pub notes: String,
}

// Leadsheet
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Leadsheet {
    pub accounts: Vec<AccountData>,
    pub opening_balance: f64,
    pub adjustments: f64,
    pub closing_balance: f64,
    pub created_at: u64,
}

// Financial Ratio
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FinancialRatio {
    pub name: String,
    pub value: f64,
    pub formula: String,
}

// Trend Analysis
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TrendAnalysis {
    pub period_name: String,
    pub current_value: f64,
    pub prior_value: f64,
    pub change: f64,
    pub change_percent: f64,
}

// Variance Analysis
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VarianceAnalysis {
    pub item_name: String,
    pub actual: f64,
    pub expected: f64,
    pub variance: f64,
    pub variance_percent: f64,
}

// Working Paper
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct WorkingPaper {
    pub id: u64,
    pub engagement_id: u64,
    pub dataset_id: u64,
    pub name: String,
    pub column_mapping: ColumnMapping,
    pub leadsheet: Option<Leadsheet>,
    pub ratios: Vec<FinancialRatio>,
    pub trend_analysis: Vec<TrendAnalysis>,
    pub variance_analysis: Vec<VarianceAnalysis>,
    pub linked_document_ids: Vec<u64>,
    pub created_at: u64,
    pub created_by: Principal,
}

// Document
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Document {
    pub id: u64,
    pub name: String,
    pub file_type: String,
    pub file_size: u64,
    pub organization_id: Option<u64>,
    pub entity_id: Option<u64>,
    pub category: String,
    pub data_chunks: Vec<Vec<u8>>, // Store file in chunks
    pub created_at: u64,
    pub created_by: Principal,
    pub access_principals: Vec<Principal>,
}

// Activity Log Entry with Blockchain Proof
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ActivityLogEntry {
    pub id: u64,
    pub principal: Principal,
    pub action: String,
    pub resource_type: String,
    pub resource_id: String,
    pub details: String,
    pub timestamp: u64,
    pub data_hash: String,           // SHA-256 hash of entry data
    pub signature: String,           // Cryptographic signature for authenticity
    pub previous_hash: String,       // Previous entry signature for blockchain chaining
    pub block_height: u64,
    pub snapshot: Option<Vec<u8>>,   // Serialized snapshot of resource state (for revert)
}

// API Request/Response Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateOrganizationRequest {
    pub name: String,
    pub description: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateOrganizationRequest {
    pub id: u64,
    pub name: String,
    pub description: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateEntityRequest {
    pub organization_id: u64,
    pub name: String,
    pub description: String,
    pub taxonomy: Option<XBRLTaxonomy>,
    pub taxonomy_config: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateEntityRequest {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub taxonomy: Option<XBRLTaxonomy>,
    pub taxonomy_config: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateClientRequest {
    pub name: String,
    pub name_ar: Option<String>,
    pub contact_email: String,
    pub contact_phone: String,
    pub address: String,
    pub tax_registration_number: Option<String>,
    pub commercial_registration: Option<String>,
    pub industry_code: Option<String>,
    pub organization_id: Option<u64>,
    pub entity_id: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateClientRequest {
    pub id: u64,
    pub name: String,
    pub name_ar: Option<String>,
    pub contact_email: String,
    pub contact_phone: String,
    pub address: String,
    pub tax_registration_number: Option<String>,
    pub commercial_registration: Option<String>,
    pub industry_code: Option<String>,
    pub organization_id: Option<u64>,
    pub entity_id: Option<u64>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateEngagementRequest {
    pub name: String,
    pub description: String,
    pub link: EngagementLink,
    pub start_date: u64,
    pub end_date: u64,
    pub status: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateEngagementRequest {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub start_date: u64,
    pub end_date: u64,
    pub status: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ImportExcelRequest {
    pub name: String,
    pub engagement_id: Option<u64>,
    pub file_name: String,
    pub file_data: Vec<u8>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateWorkingPaperRequest {
    pub engagement_id: u64,
    pub dataset_id: u64,
    pub name: String,
    pub column_mapping: ColumnMapping,
    pub selected_accounts: Vec<String>, // Account numbers to include
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UploadDocumentRequest {
    pub name: String,
    pub file_type: String,
    pub organization_id: Option<u64>,
    pub entity_id: Option<u64>,
    pub category: String,
    pub file_data: Vec<u8>,
}

// Blockchain Verification Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct BlockchainProof {
    pub entry_id: u64,
    pub data_hash: String,
    pub timestamp: u64,
    pub block_height: u64,
    pub signature: String,
    pub previous_hash: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct VerificationResult {
    pub is_valid: bool,
    pub entry_id: u64,
    pub timestamp: u64,
    pub data_hash: String,
    pub block_height: u64,
    pub verification_timestamp: u64,
    pub chain_integrity: bool,
    pub message: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct PublicVerificationRequest {
    pub entry_id: u64,
    pub verification_token: String,
}

// Trial Balance Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TrialBalance {
    pub id: u64,
    pub engagement_id: u64,
    pub period_end_date: String,
    pub description: String,
    pub currency: String,
    pub is_adjusted: bool,
    pub created_at: u64,
    pub created_by: Principal,
    pub last_modified_at: u64,
    pub last_modified_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AccountType {
    Asset,
    Liability,
    Equity,
    Revenue,
    Expense,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TrialBalanceAccount {
    pub id: u64,
    pub trial_balance_id: u64,
    pub account_number: String,
    pub account_name: String,
    pub account_type: AccountType,
    pub debit_balance: i64,
    pub credit_balance: i64,
    pub fs_line_item: Option<String>,
    pub notes: String,
    pub is_reconciled: bool,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateTrialBalanceRequest {
    pub engagement_id: u64,
    pub period_end_date: String,
    pub description: String,
    pub currency: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateAccountRequest {
    pub account_number: String,
    pub account_name: String,
    pub account_type: AccountType,
    pub debit_balance: i64,
    pub credit_balance: i64,
    pub fs_line_item: Option<String>,
    pub notes: Option<String>,
}

// Adjusting Journal Entry Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum AjeStatus {
    Draft,
    Proposed,
    Reviewed,
    Approved,
    Rejected,
    Posted,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AdjustingJournalEntry {
    pub id: u64,
    pub engagement_id: u64,
    pub trial_balance_id: u64,
    pub aje_number: String,
    pub description: String,
    pub status: AjeStatus,
    pub amount: i64,
    pub created_at: u64,
    pub created_by: Principal,
    pub reviewed_at: Option<u64>,
    pub reviewed_by: Option<Principal>,
    pub approved_at: Option<u64>,
    pub approved_by: Option<Principal>,
    pub blockchain_hash: String,
    pub blockchain_signature: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AjeLineItem {
    pub id: u64,
    pub aje_id: u64,
    pub account_id: u64,
    pub account_name: String,
    pub account_number: String,
    pub debit_amount: i64,
    pub credit_amount: i64,
    pub description: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateAjeRequest {
    pub engagement_id: u64,
    pub trial_balance_id: u64,
    pub aje_number: String,
    pub description: String,
    pub line_items: Vec<CreateAjeLineItemRequest>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateAjeLineItemRequest {
    pub account_id: u64,
    pub debit_amount: i64,
    pub credit_amount: i64,
    pub description: String,
}

// Financial Statements
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum FSCategory {
    Asset,
    Liability,
    Equity,
    Revenue,
    Expense,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FSLineItem {
    pub code: String,
    pub name: String,
    pub category: FSCategory,
    pub subcategory: String,
    pub order: u64,
    pub is_subtotal: bool,
    pub parent: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FSLine {
    pub line_item: FSLineItem,
    pub amount: i64, // in cents
    pub mapped_accounts: Vec<u64>, // trial balance account IDs
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FSNote {
    pub note_number: u64,
    pub title: String,
    pub content: String,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FinancialStatement {
    pub id: u64,
    pub engagement_id: u64,
    pub trial_balance_id: u64,
    pub taxonomy: XBRLTaxonomy,
    pub period_end_date: String,
    pub lines: Vec<FSLine>,
    pub notes: Vec<FSNote>,
    pub created_at: u64,
    pub created_by: Principal,
    pub last_modified: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GenerateFSRequest {
    pub trial_balance_id: u64,
    pub taxonomy: XBRLTaxonomy,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateFSLineMappingRequest {
    pub account_id: u64,
    pub fs_line_item_code: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AddFSNoteRequest {
    pub fs_id: u64,
    pub title: String,
    pub content: String,
}

// ============================================================================
// PHASE 1: PRE-ENGAGEMENT & SETUP
// ============================================================================

// Client Acceptance Risk Assessment
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    Unacceptable,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum AcceptanceDecision {
    Accepted,
    Rejected,
    RequiresPartnerReview,
    Pending,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ClientAcceptanceQuestionnaire {
    pub management_integrity_risk: RiskLevel,
    pub financial_stability_risk: RiskLevel,
    pub industry_risk: RiskLevel,
    pub regulatory_complexity_risk: RiskLevel,
    pub fee_collection_risk: RiskLevel,
    pub independence_threats: bool,
    pub conflicts_of_interest: bool,
    pub resources_available: bool,
    pub technical_expertise_available: bool,
    pub notes: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ClientAcceptance {
    pub id: u64,
    pub client_id: u64,
    pub questionnaire: ClientAcceptanceQuestionnaire,
    pub overall_risk: RiskLevel,
    pub decision: AcceptanceDecision,
    pub decision_rationale: String,
    pub reviewed_by: Principal,
    pub reviewed_at: u64,
    pub partner_approved_by: Option<Principal>,
    pub partner_approved_at: Option<u64>,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateClientAcceptanceRequest {
    pub client_id: u64,
    pub questionnaire: ClientAcceptanceQuestionnaire,
    pub decision_rationale: String,
}

// Engagement Letter
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum EngagementType {
    Audit,
    Review,
    Compilation,
    TaxPreparation,
    Consulting,
    Other(String),
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum EngagementLetterStatus {
    Draft,
    SentToClient,
    Signed,
    Declined,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EngagementLetter {
    pub id: u64,
    pub engagement_id: Option<u64>,
    pub client_id: u64,
    pub engagement_type: EngagementType,
    pub scope_of_services: String,
    pub management_responsibilities: String,
    pub auditor_responsibilities: String,
    pub limitations_of_engagement: String,
    pub fee_structure: String,
    pub estimated_completion_date: String,
    pub special_terms: String,
    pub status: EngagementLetterStatus,
    pub sent_date: Option<u64>,
    pub signed_date: Option<u64>,
    pub signed_by_client_name: Option<String>,
    pub created_at: u64,
    pub created_by: Principal,
    pub last_modified_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateEngagementLetterRequest {
    pub client_id: u64,
    pub engagement_type: EngagementType,
    pub scope_of_services: String,
    pub fee_structure: String,
    pub estimated_completion_date: String,
    pub special_terms: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct SignEngagementLetterRequest {
    pub letter_id: u64,
    pub client_name: String,
}

// Enhanced Engagement with Phase 1 Support
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EnhancedEngagement {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub link: EngagementLink,
    pub engagement_type: EngagementType,
    pub start_date: u64,
    pub end_date: u64,
    pub status: String,
    pub template_id: Option<u64>,
    pub prior_year_engagement_id: Option<u64>,
    pub client_acceptance_id: Option<u64>,
    pub engagement_letter_id: Option<u64>,
    pub partner_in_charge: Option<Principal>,
    pub manager_in_charge: Option<Principal>,
    pub budget_hours: Option<f64>,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateEnhancedEngagementRequest {
    pub name: String,
    pub description: String,
    pub link: EngagementLink,
    pub engagement_type: EngagementType,
    pub start_date: u64,
    pub end_date: u64,
    pub template_id: Option<u64>,
    pub prior_year_engagement_id: Option<u64>,
    pub client_acceptance_id: Option<u64>,
    pub engagement_letter_id: Option<u64>,
    pub partner_in_charge: Option<Principal>,
    pub manager_in_charge: Option<Principal>,
    pub budget_hours: Option<f64>,
}

// Conflict of Interest Check
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ConflictCheck {
    pub id: u64,
    pub client_id: u64,
    pub related_parties: Vec<String>,
    pub conflicts_found: bool,
    pub conflict_details: Vec<String>,
    pub resolution_notes: String,
    pub cleared: bool,
    pub cleared_by: Option<Principal>,
    pub cleared_at: Option<u64>,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateConflictCheckRequest {
    pub client_id: u64,
    pub related_parties: Vec<String>,
    pub potential_conflicts: Vec<String>,
    pub resolution_notes: String,
}

// Engagement Setup Template
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EngagementSetupTemplate {
    pub id: u64,
    pub name: String,
    pub engagement_type: EngagementType,
    pub description: String,
    pub default_procedures: Vec<String>,
    pub required_documents: Vec<String>,
    pub default_milestones: Vec<MilestoneTemplate>,
    pub estimated_hours: f64,
    pub is_default: bool,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct MilestoneTemplate {
    pub name: String,
    pub description: String,
    pub days_from_start: u64,
    pub estimated_hours: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateEngagementSetupTemplateRequest {
    pub name: String,
    pub engagement_type: EngagementType,
    pub description: String,
    pub default_procedures: Vec<String>,
    pub required_documents: Vec<String>,
    pub default_milestones: Vec<MilestoneTemplate>,
    pub estimated_hours: f64,
}

// Engagement Planning & Tracking
#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum MilestoneStatus {
    NotStarted,
    InProgress,
    Completed,
    Blocked,
    Cancelled,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EngagementMilestone {
    pub id: u64,
    pub engagement_id: u64,
    pub name: String,
    pub description: String,
    pub due_date: u64,
    pub status: MilestoneStatus,
    pub assigned_to: Option<Principal>,
    pub estimated_hours: f64,
    pub actual_hours: f64,
    pub completed_date: Option<u64>,
    pub completed_by: Option<Principal>,
    pub dependencies: Vec<u64>,
    pub created_at: u64,
    pub created_by: Principal,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateMilestoneRequest {
    pub engagement_id: u64,
    pub name: String,
    pub description: String,
    pub due_date: u64,
    pub assigned_to: Option<Principal>,
    pub estimated_hours: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateMilestoneRequest {
    pub milestone_id: u64,
    pub status: Option<MilestoneStatus>,
    pub actual_hours: Option<f64>,
    pub assigned_to: Option<Principal>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EngagementBudget {
    pub id: u64,
    pub engagement_id: u64,
    pub total_budgeted_hours: f64,
    pub total_actual_hours: f64,
    pub partner_hours: f64,
    pub manager_hours: f64,
    pub senior_hours: f64,
    pub staff_hours: f64,
    pub partner_rate: f64,
    pub manager_rate: f64,
    pub senior_rate: f64,
    pub staff_rate: f64,
    pub total_budgeted_fee: f64,
    pub total_actual_fee: f64,
    pub created_at: u64,
    pub created_by: Principal,
    pub last_updated_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateBudgetRequest {
    pub engagement_id: u64,
    pub total_budgeted_hours: f64,
    pub partner_hours: f64,
    pub manager_hours: f64,
    pub senior_hours: f64,
    pub staff_hours: f64,
    pub partner_rate: f64,
    pub manager_rate: f64,
    pub senior_rate: f64,
    pub staff_rate: f64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct TimeEntry {
    pub id: u64,
    pub engagement_id: u64,
    pub milestone_id: Option<u64>,
    pub user: Principal,
    pub date: u64,
    pub hours: f64,
    pub description: String,
    pub billable: bool,
    pub created_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateTimeEntryRequest {
    pub engagement_id: u64,
    pub milestone_id: Option<u64>,
    pub date: u64,
    pub hours: f64,
    pub description: String,
    pub billable: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EngagementDashboard {
    pub engagement: Engagement,
    pub budget: Option<EngagementBudget>,
    pub milestones: Vec<EngagementMilestone>,
    pub completion_percentage: f64,
    pub budget_utilization: f64,
    pub on_schedule: bool,
    pub at_risk_milestones: Vec<EngagementMilestone>,
    pub recent_time_entries: Vec<TimeEntry>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateEngagementFromTemplateRequest {
    pub name: String,
    pub description: String,
    pub link: EngagementLink,
    pub start_date: u64,
    pub end_date: u64,
    pub template_id: u64,
    pub prior_year_engagement_id: Option<u64>,
    pub client_acceptance_id: Option<u64>,
    pub engagement_letter_id: Option<u64>,
    pub partner_in_charge: Option<Principal>,
    pub manager_in_charge: Option<Principal>,
}

// Result types
pub type Result<T> = std::result::Result<T, String>;

