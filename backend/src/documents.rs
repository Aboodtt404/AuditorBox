use candid::Principal;
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{next_document_id, STORAGE};
use crate::types::{Document, Result, UploadDocumentRequest};

const CHUNK_SIZE: usize = 1_000_000; // 1MB chunks

// Upload document
pub fn upload_document(caller: Principal, req: UploadDocumentRequest) -> Result<Document> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_upload_document(&user) {
        return Err("Insufficient permissions to upload document".to_string());
    }

    // Verify organization/entity exists if specified
    if let Some(org_id) = req.organization_id {
        STORAGE
            .with(|storage| storage.borrow().organizations.get(&org_id))
            .ok_or_else(|| "Organization not found".to_string())?;
    }

    if let Some(entity_id) = req.entity_id {
        STORAGE
            .with(|storage| storage.borrow().entities.get(&entity_id))
            .ok_or_else(|| "Entity not found".to_string())?;
    }

    // Split file data into chunks
    let chunks = chunk_data(&req.file_data);

    let document = Document {
        id: next_document_id(),
        name: req.name.clone(),
        file_type: req.file_type,
        file_size: req.file_data.len() as u64,
        organization_id: req.organization_id,
        entity_id: req.entity_id,
        category: req.category,
        data_chunks: chunks,
        created_at: time(),
        created_by: caller,
        access_principals: vec![caller], // Creator has access by default
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .documents
            .insert(document.id, document.clone());
    });

    log_activity(
        caller,
        "UPLOAD".to_string(),
        "Document".to_string(),
        document.id.to_string(),
        format!("Uploaded document: {}", req.name),
    );

    Ok(document)
}

// Chunk data into smaller pieces
fn chunk_data(data: &[u8]) -> Vec<Vec<u8>> {
    data.chunks(CHUNK_SIZE)
        .map(|chunk| chunk.to_vec())
        .collect()
}

// Get document by ID
pub fn get_document(caller: Principal, id: u64) -> Result<Document> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    let document = STORAGE
        .with(|storage| storage.borrow().documents.get(&id))
        .ok_or_else(|| "Document not found".to_string())?;

    // Check access permissions
    if !can_access_document(&user.principal, &document) {
        return Err("Insufficient permissions to access document".to_string());
    }

    Ok(document)
}

// Download document data
pub fn download_document(caller: Principal, id: u64) -> Result<Vec<u8>> {
    let document = get_document(caller, id)?;

    // Reassemble chunks
    let data: Vec<u8> = document
        .data_chunks
        .iter()
        .flat_map(|chunk| chunk.iter().cloned())
        .collect();

    log_activity(
        caller,
        "DOWNLOAD".to_string(),
        "Document".to_string(),
        id.to_string(),
        format!("Downloaded document: {}", document.name),
    );

    Ok(data)
}

// List documents
pub fn list_documents(caller: Principal) -> Result<Vec<Document>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    let documents: Vec<Document> = STORAGE.with(|storage| {
        storage
            .borrow()
            .documents
            .iter()
            .filter(|(_, doc)| can_access_document(&user.principal, doc))
            .map(|(_, doc)| {
                // Return document without data chunks for listing
                let mut doc_copy = doc.clone();
                doc_copy.data_chunks = Vec::new();
                doc_copy
            })
            .collect()
    });

    Ok(documents)
}

// List documents by organization
pub fn list_documents_by_organization(
    caller: Principal,
    org_id: u64,
) -> Result<Vec<Document>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    let documents: Vec<Document> = STORAGE.with(|storage| {
        storage
            .borrow()
            .documents
            .iter()
            .filter(|(_, doc)| {
                doc.organization_id == Some(org_id)
                    && can_access_document(&user.principal, doc)
            })
            .map(|(_, doc)| {
                let mut doc_copy = doc.clone();
                doc_copy.data_chunks = Vec::new();
                doc_copy
            })
            .collect()
    });

    Ok(documents)
}

// List documents by entity
pub fn list_documents_by_entity(caller: Principal, entity_id: u64) -> Result<Vec<Document>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    let documents: Vec<Document> = STORAGE.with(|storage| {
        storage
            .borrow()
            .documents
            .iter()
            .filter(|(_, doc)| {
                doc.entity_id == Some(entity_id) && can_access_document(&user.principal, doc)
            })
            .map(|(_, doc)| {
                let mut doc_copy = doc.clone();
                doc_copy.data_chunks = Vec::new();
                doc_copy
            })
            .collect()
    });

    Ok(documents)
}

// Grant access to document
pub fn grant_document_access(
    caller: Principal,
    document_id: u64,
    principal: Principal,
) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Only managers and above can grant access
    if !auth::is_manager_or_above(&user) {
        return Err("Insufficient permissions to grant access".to_string());
    }

    let mut document = STORAGE
        .with(|storage| storage.borrow().documents.get(&document_id))
        .ok_or_else(|| "Document not found".to_string())?;

    if !document.access_principals.contains(&principal) {
        document.access_principals.push(principal);
        STORAGE.with(|storage| {
            storage
                .borrow_mut()
                .documents
                .insert(document.id, document);
        });

        log_activity(
            caller,
            "GRANT_ACCESS".to_string(),
            "Document".to_string(),
            document_id.to_string(),
            format!("Granted access to principal: {}", principal),
        );
    }

    Ok(())
}

// Revoke access to document
pub fn revoke_document_access(
    caller: Principal,
    document_id: u64,
    principal: Principal,
) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    // Only managers and above can revoke access
    if !auth::is_manager_or_above(&user) {
        return Err("Insufficient permissions to revoke access".to_string());
    }

    let mut document = STORAGE
        .with(|storage| storage.borrow().documents.get(&document_id))
        .ok_or_else(|| "Document not found".to_string())?;

    document.access_principals.retain(|p| p != &principal);

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .documents
            .insert(document.id, document);
    });

    log_activity(
        caller,
        "REVOKE_ACCESS".to_string(),
        "Document".to_string(),
        document_id.to_string(),
        format!("Revoked access from principal: {}", principal),
    );

    Ok(())
}

// Delete document
pub fn delete_document(caller: Principal, id: u64) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    let document = STORAGE
        .with(|storage| storage.borrow().documents.get(&id))
        .ok_or_else(|| "Document not found".to_string())?;

    // Only creator or managers can delete
    if document.created_by != caller && !auth::is_manager_or_above(&user) {
        return Err("Insufficient permissions to delete document".to_string());
    }

    STORAGE.with(|storage| {
        storage.borrow_mut().documents.remove(&id);
    });

    log_activity(
        caller,
        "DELETE".to_string(),
        "Document".to_string(),
        id.to_string(),
        format!("Deleted document: {}", document.name),
    );

    Ok(())
}

// Check if user can access document
fn can_access_document(principal: &Principal, document: &Document) -> bool {
    // Document creator always has access
    if document.created_by == *principal {
        return true;
    }

    // Check if principal is in access list
    if document.access_principals.contains(principal) {
        return true;
    }

    // Admins always have access
    if let Some(user) = auth::get_user(*principal) {
        if auth::is_admin(&user) {
            return true;
        }
    }

    false
}

