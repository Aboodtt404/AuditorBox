use candid::Principal;
use ic_cdk::api::time;

use crate::activity_log::log_activity;
use crate::auth;
use crate::blockchain_proof::{generate_hash, generate_signature};
use crate::storage::{next_aje_id, next_aje_line_item_id, STORAGE};
use crate::types::{
    AdjustingJournalEntry, AjeLineItem, AjeStatus, CreateAjeRequest,
    Result,
};

// Create a new adjusting journal entry with blockchain proof
pub fn create_aje(caller: Principal, req: CreateAjeRequest) -> Result<AdjustingJournalEntry> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_create_engagement(&user) {
        return Err("Insufficient permissions to create AJE".to_string());
    }

    // Verify engagement and trial balance exist
    let _engagement = STORAGE
        .with(|storage| storage.borrow().engagements.get(&req.engagement_id))
        .ok_or("Engagement not found")?;

    let _trial_balance = STORAGE
        .with(|storage| storage.borrow().trial_balances.get(&req.trial_balance_id))
        .ok_or("Trial balance not found")?;

    // Validate line items balance
    let total_debits: i64 = req.line_items.iter().map(|li| li.debit_amount).sum();
    let total_credits: i64 = req.line_items.iter().map(|li| li.credit_amount).sum();

    if total_debits != total_credits {
        return Err(format!(
            "AJE does not balance: debits {} != credits {}",
            total_debits, total_credits
        ));
    }

    let aje_id = next_aje_id();
    let timestamp = time();

    // Generate blockchain proof
    let data = format!(
        "{}:{}:{}:{}:{}:{}",
        aje_id,
        req.engagement_id,
        req.trial_balance_id,
        req.aje_number,
        req.description,
        total_debits
    );
    let blockchain_hash = generate_hash(&data);
    
    let blockchain_signature = generate_signature(
        aje_id,
        caller,
        "CREATE_AJE",
        "AdjustingJournalEntry",
        &aje_id.to_string(),
        timestamp,
        &blockchain_hash,
    );

    let aje = AdjustingJournalEntry {
        id: aje_id,
        engagement_id: req.engagement_id,
        trial_balance_id: req.trial_balance_id,
        aje_number: req.aje_number.clone(),
        description: req.description.clone(),
        status: AjeStatus::Draft,
        amount: total_debits,
        created_at: timestamp,
        created_by: caller,
        reviewed_at: None,
        reviewed_by: None,
        approved_at: None,
        approved_by: None,
        blockchain_hash: blockchain_hash.clone(),
        blockchain_signature: blockchain_signature.clone(),
    };

    STORAGE.with(|storage| {
        storage.borrow_mut().adjusting_entries.insert(aje.id, aje.clone());
    });

    // Create line items
    for line_req in req.line_items {
        let account = STORAGE
            .with(|storage| storage.borrow().trial_balance_accounts.get(&line_req.account_id))
            .ok_or("Account not found")?;

        let line_item = AjeLineItem {
            id: next_aje_line_item_id(),
            aje_id: aje.id,
            account_id: line_req.account_id,
            account_name: account.account_name.clone(),
            account_number: account.account_number.clone(),
            debit_amount: line_req.debit_amount,
            credit_amount: line_req.credit_amount,
            description: line_req.description,
        };

        STORAGE.with(|storage| {
            storage.borrow_mut().aje_line_items.insert(line_item.id, line_item);
        });
    }

    log_activity(
        caller,
        "CREATE".to_string(),
        "AdjustingJournalEntry".to_string(),
        aje.id.to_string(),
        format!("Created AJE {}: {} (${}.{})", 
            req.aje_number, 
            req.description, 
            total_debits / 100, 
            total_debits % 100
        ),
    );

    Ok(aje)
}

