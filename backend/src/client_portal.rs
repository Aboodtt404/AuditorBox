use candid::{encode_args, CandidType, Deserialize, Principal};
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

// Engagement Invitation - email-based invitation system
#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct EngagementInvitation {
    pub id: u64,
    pub engagement_id: u64,
    pub engagement_name: String, // Cache for display
    pub invited_email: String,
    pub invited_by: Principal,
    pub invited_by_name: String, // Cache for display
    pub invited_at: u64,
    pub access_level: ClientAccessLevel,
    pub status: InvitationStatus,
    pub accepted_at: Option<u64>,
    pub accepted_by: Option<Principal>, // Actual principal who accepted
    pub rejected_at: Option<u64>,
    pub rejection_reason: Option<String>,
    pub message: Option<String>, // Optional message from inviter
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum InvitationStatus {
    Pending,
    Accepted,
    Rejected,
    Expired,
    Cancelled,
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

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CreateInvitationRequest {
    pub engagement_id: u64,
    pub invited_email: String,
    pub access_level: ClientAccessLevel,
    pub message: Option<String>,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct AcceptInvitationRequest {
    pub invitation_id: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct RejectInvitationRequest {
    pub invitation_id: u64,
    pub reason: Option<String>,
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
        "create_document_request".to_string(),
        "document_request".to_string(),
        request.id.to_string(),
        format!("Document request {} created", request.id),
        encode_args((request.clone(),)).ok(),
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
        "client_access".to_string(),
        input.engagement_id.to_string(),
        format!(
            "Granted client access to engagement for {}",
            input.client_principal.to_text()
        ),
        None,
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

// Get list of engagements the current client has access to
pub fn get_my_engagements(caller: Principal) -> Result<Vec<(u64, String, String)>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    // Get all engagements this client has access to
    let accessible_engagement_ids: Vec<u64> = STORAGE.with(|storage| {
        storage
            .borrow()
            .client_access
            .iter()
            .filter(|(key, _)| key.0.starts_with(&caller.to_text()))
            .map(|(_, access)| access.engagement_id)
            .collect()
    });

    // Fetch engagement details
    let engagements: Vec<(u64, String, String)> = STORAGE.with(|storage| {
        accessible_engagement_ids
            .iter()
            .filter_map(|&eng_id| {
                storage
                    .borrow()
                    .engagements
                    .get(&eng_id)
                    .map(|eng| (eng.id, eng.name.clone(), eng.status.clone()))
            })
            .collect()
    });

    Ok(engagements)
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
        "fulfill_document_request".to_string(),
        "document_request".to_string(),
        request.id.to_string(),
        format!("Document request {} fulfilled", request.id),
        encode_args((request.clone(),)).ok(),
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
        "document_request".to_string(),
        request.id.to_string(),
        format!(
            "{} document request: {}{}",
            if input.approved { "Approved" } else { "Rejected" },
            request.title,
            input.rejection_reason.map(|r| format!(" - Reason: {}", r)).unwrap_or_default()
        ),
        encode_args((request.clone(),)).ok(),
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

// ============================================================================
// Invitation System
// ============================================================================

// Create an invitation (email-based)
pub fn create_invitation(
    caller: Principal,
    input: CreateInvitationRequest,
) -> Result<EngagementInvitation> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Only senior and above can send invitations
    if !auth::is_senior_or_above(&user) {
        return Err("Insufficient permissions to send invitations".to_string());
    }

    // Verify engagement exists
    let engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&input.engagement_id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    // Validate email format
    if !input.invited_email.contains('@') {
        return Err("Invalid email address".to_string());
    }

    // Check if there's already a pending invitation for this email + engagement
    let existing_invitation = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagement_invitations
            .iter()
            .find(|(_, inv)| {
                inv.engagement_id == input.engagement_id
                    && inv.invited_email == input.invited_email
                    && inv.status == InvitationStatus::Pending
            })
            .map(|(_, inv)| inv)
    });

    if existing_invitation.is_some() {
        return Err("An invitation to this email for this engagement already exists".to_string());
    }

    let id = STORAGE.with(|storage| {
        let borrowed = storage.borrow_mut();
        let current_max = borrowed
            .engagement_invitations
            .iter()
            .map(|(_, inv)| inv.id)
            .max()
            .unwrap_or(0);
        current_max + 1
    });

    let invitation = EngagementInvitation {
        id,
        engagement_id: input.engagement_id,
        engagement_name: engagement.name.clone(),
        invited_email: input.invited_email.clone(),
        invited_by: caller,
        invited_by_name: user.name.clone(),
        invited_at: time(),
        access_level: input.access_level.clone(),
        status: InvitationStatus::Pending,
        accepted_at: None,
        accepted_by: None,
        rejected_at: None,
        rejection_reason: None,
        message: input.message.clone(),
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagement_invitations
            .insert(invitation.id, invitation.clone());
    });

    log_activity(
        caller,
        "create_invitation".to_string(),
        "engagement_invitation".to_string(),
        invitation.id.to_string(),
        format!(
            "Sent invitation to {} for engagement {}",
            input.invited_email, engagement.name
        ),
        encode_args((invitation.clone(),)).ok(),
    );

    Ok(invitation)
}

