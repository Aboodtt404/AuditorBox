use candid::Principal;
use ic_cdk_macros::{init, query, update};

mod activity_log;
mod adjustments;
mod auth;
mod blockchain_proof;
mod client_portal;
mod clients;
mod data_import;
mod documents;
mod engagement_planning;
mod engagements;
mod entities;
mod financial_statements;
mod organizations;
mod pre_engagement;
mod storage;
mod templates;
mod trial_balance;
mod types;
mod working_papers;

use types::*;

// Initialize canister
#[init]
fn init() {
    ic_cdk::println!("AuditorBox canister initialized");
    templates::initialize_default_templates();
    engagement_planning::initialize_default_engagement_templates();
}

// ============================================================================
// User Management
// ============================================================================

#[update]
fn get_current_user() -> Result<User> {
    let caller = ic_cdk::caller();
    let user = auth::get_or_create_user(caller);
    Ok(user)
}

#[update]
fn update_user_role(target_principal: Principal, new_role: UserRole) -> Result<()> {
    let caller = ic_cdk::caller();
    auth::update_user_role(caller, target_principal, new_role)
}

#[update]
fn update_user_language(language: String) -> Result<()> {
    let caller = ic_cdk::caller();
    auth::update_user_language(caller, language)
}

#[update]
fn update_user_name(name: String) -> Result<()> {
    let caller = ic_cdk::caller();
    auth::update_user_name(caller, name)
}

#[update]
fn update_user_email(email: String) -> Result<()> {
    let caller = ic_cdk::caller();
    auth::update_user_email(caller, email)
}

#[update]
fn complete_user_profile(request: CompleteProfileRequest) -> Result<User> {
    let caller = ic_cdk::caller();
    auth::complete_user_profile(caller, request.name, request.email, request.requested_role)
}

#[query]
fn list_users() -> Result<Vec<User>> {
    let caller = ic_cdk::caller();
    auth::list_users(caller)
}

// ============================================================================
// Organization Management
// ============================================================================

#[update]
fn create_organization(req: CreateOrganizationRequest) -> Result<Organization> {
    let caller = ic_cdk::caller();
    organizations::create_organization(caller, req)
}

#[query]
fn get_organization(id: u64) -> Result<Organization> {
    let caller = ic_cdk::caller();
    organizations::get_organization(caller, id)
}

#[query]
fn list_organizations() -> Result<Vec<Organization>> {
    let caller = ic_cdk::caller();
    organizations::list_organizations(caller)
}

#[update]
fn update_organization(req: UpdateOrganizationRequest) -> Result<Organization> {
    let caller = ic_cdk::caller();
    organizations::update_organization(caller, req)
}

#[update]
fn delete_organization(id: u64) -> Result<()> {
    let caller = ic_cdk::caller();
    organizations::delete_organization(caller, id)
}

// ============================================================================
// Entity Management
// ============================================================================

#[update]
fn create_entity(req: CreateEntityRequest) -> Result<Entity> {
    let caller = ic_cdk::caller();
    entities::create_entity(caller, req)
}

#[query]
fn get_entity(id: u64) -> Result<Entity> {
    let caller = ic_cdk::caller();
    entities::get_entity(caller, id)
}

#[query]
fn list_entities() -> Result<Vec<Entity>> {
    let caller = ic_cdk::caller();
    entities::list_entities(caller)
}

#[query]
fn list_entities_by_organization(org_id: u64) -> Result<Vec<Entity>> {
    let caller = ic_cdk::caller();
    entities::list_entities_by_organization(caller, org_id)
}

#[update]
fn update_entity(req: UpdateEntityRequest) -> Result<Entity> {
    let caller = ic_cdk::caller();
    entities::update_entity(caller, req)
}

#[update]
fn delete_entity(id: u64) -> Result<()> {
    let caller = ic_cdk::caller();
    entities::delete_entity(caller, id)
}

// ============================================================================
// Client Management (Legacy)
// ============================================================================

#[update]
fn create_client(req: CreateClientRequest) -> Result<Client> {
    let caller = ic_cdk::caller();
    clients::create_client(caller, req)
}