// Submit AJE for review (change status from Draft to Proposed)
pub fn submit_aje(caller: Principal, aje_id: u64) -> Result<AdjustingJournalEntry> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    let mut aje = STORAGE
        .with(|storage| storage.borrow().adjusting_entries.get(&aje_id))
        .ok_or("AJE not found")?;

    if aje.created_by != caller && !auth::can_edit_engagement(&user) {
        return Err("Insufficient permissions to submit AJE".to_string());
    }

    if !matches!(aje.status, AjeStatus::Draft) {
        return Err(format!("AJE cannot be submitted from {:?} status", aje.status));
    }

    aje.status = AjeStatus::Proposed;

    STORAGE.with(|storage| {
        storage.borrow_mut().adjusting_entries.insert(aje.id, aje.clone());
    });

    log_activity(
        caller,
        "SUBMIT".to_string(),
        "AdjustingJournalEntry".to_string(),
        aje.id.to_string(),
        format!("Submitted AJE {} for review", aje.aje_number),
    );

    Ok(aje)
}

// Review AJE (Manager/Senior reviews the entry)
pub fn review_aje(caller: Principal, aje_id: u64, approved: bool) -> Result<AdjustingJournalEntry> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_review_work(&user) {
        return Err("Insufficient permissions to review AJE".to_string());
    }

    let mut aje = STORAGE
        .with(|storage| storage.borrow().adjusting_entries.get(&aje_id))
        .ok_or("AJE not found")?;

    if !matches!(aje.status, AjeStatus::Proposed) {
        return Err(format!("AJE cannot be reviewed from {:?} status", aje.status));
    }

    aje.status = if approved {
        AjeStatus::Reviewed
    } else {
        AjeStatus::Rejected
    };
    aje.reviewed_at = Some(time());
    aje.reviewed_by = Some(caller);

    STORAGE.with(|storage| {
        storage.borrow_mut().adjusting_entries.insert(aje.id, aje.clone());
    });

    log_activity(
        caller,
        if approved { "REVIEW_APPROVE" } else { "REVIEW_REJECT" }.to_string(),
        "AdjustingJournalEntry".to_string(),
        aje.id.to_string(),
        format!("Reviewed AJE {}: {}", aje.aje_number, if approved { "Approved" } else { "Rejected" }),
    );

    Ok(aje)
}

// Approve AJE (Partner/Admin final approval with blockchain signature)
pub fn approve_aje(caller: Principal, aje_id: u64) -> Result<AdjustingJournalEntry> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_approve(&user) {
        return Err("Insufficient permissions to approve AJE".to_string());
    }

    let mut aje = STORAGE
        .with(|storage| storage.borrow().adjusting_entries.get(&aje_id))
        .ok_or("AJE not found")?;

    if !matches!(aje.status, AjeStatus::Reviewed) {
        return Err(format!("AJE cannot be approved from {:?} status", aje.status));
    }

    let timestamp = time();
    aje.status = AjeStatus::Approved;
    aje.approved_at = Some(timestamp);
    aje.approved_by = Some(caller);

    // Update blockchain signature with approval
    let approval_data = format!(
        "{}:APPROVED:{}:{}",
        aje.blockchain_hash,
        caller.to_text(),
        timestamp
    );
    aje.blockchain_signature = generate_hash(&approval_data);

    STORAGE.with(|storage| {
        storage.borrow_mut().adjusting_entries.insert(aje.id, aje.clone());
    });

    log_activity(
        caller,
        "APPROVE".to_string(),
        "AdjustingJournalEntry".to_string(),
        aje.id.to_string(),
        format!("Approved AJE {} for posting", aje.aje_number),
    );

    Ok(aje)
}

