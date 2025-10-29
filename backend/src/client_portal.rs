use candid::{CandidType, Deserialize, Principal};
use ic_cdk::api::time;
use serde::Serialize;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{next_document_id, StorableString, STORAGE};
use crate::types::Result;

// Document Request - firm requests document from client
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct DocumentRequest {
    pub id: u64,
    pub engagement_id: u64,
    pub title: String,
    pub description: String,
    pub requested_by: Principal,
    pub requested_from_principal: Option<Principal>, // Specific client, or any client for engagement
    pub due_date: Option<u64>,
    pub status: DocumentRequestStatus,
    pub created_at: u64,
    pub fulfilled_at: Option<u64>,
    pub fulfilled_document_id: Option<u64>,
    pub category: String, // e.g., "Bank Statement", "Invoice", "Contract"
    pub is_required: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum DocumentRequestStatus {
    Pending,
    Uploaded,
    Approved,
    Rejected,
    Cancelled,
}

// Client Access - links clients to engagements
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ClientAccess {
    pub principal: Principal,
    pub engagement_id: u64,
    pub granted_by: Principal,
    pub granted_at: u64,
    pub access_level: ClientAccessLevel,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum ClientAccessLevel {
    ViewOnly,
    UploadDocuments,
    Full,
}

// Request Types
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateDocumentRequestInput {
    pub engagement_id: u64,
    pub title: String,
    pub description: String,
    pub requested_from_principal: Option<Principal>,
    pub due_date: Option<u64>,
    pub category: String,
    pub is_required: bool,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct GrantClientAccessRequest {
    pub client_principal: Principal,
    pub engagement_id: u64,
    pub access_level: ClientAccessLevel,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct FulfillDocumentRequestInput {
    pub request_id: u64,
    pub document_name: String,
    pub file_type: String,
    pub file_data: Vec<u8>,
    pub category: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ApproveDocumentInput {
    pub request_id: u64,
    pub approved: bool,
    pub rejection_reason: Option<String>,
}

// Create a document request
pub fn create_document_request(
    caller: Principal,
    input: CreateDocumentRequestInput,
) -> Result<DocumentRequest> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Only staff and above can create document requests
    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to create document requests".to_string());
    }

    // Verify engagement exists
    STORAGE
        .with(|storage| storage.borrow().engagements.get(&input.engagement_id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    let id = STORAGE.with(|storage| {
        let borrowed = storage.borrow_mut();
        let current_max = borrowed
            .client_portal_requests
            .iter()
            .map(|(_, req)| req.id)
            .max()
            .unwrap_or(0);
        current_max + 1
    });

    let request = DocumentRequest {
        id,
        engagement_id: input.engagement_id,
        title: input.title.clone(),
        description: input.description,
        requested_by: caller,
        requested_from_principal: input.requested_from_principal,
        due_date: input.due_date,
        status: DocumentRequestStatus::Pending,
        created_at: time(),
        fulfilled_at: None,
        fulfilled_document_id: None,
        category: input.category,
        is_required: input.is_required,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .client_portal_requests
            .insert(request.id, request.clone());
    });

    log_activity(
        caller,
        "CREATE".to_string(),
        "DocumentRequest".to_string(),
        request.id.to_string(),
        format!("Created document request: {}", input.title),
    );

    Ok(request)
}

// Grant client access to an engagement
pub fn grant_client_access(
    caller: Principal,
    input: GrantClientAccessRequest,
) -> Result<ClientAccess> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Only senior and above can grant client access
    if !auth::is_senior_or_above(&user) {
        return Err("Insufficient permissions to grant client access".to_string());
    }

    // Verify engagement exists
    STORAGE
        .with(|storage| storage.borrow().engagements.get(&input.engagement_id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    let access = ClientAccess {
        principal: input.client_principal,
        engagement_id: input.engagement_id,
        granted_by: caller,
        granted_at: time(),
        access_level: input.access_level,
    };

    let key = StorableString(format!("{}:{}", input.client_principal.to_text(), input.engagement_id));
    
    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .client_access
            .insert(key, access.clone());
    });

    log_activity(
        caller,
        "GRANT_ACCESS".to_string(),
        "ClientAccess".to_string(),
        input.engagement_id.to_string(),
        format!(
            "Granted client access to engagement for {}",
            input.client_principal.to_text()
        ),
    );

    Ok(access)
}

// Get document requests for an engagement (firm view)
pub fn get_document_requests_for_engagement(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<DocumentRequest>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Verify engagement exists and user has access
    STORAGE
        .with(|storage| storage.borrow().engagements.get(&engagement_id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions".to_string());
    }

    let requests = STORAGE.with(|storage| {
        storage
            .borrow()
            .client_portal_requests
            .iter()
            .filter(|(_, req)| req.engagement_id == engagement_id)
            .map(|(_, req)| req)
            .collect()
    });

    Ok(requests)
}

// Get document requests for client (client view)
pub fn get_my_document_requests(caller: Principal) -> Result<Vec<DocumentRequest>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Get all engagements this client has access to
    let accessible_engagements: Vec<u64> = STORAGE.with(|storage| {
        storage
            .borrow()
            .client_access
            .iter()
            .filter(|(key, _)| key.0.starts_with(&caller.to_text()))
            .map(|(_, access)| access.engagement_id)
            .collect()
    });

    let requests = STORAGE.with(|storage| {
        storage
            .borrow()
            .client_portal_requests
            .iter()
            .filter(|(_, req)| {
                // Include if: general request for any engagement client has access to,
                // or specifically requested from this client
                (accessible_engagements.contains(&req.engagement_id) && req.requested_from_principal.is_none())
                    || req.requested_from_principal == Some(caller)
            })
            .map(|(_, req)| req)
            .collect()
    });

    Ok(requests)
}

// Client fulfills a document request by uploading a document
pub fn fulfill_document_request(
    caller: Principal,
    input: FulfillDocumentRequestInput,
) -> Result<DocumentRequest> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    // Get the request
    let mut request = STORAGE
        .with(|storage| storage.borrow().client_portal_requests.get(&input.request_id))
        .ok_or_else(|| "Document request not found".to_string())?;

    // Verify client has access to this engagement
    let key = StorableString(format!("{}:{}", caller.to_text(), request.engagement_id));
    let has_access = STORAGE.with(|storage| storage.borrow().client_access.contains_key(&key));

    if !has_access && request.requested_from_principal != Some(caller) {
        return Err("You do not have access to fulfill this request".to_string());
    }

    if request.status != DocumentRequestStatus::Pending {
        return Err("Document request is not in pending status".to_string());
    }

    // Create document
    let document_id = next_document_id();
    let document = crate::types::Document {
        id: document_id,
        name: input.document_name,
        file_type: input.file_type,
        file_size: input.file_data.len() as u64,
        organization_id: None,
        entity_id: None,
        category: input.category,
        data_chunks: vec![input.file_data],
        created_at: time(),
        created_by: caller,
        access_principals: vec![caller, request.requested_by],
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .documents
            .insert(document_id, document);
    });

    // Update request
    request.status = DocumentRequestStatus::Uploaded;
    request.fulfilled_at = Some(time());
    request.fulfilled_document_id = Some(document_id);

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .client_portal_requests
            .insert(request.id, request.clone());
    });

    log_activity(
        caller,
        "FULFILL".to_string(),
        "DocumentRequest".to_string(),
        request.id.to_string(),
        format!("Fulfilled document request: {}", request.title),
    );

    Ok(request)
}

