use candid::Principal;
use ic_cdk_macros::{init, query, update};

mod activity_log;
mod auth;
mod clients;
mod data_import;
mod documents;
mod engagements;
mod entities;
mod organizations;
mod storage;
mod types;
mod working_papers;

use types::*;

// Initialize canister
#[init]
fn init() {
    ic_cdk::println!("AuditorBox canister initialized");
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

// Export candid interface
ic_cdk::export_candid!();