// Post AJE to trial balance (actually apply the adjustments)
pub fn post_aje(caller: Principal, aje_id: u64) -> Result<AdjustingJournalEntry> {
    let user = auth::get_user(caller).ok_or("User not found")?;

    if !auth::can_approve(&user) {
        return Err("Insufficient permissions to post AJE".to_string());
    }

    let mut aje = STORAGE
        .with(|storage| storage.borrow().adjusting_entries.get(&aje_id))
        .ok_or("AJE not found")?;

    if !matches!(aje.status, AjeStatus::Approved) {
        return Err(format!("AJE cannot be posted from {:?} status", aje.status));
    }

    // Get line items
    let line_items: Vec<AjeLineItem> = STORAGE.with(|storage| {
        storage
            .borrow()
            .aje_line_items
            .iter()
            .filter(|(_, item)| item.aje_id == aje_id)
            .map(|(_, item)| item)
            .collect()
    });

    // Apply adjustments to trial balance accounts
    for item in line_items {
        let mut account = STORAGE
            .with(|storage| storage.borrow().trial_balance_accounts.get(&item.account_id))
            .ok_or(format!("Account {} not found", item.account_id))?;

        account.debit_balance += item.debit_amount;
        account.credit_balance += item.credit_amount;

        STORAGE.with(|storage| {
            storage.borrow_mut().trial_balance_accounts.insert(account.id, account);
        });
    }

    aje.status = AjeStatus::Posted;

    STORAGE.with(|storage| {
        storage.borrow_mut().adjusting_entries.insert(aje.id, aje.clone());
    });

    // Mark trial balance as adjusted
    let mut tb = STORAGE
        .with(|storage| storage.borrow().trial_balances.get(&aje.trial_balance_id))
        .ok_or("Trial balance not found")?;
    
    tb.is_adjusted = true;
    
    STORAGE.with(|storage| {
        storage.borrow_mut().trial_balances.insert(tb.id, tb);
    });

    log_activity(
        caller,
        "POST".to_string(),
        "AdjustingJournalEntry".to_string(),
        aje.id.to_string(),
        format!("Posted AJE {} to trial balance", aje.aje_number),
    );

    Ok(aje)
}

// Get AJE by ID
pub fn get_aje(caller: Principal, aje_id: u64) -> Result<AdjustingJournalEntry> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    STORAGE
        .with(|storage| storage.borrow().adjusting_entries.get(&aje_id))
        .ok_or("AJE not found".to_string())
}

// Get line items for an AJE
pub fn get_aje_line_items(caller: Principal, aje_id: u64) -> Result<Vec<AjeLineItem>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let items = STORAGE.with(|storage| {
        storage
            .borrow()
            .aje_line_items
            .iter()
            .filter(|(_, item)| item.aje_id == aje_id)
            .map(|(_, item)| item)
            .collect()
    });

    Ok(items)
}

// List AJEs for an engagement
pub fn list_ajes_by_engagement(caller: Principal, engagement_id: u64) -> Result<Vec<AdjustingJournalEntry>> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let ajes = STORAGE.with(|storage| {
        storage
            .borrow()
            .adjusting_entries
            .iter()
            .filter(|(_, aje)| aje.engagement_id == engagement_id)
            .map(|(_, aje)| aje)
            .collect()
    });

    Ok(ajes)
}

// Verify blockchain proof for an AJE
pub fn verify_aje_blockchain(caller: Principal, aje_id: u64) -> Result<AjeBlockchainVerification> {
    let _user = auth::get_user(caller).ok_or("User not found")?;

    let aje = STORAGE
        .with(|storage| storage.borrow().adjusting_entries.get(&aje_id))
        .ok_or("AJE not found")?;

    // Regenerate hash and verify
    let data = format!(
        "{}:{}:{}:{}:{}:{}",
        aje.id,
        aje.engagement_id,
        aje.trial_balance_id,
        aje.aje_number,
        aje.description,
        aje.amount
    );
    let computed_hash = generate_hash(&data);

    let hash_matches = computed_hash == aje.blockchain_hash;

    let verification = AjeBlockchainVerification {
        aje_id: aje.id,
        is_valid: hash_matches,
        blockchain_hash: aje.blockchain_hash.clone(),
        blockchain_signature: aje.blockchain_signature.clone(),
        computed_hash,
        verified_at: time(),
        verified_by: caller,
        status: format!("{:?}", aje.status),
        created_at: aje.created_at,
        created_by: aje.created_by,
        approved_at: aje.approved_at,
        approved_by: aje.approved_by,
    };

    Ok(verification)
}

// Blockchain verification result
#[derive(candid::CandidType, serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct AjeBlockchainVerification {
    pub aje_id: u64,
    pub is_valid: bool,
    pub blockchain_hash: String,
    pub blockchain_signature: String,
    pub computed_hash: String,
    pub verified_at: u64,
    pub verified_by: Principal,
    pub status: String,
    pub created_at: u64,
    pub created_by: Principal,
    pub approved_at: Option<u64>,
    pub approved_by: Option<Principal>,
}

