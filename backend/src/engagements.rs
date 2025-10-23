use candid::Principal;
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{next_engagement_id, STORAGE};
use crate::types::{CreateEngagementRequest, Engagement, EngagementLink, Result, UpdateEngagementRequest};

// Create engagement
pub fn create_engagement(caller: Principal, req: CreateEngagementRequest) -> Result<Engagement> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_engagement(&user) {
        return Err("Insufficient permissions to create engagement".to_string());
    }

    // Verify linked resource exists
    match &req.link {
        EngagementLink::Organization(id) => {
            STORAGE
                .with(|storage| storage.borrow().organizations.get(id))
                .ok_or_else(|| "Organization not found".to_string())?;
        }
        EngagementLink::Entity(id) => {
            STORAGE
                .with(|storage| storage.borrow().entities.get(id))
                .ok_or_else(|| "Entity not found".to_string())?;
        }
        EngagementLink::Client(id) => {
            STORAGE
                .with(|storage| storage.borrow().clients.get(id))
                .ok_or_else(|| "Client not found".to_string())?;
        }
    }

    let engagement = Engagement {
        id: next_engagement_id(),
        name: req.name,
        description: req.description,
        link: req.link,
        start_date: req.start_date,
        end_date: req.end_date,
        status: req.status,
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagements
            .insert(engagement.id, engagement.clone());
    });

    log_activity(
        caller,
        "CREATE".to_string(),
        "Engagement".to_string(),
        engagement.id.to_string(),
        format!("Created engagement: {}", engagement.name),
    );

    Ok(engagement)
}

// Get engagement by ID
pub fn get_engagement(caller: Principal, id: u64) -> Result<Engagement> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().engagements.get(&id))
        .ok_or_else(|| "Engagement not found".to_string())
}

// List all engagements
pub fn list_engagements(caller: Principal) -> Result<Vec<Engagement>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let engagements = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagements
            .iter()
            .map(|(_, engagement)| engagement)
            .collect()
    });

    Ok(engagements)
}

// List engagements by organization
pub fn list_engagements_by_organization(caller: Principal, org_id: u64) -> Result<Vec<Engagement>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let engagements = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagements
            .iter()
            .filter(|(_, engagement)| matches!(engagement.link, EngagementLink::Organization(id) if id == org_id))
            .map(|(_, engagement)| engagement)
            .collect()
    });

    Ok(engagements)
}

// List engagements by entity
pub fn list_engagements_by_entity(caller: Principal, entity_id: u64) -> Result<Vec<Engagement>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let engagements = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagements
            .iter()
            .filter(|(_, engagement)| matches!(engagement.link, EngagementLink::Entity(id) if id == entity_id))
            .map(|(_, engagement)| engagement)
            .collect()
    });

    Ok(engagements)
}

// List engagements by client
pub fn list_engagements_by_client(caller: Principal, client_id: u64) -> Result<Vec<Engagement>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let engagements = STORAGE.with(|storage| {
        storage
            .borrow()
            .engagements
            .iter()
            .filter(|(_, engagement)| matches!(engagement.link, EngagementLink::Client(id) if id == client_id))
            .map(|(_, engagement)| engagement)
            .collect()
    });

    Ok(engagements)
}

// Update engagement
pub fn update_engagement(caller: Principal, req: UpdateEngagementRequest) -> Result<Engagement> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_engagement(&user) {
        return Err("Insufficient permissions to update engagement".to_string());
    }

    let mut engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&req.id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    engagement.name = req.name;
    engagement.description = req.description;
    engagement.start_date = req.start_date;
    engagement.end_date = req.end_date;
    engagement.status = req.status;

    STORAGE.with(|storage| {
        storage
            .borrow_mut()
            .engagements
            .insert(engagement.id, engagement.clone());
    });

    log_activity(
        caller,
        "UPDATE".to_string(),
        "Engagement".to_string(),
        engagement.id.to_string(),
        format!("Updated engagement: {}", engagement.name),
    );

    Ok(engagement)
}

// Delete engagement
pub fn delete_engagement(caller: Principal, id: u64) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_engagement(&user) {
        return Err("Insufficient permissions to delete engagement".to_string());
    }

    let engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&id))
        .ok_or_else(|| "Engagement not found".to_string())?;

    STORAGE.with(|storage| {
        storage.borrow_mut().engagements.remove(&id);
    });

    log_activity(
        caller,
        "DELETE".to_string(),
        "Engagement".to_string(),
        id.to_string(),
        format!("Deleted engagement: {}", engagement.name),
    );

    Ok(())
}

