use candid::Principal;
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::storage::{next_client_id, STORAGE};
use crate::types::{Client, CreateClientRequest, Result, UpdateClientRequest};

// Create client
pub fn create_client(caller: Principal, req: CreateClientRequest) -> Result<Client> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_engagement(&user) {
        return Err("Insufficient permissions to create client".to_string());
    }

    let client = Client {
        id: next_client_id(),
        name: req.name,
        contact_email: req.contact_email,
        contact_phone: req.contact_phone,
        address: req.address,
        created_at: time(),
        created_by: caller,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().clients.insert(client.id, client.clone());
    });

    log_activity(
        caller,
        "CREATE".to_string(),
        "Client".to_string(),
        client.id.to_string(),
        format!("Created client: {}", client.name),
    );

    Ok(client)
}

// Get client by ID
pub fn get_client(caller: Principal, id: u64) -> Result<Client> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().clients.get(&id))
        .ok_or_else(|| "Client not found".to_string())
}

// List all clients
pub fn list_clients(caller: Principal) -> Result<Vec<Client>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let clients = STORAGE.with(|storage| {
        storage
            .borrow()
            .clients
            .iter()
            .map(|(_, client)| client)
            .collect()
    });

    Ok(clients)
}

// Update client
pub fn update_client(caller: Principal, req: UpdateClientRequest) -> Result<Client> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_engagement(&user) {
        return Err("Insufficient permissions to update client".to_string());
    }

    let mut client = STORAGE
        .with(|storage| storage.borrow().clients.get(&req.id))
        .ok_or_else(|| "Client not found".to_string())?;

    client.name = req.name;
    client.contact_email = req.contact_email;
    client.contact_phone = req.contact_phone;
    client.address = req.address;

    STORAGE.with(|storage| {
        storage.borrow_mut().clients.insert(client.id, client.clone());
    });

    log_activity(
        caller,
        "UPDATE".to_string(),
        "Client".to_string(),
        client.id.to_string(),
        format!("Updated client: {}", client.name),
    );

    Ok(client)
}

// Delete client
pub fn delete_client(caller: Principal, id: u64) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_edit_engagement(&user) {
        return Err("Insufficient permissions to delete client".to_string());
    }

    let client = STORAGE
        .with(|storage| storage.borrow().clients.get(&id))
        .ok_or_else(|| "Client not found".to_string())?;

    STORAGE.with(|storage| {
        storage.borrow_mut().clients.remove(&id);
    });

    log_activity(
        caller,
        "DELETE".to_string(),
        "Client".to_string(),
        id.to_string(),
        format!("Deleted client: {}", client.name),
    );

    Ok(())
}