#[query]
fn get_client(id: u64) -> Result<Client> {
    let caller = ic_cdk::caller();
    clients::get_client(caller, id)
}

#[query]
fn list_clients() -> Result<Vec<Client>> {
    let caller = ic_cdk::caller();
    clients::list_clients(caller)
}

#[query]
fn list_clients_by_organization(organization_id: u64) -> Result<Vec<Client>> {
    let caller = ic_cdk::caller();
    clients::list_clients_by_organization(caller, organization_id)
}

#[query]
fn list_clients_by_entity(entity_id: u64) -> Result<Vec<Client>> {
    let caller = ic_cdk::caller();
    clients::list_clients_by_entity(caller, entity_id)
}

#[update]
fn update_client(req: UpdateClientRequest) -> Result<Client> {
    let caller = ic_cdk::caller();
    clients::update_client(caller, req)
}

#[update]
fn delete_client(id: u64) -> Result<()> {
    let caller = ic_cdk::caller();
    clients::delete_client(caller, id)
}

// ============================================================================
// Engagement Management
// ============================================================================

#[update]
fn create_engagement(req: CreateEngagementRequest) -> Result<Engagement> {
    let caller = ic_cdk::caller();
    engagements::create_engagement(caller, req)
}

#[query]
fn get_engagement(id: u64) -> Result<Engagement> {
    let caller = ic_cdk::caller();
    engagements::get_engagement(caller, id)
}

#[query]
fn list_engagements() -> Result<Vec<Engagement>> {
    let caller = ic_cdk::caller();
    engagements::list_engagements(caller)
}

#[query]
fn list_engagements_by_organization(org_id: u64) -> Result<Vec<Engagement>> {
    let caller = ic_cdk::caller();
    engagements::list_engagements_by_organization(caller, org_id)
}

#[query]
fn list_engagements_by_entity(entity_id: u64) -> Result<Vec<Engagement>> {
    let caller = ic_cdk::caller();
    engagements::list_engagements_by_entity(caller, entity_id)
}

#[query]
fn list_engagements_by_client(client_id: u64) -> Result<Vec<Engagement>> {
    let caller = ic_cdk::caller();
    engagements::list_engagements_by_client(caller, client_id)
}

#[update]
fn update_engagement(req: UpdateEngagementRequest) -> Result<Engagement> {
    let caller = ic_cdk::caller();
    engagements::update_engagement(caller, req)
}

#[update]
fn delete_engagement(id: u64) -> Result<()> {
    let caller = ic_cdk::caller();
    engagements::delete_engagement(caller, id)
}

// ============================================================================
// Data Import
// ============================================================================

#[update]
fn import_excel(req: ImportExcelRequest) -> Result<ImportedDataset> {
    let caller = ic_cdk::caller();
    data_import::import_excel(caller, req)
}

#[query]
fn get_dataset(id: u64) -> Result<ImportedDataset> {
    let caller = ic_cdk::caller();
    data_import::get_dataset(caller, id)
}

#[query]
fn list_datasets() -> Result<Vec<ImportedDataset>> {
    let caller = ic_cdk::caller();
    data_import::list_datasets(caller)
}

#[query]
fn list_datasets_by_engagement(engagement_id: u64) -> Result<Vec<ImportedDataset>> {
    let caller = ic_cdk::caller();
    data_import::list_datasets_by_engagement(caller, engagement_id)
}

// ============================================================================
// Working Papers
// ============================================================================

#[update]
fn create_working_paper(req: CreateWorkingPaperRequest) -> Result<WorkingPaper> {
    let caller = ic_cdk::caller();
    working_papers::create_working_paper(caller, req)
}

#[query]
fn get_working_paper(id: u64) -> Result<WorkingPaper> {
    let caller = ic_cdk::caller();
    working_papers::get_working_paper(caller, id)
}

#[query]
fn list_working_papers_by_engagement(engagement_id: u64) -> Result<Vec<WorkingPaper>> {
    let caller = ic_cdk::caller();
    working_papers::list_working_papers_by_engagement(caller, engagement_id)
}

