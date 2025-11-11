use candid::{decode_args, encode_args, Principal};
use ic_cdk::api::time;

use crate::auth;
use crate::blockchain_proof::{generate_hash, generate_signature};
use crate::client_portal::DocumentRequest;
use crate::storage::{next_activity_log_id, STORAGE};
use crate::templates::{AuditTemplate, EngagementChecklist};
use crate::types::{
    ActivityLogEntry, AdjustingJournalEntry, Client, ClientAcceptance, ConflictCheck, Document,
    Engagement, EngagementBudget, EngagementLetter, EngagementMilestone, EngagementSetupTemplate,
    Entity, ImportedDataset, Organization, Result, TimeEntry, TrialBalance, TrialBalanceAccount,
    WorkingPaper,
};

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
    snapshot: Option<Vec<u8>>,
) {
    let id = next_activity_log_id();
    let timestamp = time();
    let (previous_hash, block_height) = if let Some(prev) = get_previous_entry() {
        (prev.signature.clone(), prev.block_height + 1)
    } else {
        ("0000000000000000".to_string(), 0)
    };
    let signature = generate_signature(
        id,
        principal,
        &action,
        &resource_type,
        &resource_id,
        timestamp,
        &previous_hash,
    );
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
        snapshot,
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

// Revert a resource to the state captured in a specific activity log entry
pub fn revert_activity_entry(caller: Principal, entry_id: u64) -> Result<()> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::is_partner_or_above(&user) {
        return Err("Insufficient permissions to revert activity".to_string());
    }

    let entry = STORAGE
        .with(|storage| storage.borrow().activity_logs.get(&entry_id))
        .ok_or_else(|| "Activity log entry not found".to_string())?;

    let snapshot_bytes = entry
        .snapshot
        .clone()
        .ok_or_else(|| "No snapshot available for this activity".to_string())?;

    let action = entry.action.as_str();
    let resource_type = entry.resource_type.as_str();
    let resource_id = entry.resource_id.clone();

    let new_snapshot = match (resource_type, action) {
        ("client", _) => {
            let (client,): (Client,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode client snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage.borrow_mut().clients.insert(client.id, client.clone());
            });
            encode_args((client,)).ok()
        }
        ("organization", _) => {
            let (organization,): (Organization,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode organization snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .organizations
                    .insert(organization.id, organization.clone());
            });
            encode_args((organization,)).ok()
        }
        ("entity", _) => {
            let (entity,): (Entity,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode entity snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage.borrow_mut().entities.insert(entity.id, entity.clone());
            });
            encode_args((entity,)).ok()
        }
        ("engagement", "create_engagement_from_template") => {
            let (milestones,): (Vec<EngagementMilestone>,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode milestone snapshot".to_string())?;
            if let Some(engagement_id) = milestones.first().map(|m| m.engagement_id) {
                STORAGE.with(|storage| {
                    let mut storage = storage.borrow_mut();
                    let ids_to_remove: Vec<u64> = storage
                        .engagement_milestones
                        .iter()
                        .filter(|(_, m)| m.engagement_id == engagement_id)
                        .map(|(id, _)| id)
                        .collect();
                    for id in ids_to_remove {
                        storage.engagement_milestones.remove(&id);
                    }
                    for milestone in milestones.iter() {
                        storage
                            .engagement_milestones
                            .insert(milestone.id, milestone.clone());
                    }
                });
            }
            encode_args((milestones.clone(),)).ok()
        }
        ("engagement", "apply_template_to_engagement") => {
            let (checklist,): (EngagementChecklist,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode engagement checklist snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .engagement_checklists
                    .insert(checklist.id, checklist.clone());
            });
            encode_args((checklist,)).ok()
        }
        ("engagement", _) => {
            let (engagement,): (Engagement,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode engagement snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .engagements
                    .insert(engagement.id, engagement.clone());
            });
            encode_args((engagement,)).ok()
        }
        ("trial_balance", "import_trial_balance_csv") => {
            let (accounts,): (Vec<TrialBalanceAccount>,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode trial balance account snapshot".to_string())?;
            if let Some(trial_balance_id) = accounts.first().map(|a| a.trial_balance_id) {
                STORAGE.with(|storage| {
                    let mut storage = storage.borrow_mut();
                    let ids_to_remove: Vec<u64> = storage
                        .trial_balance_accounts
                        .iter()
                        .filter(|(_, account)| account.trial_balance_id == trial_balance_id)
                        .map(|(id, _)| id)
                        .collect();
                    for id in ids_to_remove {
                        storage.trial_balance_accounts.remove(&id);
                    }
                    for account in accounts.iter() {
                        storage
                            .trial_balance_accounts
                            .insert(account.id, account.clone());
                    }
                });
            }
            encode_args((accounts.clone(),)).ok()
        }
        ("trial_balance", _) => {
            let (trial_balance,): (TrialBalance,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode trial balance snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .trial_balances
                    .insert(trial_balance.id, trial_balance.clone());
            });
            encode_args((trial_balance,)).ok()
        }
        ("trial_balance_account", _) => {
            let (account,): (TrialBalanceAccount,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode trial balance account snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .trial_balance_accounts
                    .insert(account.id, account.clone());
            });
            encode_args((account,)).ok()
        }
        ("engagement_template", _) => {
            let (template,): (EngagementSetupTemplate,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode engagement template snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .engagement_templates
                    .insert(template.id, template.clone());
            });
            encode_args((template,)).ok()
        }
        ("engagement_milestone", _) => {
            let (milestone,): (EngagementMilestone,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode engagement milestone snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .engagement_milestones
                    .insert(milestone.id, milestone.clone());
            });
            encode_args((milestone,)).ok()
        }
        ("engagement_budget", _) => {
            let (budget,): (EngagementBudget,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode engagement budget snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .engagement_budgets
                    .insert(budget.id, budget.clone());
            });
            encode_args((budget,)).ok()
        }
        ("time_entry", _) => {
            let (time_entry,): (TimeEntry,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode time entry snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage.borrow_mut().time_entries.insert(time_entry.id, time_entry.clone());
            });
            encode_args((time_entry,)).ok()
        }
        ("client_acceptance", _) => {
            let (acceptance,): (ClientAcceptance,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode client acceptance snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .client_acceptances
                    .insert(acceptance.id, acceptance.clone());
            });
            encode_args((acceptance,)).ok()
        }
        ("engagement_letter", _) => {
            let (letter,): (EngagementLetter,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode engagement letter snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .engagement_letters
                    .insert(letter.id, letter.clone());
            });
            encode_args((letter,)).ok()
        }
        ("conflict_check", _) => {
            let (conflict,): (ConflictCheck,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode conflict check snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .conflict_checks
                    .insert(conflict.id, conflict.clone());
            });
            encode_args((conflict,)).ok()
        }
        ("aje", _) => {
            let (aje,): (AdjustingJournalEntry,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode AJE snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .adjusting_entries
                    .insert(aje.id, aje.clone());
            });
            encode_args((aje,)).ok()
        }
        ("document_request", _) => {
            let (request,): (DocumentRequest,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode document request snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .client_portal_requests
                    .insert(request.id, request.clone());
            });
            encode_args((request,)).ok()
        }
        ("document", _) => {
            let (document,): (Document,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode document snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage.borrow_mut().documents.insert(document.id, document.clone());
            });
            encode_args((document,)).ok()
        }
        ("working_paper", _) => {
            let (working_paper,): (WorkingPaper,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode working paper snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .working_papers
                    .insert(working_paper.id, working_paper.clone());
            });
            encode_args((working_paper,)).ok()
        }
        ("template", _) => {
            let (template,): (AuditTemplate,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode template snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .audit_templates
                    .insert(template.id, template.clone());
            });
            encode_args((template,)).ok()
        }
        ("dataset", _) => {
            let (dataset,): (ImportedDataset,) = decode_args(&snapshot_bytes)
                .map_err(|_| "Failed to decode dataset snapshot".to_string())?;
            STORAGE.with(|storage| {
                storage
                    .borrow_mut()
                    .datasets
                    .insert(dataset.id, dataset.clone());
            });
            encode_args((dataset,)).ok()
        }
        _ => return Err("Revert not supported for this activity type".to_string()),
    };

    let details = format!(
        "Reverted {} {} to activity entry {}",
        entry.resource_type, entry.resource_id, entry_id
    );

    log_activity(
        caller,
        format!("revert_{}", entry.action),
        entry.resource_type.clone(),
        resource_id,
        details,
        new_snapshot,
    );

    Ok(())
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