// Approve or reject an uploaded document
pub fn approve_document_request(
    caller: Principal,
    input: ApproveDocumentInput,
) -> Result<DocumentRequest> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions to approve documents".to_string());
    }

    let mut request = STORAGE
        .with(|storage| storage.borrow().client_portal_requests.get(&input.request_id))
        .ok_or_else(|| "Document request not found".to_string())?;

    if request.status != DocumentRequestStatus::Uploaded {
        return Err("Document request is not in uploaded status".to_string());
    }

    request.status = if input.approved {
        DocumentRequestStatus::Approved
    } else {
        DocumentRequestStatus::Rejected
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .client_portal_requests
            .insert(request.id, request.clone());
    });

    log_activity(
        caller,
        if input.approved { "APPROVE" } else { "REJECT" }.to_string(),
        "DocumentRequest".to_string(),
        request.id.to_string(),
        format!(
            "{} document request: {}{}",
            if input.approved { "Approved" } else { "Rejected" },
            request.title,
            input.rejection_reason.map(|r| format!(" - Reason: {}", r)).unwrap_or_default()
        ),
    );

    Ok(request)
}

// Get client access for an engagement
pub fn get_client_access_for_engagement(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<ClientAccess>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions".to_string());
    }

    let access_list = STORAGE.with(|storage| {
        storage
            .borrow()
            .client_access
            .iter()
            .filter(|(_, access)| access.engagement_id == engagement_id)
            .map(|(_, access)| access)
            .collect()
    });

    Ok(access_list)
}

// Check if caller is a client user with access to an engagement
pub fn has_client_access(caller: Principal, engagement_id: u64) -> bool {
    let key = StorableString(format!("{}:{}", caller.to_text(), engagement_id));
    STORAGE.with(|storage| storage.borrow().client_access.contains_key(&key))
}

