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
    USGAAP,
    IFRS,
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

// Client (Legacy)
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Client {
    pub id: u64,
    pub name: String,
    pub contact_email: String,
    pub contact_phone: String,
    pub address: String,
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

// Activity Log Entry
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ActivityLogEntry {
    pub id: u64,
    pub principal: Principal,
    pub action: String,
    pub resource_type: String,
    pub resource_id: String,
    pub details: String,
    pub timestamp: u64,
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
    pub contact_email: String,
    pub contact_phone: String,
    pub address: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct UpdateClientRequest {
    pub id: u64,
    pub name: String,
    pub contact_email: String,
    pub contact_phone: String,
    pub address: String,
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

// Result types
pub type Result<T> = std::result::Result<T, String>;

