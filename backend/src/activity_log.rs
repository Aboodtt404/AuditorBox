use candid::Principal;
use ic_cdk::api::time;

use crate::auth;
use crate::storage::{next_activity_log_id, STORAGE};
use crate::types::{ActivityLogEntry, Result};

// Log an activity
pub fn log_activity(
    principal: Principal,
    action: String,
    resource_type: String,
    resource_id: String,
    details: String,
) {
    let entry = ActivityLogEntry {
        id: next_activity_log_id(),
        principal,
        action,
        resource_type,
        resource_id,
        details,
        timestamp: time(),
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

