use candid::Principal;
use ic_cdk::api::time;

use crate::auth;
use crate::blockchain_proof::{generate_hash, generate_signature};
use crate::storage::{next_activity_log_id, STORAGE};
use crate::types::{ActivityLogEntry, Result};

// Get the previous entry for blockchain chaining
fn get_previous_entry() -> Option<ActivityLogEntry> {
    STORAGE.with(|storage| {
        let logs = storage.borrow();
        logs.activity_logs
            .iter()
            .max_by_key(|(_, entry)| entry.block_height)
            .map(|(_, entry)| entry)
    })
}

// Log an activity with blockchain proof
pub fn log_activity(
    principal: Principal,
    action: String,
    resource_type: String,
    resource_id: String,
    details: String,
) {
    let id = next_activity_log_id();
    let timestamp = time();

    // Get previous entry for blockchain chaining
    let (previous_hash, block_height) = if let Some(prev) = get_previous_entry() {
        (prev.signature.clone(), prev.block_height + 1)
    } else {
        // Genesis entry
        ("0000000000000000".to_string(), 0)
    };

    // Generate signature
    let signature = generate_signature(
        id,
        principal,
        &action,
        &resource_type,
        &resource_id,
        timestamp,
        &previous_hash,
    );

    // Generate data hash
    let data_content = format!(
        "{}:{}:{}:{}:{}:{}",
        id,
        principal.to_text(),
        action,
        resource_type,
        resource_id,
        details
    );
    let data_hash = generate_hash(&data_content);

    let entry = ActivityLogEntry {
        id,
        principal,
        action,
        resource_type,
        resource_id,
        details,
        timestamp,
        data_hash,
        signature,
        previous_hash,
        block_height,
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().activity_logs.insert(entry.id, entry);
    });
}

// Get activity logs (filtered by permissions)
pub fn get_activity_logs(caller: Principal, limit: Option<u64>) -> Result<Vec<ActivityLogEntry>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_view_activity_log(&user) {
        return Err("Insufficient permissions to view activity log".to_string());
    }

    let max_entries = limit.unwrap_or(100);
    let logs: Vec<ActivityLogEntry> = STORAGE.with(|storage| {
        storage
            .borrow()
            .activity_logs
            .iter()
            .map(|(_, log)| log)
            .collect()
    });

    // Sort by timestamp descending (newest first) and limit
    let mut sorted_logs = logs;
    sorted_logs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    sorted_logs.truncate(max_entries as usize);

    Ok(sorted_logs)
}

// Get activity logs for a specific user
pub fn get_user_activity_logs(
    caller: Principal,
    target_principal: Principal,
    limit: Option<u64>,
) -> Result<Vec<ActivityLogEntry>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_view_activity_log(&user) && caller != target_principal {
        return Err("Insufficient permissions to view activity log".to_string());
    }

    let max_entries = limit.unwrap_or(100);
    let logs: Vec<ActivityLogEntry> = STORAGE.with(|storage| {
        storage
            .borrow()
            .activity_logs
            .iter()
            .filter(|(_, log)| log.principal == target_principal)
            .map(|(_, log)| log)
            .collect()
    });

    // Sort by timestamp descending and limit
    let mut sorted_logs = logs;
    sorted_logs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    sorted_logs.truncate(max_entries as usize);

    Ok(sorted_logs)
}

// Get activity logs for a specific resource
pub fn get_resource_activity_logs(
    caller: Principal,
    resource_type: String,
    resource_id: String,
    limit: Option<u64>,
) -> Result<Vec<ActivityLogEntry>> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_view_activity_log(&user) {
        return Err("Insufficient permissions to view activity log".to_string());
    }

    let max_entries = limit.unwrap_or(100);
    let logs: Vec<ActivityLogEntry> = STORAGE.with(|storage| {
        storage
            .borrow()
            .activity_logs
            .iter()
            .filter(|(_, log)| {
                log.resource_type == resource_type && log.resource_id == resource_id
            })
            .map(|(_, log)| log)
            .collect()
    });

    // Sort by timestamp descending and limit
    let mut sorted_logs = logs;
    sorted_logs.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
    sorted_logs.truncate(max_entries as usize);

    Ok(sorted_logs)
}

// Verify the blockchain integrity of an activity log entry
pub fn verify_activity_log(caller: Principal, entry_id: u64) -> Result<crate::types::VerificationResult> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let entry = STORAGE
        .with(|storage| storage.borrow().activity_logs.get(&entry_id))
        .ok_or_else(|| "Activity log entry not found".to_string())?;

    // Reconstruct the data content
    let data_content = format!(
        "{}:{}:{}:{}:{}:{}",
        entry.id,
        entry.principal.to_text(),
        entry.action,
        entry.resource_type,
        entry.resource_id,
        entry.details
    );

    // Verify data hash
    let computed_hash = generate_hash(&data_content);
    let hash_matches = computed_hash == entry.data_hash;

    // Verify signature
    let signature = generate_signature(
        entry.id,
        entry.principal,
        &entry.action,
        &entry.resource_type,
        &entry.resource_id,
        entry.timestamp,
        &entry.previous_hash,
    );
    let signature_matches = signature == entry.signature;

    let is_valid = hash_matches && signature_matches;

    Ok(crate::types::VerificationResult {
        is_valid,
        entry_id: entry.id,
        timestamp: entry.timestamp,
        data_hash: computed_hash,
        block_height: entry.block_height,
        verification_timestamp: time(),
        chain_integrity: is_valid,
        message: if is_valid {
            "Entry verified successfully - blockchain integrity confirmed".to_string()
        } else if !hash_matches {
            "Data hash mismatch - entry data may have been tampered with".to_string()
        } else {
            "Signature verification failed - entry may have been modified".to_string()
        },
    })
}

// Verify the entire blockchain chain integrity
pub fn verify_blockchain_chain(caller: Principal) -> Result<bool> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let mut entries: Vec<ActivityLogEntry> = STORAGE.with(|storage| {
        storage
            .borrow()
            .activity_logs
            .iter()
            .map(|(_, entry)| entry)
            .collect()
    });

    if entries.is_empty() {
        return Ok(true);
    }

    // Sort by block height
    entries.sort_by_key(|e| e.block_height);

    // Verify each entry links to the previous one
    for i in 1..entries.len() {
        let current = &entries[i];
        let previous = &entries[i - 1];

        if current.previous_hash != previous.signature {
            return Ok(false);
        }

        if current.block_height != previous.block_height + 1 {
            return Ok(false);
        }
    }

    Ok(true)
}

// Get blockchain proof for a specific entry (public verification)
pub fn get_blockchain_proof(entry_id: u64) -> Result<crate::types::BlockchainProof> {
    let entry = STORAGE
        .with(|storage| storage.borrow().activity_logs.get(&entry_id))
        .ok_or_else(|| "Activity log entry not found".to_string())?;

    Ok(crate::types::BlockchainProof {
        entry_id: entry.id,
        data_hash: entry.data_hash,
        timestamp: entry.timestamp,
        block_height: entry.block_height,
        signature: entry.signature,
        previous_hash: entry.previous_hash,
    })
}