#[update]
fn link_document_to_working_paper(working_paper_id: u64, document_id: u64) -> Result<()> {
    let caller = ic_cdk::caller();
    working_papers::link_document_to_working_paper(caller, working_paper_id, document_id)
}

// ============================================================================
// Document Management
// ============================================================================

#[update]
fn upload_document(req: UploadDocumentRequest) -> Result<Document> {
    let caller = ic_cdk::caller();
    documents::upload_document(caller, req)
}

#[query]
fn get_document(id: u64) -> Result<Document> {
    let caller = ic_cdk::caller();
    documents::get_document(caller, id)
}

#[query]
fn download_document(id: u64) -> Result<Vec<u8>> {
    let caller = ic_cdk::caller();
    documents::download_document(caller, id)
}

#[query]
fn list_documents() -> Result<Vec<Document>> {
    let caller = ic_cdk::caller();
    documents::list_documents(caller)
}

#[query]
fn list_documents_by_organization(org_id: u64) -> Result<Vec<Document>> {
    let caller = ic_cdk::caller();
    documents::list_documents_by_organization(caller, org_id)
}

#[query]
fn list_documents_by_entity(entity_id: u64) -> Result<Vec<Document>> {
    let caller = ic_cdk::caller();
    documents::list_documents_by_entity(caller, entity_id)
}

#[update]
fn grant_document_access(document_id: u64, principal: Principal) -> Result<()> {
    let caller = ic_cdk::caller();
    documents::grant_document_access(caller, document_id, principal)
}

#[update]
fn revoke_document_access(document_id: u64, principal: Principal) -> Result<()> {
    let caller = ic_cdk::caller();
    documents::revoke_document_access(caller, document_id, principal)
}

#[update]
fn delete_document(id: u64) -> Result<()> {
    let caller = ic_cdk::caller();
    documents::delete_document(caller, id)
}

// ============================================================================
// Activity Log
// ============================================================================

#[query]
fn get_activity_logs(limit: Option<u64>) -> Result<Vec<ActivityLogEntry>> {
    let caller = ic_cdk::caller();
    activity_log::get_activity_logs(caller, limit)
}

#[query]
fn get_user_activity_logs(
    target_principal: Principal,
    limit: Option<u64>,
) -> Result<Vec<ActivityLogEntry>> {
    let caller = ic_cdk::caller();
    activity_log::get_user_activity_logs(caller, target_principal, limit)
}

#[query]
fn get_resource_activity_logs(
    resource_type: String,
    resource_id: String,
    limit: Option<u64>,
) -> Result<Vec<ActivityLogEntry>> {
    let caller = ic_cdk::caller();
    activity_log::get_resource_activity_logs(caller, resource_type, resource_id, limit)
}

#[update]
fn revert_activity_entry(entry_id: u64) -> Result<()> {
    let caller = ic_cdk::caller();
    activity_log::revert_activity_entry(caller, entry_id)
}

// ============================================================================
// Blockchain Verification
// ============================================================================

#[query]
fn verify_activity_log(entry_id: u64) -> Result<VerificationResult> {
    let caller = ic_cdk::caller();
    activity_log::verify_activity_log(caller, entry_id)
}

#[query]
fn verify_blockchain_chain() -> Result<bool> {
    let caller = ic_cdk::caller();
    activity_log::verify_blockchain_chain(caller)
}

#[query]
fn get_blockchain_proof(entry_id: u64) -> Result<BlockchainProof> {
    activity_log::get_blockchain_proof(entry_id)
}

// ============================================================================
// Client Portal
// ============================================================================

#[update]
fn create_document_request(
    input: client_portal::CreateDocumentRequestInput,
) -> Result<client_portal::DocumentRequest> {
    let caller = ic_cdk::caller();
    client_portal::create_document_request(caller, input)
}

#[update]
fn grant_client_access(
    input: client_portal::GrantClientAccessRequest,
) -> Result<client_portal::ClientAccess> {
    let caller = ic_cdk::caller();
    client_portal::grant_client_access(caller, input)
}