// Get invitations for current user (by email)
pub fn get_my_invitations(caller: Principal) -> Result<Vec<EngagementInvitation>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Must be a client user
    if !auth::is_client_user(&user) {
        return Err("Only client users can view invitations".to_string());
    }

    let invitations = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagement_invitations
            .iter()
            .filter(|(_, inv)| {
                inv.invited_email.to_lowercase() == user.email.to_lowercase()
                    && inv.status == InvitationStatus::Pending
            })
            .map(|(_, inv)| inv)
            .collect()
    });

    Ok(invitations)
}

// Accept invitation
pub fn accept_invitation(
    caller: Principal,
    input: AcceptInvitationRequest,
) -> Result<ClientAccess> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Must be a client user
    if !auth::is_client_user(&user) {
        return Err("Only client users can accept invitations".to_string());
    }

    let mut invitation = STORAGE
        .with(|storage| storage.borrow().engagement_invitations.get(&input.invitation_id))
        .ok_or_else(|| "Invitation not found".to_string())?;

    // Verify email matches
    if invitation.invited_email.to_lowercase() != user.email.to_lowercase() {
        return Err("This invitation was not sent to your email address".to_string());
    }

    // Check status
    if invitation.status != InvitationStatus::Pending {
        return Err(format!("Invitation is no longer pending (status: {:?})", invitation.status));
    }

    // Update invitation status
    invitation.status = InvitationStatus::Accepted;
    invitation.accepted_at = Some(time());
    invitation.accepted_by = Some(caller);

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagement_invitations
            .insert(invitation.id, invitation.clone());
    });

    // Grant access
    let access = ClientAccess {
        principal: caller,
        engagement_id: invitation.engagement_id,
        granted_by: invitation.invited_by,
        granted_at: time(),
        access_level: invitation.access_level.clone(),
    };

    let key = StorableString(format!("{}:{}", caller.to_text(), invitation.engagement_id));

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .client_access
            .insert(key, access.clone());
    });

    log_activity(
        caller,
        "accept_invitation".to_string(),
        "engagement_invitation".to_string(),
        invitation.id.to_string(),
        format!(
            "Accepted invitation to engagement {}",
            invitation.engagement_name
        ),
        encode_args((access.clone(),)).ok(),
    );

    Ok(access)
}

// Reject invitation
pub fn reject_invitation(
    caller: Principal,
    input: RejectInvitationRequest,
) -> Result<EngagementInvitation> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Must be a client user
    if !auth::is_client_user(&user) {
        return Err("Only client users can reject invitations".to_string());
    }

    let mut invitation = STORAGE
        .with(|storage| storage.borrow().engagement_invitations.get(&input.invitation_id))
        .ok_or_else(|| "Invitation not found".to_string())?;

    // Verify email matches
    if invitation.invited_email.to_lowercase() != user.email.to_lowercase() {
        return Err("This invitation was not sent to your email address".to_string());
    }

    // Check status
    if invitation.status != InvitationStatus::Pending {
        return Err(format!("Invitation is no longer pending (status: {:?})", invitation.status));
    }

    // Update invitation status
    invitation.status = InvitationStatus::Rejected;
    invitation.rejected_at = Some(time());
    invitation.rejection_reason = input.reason.clone();

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagement_invitations
            .insert(invitation.id, invitation.clone());
    });

    log_activity(
        caller,
        "reject_invitation".to_string(),
        "engagement_invitation".to_string(),
        invitation.id.to_string(),
        format!(
            "Rejected invitation to engagement {}",
            invitation.engagement_name
        ),
        encode_args((invitation.clone(),)).ok(),
    );

    Ok(invitation)
}

// Get all invitations for an engagement (firm view)
pub fn get_invitations_for_engagement(
    caller: Principal,
    engagement_id: u64,
) -> Result<Vec<EngagementInvitation>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_staff_or_above(&user) {
        return Err("Insufficient permissions".to_string());
    }

    let invitations = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagement_invitations
            .iter()
            .filter(|(_, inv)| inv.engagement_id == engagement_id)
            .map(|(_, inv)| inv)
            .collect()
    });

    Ok(invitations)
}

