use candid::Principal;
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::organizations;
use crate::storage::{next_entity_id, STORAGE};
use crate::types::{CreateEntityRequest, Entity, Result, UpdateEntityRequest};

// Create entity
pub fn create_entity(caller: Principal, req: CreateEntityRequest) -> Result<Entity> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_entity(&user) {
        return Err("Insufficient permissions to create entity".to_string());
    }

    // Verify organization exists
    let _org = organizations::get_organization(caller, req.organization_id)?;

    let entity = Entity {
        id: next_entity_id(),
        organization_id: req.organization_id,
        name: req.name,
        description: req.description,
        taxonomy: req.taxonomy,
        taxonomy_config: req.taxonomy_config,
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().entities.insert(entity.id, entity.clone());
    });

    // Add entity to organization
    organizations::add_entity_to_organization(req.organization_id, entity.id)?;

    log_activity(
        caller,
        "CREATE".to_string(),
        "Entity".to_string(),
        entity.id.to_string(),
        format!("Created entity: {}", entity.name),
    );

    Ok(entity)
}

// Get entity by ID
pub fn get_entity(caller: Principal, id: u64) -> Result<Entity> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().entities.get(&id))
        .ok_or_else(|| "Entity not found".to_string())
}

// List all entities
pub fn list_entities(caller: Principal) -> Result<Vec<Entity>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let entities = STORAGE.with(|storage| {
        storage
            .borrow()
            .entities
            .iter()
            .map(|(_, entity)| entity)
            .collect()
    });

    Ok(entities)
}

// List entities by organization
pub fn list_entities_by_organization(caller: Principal, org_id: u64) -> Result<Vec<Entity>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let entities = STORAGE.with(|storage| {
        storage
            .borrow()
            .entities
            .iter()
            .filter(|(_, entity)| entity.organization_id == org_id)
            .map(|(_, entity)| entity)
            .collect()
    });

    Ok(entities)
}

// Update entity
pub fn update_entity(caller: Principal, req: UpdateEntityRequest) -> Result<Entity> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_entity(&user) {
        return Err("Insufficient permissions to update entity".to_string());
    }

    let mut entity = STORAGE
        .with(|storage| storage.borrow().entities.get(&req.id))
        .ok_or_else(|| "Entity not found".to_string())?;

    entity.name = req.name;
    entity.description = req.description;
    entity.taxonomy = req.taxonomy;
    entity.taxonomy_config = req.taxonomy_config;

    STORAGE.with(|storage| {
        storage.borrow_mut().entities.insert(entity.id, entity.clone());
    });

    log_activity(
        caller,
        "UPDATE".to_string(),
        "Entity".to_string(),
        entity.id.to_string(),
        format!("Updated entity: {}", entity.name),
    );

    Ok(entity)
}

// Delete entity
pub fn delete_entity(caller: Principal, id: u64) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_entity(&user) {
        return Err("Insufficient permissions to delete entity".to_string());
    }

    let entity = STORAGE
        .with(|storage| storage.borrow().entities.get(&id))
        .ok_or_else(|| "Entity not found".to_string())?;

    // Remove entity from organization
    organizations::remove_entity_from_organization(entity.organization_id, id)?;

    STORAGE.with(|storage| {
        storage.borrow_mut().entities.remove(&id);
    });

    log_activity(
        caller,
        "DELETE".to_string(),
        "Entity".to_string(),
        id.to_string(),
        format!("Deleted entity: {}", entity.name),
    );

    Ok(())
}