#[query]
fn get_document_requests_for_engagement(
    engagement_id: u64,
) -> Result<Vec<client_portal::DocumentRequest>> {
    let caller = ic_cdk::caller();
    client_portal::get_document_requests_for_engagement(caller, engagement_id)
}

#[query]
fn get_my_document_requests() -> Result<Vec<client_portal::DocumentRequest>> {
    let caller = ic_cdk::caller();
    client_portal::get_my_document_requests(caller)
}

#[update]
fn fulfill_document_request(
    input: client_portal::FulfillDocumentRequestInput,
) -> Result<client_portal::DocumentRequest> {
    let caller = ic_cdk::caller();
    client_portal::fulfill_document_request(caller, input)
}

#[update]
fn approve_document_request(
    input: client_portal::ApproveDocumentInput,
) -> Result<client_portal::DocumentRequest> {
    let caller = ic_cdk::caller();
    client_portal::approve_document_request(caller, input)
}

#[query]
fn get_client_access_for_engagement(
    engagement_id: u64,
) -> Result<Vec<client_portal::ClientAccess>> {
    let caller = ic_cdk::caller();
    client_portal::get_client_access_for_engagement(caller, engagement_id)
}

// ============================================================================
// Audit Templates
// ============================================================================

#[update]
fn create_template(req: templates::CreateTemplateRequest) -> Result<templates::AuditTemplate> {
    let caller = ic_cdk::caller();
    templates::create_template(caller, req)
}

#[query]
fn list_templates() -> Result<Vec<templates::AuditTemplate>> {
    let caller = ic_cdk::caller();
    templates::list_templates(caller)
}

#[query]
fn get_template(template_id: u64) -> Result<templates::AuditTemplate> {
    let caller = ic_cdk::caller();
    templates::get_template(caller, template_id)
}

#[update]
fn apply_template_to_engagement(
    req: templates::ApplyTemplateRequest,
) -> Result<templates::EngagementChecklist> {
    let caller = ic_cdk::caller();
    templates::apply_template_to_engagement(caller, req)
}

#[query]
fn get_engagement_checklists(engagement_id: u64) -> Result<Vec<templates::EngagementChecklist>> {
    let caller = ic_cdk::caller();
    templates::get_engagement_checklists(caller, engagement_id)
}

#[update]
fn update_checklist_item(
    req: templates::UpdateChecklistItemRequest,
) -> Result<templates::EngagementChecklist> {
    let caller = ic_cdk::caller();
    templates::update_checklist_item(caller, req)
}

// ============================================================================
// Trial Balance
// ============================================================================

#[update]
fn create_trial_balance(req: CreateTrialBalanceRequest) -> Result<TrialBalance> {
    let caller = ic_cdk::caller();
    trial_balance::create_trial_balance(caller, req)
}

#[update]
fn add_trial_balance_account(
    trial_balance_id: u64,
    req: UpdateAccountRequest,
) -> Result<TrialBalanceAccount> {
    let caller = ic_cdk::caller();
    trial_balance::add_account(caller, trial_balance_id, req)
}

#[query]
fn get_trial_balance(id: u64) -> Result<TrialBalance> {
    let caller = ic_cdk::caller();
    trial_balance::get_trial_balance(caller, id)
}

#[query]
fn get_trial_balance_accounts(trial_balance_id: u64) -> Result<Vec<TrialBalanceAccount>> {
    let caller = ic_cdk::caller();
    trial_balance::get_accounts(caller, trial_balance_id)
}

#[query]
fn list_trial_balances_by_engagement(engagement_id: u64) -> Result<Vec<TrialBalance>> {
    let caller = ic_cdk::caller();
    trial_balance::list_trial_balances_by_engagement(caller, engagement_id)
}

#[query]
fn validate_trial_balance(trial_balance_id: u64) -> Result<trial_balance::TrialBalanceValidation> {
    let caller = ic_cdk::caller();
    trial_balance::validate_trial_balance(caller, trial_balance_id)
}

#[update]
fn map_account_to_fs_line(account_id: u64, fs_line_item: String) -> Result<TrialBalanceAccount> {
    let caller = ic_cdk::caller();
    trial_balance::map_to_fs_line(caller, account_id, fs_line_item)
}

