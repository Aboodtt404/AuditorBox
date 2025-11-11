use candid::Principal;
use ic_cdk::api::time;
use candid::encode_args;

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

    let organization = Organization {
        id: next_org_id(),
        name: req.name,
        description: req.description,
        created_at: time(),
        created_by: caller,
        entity_ids: Vec::new(),
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.insert(organization.id, organization.clone());
    });

    let snapshot = encode_args((organization.clone(),)).ok();
    log_activity(
        caller,
        "create_organization".to_string(),
        "organization".to_string(),
        organization.id.to_string(),
        format!("Organization {} created", organization.name),
        snapshot,
    );

    Ok(organization)
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

    let mut organization = STORAGE
        .with(|storage| storage.borrow().organizations.get(&req.id))
        .ok_or_else(|| "Organization not found".to_string())?;

    organization.name = req.name;
    organization.description = req.description;

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.insert(organization.id, organization.clone());
    });

    let snapshot = encode_args((organization.clone(),)).ok();
    log_activity(
        caller,
        "update_organization".to_string(),
        "organization".to_string(),
        organization.id.to_string(),
        format!("Organization {} updated", organization.name),
        snapshot,
    );

    Ok(organization)
}

// Delete organization
pub fn delete_organization(caller: Principal, id: u64) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_delete_organization(&user) {
        return Err("Insufficient permissions to delete organization".to_string());
    }

    let organization = STORAGE
        .with(|storage| storage.borrow().organizations.get(&id))
        .ok_or_else(|| "Organization not found".to_string())?;

    // Check if organization has entities
    if !organization.entity_ids.is_empty() {
        return Err("Cannot delete organization with entities".to_string());
    }

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.remove(&id);
    });

    let snapshot = encode_args((organization.clone(),)).ok();
    log_activity(
        caller,
        "delete_organization".to_string(),
        "organization".to_string(),
        id.to_string(),
        format!("Organization {} deleted", organization.name),
        snapshot,
    );

    Ok(())
}

// Add entity to organization (internal use)
pub fn add_entity_to_organization(org_id: u64, entity_id: u64) -> Result<()> {
    let mut organization = STORAGE
        .with(|storage| storage.borrow().organizations.get(&org_id))
        .ok_or_else(|| "Organization not found".to_string())?;

    if !organization.entity_ids.contains(&entity_id) {
        organization.entity_ids.push(entity_id);
        STORAGE.with(|storage| {
            storage.borrow_mut().organizations.insert(organization.id, organization);
        });
    }

    Ok(())
}

// Remove entity from organization (internal use)
pub fn remove_entity_from_organization(org_id: u64, entity_id: u64) -> Result<()> {
    let mut organization = STORAGE
        .with(|storage| storage.borrow().organizations.get(&org_id))
        .ok_or_else(|| "Organization not found".to_string())?;

    organization.entity_ids.retain(|&id| id != entity_id);

    STORAGE.with(|storage| {
        storage.borrow_mut().organizations.insert(organization.id, organization);
    });

    Ok(())
}

