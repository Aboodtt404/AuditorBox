use candid::Principal;
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{next_org_id, STORAGE};
use crate::types::{CreateOrganizationRequest, Organization, Result, UpdateOrganizationRequest};

// Create organization
pub fn create_organization(caller: Principal, req: CreateOrganizationRequest) -> Result<Organization> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_organization(&user) {
        return Err("Insufficient permissions to create organization".to_string());
    }

    let org = Organization {
        id: next_org_id(),
        name: req.name,
        description: req.description,
        created_at: time(),
        created_by: caller,
        entity_ids: Vec::new(),
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.insert(org.id, org.clone());
    });

    log_activity(
        caller,
        "CREATE".to_string(),
        "Organization".to_string(),
        org.id.to_string(),
        format!("Created organization: {}", org.name),
    );

    Ok(org)
}

// Get organization by ID
pub fn get_organization(caller: Principal, id: u64) -> Result<Organization> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().organizations.get(&id))
        .ok_or_else(|| "Organization not found".to_string())
}

// List all organizations
pub fn list_organizations(caller: Principal) -> Result<Vec<Organization>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let orgs = STORAGE.with(|storage| {
        storage
            .borrow()
            .organizations
            .iter()
            .map(|(_, org)| org)
            .collect()
    });

    Ok(orgs)
}

// Update organization
pub fn update_organization(caller: Principal, req: UpdateOrganizationRequest) -> Result<Organization> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_organization(&user) {
        return Err("Insufficient permissions to update organization".to_string());
    }

    let mut org = STORAGE
        .with(|storage| storage.borrow().organizations.get(&req.id))
        .ok_or_else(|| "Organization not found".to_string())?;

    org.name = req.name;
    org.description = req.description;

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.insert(org.id, org.clone());
    });

    log_activity(
        caller,
        "UPDATE".to_string(),
        "Organization".to_string(),
        org.id.to_string(),
        format!("Updated organization: {}", org.name),
    );

    Ok(org)
}

// Delete organization
pub fn delete_organization(caller: Principal, id: u64) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_delete_organization(&user) {
        return Err("Insufficient permissions to delete organization".to_string());
    }

    let org = STORAGE
        .with(|storage| storage.borrow().organizations.get(&id))
        .ok_or_else(|| "Organization not found".to_string())?;

    // Check if organization has entities
    if !org.entity_ids.is_empty() {
        return Err("Cannot delete organization with entities".to_string());
    }

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.remove(&id);
    });

    log_activity(
        caller,
        "DELETE".to_string(),
        "Organization".to_string(),
        id.to_string(),
        format!("Deleted organization: {}", org.name),
    );

    Ok(())
}

// Add entity to organization (internal use)
pub fn add_entity_to_organization(org_id: u64, entity_id: u64) -> Result<()> {
    let mut org = STORAGE
        .with(|storage| storage.borrow().organizations.get(&org_id))
        .ok_or_else(|| "Organization not found".to_string())?;

    if !org.entity_ids.contains(&entity_id) {
        org.entity_ids.push(entity_id);
        STORAGE.with(|storage| {
            storage.borrow_mut().organizations.insert(org.id, org);
        });
    }

    Ok(())
}

// Remove entity from organization (internal use)
pub fn remove_entity_from_organization(org_id: u64, entity_id: u64) -> Result<()> {
    let mut org = STORAGE
        .with(|storage| storage.borrow().organizations.get(&org_id))
        .ok_or_else(|| "Organization not found".to_string())?;

    org.entity_ids.retain(|&id| id != entity_id);

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.insert(org.id, org);
    });

    Ok(())
}