#[update]
fn import_trial_balance_csv(
    engagement_id: u64,
    period_end_date: String,
    csv_data: Vec<trial_balance::CsvAccountRow>,
) -> Result<TrialBalance> {
    let caller = ic_cdk::caller();
    trial_balance::import_trial_balance_csv(caller, engagement_id, period_end_date, csv_data)
}

// ============================================================================
// Adjusting Journal Entries
// ============================================================================

#[update]
fn create_aje(req: CreateAjeRequest) -> Result<AdjustingJournalEntry> {
    let caller = ic_cdk::caller();
    adjustments::create_aje(caller, req)
}

#[update]
fn submit_aje(aje_id: u64) -> Result<AdjustingJournalEntry> {
    let caller = ic_cdk::caller();
    adjustments::submit_aje(caller, aje_id)
}

#[update]
fn review_aje(aje_id: u64, approved: bool) -> Result<AdjustingJournalEntry> {
    let caller = ic_cdk::caller();
    adjustments::review_aje(caller, aje_id, approved)
}

#[update]
fn approve_aje(aje_id: u64) -> Result<AdjustingJournalEntry> {
    let caller = ic_cdk::caller();
    adjustments::approve_aje(caller, aje_id)
}

#[update]
fn post_aje(aje_id: u64) -> Result<AdjustingJournalEntry> {
    let caller = ic_cdk::caller();
    adjustments::post_aje(caller, aje_id)
}

#[query]
fn get_aje(aje_id: u64) -> Result<AdjustingJournalEntry> {
    let caller = ic_cdk::caller();
    adjustments::get_aje(caller, aje_id)
}

#[query]
fn get_aje_line_items(aje_id: u64) -> Result<Vec<AjeLineItem>> {
    let caller = ic_cdk::caller();
    adjustments::get_aje_line_items(caller, aje_id)
}

#[query]
fn list_ajes_by_engagement(engagement_id: u64) -> Result<Vec<AdjustingJournalEntry>> {
    let caller = ic_cdk::caller();
    adjustments::list_ajes_by_engagement(caller, engagement_id)
}

#[query]
fn verify_aje_blockchain(aje_id: u64) -> Result<adjustments::AjeBlockchainVerification> {
    let caller = ic_cdk::caller();
    adjustments::verify_aje_blockchain(caller, aje_id)
}

// ============================================================================
// Financial Statements API
// ============================================================================

#[update]
fn generate_financial_statements(request: GenerateFSRequest) -> Result<FinancialStatement> {
    let caller = ic_cdk::caller();
    financial_statements::generate_financial_statements(caller, request)
}

#[query]
fn get_financial_statement(fs_id: u64) -> Result<FinancialStatement> {
    let caller = ic_cdk::caller();
    financial_statements::get_financial_statement(caller, fs_id)
}

#[query]
fn list_financial_statements_by_engagement(engagement_id: u64) -> Result<Vec<FinancialStatement>> {
    let caller = ic_cdk::caller();
    financial_statements::list_financial_statements_by_engagement(caller, engagement_id)
}

#[update]
fn update_fs_line_mapping(request: UpdateFSLineMappingRequest) -> Result<()> {
    let caller = ic_cdk::caller();
    financial_statements::update_fs_line_mapping(caller, request)
}

#[update]
fn add_fs_note(request: AddFSNoteRequest) -> Result<()> {
    let caller = ic_cdk::caller();
    financial_statements::add_fs_note(caller, request)
}

#[query]
fn get_line_items_for_taxonomy(taxonomy: XBRLTaxonomy) -> Vec<FSLineItem> {
    financial_statements::get_line_items_for_taxonomy(&taxonomy)
}

// ============================================================================
// PHASE 1: PRE-ENGAGEMENT & SETUP
// ============================================================================

#[update]
fn create_client_acceptance(request: CreateClientAcceptanceRequest) -> Result<ClientAcceptance> {
    let caller = ic_cdk::caller();
    pre_engagement::create_client_acceptance(caller, request)
}

#[update]
fn approve_client_acceptance(acceptance_id: u64) -> Result<ClientAcceptance> {
    let caller = ic_cdk::caller();
    pre_engagement::approve_client_acceptance(caller, acceptance_id)
}

#[query]
fn list_client_acceptances_by_client(client_id: u64) -> Result<Vec<ClientAcceptance>> {
    let caller = ic_cdk::caller();
    pre_engagement::list_client_acceptances_by_client(caller, client_id)
}

#[update]
fn create_engagement_letter(request: CreateEngagementLetterRequest) -> Result<EngagementLetter> {
    let caller = ic_cdk::caller();
    pre_engagement::create_engagement_letter(caller, request)
}

#[update]
fn send_engagement_letter(letter_id: u64) -> Result<EngagementLetter> {
    let caller = ic_cdk::caller();
    pre_engagement::send_engagement_letter(caller, letter_id)
}

#[update]
fn sign_engagement_letter(request: SignEngagementLetterRequest) -> Result<EngagementLetter> {
    let caller = ic_cdk::caller();
    pre_engagement::sign_engagement_letter(caller, request)
}

#[query]
fn list_engagement_letters_by_client(client_id: u64) -> Result<Vec<EngagementLetter>> {
    let caller = ic_cdk::caller();
    pre_engagement::list_engagement_letters_by_client(caller, client_id)
}

#[update]
fn create_conflict_check(request: CreateConflictCheckRequest) -> Result<ConflictCheck> {
    let caller = ic_cdk::caller();
    pre_engagement::create_conflict_check(caller, request)
}

#[query]
fn list_conflict_checks_by_client(client_id: u64) -> Result<Vec<ConflictCheck>> {
    let caller = ic_cdk::caller();
    pre_engagement::list_conflict_checks_by_client(caller, client_id)
}

// ============================================================================
// ENGAGEMENT PLANNING & SETUP
// ============================================================================

#[update]
fn create_engagement_setup_template(request: CreateEngagementSetupTemplateRequest) -> Result<EngagementSetupTemplate> {
    let caller = ic_cdk::caller();
    engagement_planning::create_engagement_setup_template(caller, request)
}

#[query]
fn list_engagement_templates() -> Result<Vec<EngagementSetupTemplate>> {
    let caller = ic_cdk::caller();
    engagement_planning::list_engagement_templates(caller)
}

#[update]
fn create_engagement_from_template(request: CreateEngagementFromTemplateRequest) -> Result<(Engagement, Vec<EngagementMilestone>)> {
    let caller = ic_cdk::caller();
    engagement_planning::create_engagement_from_template(caller, request)
}

#[update]
fn create_milestone(request: CreateMilestoneRequest) -> Result<EngagementMilestone> {
    let caller = ic_cdk::caller();
    engagement_planning::create_milestone(caller, request)
}

#[update]
fn update_milestone(request: UpdateMilestoneRequest) -> Result<EngagementMilestone> {
    let caller = ic_cdk::caller();
    engagement_planning::update_milestone(caller, request)
}

#[query]
fn list_milestones_by_engagement(engagement_id: u64) -> Result<Vec<EngagementMilestone>> {
    let caller = ic_cdk::caller();
    engagement_planning::list_milestones_by_engagement(caller, engagement_id)
}

#[update]
fn create_budget(request: CreateBudgetRequest) -> Result<EngagementBudget> {
    let caller = ic_cdk::caller();
    engagement_planning::create_budget(caller, request)
}

#[update]
fn create_time_entry(request: CreateTimeEntryRequest) -> Result<TimeEntry> {
    let caller = ic_cdk::caller();
    engagement_planning::create_time_entry(caller, request)
}

#[query]
fn list_time_entries_by_engagement(engagement_id: u64) -> Result<Vec<TimeEntry>> {
    let caller = ic_cdk::caller();
    engagement_planning::list_time_entries_by_engagement(caller, engagement_id)
}

#[query]
fn get_engagement_dashboard(engagement_id: u64) -> Result<EngagementDashboard> {
    let caller = ic_cdk::caller();
    engagement_planning::get_engagement_dashboard(caller, engagement_id)
}

// Export candid interface
ic_cdk::export_candid!();

